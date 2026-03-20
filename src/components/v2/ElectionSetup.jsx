import CandidatePortrait from '../CandidatePortrait.jsx';
import { getEraData } from '../../data/eraData.js';
import { getFriendlinessLabel, getFriendlinessColor } from '../../data/v2/candidates.js';
import GameStatusBar from './GameStatusBar.jsx';

export default function ElectionSetup({ state, onContinue }) {
  const { round, roundCandidates, advisor, momentum, tycoonThreat, winsCount, milestonePoints } = state;
  const { dem, rep, office, year, category, location, incumbent, incumbentName, partisanLean, handicapperRating, yourProjectedSupport } = roundCandidates;
  const eraData = getEraData(state.era);
  const { ADVISORS, ANTAGONIST, getAntagonistStage, getAdvisorBriefing, RACE_CATEGORIES, antagonistQuoteKey } = eraData;
  const tycoonStage = getAntagonistStage(round);
  const advisorData = ADVISORS[advisor];
  const briefing = getAdvisorBriefing(advisor, round, dem, rep);

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      <GameStatusBar round={round} momentum={momentum} tycoonThreat={tycoonThreat} winsCount={winsCount} milestonePoints={milestonePoints} />

      {/* Election header */}
      <div className="text-center mb-4 mt-2">
        <div className="font-ticker text-xs tracking-[0.2em] text-brass-dark uppercase">
          Election {round} of 5 &bull; {year || (1891 + round)}
        </div>
        <h1 className="font-display text-2xl font-bold text-walnut mt-1">
          Race for {office}
        </h1>
        {location && (
          <div className="font-ticker text-xs text-walnut-light/60 mt-0.5">
            {location} &bull; {RACE_CATEGORIES[category]?.label || 'Race'}
          </div>
        )}
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
      </div>

      {/* Race context stats */}
      {partisanLean && (
        <div className="max-w-md mx-auto w-full mb-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-cream-dark/30 rounded p-1.5">
              <div className="font-ticker text-[10px] text-walnut-light/60 uppercase">Lean</div>
              <div className="font-ticker text-xs font-bold text-walnut">{partisanLean}</div>
            </div>
            <div className="bg-cream-dark/30 rounded p-1.5">
              <div className="font-ticker text-[10px] text-walnut-light/60 uppercase">Rating</div>
              <div className="font-ticker text-xs font-bold text-walnut">{handicapperRating}</div>
            </div>
            <div className="bg-cream-dark/30 rounded p-1.5">
              <div className="font-ticker text-[10px] text-walnut-light/60 uppercase">Incumbent</div>
              <div className="font-ticker text-xs font-bold text-walnut">{incumbent === 'Open Seat' ? 'Open' : incumbent?.charAt(0)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Antagonist alert (if active) */}
      {tycoonStage[antagonistQuoteKey] && (
        <div className="card-gilded p-3 mb-4 max-w-md mx-auto w-full border-l-4 border-darkred">
          <div className="flex items-start gap-2">
            <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden border border-walnut/20">
              <CandidatePortrait id={ANTAGONIST.id} traits={ANTAGONIST.portraitTraits} size={40} era={state.era} />
            </div>
            <div className="flex-1">
              <div className="font-ticker text-xs text-darkred font-bold uppercase">
                {ANTAGONIST.name} &mdash; {tycoonStage.label}
              </div>
              <div className="font-body text-xs text-walnut-light mt-1 italic">
                {tycoonStage[antagonistQuoteKey]}
              </div>
              <div className="font-body text-xs text-walnut-light/70 mt-1">
                {tycoonStage.description}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidates */}
      <div className="max-w-md mx-auto w-full space-y-3 mb-4">
        <h2 className="font-display text-sm font-bold text-walnut uppercase tracking-wider">The Candidates</h2>

        {/* Democrat */}
        <CandidateCard candidate={dem} label="Democrat" era={state.era} />

        {/* Republican */}
        <CandidateCard candidate={rep} label="Republican" era={state.era} />
      </div>

      {/* Advisor briefing */}
      <div className="card-gilded p-3 mb-6 max-w-md mx-auto w-full">
        <div className="flex items-start gap-2">
          <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden border border-brass/30">
            <CandidatePortrait id={advisor} traits={advisorData.portraitTraits} size={40} era={state.era} />
          </div>
          <div className="flex-1">
            <div className="font-ticker text-xs text-brass-dark">
              {advisorData.firstName} says:
            </div>
            <div className="font-body text-sm text-walnut mt-1 italic">
              &ldquo;{briefing}&rdquo;
            </div>
          </div>
        </div>
      </div>

      {/* Continue button */}
      <div className="max-w-md mx-auto w-full">
        <button onClick={onContinue} className="btn-brass w-full text-base py-3">
          Make Your Choice
        </button>
      </div>
    </div>
  );
}

function CandidateCard({ candidate, label, era = 'historical' }) {
  const friendLabel = getFriendlinessLabel(candidate.friendliness);
  const friendColor = getFriendlinessColor(candidate.friendliness);

  return (
    <div className={`card-gilded p-3 ${(candidate.boughtByBlackwood || candidate.boughtByAntagonist) ? 'border-l-4 border-darkred' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden border border-walnut/20">
          <CandidatePortrait id={candidate.id} traits={candidate.portraitTraits} size={48} era={era} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-walnut text-sm">{candidate.name}</span>
            <span className="font-ticker text-xs text-walnut-light/50">({label})</span>
          </div>
          <div className="font-ticker text-xs text-brass-dark">{candidate.title}</div>
          <div className="font-body text-xs text-walnut-light/70 mt-1">{candidate.description}</div>
          <div className={`font-ticker text-xs mt-1 ${friendColor}`}>
            {friendLabel}
            {(candidate.boughtByBlackwood || candidate.boughtByAntagonist) && (
              <span className="text-darkred font-bold ml-1">— BOUGHT</span>
            )}
            {candidate.pressured && !candidate.boughtByBlackwood && !candidate.boughtByAntagonist && (
              <span className="text-walnut-light/50 ml-1">— under pressure</span>
            )}
          </div>
          {candidate.pressureNote && (
            <div className="font-body text-xs text-walnut-light/60 mt-0.5 italic">
              {candidate.pressureNote}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
