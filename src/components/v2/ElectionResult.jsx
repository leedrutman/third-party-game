import CandidatePortrait from '../CandidatePortrait.jsx';
import { getEraData } from '../../data/eraData.js';
import GameStatusBar from './GameStatusBar.jsx';

export default function ElectionResult({ state, onContinue }) {
  const { round, elections, advisor, momentum, tycoonThreat, winsCount, milestonePoints } = state;
  const election = elections[elections.length - 1]; // Most recent
  const { result, headline, office, demCandidate, repCandidate } = election;
  const antagonistReaction = election.antagonistReaction || election.blackwoodReaction;
  const eraData = getEraData(state.era);
  const { ADVISORS, ANTAGONIST, antagonistName, getAdvisorResultReaction } = eraData;
  const advisorData = ADVISORS[advisor];
  const advisorReaction = getAdvisorResultReaction(advisor, result.playerWon, result.choice, round);

  const resultClass = result.playerWon
    ? 'result-win'
    : result.spoiled
      ? 'result-spoiler'
      : 'result-loss';

  return (
    <div className={`screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture`}>
      <GameStatusBar round={round} momentum={momentum} tycoonThreat={tycoonThreat} winsCount={winsCount} milestonePoints={milestonePoints} />

      {/* Headline */}
      <div className={`text-center mb-4 mt-2 ${resultClass}`}>
        <div className="font-ticker text-xs tracking-[0.2em] text-brass-dark uppercase">
          Election {round} Result
        </div>
        <h1 className="font-display text-lg sm:text-xl font-bold text-walnut mt-1 px-2 leading-tight">
          {headline}
        </h1>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
      </div>

      {/* Result badge */}
      <div className="max-w-md mx-auto w-full mb-4">
        {result.playerWon && (
          <div className="card-gilded p-3 border-l-4 border-forest text-center">
            <div className="font-display text-lg font-bold text-forest">
              VICTORY
            </div>
            <div className="font-body text-xs text-walnut-light">
              {result.fusionWin
                ? `Your fusion ticket won the ${office}!`
                : `Your candidate won outright — stunning upset!`}
            </div>
          </div>
        )}
        {result.spoiled && (
          <div className="card-gilded p-3 border-l-4 border-darkred text-center">
            <div className="font-display text-lg font-bold text-darkred">
              VOTE SPLIT
            </div>
            <div className="font-body text-xs text-walnut-light">
              Your voters split the progressive vote. The establishment candidate won.
            </div>
          </div>
        )}
        {!result.playerWon && !result.spoiled && (
          <div className="card-gilded p-3 border-l-4 border-walnut-light text-center">
            <div className="font-display text-lg font-bold text-walnut-light">
              DEFEAT
            </div>
            <div className="font-body text-xs text-walnut-light">
              Your candidate fell short. The establishment holds.
            </div>
          </div>
        )}
      </div>

      {/* Vote breakdown */}
      <div className="card-gilded p-4 mb-4 max-w-md mx-auto w-full">
        <div className="font-ticker text-xs text-brass-dark uppercase tracking-wider mb-2">
          Vote Breakdown
        </div>

        {result.fusionWin ? (
          <FusionVoteDisplay
            result={result}
            partyName={state.partyName || 'Your Party'}
            demCandidate={demCandidate}
            repCandidate={repCandidate}
          />
        ) : (
          <>
            <VoteBar label={state.partyName || 'Your Party'} pct={result.yourPct} color="bg-brass" />
            <VoteBar label={`${demCandidate.name} (D)`} pct={result.demPct} color="bg-navy" />
            <VoteBar label={`${repCandidate.name} (R)`} pct={result.repPct} color="bg-darkred" />
          </>
        )}
      </div>

      {/* Fusion teaching moment */}
      <FusionTeachingMoment round={round} result={result} />

      {/* Advisor reaction */}
      <div className="card-gilded p-3 mb-4 max-w-md mx-auto w-full">
        <div className="flex items-start gap-2">
          <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden border border-brass/30">
            <CandidatePortrait id={advisor} traits={advisorData.portraitTraits} size={40} era={state.era} />
          </div>
          <div className="flex-1">
            <div className="font-ticker text-xs text-brass-dark">
              {advisorData.firstName}:
            </div>
            <div className="font-body text-sm text-walnut mt-1 italic">
              &ldquo;{advisorReaction}&rdquo;
            </div>
          </div>
        </div>
      </div>

      {/* Antagonist reaction */}
      <div className="card-gilded p-3 mb-6 max-w-md mx-auto w-full border-l-4 border-darkred/50">
        <div className="flex items-start gap-2">
          <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden border border-walnut/20">
            <CandidatePortrait id={ANTAGONIST.id} traits={ANTAGONIST.portraitTraits} size={40} era={state.era} />
          </div>
          <div className="flex-1">
            <div className="font-ticker text-xs text-darkred">
              {antagonistName}:
            </div>
            <div className="font-body text-sm text-walnut-light mt-1 italic">
              {antagonistReaction}
            </div>
          </div>
        </div>
      </div>

      {/* Continue button */}
      <div className="max-w-md mx-auto w-full">
        <button onClick={onContinue} className="btn-brass w-full text-base py-3">
          {result.fusionWin
            ? 'Negotiate Your Demands'
            : round < 5
              ? 'Next Election'
              : 'See Your Results'}
        </button>
      </div>
    </div>
  );
}

