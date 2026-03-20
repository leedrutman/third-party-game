import { ISSUES } from '../data/issues.js';
import { getFlagshipBill } from '../engine/legislativeVotes.js';

const ACT_DATA = {
  1: {
    number: 'I',
    title: 'The Fusion Era',
    year: '1892\u20131896',
    subtitle: 'Fusion Voting Is the Law',
    scene: true,
    description:
      'But your state permits a practice as old as the Republic itself: fusion voting. Across three congressional districts \u2014 one urban, one mixed, one rural \u2014 your party can cross-endorse a major-party candidate, and every ballot cast on YOUR line still counts \u2014 building your organization while helping your allies win. Three elections. Three chances to prove that a third party can matter.',
    flavor: 'Make every election count.',
  },
  2: {
    number: 'II',
    title: "The Spoiler's Trap",
    year: '~1904',
    subtitle: 'Fusion Banned \u2014 First Past the Post',
    description:
      'The major parties saw what fusion could do and killed it. In state after state, legislatures banned cross-endorsement. Now you face the naked arithmetic of first-past-the-post: every vote you win is a vote that splits the opposition.',
    flavor: 'Welcome to the spoiler trap.',
  },
  3: {
    number: 'III',
    title: "The People's Assembly",
    year: '~1912 (Counterfactual)',
    subtitle: 'Proportional Representation',
    description:
      'What if America had followed the path already spreading across Europe? What if, instead of banning fusion, they had adopted proportional representation \u2014 where every vote counts and every party gets seats matching its support?',
    flavor: "Let's find out.",
  },
};

function ScenarioCard({ scenario }) {
  if (!scenario) return null;

  return (
    <div className="card-gilded p-4 mb-6 text-left">
      <div className="font-ticker text-xs tracking-[0.15em] text-brass-dark uppercase mb-3 text-center">
        Timeline #{scenario.timelineNumber || '??'}
      </div>

      {/* President */}
      <div className="mb-3">
        <div className="font-display text-sm font-bold text-walnut">
          {'\u{1F3DB}\uFE0F'} President {scenario.president.name}
        </div>
        <div className="font-body text-xs text-walnut-light/70 italic mt-0.5">
          {scenario.president.flavor}
        </div>
      </div>

      {/* World events */}
      {scenario.events.map(event => (
        <div key={event.key} className="mb-2">
          <div className="font-display text-sm font-bold text-walnut">
            {'\u{1F4F0}'} {event.name}
          </div>
          <div className="font-body text-xs text-walnut-light/70 italic mt-0.5">
            {event.description}
          </div>
        </div>
      ))}
    </div>
  );
}

function BillMissionCard({ issueKey }) {
  const bill = getFlagshipBill(issueKey);
  const issueName = ISSUES[issueKey]?.name;
  if (!bill) return null;

  return (
    <div className="card-gilded p-4 mb-6 border-2 border-brass/30">
      <div className="font-ticker text-xs tracking-[0.15em] text-brass-dark uppercase mb-2 text-center">
        Your Mission
      </div>
      <div className="font-display text-lg font-bold text-walnut text-center mb-3">
        Pass {bill.name}
      </div>
      <div className="flex gap-1">
        {bill.stages.map((stage, i) => (
          <div key={i} className="flex-1 text-center">
            <div className="h-2 rounded-full bg-walnut/15 mb-1" />
            <div className="font-ticker text-[9px] text-walnut-light/50">
              {stage.name}
            </div>
          </div>
        ))}
      </div>
      <div className="font-body text-xs text-walnut-light/60 text-center mt-2 italic">
        Win elections. Build leverage. Pass the law.
      </div>
    </div>
  );
}

