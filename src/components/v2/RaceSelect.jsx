// Race Selection: Two-category tabs (State Legislative / Statewide) with Ask for Advice

import { useState } from 'react';
import GameStatusBar from './GameStatusBar.jsx';
import CandidatePortrait from '../CandidatePortrait.jsx';
import { getEraData } from '../../data/eraData.js';
import { getAdvisorRaceCommentary, getAdvisorTransitionLine, getAdvisorRaceAdvice } from '../../data/v2/advisorRaceCommentary.js';
import { getFriendlinessLabel, getFriendlinessColor } from '../../data/v2/candidates.js';

export default function RaceSelect({ state, onSelect }) {
  const [activeTab, setActiveTab] = useState('state_leg');
  const [confirmed, setConfirmed] = useState(null);
  const [showAdvice, setShowAdvice] = useState(false);

  const { round, availableRaces, advisor, momentum, tycoonThreat, winsCount, previousResults, milestonePoints } = state;
  const eraData = getEraData(state.era);
  const { ADVISORS, ANTAGONIST, getAntagonistStage, RACE_CATEGORIES, antagonistQuoteKey, getCurrentMilestone } = eraData;
  const advisorData = ADVISORS[advisor];
  const tycoonStage = getAntagonistStage(round);

  // availableRaces is now { stateLeg, statewide }
  const stateLegRace = availableRaces?.stateLeg;
  const statewideRace = availableRaces?.statewide;
  const activeRace = activeTab === 'state_leg' ? stateLegRace : statewideRace;

  // Transition line from previous round
  const transitionLine = getAdvisorTransitionLine(advisor, round, winsCount, previousResults);

  // Advice (only generated when requested)
  const advice = showAdvice && stateLegRace && statewideRace
    ? getAdvisorRaceAdvice(advisor, stateLegRace, statewideRace, round, winsCount)
    : null;

  const currentMilestone = getCurrentMilestone(milestonePoints || 0);

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      <GameStatusBar round={round} momentum={momentum} tycoonThreat={tycoonThreat} winsCount={winsCount} milestonePoints={milestonePoints} />

      {/* Header */}
      <div className="text-center mb-4 mt-2">
        <div className="font-ticker text-xs tracking-[0.2em] text-brass-dark uppercase">
          Round {round} of 5 &bull; Choose Your Race
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-walnut mt-1">
          Where Will You Fight?
        </h1>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
      </div>

      {/* Advisor transition commentary */}
      {transitionLine && (
        <div className="card-gilded p-4 mb-4 max-w-md mx-auto w-full">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-brass overflow-hidden bg-cream">
              <CandidatePortrait id={advisor} traits={advisorData.portraitTraits} size={40} era={state.era} />
            </div>
            <div>
              <div className="font-ticker text-xs text-brass-dark mb-1">
                {advisorData.name} says:
              </div>
              <p className="font-body text-sm text-walnut leading-relaxed italic">
                &ldquo;{transitionLine}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Antagonist alert (rounds 2+) */}
      {tycoonStage[antagonistQuoteKey] && (
        <div className="card-gilded p-3 mb-4 max-w-md mx-auto w-full border-l-4 border-darkred">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-darkred/50 overflow-hidden bg-cream">
              <CandidatePortrait id={ANTAGONIST.id} traits={ANTAGONIST.portraitTraits} size={40} era={state.era} />
            </div>
            <div>
              <div className="font-ticker text-xs text-darkred uppercase tracking-wider">
                {ANTAGONIST.name} &mdash; {tycoonStage.label}
              </div>
              <p className="font-body text-xs text-walnut-light italic mt-1">
                {tycoonStage[antagonistQuoteKey]}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Two category tabs */}
      <div className="flex gap-1 max-w-md mx-auto w-full mb-0">
        {['state_leg', 'statewide'].map((catKey) => {
          const cat = RACE_CATEGORIES[catKey];
          const race = catKey === 'state_leg' ? stateLegRace : statewideRace;
          return (
            <button
              key={catKey}
              onClick={() => { setActiveTab(catKey); setConfirmed(null); }}
              className={`flex-1 py-2 px-2 rounded-t-lg text-center transition-all border-b-2 ${
                activeTab === catKey
                  ? 'border-brass bg-cream shadow-sm'
                  : 'border-transparent bg-walnut/5 hover:bg-walnut/10'
              }`}
            >
              <div className="font-ticker text-[10px] text-brass-dark uppercase tracking-wider">
                {cat.shortLabel}
              </div>
              <div className="font-display text-xs sm:text-sm font-bold text-walnut leading-tight">
                {race?.officeShort || cat.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active race detail card */}
      {activeRace && (
        <RaceDetailCard
          race={activeRace}
          advisorId={advisor}
          advisorData={advisorData}
          round={round}
          winsCount={winsCount}
          previousResults={previousResults}
          isConfirmed={confirmed === activeTab}
          onConfirm={() => setConfirmed(activeTab)}
          raceCategories={RACE_CATEGORIES}
          era={state.era}
        />
      )}

      {/* Ask for Advice button */}
      {!showAdvice && (
        <div className="max-w-md mx-auto w-full mt-3">
          <button
            onClick={() => setShowAdvice(true)}
            className="btn-option w-full py-2 font-display text-sm"
          >
            Ask {advisorData.firstName} for Advice
          </button>
        </div>
      )}

      {/* Advisor advice */}
      {advice && (
        <div className="card-gilded p-4 mt-3 max-w-md mx-auto w-full border-l-4 border-brass">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-brass overflow-hidden bg-cream">
              <CandidatePortrait id={advisor} traits={advisorData.portraitTraits} size={32} era={state.era} />
            </div>
            <div>
              <div className="font-ticker text-xs text-brass-dark mb-1">
                {advisorData.firstName}&apos;s Recommendation:
              </div>
              <p className="font-body text-sm text-walnut leading-relaxed italic">
                &ldquo;{advice.text}&rdquo;
              </p>
              {advice.recommendation && (
                <button
                  onClick={() => { setActiveTab(advice.recommendation); setConfirmed(null); }}
                  className="mt-2 font-ticker text-xs text-brass-dark underline hover:text-brass cursor-pointer"
                >
                  View {advice.recommendation === 'state_leg' ? 'State Legislative' : 'Statewide'} race &rarr;
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enter race button */}
      {confirmed !== null && (
        <div className="max-w-md mx-auto w-full mt-4">
          <button
            onClick={() => onSelect(activeRace)}
            className="btn-brass w-full text-base py-3 font-display tracking-wide"
          >
            Enter the {activeRace.officeShort} Race
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Race Detail Card ────────────────────────────────────────────

function RaceDetailCard({ race, advisorId, advisorData, round, winsCount, previousResults, isConfirmed, onConfirm, raceCategories, era = 'historical' }) {
  const commentary = getAdvisorRaceCommentary(advisorId, race, round, winsCount, previousResults);
  const categoryLabel = (raceCategories && raceCategories[race.category]?.label) || 'Race';

  return (
    <div className="card-gilded p-4 max-w-md mx-auto w-full rounded-t-none border-t-2 border-brass/30">
      {/* Race header */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-lg font-bold text-walnut">{race.office}</h2>
          <span className={`font-ticker text-[10px] px-2 py-0.5 rounded uppercase tracking-wider ${
            race.category === 'state_leg'
              ? 'bg-forest/10 text-forest'
              : 'bg-brass/20 text-brass-dark'
          }`}>
            {categoryLabel}
          </span>
        </div>
        <p className="font-body text-xs text-walnut-light italic">{race.location}</p>
        <p className="font-body text-sm text-walnut-light mt-1">{race.description}</p>
      </div>

      {/* Race context stats */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3 py-2 border-y border-walnut/10">
        <RaceStat label="Incumbent" value={race.incumbent === 'Open Seat' ? 'Open Seat' : `${race.incumbent} (${race.incumbentName})`} />
        <RaceStat label="Partisan Lean" value={race.partisanLean} color={
          race.partisanLeanValue > 0 ? 'text-darkred' :
          race.partisanLeanValue < 0 ? 'text-blue-700' : 'text-walnut'
        } />
        <RaceStat label="Your Projected Support" value={race.yourProjectedSupport} color="text-brass-dark" />
        <RaceStat label="Handicapper Rating" value={race.handicapperRating} color={
          race.handicapperRating.includes('Toss') ? 'text-forest' :
          race.handicapperRating.includes('Lean') ? 'text-brass-dark' : 'text-darkred'
        } />
      </div>

      {/* Candidate mini-cards */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <CandidateMini candidate={race.dem} era={era} />
        <CandidateMini candidate={race.rep} era={era} />
      </div>

      {/* Advisor commentary */}
      <div className="bg-cream-dark/30 rounded-lg p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-shrink-0 w-8 h-8 rounded-full border border-brass overflow-hidden bg-cream">
            <CandidatePortrait id={advisorId} traits={advisorData.portraitTraits} size={32} era={era} />
          </div>
          <div className="font-ticker text-xs text-brass-dark">
            {advisorData.name}&apos;s Analysis
          </div>
          {commentary.strength === 'strong' && (
            <span className="font-ticker text-[10px] bg-forest/15 text-forest px-1.5 py-0.5 rounded uppercase">
              Top Pick
            </span>
          )}
        </div>
        <div className="space-y-2">
          <p className="font-body text-sm text-walnut leading-relaxed">{commentary.overview}</p>
          <p className="font-body text-sm text-walnut leading-relaxed">{commentary.numbers}</p>
          <p className="font-body text-sm text-walnut leading-relaxed">{commentary.candidateRead}</p>
          <p className="font-body text-sm text-walnut font-bold leading-relaxed">{commentary.recommendation}</p>
        </div>
      </div>

      {/* Select this race button */}
      {!isConfirmed && (
        <button
          onClick={onConfirm}
          className="btn-option w-full py-2 font-display text-sm"
        >
          Select This Race
        </button>
      )}
      {isConfirmed && (
        <div className="text-center font-ticker text-xs text-forest uppercase tracking-wider py-2">
          &#x2713; Selected — confirm below
        </div>
      )}
    </div>
  );
}

// ─── Small components ────────────────────────────────────────────

function RaceStat({ label, value, color = 'text-walnut' }) {
  return (
    <div className="flex flex-col">
      <span className="font-ticker text-[10px] text-walnut-light/60 uppercase tracking-wider">{label}</span>
      <span className={`font-body text-xs font-bold ${color}`}>{value}</span>
    </div>
  );
}

function CandidateMini({ candidate, era = 'historical' }) {
  const fLabel = getFriendlinessLabel(candidate.friendliness);
  const fColor = getFriendlinessColor(candidate.friendliness);

  return (
    <div className={`rounded-lg border p-2 ${
      (candidate.boughtByBlackwood || candidate.boughtByAntagonist) ? 'border-darkred/30 bg-darkred/5' : 'border-walnut/10 bg-cream/50'
    }`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-shrink-0 w-8 h-8 rounded-full border border-walnut/20 overflow-hidden bg-cream">
          <CandidatePortrait id={candidate.id} traits={candidate.portraitTraits} size={32} era={era} />
        </div>
        <div className="min-w-0">
          <div className="font-display text-xs font-bold text-walnut truncate">{candidate.name}</div>
          <div className="font-ticker text-[10px] text-walnut-light/60">
            ({candidate.party === 'democrat' ? 'D' : 'R'})
          </div>
        </div>
      </div>
      <div className={`font-ticker text-[10px] font-bold ${fColor}`}>
        {fLabel}
        {(candidate.boughtByBlackwood || candidate.boughtByAntagonist) && <span className="text-darkred ml-1">BOUGHT</span>}
      </div>
    </div>
  );
}