function FusionVoteDisplay({ result, partyName, demCandidate, repCandidate }) {
  const fusedWithDem = result.choice === 'fuse_dem';
  const allyPct = fusedWithDem ? result.demPct : result.repPct;
  const opponentPct = fusedWithDem ? result.repPct : result.demPct;
  const allyName = fusedWithDem ? `${demCandidate.name} (D)` : `${repCandidate.name} (R)`;
  const opponentName = fusedWithDem ? `${repCandidate.name} (R)` : `${demCandidate.name} (D)`;
  const allyColor = fusedWithDem ? 'bg-navy' : 'bg-darkred';
  const allyColorText = fusedWithDem ? 'text-navy' : 'text-darkred';
  const opponentColor = fusedWithDem ? 'bg-darkred' : 'bg-navy';
  const fusionTotal = (allyPct + result.yourPct).toFixed(1);

  // Scale so the larger total fills ~90% of bar width, leaving room for labels
  const maxPct = Math.max(allyPct + result.yourPct, opponentPct);
  const scale = 90 / maxPct;

  // Position of the "finish line" — opponent's percentage as a visual threshold
  const finishLinePos = opponentPct * scale;

  return (
    <div>
      {/* Opponent bar first — the bar to beat */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="font-body text-xs text-walnut">{opponentName}</span>
          <span className="font-ticker text-xs text-walnut font-bold">{opponentPct}%</span>
        </div>
        <div className="support-meter" style={{ height: '16px' }}>
          <div
            className={`support-meter-fill ${opponentColor}`}
            style={{
              width: `${opponentPct * scale}%`,
              transition: 'width 0.8s ease-out',
            }}
          />
        </div>
      </div>

      {/* Fusion ticket — stacked bar with finish line */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="font-body text-xs text-forest font-semibold">
            Fusion Ticket
          </span>
          <span className="font-ticker text-xs text-forest font-bold">
            {fusionTotal}%
          </span>
        </div>
        <div className="support-meter relative" style={{ height: '16px' }}>
          {/* Finish line — dashed vertical at opponent's percentage */}
          <div
            className="absolute top-[-4px] bottom-[-4px] border-l-2 border-dashed border-walnut/50 z-10"
            style={{ left: `${finishLinePos}%` }}
          >
            <span className="absolute top-[-16px] left-[-8px] font-ticker text-[9px] text-walnut-light whitespace-nowrap">
              {opponentPct}%
            </span>
          </div>
          {/* Ally's votes — appears first */}
          <div
            className={`support-meter-fill ${allyColor}`}
            style={{
              width: `${allyPct * scale}%`,
              display: 'inline-block',
              borderRadius: '4px 0 0 4px',
              transition: 'width 0.8s ease-out',
            }}
          />
          {/* YOUR votes — the kingmaker slice that pushes past the line */}
          <div
            className="support-meter-fill bg-brass"
            style={{
              width: `${result.yourPct * scale}%`,
              display: 'inline-block',
              borderRadius: '0 4px 4px 0',
              transition: 'width 0.6s ease-out 0.8s',
              boxShadow: '0 0 6px rgba(184, 142, 58, 0.4)',
            }}
          />
        </div>
        {/* Legend */}
        <div className="flex gap-3 mt-1.5">
          <div className="flex items-center gap-1">
            <span className={`inline-block w-2.5 h-2.5 rounded-sm ${allyColor}`}></span>
            <span className="font-body text-[10px] text-walnut-light">{allyName} ({allyPct}%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-brass" style={{ boxShadow: '0 0 3px rgba(184, 142, 58, 0.4)' }}></span>
            <span className="font-body text-[10px] text-brass-dark font-semibold">{partyName} ({result.yourPct}%)</span>
          </div>
        </div>
      </div>

      {/* Kingmaker callout — explicit before/after math */}
      <div className="mt-3 p-2.5 bg-brass/10 rounded border border-brass/20">
        <div className="font-ticker text-[11px] text-center leading-relaxed">
          <span className={allyColorText}>Without you: {allyPct}%</span>
          <span className="text-walnut-light mx-1">—</span>
          <span className="text-darkred">not enough to win</span>
        </div>
        <div className="font-ticker text-[11px] text-center leading-relaxed mt-0.5">
          <span className="text-brass-dark font-bold">With your {result.yourPct}%: {fusionTotal}%</span>
          <span className="text-walnut-light mx-1">—</span>
          <span className="text-forest font-bold">victory</span>
        </div>
      </div>
    </div>
  );
}

function VoteBar({ label, pct, color }) {
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="font-body text-xs text-walnut">{label}</span>
        <span className="font-ticker text-xs text-walnut font-bold">{pct}%</span>
      </div>
      <div className="support-meter">
        <div
          className={`support-meter-fill ${color}`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
    </div>
  );
}

function FusionTeachingMoment({ round, result }) {
  let content = null;

  if (result.fusionWin && round === 1) {
    content = {
      color: 'forest',
      title: 'This Is Fusion',
      text: 'Your voters didn\'t "waste" their votes. They cast ballots on your party\'s line, those votes counted toward the shared candidate, and together you won. Your party gets credit — and leverage.',
    };
  } else if (result.fusionWin && round === 2) {
    content = {
      color: 'forest',
      title: 'The Kingmaker Pattern',
      text: 'Two fusion wins. The pattern is clear: in any tight race, your 3-5% is the margin of victory. Major-party candidates need you. That\'s power — without winning a single seat outright.',
    };
  } else if (result.spoiled) {
    content = {
      color: 'darkred',
      title: 'The Spoiler Trap',
      text: 'This is what happens without fusion. Your voters split the progressive vote, and the establishment candidate wins. The same voters, the same beliefs — but under winner-take-all rules, your party is a liability instead of an asset.',
    };
  } else if (!result.playerWon && result.choice === 'alone') {
    content = {
      color: 'walnut-light',
      title: 'The Third-Party Graveyard',
      text: 'Running alone with 3-5% support means your voters either defect to a major party or "waste" their vote. This is why third parties die under winner-take-all — not because people don\'t support them, but because the rules punish them for trying.',
    };
  } else if (!result.playerWon && (result.choice === 'fuse_dem' || result.choice === 'fuse_rep')) {
    content = {
      color: 'walnut-light',
      title: 'Fusion Isn\'t Magic',
      text: 'Fusion doesn\'t guarantee victory. If the opponent\'s margin is too wide or the opposition\'s interference too strong, even the kingmaker math falls short. But the lesson stands: fusion gave you a fighting chance. Without it, you had none.',
    };
  } else if (result.fusionWin && round >= 4) {
    content = {
      color: 'forest',
      title: 'Why They Want to Ban It',
      text: 'This is exactly what the tycoons feared. A tiny reform party, wielding real power through fusion. Historically, they responded by making fusion illegal — not because it didn\'t work, but because it worked too well.',
    };
  }

  if (!content) return null;

  return (
    <div className={`card-gilded p-3 mb-4 max-w-md mx-auto w-full border-l-4 border-${content.color}/50`}>
      <div className={`font-ticker text-xs text-${content.color} uppercase tracking-wider mb-1`}>
        {content.title}
      </div>
      <p className="font-body text-xs text-walnut leading-relaxed">
        {content.text}
      </p>
    </div>
  );
}
