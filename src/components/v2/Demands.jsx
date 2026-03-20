// Demands: Negotiation screen after a fusion win
// Player picks a demand, partner accepts/rejects based on leverage

import { useState } from 'react';
import CandidatePortrait from '../CandidatePortrait.jsx';
import GameStatusBar from './GameStatusBar.jsx';
import { getEraData } from '../../data/eraData.js';
import { getRng } from '../../engine/v2/electorate.js';

export default function Demands({ state, dispatch }) {
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [demandResult, setDemandResult] = useState(null);

  const {
    round, advisor, momentum, tycoonThreat, winsCount,
    milestonePoints, goodwill, currentLeverage, currentFusionPartner,
    elections, demandResults,
  } = state;

  const eraData = getEraData(state.era);
  const { ADVISORS, DEMANDS, MILESTONES, getMilestoneProgress, resolveDemand, getPartnerReaction, getAdvisorDemandReaction } = eraData;
  const advisorData = ADVISORS[advisor];
  const election = elections[elections.length - 1];
  const partner = currentFusionPartner === 'dem' ? election.demCandidate : election.repCandidate;
  const partnerFriendliness = partner?.friendliness || 0.5;

  // Which demands have already been won?
  const wonDemandIds = new Set(demandResults.filter(d => d.accepted).map(d => d.demandId));

  const milestoneInfo = getMilestoneProgress(milestonePoints);

  const handleSubmit = () => {
    if (!selectedDemand) return;

    const demand = DEMANDS.find(d => d.id === selectedDemand);
    if (!demand) return;

    const rng = getRng();
    const resolution = resolveDemand(demand, currentLeverage, goodwill, partnerFriendliness);
    const partnerReaction = getPartnerReaction(resolution.reaction, partner.name, rng);
    const advisorReaction = getAdvisorDemandReaction(advisor, demand, resolution.accepted, rng);

    setDemandResult({
      demand,
      accepted: resolution.accepted,
      reaction: resolution.reaction,
      partnerReaction,
      advisorReaction,
    });
    setSubmitted(true);

    // Dispatch to update game state
    dispatch({
      type: 'SUBMIT_DEMAND',
      payload: {
        demand,
        accepted: resolution.accepted,
        reaction: resolution.reaction,
        partnerReaction,
        advisorReaction,
      },
    });
  };

  const handleContinue = () => {
    dispatch({ type: 'FINISH_DEMANDS' });
  };

  // Leverage display
  const leveragePct = Math.round(currentLeverage * 100);
  const leverageLabel = leveragePct >= 60 ? 'Strong' : leveragePct >= 30 ? 'Moderate' : 'Weak';
  const leverageColor = leveragePct >= 60 ? 'text-forest' : leveragePct >= 30 ? 'text-brass-dark' : 'text-darkred';

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      <GameStatusBar round={round} momentum={momentum} tycoonThreat={tycoonThreat} winsCount={winsCount} milestonePoints={milestonePoints} />

      {/* Header */}
      <div className="text-center mb-4 mt-2">
        <div className="font-ticker text-xs tracking-[0.2em] text-brass-dark uppercase">
          Round {round} &bull; Negotiation
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-walnut mt-1">
          Time to Negotiate
        </h1>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
      </div>

      {/* Partner + Leverage */}
      <div className="card-gilded p-4 mb-4 max-w-md mx-auto w-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-brass overflow-hidden bg-cream">
            <CandidatePortrait id={partner.id} traits={partner.portraitTraits} size={48} era={state.era} />
          </div>
          <div>
            <div className="font-display text-sm font-bold text-walnut">{partner.name}</div>
            <div className="font-ticker text-xs text-walnut-light/60">{partner.title} ({partner.party === 'democrat' ? 'D' : 'R'})</div>
            <div className="font-body text-xs text-walnut-light italic mt-0.5">
              &ldquo;You helped me win. What do you want?&rdquo;
            </div>
          </div>
        </div>

        {/* Leverage meter */}
        <div className="flex items-center gap-2">
          <span className="font-ticker text-xs text-walnut-light/60">Your Leverage:</span>
          <div className="flex-1 h-2 bg-walnut/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-brass"
              style={{ width: `${Math.min(100, leveragePct)}%` }}
            />
          </div>
          <span className={`font-ticker text-xs font-bold ${leverageColor}`}>
            {leveragePct}% &bull; {leverageLabel}
          </span>
        </div>
      </div>

      {/* Milestone Progress */}
      <div className="card-gilded p-3 mb-4 max-w-md mx-auto w-full">
        <div className="font-ticker text-xs text-brass-dark uppercase tracking-wider mb-2">
          Party Viability
        </div>
        <MilestoneBar milestonePoints={milestonePoints} MILESTONES={MILESTONES} getMilestoneProgress={getMilestoneProgress} />
      </div>

      {!submitted ? (
        <>
          {/* Demand cards */}
          <div className="max-w-md mx-auto w-full space-y-2 mb-4">
            {DEMANDS.map(demand => {
              const isWon = wonDemandIds.has(demand.id);
              const isSelected = selectedDemand === demand.id;
              const difficulty = currentLeverage >= demand.leverageThreshold + 0.15
                ? 'easy' : currentLeverage >= demand.leverageThreshold
                ? 'possible' : 'hard';

              return (
                <button
                  key={demand.id}
                  onClick={() => !isWon && setSelectedDemand(demand.id)}
                  disabled={isWon}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    isWon
                      ? 'border-forest/30 bg-forest/5 opacity-60 cursor-not-allowed'
                      : isSelected
                        ? 'border-brass bg-brass/10 shadow-md'
                        : 'border-walnut/10 bg-cream/50 hover:border-brass/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{demand.icon}</span>
                      <span className="font-display text-sm font-bold text-walnut">{demand.label}</span>
                    </div>
                    {isWon && (
                      <span className="font-ticker text-xs text-forest font-bold">&#x2713; WON</span>
                    )}
                    {!isWon && (
                      <span className={`font-ticker text-[10px] px-1.5 py-0.5 rounded uppercase ${
                        difficulty === 'easy' ? 'bg-forest/15 text-forest' :
                        difficulty === 'possible' ? 'bg-brass/20 text-brass-dark' :
                        'bg-darkred/10 text-darkred'
                      }`}>
                        {difficulty === 'easy' ? 'Likely' : difficulty === 'possible' ? 'Possible' : 'Unlikely'}
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-walnut-light ml-7">{demand.description}</p>
                  {!isWon && (
                    <div className="flex items-center gap-3 mt-1 ml-7">
                      <span className="font-ticker text-[10px] text-walnut-light/50">
                        +{demand.milestonePoints} milestone pts
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Submit demand button */}
          <div className="max-w-md mx-auto w-full">
            <button
              onClick={handleSubmit}
              disabled={!selectedDemand}
              className={`btn-brass w-full text-base py-3 font-display tracking-wide ${
                !selectedDemand ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Make Your Demand
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Demand result */}
          <div className="max-w-md mx-auto w-full space-y-3 mb-4">
            {/* Partner reaction */}
            <div className={`card-gilded p-4 border-l-4 ${
              demandResult.accepted ? 'border-forest' : 'border-darkred'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-shrink-0 w-10 h-10 rounded-full border border-walnut/20 overflow-hidden bg-cream">
                  <CandidatePortrait id={partner.id} traits={partner.portraitTraits} size={40} era={state.era} />
                </div>
                <div>
                  <span className={`font-display text-sm font-bold ${
                    demandResult.accepted ? 'text-forest' : 'text-darkred'
                  }`}>
                    {demandResult.accepted ? 'ACCEPTED' : 'REFUSED'}
                    {demandResult.reaction === 'grudging' && (
                      <span className="text-brass-dark font-normal text-xs ml-2">(grudgingly)</span>
                    )}
                  </span>
                </div>
              </div>
              <p className="font-body text-sm text-walnut italic">
                {demandResult.partnerReaction}
              </p>
              {demandResult.accepted && (
                <div className="mt-2 p-2 bg-forest/10 rounded text-center">
                  <span className="font-ticker text-xs text-forest font-bold">
                    +{demandResult.demand.milestonePoints} Milestone Points
                  </span>
                </div>
              )}
            </div>

            {/* Advisor reaction */}
            <div className="card-gilded p-3">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden border border-brass/30">
                  <CandidatePortrait id={state.advisor} traits={advisorData.portraitTraits} size={32} era={state.era} />
                </div>
                <div className="flex-1">
                  <div className="font-ticker text-xs text-brass-dark">
                    {advisorData.firstName}:
                  </div>
                  <div className="font-body text-sm text-walnut mt-1 italic">
                    &ldquo;{demandResult.advisorReaction}&rdquo;
                  </div>
                </div>
              </div>
            </div>

            {/* Updated milestone bar */}
            <div className="card-gilded p-3">
              <div className="font-ticker text-xs text-brass-dark uppercase tracking-wider mb-2">
                Party Viability — Updated
              </div>
              <MilestoneBar milestonePoints={milestonePoints} MILESTONES={MILESTONES} getMilestoneProgress={getMilestoneProgress} />
            </div>
          </div>

          {/* Continue button */}
          <div className="max-w-md mx-auto w-full">
            <button onClick={handleContinue} className="btn-brass w-full text-base py-3">
              {round < 5 ? 'Next Election' : 'See Your Results'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Milestone Progress Bar ──────────────────────────────────────

function MilestoneBar({ milestonePoints, MILESTONES, getMilestoneProgress }) {
  const { current, next, progress, currentIndex } = getMilestoneProgress(milestonePoints);

  return (
    <div>
      {/* Milestone dots */}
      <div className="flex items-center justify-between mb-2">
        {MILESTONES.map((m, i) => (
          <div key={m.id} className="flex flex-col items-center" style={{ flex: i === 0 || i === MILESTONES.length - 1 ? '0 0 auto' : '1' }}>
            <div className={`w-3 h-3 rounded-full border-2 transition-all ${
              i <= currentIndex
                ? 'bg-brass border-brass'
                : 'bg-transparent border-walnut/20'
            }`} />
            <span className={`font-ticker text-[9px] mt-1 text-center leading-tight ${
              i <= currentIndex ? 'text-brass-dark font-bold' : 'text-walnut-light/40'
            }`}>
              {m.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar between current and next */}
      <div className="h-1.5 bg-walnut/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-brass rounded-full transition-all duration-700"
          style={{ width: `${(currentIndex / (MILESTONES.length - 1)) * 100 + (progress / (MILESTONES.length - 1)) * 100}%` }}
        />
      </div>

      {/* Current milestone label */}
      <div className="flex justify-between items-center mt-1">
        <span className="font-ticker text-[10px] text-brass-dark font-bold">
          {current.label}
        </span>
        <span className="font-ticker text-[10px] text-walnut-light/50">
          {milestonePoints} pts{next ? ` / ${next.threshold} for ${next.label}` : ' — MAX'}
        </span>
      </div>
    </div>
  );
}
