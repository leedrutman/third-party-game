import DistrictCard from './DistrictCard.jsx';
import { DISTRICTS, DISTRICT_LIST } from '../engine/districts.js';
import { ISSUES } from '../data/issues.js';
import { NPC_PARTIES } from '../engine/parties.js';
import { ADVISORS, getAdvisorResultReaction } from '../data/advisorLines.js';

const ELECTION_YEARS = { 1: 1892, 2: 1894, 3: 1896 };

export default function ResultScreen({ act, round, state, onContinue }) {
  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="font-display text-sm text-walnut-light uppercase tracking-wider">
          Act {act === 1 ? 'I' : act === 2 ? 'II' : 'III'} &bull; Results
        </div>
        <h1 className="font-display text-2xl font-bold text-walnut mt-1">
          {getResultTitle(act, round, state)}
        </h1>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
      </div>

      <div className="max-w-md mx-auto w-full flex flex-col gap-4">
        {/* Act I: Per-election-cycle results */}
        {act === 1 && <Act1ElectionResults round={round} state={state} />}

        {/* Act II Round 1: FPTP results */}
        {act === 2 && round === 1 && (
          <Act2ElectionResults state={state} />
        )}

        {/* Act II Round 2: Blame result */}
        {act === 2 && round === 2 && (
          <SingleChoiceResult
            title={state.act2.blameChoice === 'apologize' ? 'Dignified Retreat' :
                   state.act2.blameChoice === 'doubleDown' ? 'Defiant Stand' : 'Strategic Pivot'}
            description={getBlameResultText(state)}
            state={state}
          />
        )}

        {/* Act II Round 3: Absorption result */}
        {act === 2 && round === 3 && (
          <SingleChoiceResult
            title={state.act2.absorptionChoice === 'cryTheft' ? 'Theft Alleged' :
                   state.act2.absorptionChoice === 'outflank' ? 'The Radical Turn' : 'The End'}
            description={getAbsorptionResultText(state)}
            state={state}
          />
        )}

        {/* Act III results */}
        {act === 3 && round === 1 && <PRElectionResult state={state} />}
        {act === 3 && round === 2 && <CoalitionResult state={state} />}
        {act === 3 && round === 3 && <VoteResult state={state} />}
      </div>

      <div className="mt-6 max-w-md mx-auto w-full">
        <button onClick={onContinue} className="btn-brass w-full text-lg">
          Continue
        </button>
      </div>
    </div>
  );
}

function AdvisorReaction({ act, results, state }) {
  const advisorId = state.advisor || 'ezra';
  const advisor = ADVISORS[advisorId] || ADVISORS.ezra;
  const reaction = getAdvisorResultReaction(act, results, advisorId);
  if (!reaction) return null;

  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded bg-walnut/5 border border-brass/20">
      <span className="text-lg flex-shrink-0 mt-0.5">{advisor.icon}</span>
      <div>
        <div className="font-display text-xs font-bold text-brass-dark mb-1">{advisor.firstName}</div>
        <div className="font-body text-sm text-walnut leading-relaxed italic">
          &ldquo;{reaction}&rdquo;
        </div>
      </div>
    </div>
  );
}

function SpoilerSummary({ spoiledResults, context }) {
  if (spoiledResults.length === 0) return null;

  // Calculate total wasted progressive votes
  const totalYourVotes = spoiledResults.reduce((sum, r) => sum + (r.yourPercent || 0), 0);
  const avgMargin = spoiledResults.reduce((sum, r) =>
    sum + ((r.democratPercent + r.yourPercent) - r.republicanPercent), 0) / spoiledResults.length;

  return (
    <div className="card-gilded p-4 border-darkred/30 bg-darkred/3">
      <div className="text-center">
        <div className="text-2xl mb-1">{'\u{1F4A5}'}</div>
        <div className="font-display text-sm font-bold text-darkred">
          The Spoiler Effect
        </div>
        <p className="font-body text-xs text-walnut-light mt-2 leading-relaxed">
          {context === 'act2'
            ? `Without fusion, you split the progressive vote in ${spoiledResults.length} district${spoiledResults.length > 1 ? 's' : ''}. Republicans won seats they would have lost if your voters had been on a shared ballot line.`
            : spoiledResults.length === 1
              ? 'In 1 district, running alone split the progressive vote and handed the seat to Republicans.'
              : `In ${spoiledResults.length} districts, running alone split the progressive vote and handed seats to Republicans.`
          }
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="font-display text-xl font-bold text-darkred">{spoiledResults.length}</div>
            <div className="font-body text-xs text-walnut-light/60">
              seat{spoiledResults.length > 1 ? 's' : ''} handed to GOP
            </div>
          </div>
          <div>
            <div className="font-display text-xl font-bold text-brass">
              +{avgMargin.toFixed(1)}%
            </div>
            <div className="font-body text-xs text-walnut-light/60">
              avg. progressive margin if combined
            </div>
          </div>
        </div>
        {context === 'act2' && (
          <p className="font-body text-xs text-darkred/70 italic mt-3">
            This is what FPTP does to third parties.
          </p>
        )}
      </div>
    </div>
  );
}

