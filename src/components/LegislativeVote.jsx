import { useState } from 'react';
import { ISSUES } from '../data/issues.js';
import { getFlagshipBill, getCurrentStage } from '../engine/legislativeVotes.js';
import { getDecisionGuidance, ADVISORS } from '../data/advisorLines.js';
import CandidatePortrait from './CandidatePortrait.jsx';

// Bill pipeline progress indicator
function BillPipeline({ currentStage, stages }) {
  const stageNames = stages?.map(s => s.name) || ['Introduction', 'Committee', 'Floor Vote'];
  return (
    <div className="flex items-center gap-1 mb-4">
      {stageNames.map((name, i) => {
        const done = i < currentStage;
        const active = i === currentStage;
        return (
          <div key={i} className="flex-1 flex items-center">
            <div className="flex-1 flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                done ? 'bg-forest border-forest text-cream' :
                active ? 'bg-brass/20 border-brass text-brass-dark' :
                'bg-walnut/5 border-walnut/20 text-walnut-light/40'
              }`}>
                {done ? '\u2713' : i + 1}
              </div>
              <div className={`font-ticker text-[9px] mt-1 text-center ${
                done ? 'text-forest' :
                active ? 'text-brass-dark font-bold' :
                'text-walnut-light/40'
              }`}>
                {name}
              </div>
            </div>
            {i < stageNames.length - 1 && (
              <div className={`w-full h-0.5 mx-1 mt-[-12px] ${
                done ? 'bg-forest' : 'bg-walnut/10'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function LegislativeVote({ election, state, onSubmit }) {
  const [choice, setChoice] = useState(null);
  const advisorId = state.advisor || 'ezra';
  const advisor = ADVISORS[advisorId] || ADVISORS.ezra;
  const guidance = getDecisionGuidance('legislative', advisorId);

  const issueKey = typeof state.party.issues === 'string' ? state.party.issues : state.party.issues[0];
  const bill = getFlagshipBill(issueKey);
  const currentStage = state.act1.billProgress?.stage || 0;
  const stageData = getCurrentStage(issueKey, currentStage);
  const issueName = ISSUES[issueKey]?.name || issueKey;

  // If bill is already fully passed (shouldn't happen but safety)
  if (currentStage >= 3) {
    return (
      <div className="screen-enter min-h-dvh flex flex-col items-center justify-center px-6 py-12 paper-texture">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">{'\u{1F3DB}\uFE0F'}</div>
          <h1 className="font-display text-2xl font-bold text-walnut mb-4">
            {bill?.name || 'Your Bill'} Is Already Law
          </h1>
          <p className="font-body text-sm text-walnut-light mb-6">
            Your flagship legislation has already passed. Now you defend it.
          </p>
          <button onClick={() => onSubmit('none')} className="btn-brass text-lg px-8 py-4">
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Find the ally candidate
  const seatsHeld = state.act1.seatsHeld;
  const seatCount = Object.values(seatsHeld).filter(Boolean).length;

  let allyName = 'your ally';
  let allyId = null;
  const heldEntry = Object.entries(seatsHeld).find(([, v]) => v);
  if (heldEntry) {
    const [distId, fusionType] = heldEntry;
    const partyKey = fusionType === 'fusionDem' ? 'democrat' : 'republican';
    const candidate = state.candidates[distId]?.[partyKey];
    if (candidate) {
      allyName = `${candidate.title} ${candidate.name}`;
      allyId = candidate.id;
    }
  }

  const electionYears = { 1: 1892, 2: 1894, 3: 1896 };

  // Calculate leverage for display
  const leverage = seatCount * 15 + state.allyRelationship * 0.3;
  const leverageLabel = leverage > 40 ? 'Strong' : leverage > 20 ? 'Moderate' : 'Weak';
  const leverageColor = leverage > 40 ? 'text-forest' : leverage > 20 ? 'text-brass-dark' : 'text-darkred';

  // Betrayal risk based on stage (later stages = higher risk)
  const betrayalRisk = {
    pressAlly: currentStage === 2 ? 'High' : currentStage === 1 ? 'Moderate' : 'Low',
    negotiate: 'Low',
    threatenStandalone: currentStage === 2 ? 'Moderate' : 'Low',
    goPublic: 'None',
  };

  const options = [
    {
      key: 'pressAlly',
      icon: '\u{1F4E2}',
      label: 'Press Your Ally',
      desc: `Demand that ${allyName} pushes ${bill?.shortName || 'your bill'} forward. This could work, but it strains the relationship.`,
      tradeoffs: [
        { icon: '\u2191', label: 'Pass chance', color: 'text-forest' },
        { icon: '\u2191', label: 'Morale', color: 'text-forest' },
        { icon: '\u2193', label: 'Ally relations', color: 'text-darkred' },
      ],
    },
    {
      key: 'negotiate',
      icon: '\u{1F91D}',
      label: 'Negotiate Privately',
      desc: 'Work behind closed doors. Less confrontational, but less pressure.',
      tradeoffs: [
        { icon: '\u2014', label: 'Pass chance', color: 'text-walnut-light' },
        { icon: '\u2191', label: 'Ally relations', color: 'text-forest' },
        { icon: '\u2193', label: 'Visibility', color: 'text-darkred' },
      ],
    },
    {
      key: 'threatenStandalone',
      icon: '\u26A0\uFE0F',
      label: 'Threaten to Run Alone',
      desc: `Tell them: advance ${bill?.shortName || 'our bill'} or face a spoiler next election. A dangerous bluff.`,
      tradeoffs: [
        { icon: '\u2191', label: 'Pass chance', color: 'text-forest' },
        { icon: '\u2193\u2193', label: 'Ally relations', color: 'text-darkred' },
        { icon: '\u2191', label: 'Visibility', color: 'text-forest' },
      ],
    },
  ];

  // Go Public only available after betrayal
  if (state.act1.betrayalOccurred) {
    options.push({
      key: 'goPublic',
      icon: '\u{1F4F0}',
      label: 'Go Public with the Betrayal',
      desc: `Take ${state.act1.betrayalDetails?.candidateName || 'their'} betrayal to the newspapers. Maximum visibility, maximum damage.`,
      tradeoffs: [
        { icon: '\u2193', label: 'Pass chance', color: 'text-darkred' },
        { icon: '\u2191\u2191', label: 'Morale + Visibility', color: 'text-forest' },
        { icon: '\u2193\u2193', label: 'Ally relations', color: 'text-darkred' },
      ],
    });
  }

  // If no seats held, show a simpler screen
  if (seatCount === 0) {
    return (
      <div className="screen-enter min-h-dvh flex flex-col items-center justify-center px-6 py-12 paper-texture">
        <div className="text-center max-w-md">
          <div className="font-ticker text-xs tracking-[0.2em] text-brass-dark uppercase">
            Act I &bull; {electionYears[election]} &bull; Legislature
          </div>
          <h1 className="font-display text-2xl font-bold text-walnut mt-2 mb-4">
            No Seats, No Leverage
          </h1>

          {/* Still show the pipeline */}
          <BillPipeline currentStage={currentStage} stages={bill?.stages} />

          <p className="font-body text-sm text-walnut-light mb-6">
            Without fusion victories, you have no allies in the legislature to push {bill?.shortName || 'your bill'}.
            {stageData && ` ${stageData.name} cannot proceed without a sponsor.`}
          </p>
          <button onClick={() => onSubmit('none')} className="btn-brass text-lg px-8 py-4">
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      <div className="text-center mb-4">
        <div className="font-ticker text-xs tracking-[0.2em] text-brass-dark uppercase">
          Act I &bull; {electionYears[election]} &bull; {stageData?.name || 'Legislature'}
        </div>
        <h1 className="font-display text-2xl font-bold text-walnut mt-1">
          {bill?.name || 'Legislative Vote'}
        </h1>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
      </div>

      {/* Bill pipeline progress */}
      <div className="max-w-md mx-auto w-full">
        <BillPipeline currentStage={currentStage} stages={bill?.stages} />
      </div>

      {/* Stage card */}
      <div className="max-w-md mx-auto w-full mb-4">
        <div className="card-gilded p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-ticker text-xs text-brass-dark uppercase font-bold">
              Stage {currentStage + 1}: {stageData?.name}
            </span>
          </div>
          <p className="font-body text-sm text-walnut-light leading-relaxed">
            {stageData?.description || 'A critical moment for your legislation.'}
          </p>
          <div className="mt-3 pt-3 border-t border-walnut/10">
            <div className="flex items-center gap-3">
              {allyId && <CandidatePortrait candidateId={allyId} size={36} />}
              <div className="flex-1">
                <p className="font-body text-xs text-walnut-light/60">
                  You hold <strong>{seatCount}</strong> fusion seat{seatCount !== 1 ? 's' : ''}.
                </p>
              </div>
            </div>
            {/* Leverage meter */}
            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs font-body">
              <div>
                <div className="text-walnut-light/50">Seats</div>
                <div className="font-bold text-walnut">{seatCount}</div>
              </div>
              <div>
                <div className="text-walnut-light/50">Ally Trust</div>
                <div className={`font-bold ${state.allyRelationship >= 60 ? 'text-forest' : state.allyRelationship >= 35 ? 'text-brass-dark' : 'text-darkred'}`}>
                  {state.allyRelationship >= 60 ? 'High' : state.allyRelationship >= 35 ? 'OK' : 'Low'}
                </div>
              </div>
              <div>
                <div className="text-walnut-light/50">Leverage</div>
                <div className={`font-bold ${leverageColor}`}>{leverageLabel}</div>
              </div>
            </div>
            <p className="font-body text-[10px] text-walnut-light/40 mt-1.5 text-center italic">
              More seats + stronger relationship = higher chance of advancing the bill
            </p>
          </div>
        </div>
      </div>

      {/* Advisor assessment */}
      <div className="max-w-md mx-auto w-full mb-4">
        <div className="flex items-start gap-3 px-4 py-3 rounded bg-walnut/5 border border-brass/20">
          <span className="text-lg flex-shrink-0 mt-0.5">{advisor.icon}</span>
          <div>
            <div className="font-display text-xs font-bold text-brass-dark mb-1">{advisor.firstName}</div>
            <div className="font-body text-sm text-walnut leading-relaxed italic">
              &ldquo;{guidance.assessment}&rdquo;
            </div>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
        <p className="font-body text-sm text-walnut-light text-center">
          How do you push {allyName} on {bill?.shortName || 'this bill'}?
        </p>
        {options.map(opt => (
          <button
            key={opt.key}
            onClick={() => setChoice(opt.key)}
            className={`btn-option ${choice === opt.key ? 'selected' : ''}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl mt-0.5">{opt.icon}</span>
              <div className="flex-1">
                <div className="font-display font-bold text-walnut flex items-center gap-2">
                  <span>{opt.label}</span>
                  {guidance.pick === opt.key && (
                    <span className="text-xs font-ticker text-brass-dark bg-brass/10 px-1.5 py-0.5 rounded">
                      {advisor.firstName}&rsquo;s pick
                    </span>
                  )}
                </div>
                <div className="font-body text-xs text-walnut-light/70 mt-1">{opt.desc}</div>
                {opt.tradeoffs && (
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5">
                    {opt.tradeoffs.map((t, i) => (
                      <span key={i} className={`font-ticker text-[10px] ${t.color}`}>
                        {t.icon} {t.label}
                      </span>
                    ))}
                    {betrayalRisk[opt.key] && betrayalRisk[opt.key] !== 'None' && (
                      <span className={`font-ticker text-[10px] ${betrayalRisk[opt.key] === 'High' ? 'text-darkred' : betrayalRisk[opt.key] === 'Moderate' ? 'text-brass-dark' : 'text-walnut-light/50'}`}>
                        {'\u{1F3B2}'} Betrayal: {betrayalRisk[opt.key]}
                      </span>
                    )}
                  </div>
                )}
                {guidance.options?.[opt.key] && (
                  <div className="flex items-start gap-1.5 mt-1.5">
                    <span className="text-sm flex-shrink-0">{advisor.icon}</span>
                    <div className="font-body text-xs text-walnut-light/60 italic">
                      &ldquo;{guidance.options[opt.key]}&rdquo;
                    </div>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="max-w-md mx-auto w-full mt-6">
        <button
          onClick={() => choice && onSubmit(choice)}
          disabled={!choice}
          className="btn-brass w-full text-lg disabled:opacity-40"
        >
          Make Your Move
        </button>
      </div>
    </div>
  );
}