export default function ActIntro({ act, party, state, onContinue }) {
  const data = ACT_DATA[act];
  const scenario = state?.scenario;
  const issueKey = typeof party?.issues === 'string' ? party?.issues : party?.issues?.[0];
  const billProgress = state?.act1?.billProgress;
  const billPassed = billProgress?.stage >= 3;
  const bill = issueKey ? getFlagshipBill(issueKey) : null;

  // Act II: customize description based on whether bill passed
  let act2Description = data.description;
  let act2Flavor = data.flavor;
  if (act === 2 && bill) {
    if (billPassed) {
      act2Description = `The major parties saw what fusion could do and killed it. But ${bill.shortName || bill.name} is already law \u2014 your crowning achievement. Now they\u2019re coming for it. Under first-past-the-post, every vote you win splits the opposition, and the forces that opposed your bill are marshaling to repeal it.`;
      act2Flavor = 'Can you defend what you built?';
    } else {
      const stageLabel = billProgress?.stage === 0 ? 'never even introduced' : billProgress?.stage === 1 ? 'stalled in committee' : 'killed on the floor';
      act2Description = `The major parties saw what fusion could do and killed it. ${bill.name} was ${stageLabel}. Your signature legislation never became law. Now you face the naked arithmetic of first-past-the-post: every vote you win is a vote that splits the opposition.`;
      act2Flavor = 'Welcome to the spoiler trap.';
    }
  }

  return (
    <div className="screen-enter min-h-dvh flex flex-col items-center justify-center px-6 py-12 paper-texture">
      <div className="max-w-md text-center">
        {/* Act number */}
        <div className="font-ticker text-xs tracking-[0.3em] text-brass-dark uppercase mb-2">
          {data.year}
        </div>
        <div className="font-display text-sm text-walnut-light uppercase tracking-wider mb-1">
          Act {data.number}
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-walnut mb-2">
          {data.title}
        </h1>

        <div className="divider-ornate text-brass text-sm">&#x2726;</div>

        {/* Scene-setting for Act I */}
        {data.scene && (
          <div className="text-left space-y-3 mb-6">
            <p className="font-body text-sm text-walnut leading-relaxed">
              Twelve-hour shifts in the mills. Farmers drowning in debt. Railroad barons buying legislatures by the carload. Women can&rsquo;t vote. Half the country can&rsquo;t afford a doctor.
            </p>
            <p className="font-body text-sm text-walnut leading-relaxed">
              The two major parties? <span className="font-bold" style={{ color: '#3B5975' }}>The Republicans</span> hold the tariffs and the factory owners. <span className="font-bold" style={{ color: '#8B6340' }}>The Democrats</span> hold the South and Tammany Hall. Neither holds much interest in the problems that keep ordinary people up at night.
            </p>
            <p className="font-body text-sm text-walnut leading-relaxed italic">
              They squabble over patronage and trade policy while the country burns.
            </p>
          </div>
        )}

        {/* Scenario card for Act I */}
        {act === 1 && scenario && <ScenarioCard scenario={scenario} />}

        <div className="inline-block card-gilded px-3 py-1 mb-6">
          <span className="font-display text-sm font-bold text-brass-dark">
            {data.subtitle}
          </span>
        </div>

        <p className="font-body text-sm text-walnut leading-relaxed mb-4">
          {act === 2 ? act2Description : data.description}
        </p>

        <p className="font-display italic text-walnut-light text-lg mb-8">
          {act === 2 ? act2Flavor : data.flavor}
        </p>

        {/* Bill mission card for Act I */}
        {act === 1 && issueKey && <BillMissionCard issueKey={issueKey} />}

        {/* Party reminder */}
        {party && (
          <div className="card-gilded px-4 py-2 mb-8 inline-block">
            <span className="text-lg mr-2">{party.mascot?.icon}</span>
            <span className="font-display text-sm font-bold text-walnut">
              {party.name}
            </span>
          </div>
        )}

        <div>
          <button onClick={onContinue} className="btn-brass text-lg px-8 py-4">
            {act === 1 ? 'Meet the Candidates' : act === 2 ? 'Face the Music' : 'Enter Parliament'}
          </button>
        </div>
      </div>
    </div>
  );
}
