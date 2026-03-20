// Dashboard of Reckoning: Fusion vs FPTP + Milestone Progress

import { getEraData } from '../../data/eraData.js';

export default function Dashboard({ state, onPlayAgain, onSwitchEra }) {
  const { elections, fptpCounterfactual, partyName, winsCount, milestonePoints, demandResults } = state;
  const eraData = getEraData(state.era);
  const { getCurrentMilestone, getMilestoneProgress, RACE_CATEGORIES, antagonistName, MILESTONES } = eraData;
  const isModern = state.era === 'modern';

  const fusionWins = winsCount;
  const fptpWins = 0; // FPTP counterfactual always yields 0 wins
  const fusionSpoiled = elections.filter(e => e.result.spoiled).length;
  const fptpSpoiled = fptpCounterfactual?.filter(e => e.spoiled).length || 0;

  const currentMilestone = getCurrentMilestone(milestonePoints || 0);
  const milestoneInfo = getMilestoneProgress(milestonePoints || 0);

  // Party status based on milestone reached
  const partyStatusFusion = milestoneInfo.currentIndex >= 4 ? 'Legislation Passed!'
    : milestoneInfo.currentIndex >= 3 ? 'Bill on the Floor'
    : milestoneInfo.currentIndex >= 2 ? 'Building Alliances'
    : milestoneInfo.currentIndex >= 1 ? 'On the Ballot'
    : 'Just Getting Started';
  const partyStatusFPTP = 'Dead';

  const blackwoodStatusFusion = fusionWins >= 4 ? 'Reeling' : fusionWins >= 3 ? 'Weakened' : fusionWins >= 1 ? 'Challenged' : 'Untouched';
  const blackwoodStatusFPTP = 'Untouched';

  const acceptedDemands = demandResults?.filter(d => d.accepted) || [];

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="font-ticker text-xs tracking-[0.3em] text-brass-dark uppercase">
          The Reckoning
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-walnut mt-1">
          Dashboard of Democracy
        </h1>
        <div className="divider-ornate text-brass text-sm">&#x2726;</div>
        <p className="font-body text-sm text-walnut-light italic">
          Same voters. Same organizer. Same tycoon. Different rules.
        </p>
      </div>

      {/* Milestone Progress — the big payoff */}
      <div className="max-w-lg mx-auto w-full mb-6">
        <div className="card-gilded p-4 border-t-4 border-brass">
          <div className="font-ticker text-xs text-brass-dark uppercase tracking-wider mb-3">
            Your Party&apos;s Journey
          </div>

          {/* Milestone bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              {MILESTONES.map((m, i) => (
                <div key={m.id} className="flex flex-col items-center" style={{ flex: i === 0 || i === MILESTONES.length - 1 ? '0 0 auto' : '1' }}>
                  <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                    i <= milestoneInfo.currentIndex
                      ? 'bg-brass border-brass'
                      : 'bg-transparent border-walnut/20'
                  }`}>
                    {i <= milestoneInfo.currentIndex && (
                      <div className="w-full h-full flex items-center justify-center text-cream text-[8px] font-bold">
                        &#x2713;
                      </div>
                    )}
                  </div>
                  <span className={`font-ticker text-[9px] mt-1 text-center leading-tight max-w-[60px] ${
                    i <= milestoneInfo.currentIndex ? 'text-brass-dark font-bold' : 'text-walnut-light/40'
                  }`}>
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-2 bg-walnut/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-brass rounded-full transition-all duration-1000"
                style={{ width: `${(milestoneInfo.currentIndex / (MILESTONES.length - 1)) * 100 + (milestoneInfo.progress / (MILESTONES.length - 1)) * 100}%` }}
              />
            </div>
            <p className="font-body text-xs text-walnut-light text-center mt-2 italic">
              {currentMilestone.description}
            </p>
          </div>

          {/* Demand wins */}
          {acceptedDemands.length > 0 && (
            <div className="border-t border-walnut/10 pt-3">
              <div className="font-ticker text-xs text-brass-dark uppercase tracking-wider mb-2">
                Demands Won
              </div>
              <div className="space-y-1">
                {acceptedDemands.map((d, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-forest text-xs">&#x2713;</span>
                    <span className="font-body text-xs text-walnut">{d.demandLabel}</span>
                    <span className="font-ticker text-[10px] text-walnut-light/50">Round {d.round}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FPTP Counterfactual comparison */}
      <div className="max-w-lg mx-auto w-full mb-6">
        <div className="font-ticker text-xs text-walnut-light/60 uppercase tracking-wider text-center mb-2">
          Without Fusion Voting
        </div>
        <div className="card-gilded p-4 border-t-4 border-darkred">
          <div className="grid grid-cols-3 gap-2 text-center mb-2">
            <div>
              <div className="font-ticker text-[10px] text-walnut-light/50 uppercase">Wins</div>
              <div className="font-display text-lg font-bold text-darkred">0 / 5</div>
            </div>
            <div>
              <div className="font-ticker text-[10px] text-walnut-light/50 uppercase">Milestone</div>
              <div className="font-ticker text-xs font-bold text-darkred">Recognition</div>
              <div className="font-ticker text-[10px] text-walnut-light/40">(stuck at zero)</div>
            </div>
            <div>
              <div className="font-ticker text-[10px] text-walnut-light/50 uppercase">Party</div>
              <div className="font-ticker text-xs font-bold text-darkred">Dead</div>
            </div>
          </div>
          <p className="font-body text-xs text-walnut-light/60 text-center italic">
            Without fusion, your 3-5% support is invisible. Strategic defection kills your party before it starts.
          </p>
        </div>
      </div>

      {/* 2-column comparison */}
      <div className="max-w-lg mx-auto w-full grid grid-cols-2 gap-3 mb-6">
        {/* Fusion column */}
        <div className="card-gilded p-3 border-t-4 border-forest">
          <div className="text-center mb-3">
            <div className="font-display font-bold text-forest text-sm uppercase">
              Your Game
            </div>
            <div className="font-ticker text-xs text-walnut-light/60">
              With Fusion Voting
            </div>
          </div>

          <StatRow label="Elections Won" value={`${fusionWins} / 5`} highlight={fusionWins >= 3} />
          <StatRow label="Votes Split" value={fusionSpoiled} bad={fusionSpoiled > 0} />
          <StatRow label="Party Status" value={partyStatusFusion} highlight={milestoneInfo.currentIndex >= 1} />
          <StatRow label={`${antagonistName}'s Grip`} value={blackwoodStatusFusion} highlight={fusionWins >= 3} />
        </div>

        {/* FPTP column */}
        <div className="card-gilded p-3 border-t-4 border-darkred">
          <div className="text-center mb-3">
            <div className="font-display font-bold text-darkred text-sm uppercase">
              Without Fusion
            </div>
            <div className="font-ticker text-xs text-walnut-light/60">
              FPTP Counterfactual
            </div>
          </div>

          <StatRow label="Elections Won" value={`${fptpWins} / 5`} bad />
          <StatRow label="Votes Split" value={fptpSpoiled} bad={fptpSpoiled > 0} />
          <StatRow label="Party Status" value={partyStatusFPTP} bad />
          <StatRow label={`${antagonistName}'s Grip`} value={blackwoodStatusFPTP} bad />
        </div>
      </div>

      {/* Per-election comparison */}
      <div className="max-w-lg mx-auto w-full mb-6">
        <h2 className="font-display text-sm font-bold text-walnut uppercase tracking-wider mb-2">
          Election by Election
        </h2>
        {elections.map((el, i) => {
          const fptp = fptpCounterfactual?.[i];
          const catLabel = RACE_CATEGORIES[el.category]?.shortLabel || '';
          return (
            <div key={el.round} className="card-gilded p-2 mb-2">
              <div className="font-ticker text-xs text-brass-dark mb-1">
                Round {el.round}: {el.officeShort || el.office}{el.location ? `, ${el.location}` : ''} {catLabel ? `(${catLabel})` : ''}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-body text-walnut-light">Fusion: </span>
                  <span className={`font-bold ${el.result.playerWon ? 'text-forest' : el.result.spoiled ? 'text-darkred' : 'text-walnut-light'}`}>
                    {el.result.playerWon ? 'WON' : el.result.spoiled ? 'SPOILED' : 'LOST'}
                  </span>
                  <span className="text-walnut-light/50 ml-1">({el.result.yourPct}%)</span>
                </div>
                <div>
                  <span className="font-body text-walnut-light">FPTP: </span>
                  <span className={`font-bold ${fptp?.spoiled ? 'text-darkred' : 'text-walnut-light'}`}>
                    {fptp?.spoiled ? 'SPOILED' : 'LOST'}
                  </span>
                  <span className="text-walnut-light/50 ml-1">({fptp?.yourPct}%)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* The punchline */}
      <div className="max-w-lg mx-auto w-full text-center mb-6">
        <div className="card-gilded p-5">
          <p className="font-display text-lg font-bold text-walnut">
            &ldquo;The voters didn&apos;t change. The rules did.&rdquo;
          </p>
          <p className="font-body text-sm text-walnut-light mt-2">
            Fusion voting gave your party a fighting chance against {antagonistName}&apos;s machine.
            Without it, the same voters, the same organizer, the same cause —
            produced nothing but spoiled races and a dead party.
          </p>
          <p className="font-body text-xs text-walnut-light/60 mt-3 italic">
            {isModern
              ? 'This reflects a real dynamic. Fusion voting was legal in most states until the early 1900s, when major parties banned it to eliminate third-party competition. Restoring it could break the two-party doom loop.'
              : 'This is historically accurate. Between 1896 and 1910, most states banned fusion voting at the behest of major-party legislators — eliminating the only tool that made third parties viable.'}
          </p>
        </div>
      </div>

      {/* Play again / Try Today */}
      <div className="max-w-md mx-auto w-full text-center">
        <button onClick={onPlayAgain} className="btn-brass text-base px-8 py-3">
          Play Again
        </button>
        <p className="font-ticker text-xs text-walnut-light/40 mt-3">
          Try a different advisor and see how the strategy changes.
        </p>

        {!isModern && onSwitchEra && (
          <div className="mt-6 card-gilded p-4 border-t-4 border-brass">
            <p className="font-display text-base font-bold text-walnut">
              That was 1892. Now try today.
            </p>
            <p className="font-body text-sm text-walnut-light mt-2">
              Fusion was banned over a century ago. But what if it came back?
              Play the modern era and see if fusion voting can break today&apos;s doom loop.
            </p>
            <button
              onClick={() => onSwitchEra('modern')}
              className="btn-brass text-sm px-6 py-2 mt-3"
            >
              Play 2026
            </button>
          </div>
        )}

        {isModern && onSwitchEra && (
          <div className="mt-6">
            <button
              onClick={() => onSwitchEra('historical')}
              className="font-ticker text-xs text-brass-dark underline hover:text-walnut transition-colors"
            >
              Play the 1892 version
            </button>
          </div>
        )}
      </div>

      {/* Decorative bottom border */}
      <div className="w-full max-w-sm mx-auto mt-8">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-brass/50 to-transparent" />
        <div className="h-px mt-0.5 bg-gradient-to-r from-transparent via-brass to-transparent" />
      </div>
    </div>
  );
}

function StatRow({ label, value, highlight, bad }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-walnut/5 last:border-0">
      <span className="font-body text-xs text-walnut-light/70">{label}</span>
      <span className={`font-ticker text-xs font-bold ${
        highlight ? 'text-forest' : bad ? 'text-darkred' : 'text-walnut'
      }`}>
        {value}
      </span>
    </div>
  );
}