function Act2ElectionResults({ state }) {
  const results = state.act2.electionResults;
  const choices = state.act2.runChoices;
  if (!results) return null;

  const resultsList = Object.values(results);
  const contested = resultsList.filter(r => !r.stoodDown);
  const spoiledResults = resultsList.filter(r => r.spoiled);
  const playerWins = resultsList.filter(r => r.winner === 'player').length;
  const stoodDown = resultsList.filter(r => r.stoodDown).length;

  const avgPercent = contested.length > 0
    ? (contested.reduce((s, r) => s + (r.yourPercent || 0), 0) / contested.length).toFixed(1)
    : 0;

  return (
    <>
      {/* Election summary card */}
      <div className="card-gilded p-4 text-center">
        <div className="font-display text-sm text-walnut-light">
          First Election Without Fusion
        </div>
        {playerWins > 0 ? (
          <div className="font-display text-lg font-bold text-brass mt-1">
            {playerWins} Outright Win{playerWins > 1 ? 's' : ''}!
          </div>
        ) : spoiledResults.length > 0 ? (
          <div className="font-display text-lg font-bold text-darkred mt-1">
            Vote Split {'\u2014'} No Wins
          </div>
        ) : stoodDown === resultsList.length ? (
          <div className="font-display text-lg font-bold text-walnut-light mt-1">
            Sat Out Entirely
          </div>
        ) : (
          <div className="font-display text-lg font-bold text-walnut-light mt-1">
            Shut Out
          </div>
        )}
        {contested.length > 0 && (
          <div className="font-body text-xs text-walnut-light/70 mt-1">
            Your line averaged {avgPercent}% across {contested.length} contested district{contested.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Advisor reaction */}
      <AdvisorReaction act="act2" results={results} state={state} />

      {/* Spoiler summary */}
      <SpoilerSummary spoiledResults={spoiledResults} context="act2" />

      {/* Per-district results */}
      {DISTRICT_LIST.map(d => (
        <DistrictCard
          key={d.id}
          districtId={d.id}
          support={results[d.id]?.yourPercent || 0}
          choice={choices[d.id]}
          result={results[d.id]}
          showResult
        />
      ))}

      <ResourceSummary state={state} />
    </>
  );
}

function ElectionComparison({ round, state }) {
  if (round <= 1) return null;

  const prevRound = round - 1;
  const prevData = state.act1.elections[prevRound];
  const currData = state.act1.elections[round];
  if (!prevData?.electionResults || !currData?.electionResults) return null;

  const prevResults = Object.values(prevData.electionResults);
  const currResults = Object.values(currData.electionResults);

  const prevContested = prevResults.filter(r => !r.stoodDown);
  const currContested = currResults.filter(r => !r.stoodDown);

  const prevAvg = prevContested.length > 0
    ? prevContested.reduce((s, r) => s + (r.yourPercent || 0), 0) / prevContested.length : 0;
  const currAvg = currContested.length > 0
    ? currContested.reduce((s, r) => s + (r.yourPercent || 0), 0) / currContested.length : 0;
  const avgDelta = currAvg - prevAvg;

  const prevFusionWins = prevResults.filter(r => r.fusionWin).length;
  const currFusionWins = currResults.filter(r => r.fusionWin).length;
  const winDelta = currFusionWins - prevFusionWins;

  const prevSpoiled = prevResults.filter(r => r.spoiled).length;
  const currSpoiled = currResults.filter(r => r.spoiled).length;

  return (
    <div className="card-gilded p-3 border-brass/20">
      <div className="font-ticker text-[10px] tracking-wider text-brass-dark uppercase text-center mb-2">
        vs. {ELECTION_YEARS[prevRound]}
      </div>
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-body">
        <div>
          <div className={`font-display text-sm font-bold ${avgDelta > 0 ? 'text-forest' : avgDelta < 0 ? 'text-darkred' : 'text-walnut-light'}`}>
            {avgDelta > 0 ? '+' : ''}{avgDelta.toFixed(1)}%
          </div>
          <div className="text-walnut-light/60">Avg. support</div>
        </div>
        <div>
          <div className={`font-display text-sm font-bold ${winDelta > 0 ? 'text-forest' : winDelta < 0 ? 'text-darkred' : 'text-walnut-light'}`}>
            {winDelta > 0 ? '+' : ''}{winDelta}
          </div>
          <div className="text-walnut-light/60">Fusion wins</div>
        </div>
        <div>
          <div className={`font-display text-sm font-bold ${currSpoiled < prevSpoiled ? 'text-forest' : currSpoiled > prevSpoiled ? 'text-darkred' : 'text-walnut-light'}`}>
            {currSpoiled === prevSpoiled ? '\u2014' : currSpoiled < prevSpoiled ? '\u2193' + (prevSpoiled - currSpoiled) : '\u2191' + (currSpoiled - prevSpoiled)}
          </div>
          <div className="text-walnut-light/60">Spoiled</div>
        </div>
      </div>
    </div>
  );
}

function Act1ElectionResults({ round, state }) {
  const elData = state.act1.elections[round];
  if (!elData?.electionResults) return null;

  const results = elData.electionResults;
  const choices = elData.fusionChoices;

  const fusionWins = Object.values(results).filter(r => r.fusionWin).length;
  const spoiledResults = Object.values(results).filter(r => r.spoiled);
  const fundGrowth = fusionWins * 75;

  // Average your-line % across contested districts (not stood-down)
  const contested = Object.values(results).filter(r => !r.stoodDown);
  const avgPercent = contested.length > 0
    ? (contested.reduce((s, r) => s + (r.yourPercent || 0), 0) / contested.length).toFixed(1)
    : 0;
  const pivotalWins = Object.values(results).filter(r =>
    r.fusionWin && r.yourPercent > Math.abs(r.republicanPercent - r.democratPercent)
  ).length;

  return (
    <>
      {/* Election summary card */}
      <div className="card-gilded p-4 text-center">
        <div className="font-display text-sm text-walnut-light">
          Election of {ELECTION_YEARS[round] || round}
        </div>
        {fusionWins > 0 ? (
          <div className="font-display text-lg font-bold text-forest mt-1">
            {fusionWins} Fusion Victor{fusionWins > 1 ? 'ies' : 'y'}!
          </div>
        ) : spoiledResults.length > 0 ? (
          <div className="font-display text-lg font-bold text-darkred mt-1">
            Vote Split {'\u2014'} No Wins
          </div>
        ) : (
          <div className="font-display text-lg font-bold text-walnut-light mt-1">
            Building Momentum
          </div>
        )}
        <div className="font-body text-xs text-walnut-light/70 mt-1">
          Your line averaged {avgPercent}% across {contested.length} district{contested.length !== 1 ? 's' : ''}
          {pivotalWins > 0 && (
            <span className="text-forest font-bold">
              {' \u2014 '} pivotal in {pivotalWins} win{pivotalWins !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Advisor reaction */}
      <AdvisorReaction act="act1" results={results} state={state} />

      {/* Election-over-election comparison */}
      <ElectionComparison round={round} state={state} />

      {/* Spoiler summary for Act I (when player ran alone and split votes) */}
      <SpoilerSummary spoiledResults={spoiledResults} context="act1" />

      {/* War chest growth banner */}
      {fundGrowth > 0 && (
        <div className="card-gilded p-3 text-center border-brass/30">
          <div className="font-display text-sm font-bold text-brass-dark">
            +${fundGrowth} to the War Chest
          </div>
          <div className="font-body text-xs text-walnut-light/60 mt-0.5">
            Fusion victories bring donors and supporters. Campaign fund now <span className="font-bold text-brass-dark">${state.fundPool}</span>.
          </div>
        </div>
      )}

      {/* Per-district results */}
      {DISTRICT_LIST.map(d => (
        <DistrictCard
          key={d.id}
          districtId={d.id}
          support={results[d.id]?.yourPercent || 0}
          choice={choices[d.id]}
          result={results[d.id]}
          showResult
        />
      ))}

      <ResourceSummary state={state} />
    </>
  );
}

function ResourceSummary({ state }) {
  return (
    <div className="card-gilded p-4 mt-2">
      <h4 className="font-display text-sm font-bold text-walnut mb-3">Party Resources</h4>
      <div className="grid grid-cols-3 gap-4">
        <ResourceMeter label="Funds" value={state.resources.funds} />
        <ResourceMeter label="Morale" value={state.resources.morale} />
        <ResourceMeter label="Visibility" value={state.resources.visibility} />
      </div>
      <div className="mt-3 pt-3 border-t border-walnut/10">
        <div className="flex justify-between text-xs font-body">
          <span className="text-walnut-light">Ally Relations</span>
          <span className={`font-bold ${
            state.allyRelationship > 60 ? 'text-forest' :
            state.allyRelationship > 35 ? 'text-brass-dark' :
            'text-darkred'
          }`}>
            {state.allyRelationship > 60 ? 'Healthy' :
             state.allyRelationship > 35 ? 'Strained' : 'Hostile'}
          </span>
        </div>
      </div>
    </div>
  );
}

function ResourceMeter({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-xs font-body text-walnut-light mb-1">{label}</div>
      <div className="support-meter mx-auto w-full">
        <div
          className="support-meter-fill"
          style={{
            width: `${value}%`,
            backgroundColor: value > 60 ? '#2D5F2D' : value > 30 ? '#B8860B' : '#8B1A1A',
          }}
        />
      </div>
      <div className="text-xs font-bold text-walnut mt-1">{Math.round(value)}</div>
    </div>
  );
}

function SingleChoiceResult({ title, description, state }) {
  return (
    <div className="card-gilded p-5">
      <div className="text-center mb-4">
        <h3 className="font-display text-xl font-bold text-walnut">{title}</h3>
      </div>
      <p className="font-body text-sm text-walnut-light text-center leading-relaxed">
        {description}
      </p>
      <ResourceSummary state={state} />
    </div>
  );
}

function PRElectionResult({ state }) {
  const seats = state.act3.seatResults;
  if (!seats) return null;

  const parties = [
    { key: 'republican', label: 'Rep.', seats: seats.republican, color: NPC_PARTIES.republican.color },
    { key: 'democrat', label: 'Dem.', seats: seats.democrat, color: NPC_PARTIES.democrat.color },
    { key: 'player', label: 'You!', seats: seats.player, color: '#B8860B', highlight: true },
    { key: 'agrarian', label: 'Agrar.', seats: seats.agrarian, color: NPC_PARTIES.agrarian.color },
    { key: 'traditionalist', label: 'Trad.', seats: seats.traditionalist, color: NPC_PARTIES.traditionalist.color },
  ];

  return (
    <div className="card-gilded p-5">
      <div className="text-center mb-4">
        <div className="text-3xl mb-2">{'\u{1F3DB}\uFE0F'}</div>
        <h3 className="font-display text-xl font-bold text-walnut">
          You're in Parliament.
        </h3>
        <p className="font-body text-sm text-walnut-light mt-2">
          After two acts of struggling to exist, you simply... exist.
        </p>
      </div>
      <div className="grid grid-cols-5 gap-1 text-center text-xs font-body mt-4">
        {parties.map(p => (
          <div key={p.key}>
            <div className="w-6 h-6 rounded-full mx-auto mb-1" style={{ background: p.color }} />
            <div className={`font-bold ${p.highlight ? 'text-brass' : ''}`}>{p.seats}</div>
            <div className={p.highlight ? 'text-brass-dark font-bold' : 'text-walnut-light/60'}>{p.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoalitionResult({ state }) {
  const result = state.act3.coalitionResult;

  return (
    <div className="card-gilded p-5">
      <div className="text-center mb-4">
        <div className="text-3xl mb-2">
          {result === 'inGovernment' ? '\u{1F3DB}\uFE0F' : result === 'shaky' ? '\u2696\uFE0F' : '\u{1F4CB}'}
        </div>
        <h3 className="font-display text-xl font-bold text-walnut">
          {result === 'inGovernment' ? "You're in Government" :
           result === 'shaky' ? 'Shaky Coalition' :
           'In Opposition'}
        </h3>
      </div>
      <p className="font-body text-sm text-walnut-light text-center leading-relaxed">
        {result === 'inGovernment'
          ? "The coalition forms with your party at the table. It's not the biggest seat, but it's a seat. For the first time, you're governing."
          : result === 'shaky'
          ? "A coalition forms, technically. It could collapse at any moment, but for now you have influence. Use it fast."
          : "The coalition formed without you. You're in opposition \u2014 but with real seats and a real voice. That's more than you ever had under FPTP."}
      </p>
    </div>
  );
}

function VoteResult({ state }) {
  const result = state.act3.voteResult;
  const fallbackIssue = typeof state.party.issues === 'string' ? state.party.issues : state.party.issues[0];
  const issue = ISSUES[state.act3.issuePriority || fallbackIssue]?.name || 'Your issue';

  return (
    <div className="card-gilded p-5">
      <div className="text-center mb-4">
        <div className="text-3xl mb-2">
          {result === 'passed' ? '\u2705' : result === 'partial' ? '\u{1F4DD}' : '\u274C'}
        </div>
        <h3 className="font-display text-xl font-bold text-walnut">
          {result === 'passed' ? `${issue} Passes!` :
           result === 'partial' ? 'Amended Bill Passes' :
           'Bill Defeated'}
        </h3>
      </div>
      <p className="font-body text-sm text-walnut-light text-center leading-relaxed">
        {result === 'passed'
          ? `The bill passes. It's not everything you wanted, but it's real policy \u2014 with your party's name on it.`
          : result === 'partial'
          ? `The amended version squeaks through. Stronger than the compromise, weaker than the dream. Real politics.`
          : `The bill fails. Your principles are intact. Your policy agenda is not. The question echoes: was it worth it?`}
      </p>
    </div>
  );
}

function getResultTitle(act, round, state) {
  if (act === 1) return `Election of ${ELECTION_YEARS[round] || round}`;
  if (act === 2 && round === 1) return 'Election Results';
  if (act === 2 && round === 2) return 'The Aftermath';
  if (act === 2 && round === 3) return 'The Final Chapter';
  if (act === 3 && round === 1) return 'Seat Allocation';
  if (act === 3 && round === 2) return 'Coalition Talks';
  if (act === 3 && round === 3) return 'The Floor Vote';
  return 'Results';
}

function getBlameResultText(state) {
  switch (state.act2.blameChoice) {
    case 'apologize':
      return "You told your voters to back the Democrats. They did \u2014 mostly. The Democrats won a seat, barely acknowledged you. Your ballot line is empty. Your donors are gone. But hey, nobody's blaming you anymore. They've just forgotten you.";
    case 'doubleDown':
      return "You ran harder. The spoiler math got worse. The Republicans sent a thank-you note (probably sarcastic). Your base loves your courage. Everyone else thinks you're delusional. Morale is up. Electability is down. Way down.";
    case 'pivot':
      return "New issues, new pitch, smaller tent. The voters who stuck around are passionate. The ones who left aren't coming back. You've found a niche. Whether it's a foundation or a coffin remains to be seen.";
    default:
      return '';
  }
}

function getAbsorptionResultText(state) {
  switch (state.act2.absorptionChoice) {
    case 'cryTheft':
      return "You accused the Democrats of stealing your platform. The press covered it for one news cycle. The Democrats shrugged. The public moved on. Your ideas are in someone else's mouth now, and there's nothing you can do about it.";
    case 'outflank':
      return "You pushed further left (or further out, depending on who you ask). Your remaining supporters are fervent. Your electorate is tiny. You've become a party of principle in a system that only rewards plurality.";
    case 'acceptReality':
      return "You endorsed the Democrats and dissolved your party. The ideas will live on \u2014 in diluted form, in someone else's platform, credited to someone else. Your supporters will vote Democrat and feel slightly hollow about it. This is what FPTP does to third parties.";
    default:
      return '';
  }
}
