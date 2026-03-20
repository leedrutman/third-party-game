import { ISSUES } from '../data/issues.js';
import { getFlagshipBill, getCurrentStage } from '../engine/legislativeVotes.js';
import CandidatePortrait from './CandidatePortrait.jsx';

// Bill pipeline progress indicator (shared with LegislativeVote)
function BillPipeline({ currentStage, stages, justAdvanced }) {
  const stageNames = stages?.map(s => s.name) || ['Introduction', 'Committee', 'Floor Vote'];
  return (
    <div className="flex items-center gap-1 mb-4">
      {stageNames.map((name, i) => {
        const done = i < currentStage;
        const active = i === currentStage;
        const justDone = justAdvanced && i === currentStage - 1;
        return (
          <div key={i} className="flex-1 flex items-center">
            <div className="flex-1 flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                done ? 'bg-forest border-forest text-cream' :
                active ? 'bg-brass/20 border-brass text-brass-dark' :
                'bg-walnut/5 border-walnut/20 text-walnut-light/40'
              } ${justDone ? 'ring-2 ring-forest/30 ring-offset-1' : ''}`}>
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

export default function LegislativeResult({ election, state, onContinue }) {
  const elData = state.act1.elections[election];
  const legVote = elData?.legislativeVote;

  const issueKey = typeof state.party?.issues === 'string' ? state.party.issues : state.party?.issues?.[0];
  const bill = getFlagshipBill(issueKey);
  const billProgress = state.act1.billProgress;
  const currentStage = billProgress?.stage || 0;

  // Did the bill just advance this election?
  const latestHistory = billProgress?.stageHistory?.slice(-1)[0];
  const justAdvanced = latestHistory?.election === election && latestHistory?.advanced;
  const billJustPassed = justAdvanced && currentStage >= 3;

  // Find ally portrait
  let allyId = null;
  const heldEntry = Object.entries(state.act1.seatsHeld).find(([, v]) => v);
  if (heldEntry) {
    const [distId, fusionType] = heldEntry;
    const partyKey = fusionType === 'fusionDem' ? 'democrat' : 'republican';
    const candidate = state.candidates[distId]?.[partyKey];
    if (candidate) allyId = candidate.id;
  }

  if (!legVote || legVote.playerChoice === 'none') {
    return (
      <div className="screen-enter min-h-dvh flex flex-col items-center justify-center px-6 py-12 paper-texture">
        <div className="text-center max-w-md">
          <div className="font-display text-2xl font-bold text-walnut mb-4">
            {'\u{1F4CB}'} Session Adjourned
          </div>

          {/* Show pipeline even when no action */}
          <BillPipeline currentStage={currentStage} stages={bill?.stages} justAdvanced={false} />

          <p className="font-body text-sm text-walnut-light mb-6">
            Without seats in the legislature, {bill?.shortName || 'your bill'} never reached the floor.
            The lesson is clear: you need to win to have any power at all.
          </p>
          <button onClick={onContinue} className="btn-brass text-lg px-8 py-4">
            {election < 3 ? `On to ${election === 1 ? '1894' : '1896'}` : 'Review Act I'}
          </button>
        </div>
      </div>
    );
  }

  const advanced = legVote.advanced ?? (legVote.outcome === 'full');
  const betrayal = legVote.betrayal;
  const billTitle = bill?.shortName || legVote.bill?.title || 'the bill';

  // Get the stage data for the stage we ATTEMPTED (current - 1 if advanced, current if not)
  const attemptedStage = justAdvanced ? currentStage - 1 : currentStage;
  const stageData = bill?.stages?.[attemptedStage];

  let emoji, headline, description;

  if (billJustPassed) {
    // BILL BECOMES LAW - special celebration
    emoji = '\u{1F3DB}\uFE0F'; // classical building
    headline = `${bill?.name || billTitle} Is Now Law!`;
    description = stageData?.successText || `Your flagship legislation passes into law. This is what your party was built for.`;
  } else if (betrayal) {
    emoji = '\u{1F4A5}'; // explosion
    headline = 'Betrayal!';
    description = state.act1.betrayalDetails?.description ||
      `Your ally voted against ${billTitle} despite the fusion deal. The newspapers are full of it.`;
  } else if (advanced) {
    emoji = '\u2705'; // check
    headline = stageData?.successText
      ? `${billTitle} Advances!`
      : `${billTitle} Advances!`;
    description = stageData?.successText ||
      `Your fusion ally held the line. ${billTitle} moves to the next stage.`;
  } else {
    emoji = '\u274C'; // red X
    headline = `${billTitle} Stalled`;
    description = stageData?.failText ||
      `The bill goes nowhere this session. You'll need more leverage next time.`;
  }

  const electionYears = { 1: 1892, 2: 1894, 3: 1896 };

  return (
    <div className="screen-enter min-h-dvh flex flex-col items-center justify-center px-6 py-12 paper-texture">
      <div className="text-center max-w-md">
        <div className="font-ticker text-xs tracking-[0.2em] text-brass-dark uppercase mb-4">
          Act I &bull; {electionYears[election]} &bull; Legislative Result
        </div>

        {/* Bill pipeline progress */}
        <BillPipeline currentStage={currentStage} stages={bill?.stages} justAdvanced={justAdvanced} />

        <div className={`card-gilded p-6 mb-6 ${billJustPassed ? 'border-2 border-forest' : ''}`}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-4xl">{emoji}</span>
            {allyId && <CandidatePortrait candidateId={allyId} size={48} />}
          </div>
          <h1 className={`font-display text-2xl font-bold mb-3 ${billJustPassed ? 'text-forest' : 'text-walnut'}`}>
            {headline}
          </h1>
          <p className="font-body text-sm text-walnut-light leading-relaxed">{description}</p>

          {/* Resource changes summary */}
          <div className="mt-4 pt-4 border-t border-walnut/10 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="font-ticker text-xs text-walnut-light/50">Morale</div>
              <div className={`font-display text-sm font-bold ${
                state.resources.morale > 50 ? 'text-forest' : state.resources.morale > 25 ? 'text-brass-dark' : 'text-darkred'
              }`}>
                {state.resources.morale}
              </div>
            </div>
            <div>
              <div className="font-ticker text-xs text-walnut-light/50">Visibility</div>
              <div className={`font-display text-sm font-bold ${
                state.resources.visibility > 50 ? 'text-forest' : state.resources.visibility > 25 ? 'text-brass-dark' : 'text-darkred'
              }`}>
                {state.resources.visibility}
              </div>
            </div>
            <div>
              <div className="font-ticker text-xs text-walnut-light/50">Ally</div>
              <div className={`font-display text-sm font-bold ${
                state.allyRelationship >= 60 ? 'text-forest' : state.allyRelationship >= 30 ? 'text-brass-dark' : 'text-darkred'
              }`}>
                {state.allyRelationship >= 60 ? 'Healthy' : state.allyRelationship >= 30 ? 'Strained' : 'Hostile'}
              </div>
            </div>
          </div>
        </div>

        {betrayal && (
          <div className="card-gilded p-4 mb-4 border-l-4 border-darkred">
            <p className="font-body text-xs text-darkred italic">
              The &ldquo;Go Public&rdquo; option is now available in future legislative votes.
              You can take this betrayal to the press.
            </p>
          </div>
        )}

        {!advanced && !betrayal && election < 3 && (
          <div className="card-gilded p-4 mb-4 border-l-4 border-brass">
            <p className="font-body text-xs text-brass-dark italic">
              You&rsquo;ll have another chance to advance {billTitle} after the next election.
              Win more seats and strengthen your leverage.
            </p>
          </div>
        )}

        <button onClick={onContinue} className="btn-brass text-lg px-8 py-4 w-full">
          {election < 3 ? `On to ${election === 1 ? '1894' : '1896'}` : 'Review Act I'}
        </button>
      </div>
    </div>
  );
}
