import { useState } from 'react';
import DistrictCard from './DistrictCard.jsx';
import CandidatePortrait from './CandidatePortrait.jsx';
import { DISTRICT_LIST, DISTRICTS } from '../engine/districts.js';
import { ISSUES } from '../data/issues.js';
import { isFriendly } from '../data/candidates.js';
import { NPC_PARTIES } from '../engine/parties.js';
import { getDistrictBrief, getAdvisorChoices, getDecisionGuidance, getAdvisorFPTPChoices, ADVISORS } from '../data/advisorLines.js';

const ELECTION_YEARS = { 1: 1892, 2: 1894, 3: 1896 };

// --- Candidate Fusion Option (advisor-driven) ---
function CandidateFusionOption({
  candidate, advisorComment, dismissal, selected, onSelect, isAdvisorPick, advisorIcon, advisorFirstName,
}) {
  const isdem = candidate.party === 'democrat';
  const partyAbbr = isdem ? 'D' : 'R';

  // Hostile candidate — advisor says no deal
  if (dismissal) {
    return (
      <div className="btn-option opacity-50 pointer-events-none">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5 opacity-50">
            <CandidatePortrait candidateId={candidate.id} size={40} />
          </div>
          <div>
            <div className="font-display text-sm font-bold text-walnut">
              {candidate.title} {candidate.name} <span className="text-walnut-light/60">({partyAbbr})</span>
            </div>
            <div className="font-body text-xs text-walnut-light/70 italic">
              {candidate.description}
            </div>
            <div className="flex items-start gap-1.5 mt-2">
              <span className="text-sm flex-shrink-0">{advisorIcon}</span>
              <div className="font-body text-xs text-darkred italic">
                "{dismissal}"
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Friendly candidate — advisor gives their read
  return (
    <button
      onClick={onSelect}
      className={`btn-option flex flex-col gap-2 w-full text-left ${selected ? 'selected' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <CandidatePortrait candidateId={candidate.id} size={40} />
        </div>
        <div className="flex-1">
          <div className="font-display text-sm font-bold text-walnut flex items-center gap-2">
            <span>Fuse with {candidate.title} {candidate.name}</span>
            <span className="text-walnut-light/60">({partyAbbr})</span>
            {isAdvisorPick && (
              <span className="text-xs font-ticker text-brass-dark bg-brass/10 px-1.5 py-0.5 rounded">
                {advisorFirstName}'s pick
              </span>
            )}
          </div>
          <div className="font-body text-xs text-walnut-light/70 italic">
            {candidate.description}
          </div>
          {advisorComment && (
            <div className="flex items-start gap-1.5 mt-2">
              <span className="text-sm flex-shrink-0">{advisorIcon}</span>
              <div className="font-body text-xs text-walnut leading-relaxed italic">
                "{advisorComment}"
              </div>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

// Act I: Fusion Choice (per-district, per-election-cycle)
export function FusionDecision({ state, election, onSubmit }) {
  const [choices, setChoices] = useState({});
  const allChosen = DISTRICT_LIST.every(d => choices[d.id]);
  const advisorId = state.advisor || 'ezra';
  const advisor = ADVISORS[advisorId] || ADVISORS.ezra;

  const year = ELECTION_YEARS[election] || election;

  // Precompute advisor briefs and auto-picks
  const briefs = {};
  DISTRICT_LIST.forEach(d => {
    briefs[d.id] = getDistrictBrief(d.id, state, election, advisorId);
  });
  const advisorChoices = getAdvisorChoices(state, election, advisorId);

  function letAdvisorDecide() {
    setChoices({ ...advisorChoices });
  }

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      <div className="text-center mb-6">
        <div className="font-display text-sm text-walnut-light uppercase tracking-wider">
          Act I &bull; Election of {year}
        </div>
        <h1 className="font-display text-2xl font-bold text-walnut mt-1">The Fusion Choice</h1>
        <p className="font-body text-sm text-walnut-light mt-2 max-w-sm mx-auto">
          Cross-endorsement lets {state.party?.name} voters cast ballots on YOUR line while backing a major-party candidate. Only candidates who share your concerns will deal.
        </p>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
      </div>

      {/* Let Advisor Decide button */}
      <div className="max-w-md mx-auto w-full mb-5">
        <button
          onClick={letAdvisorDecide}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded border-2 border-brass/40 bg-brass/5 hover:bg-brass/10 transition-colors"
        >
          <span className="text-xl">{advisor.icon}</span>
          <div className="text-left">
            <div className="font-display text-sm font-bold text-brass-dark">Let {advisor.firstName} Decide</div>
            <div className="font-body text-xs text-walnut-light/60">Trust {advisor.firstName}'s strategic judgment on all districts</div>
          </div>
        </button>
      </div>

      <div className="flex flex-col gap-6 max-w-md mx-auto w-full">
        {DISTRICT_LIST.map(district => {
          const candidates = state.candidates?.[district.id];
          if (!candidates) return null;
          const brief = briefs[district.id];

          return (
            <div key={district.id} className="card-gilded p-4">
              {/* District header */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{district.icon}</span>
                <div>
                  <h3 className="font-display font-bold text-walnut">{district.name}</h3>
                  <p className="font-body text-xs text-walnut-light/70">
                    {district.type} &bull; {district.industry}
                  </p>
                  <p className="font-body text-xs text-walnut-light/50">
                    {district.ethnic}
                  </p>
                </div>
              </div>

              {/* Advisor's district assessment */}
              <div className="flex items-start gap-2 px-3 py-2 rounded bg-walnut/5 border border-brass/20 mb-3">
                <span className="text-sm flex-shrink-0 mt-0.5">{advisor.icon}</span>
                <div className="font-body text-xs text-walnut leading-relaxed italic">
                  "{brief.assessment}"
                </div>
              </div>

              {/* Last election context (elections 2/3 only) */}
              {brief.lastElection && (
                <div className="flex items-start gap-2 px-3 py-2 rounded bg-brass/5 border border-brass/30 mb-3">
                  <span className="text-sm flex-shrink-0 mt-0.5">📜</span>
                  <div className="font-body text-xs text-brass-dark leading-relaxed">
                    <span className="font-display font-bold">Last election:</span>{' '}
                    <span className="italic">"{brief.lastElection}"</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {/* Democrat candidate */}
                <CandidateFusionOption
                  candidate={candidates.democrat}
                  advisorComment={brief.candidates.democrat.fusionComment}
                  dismissal={brief.candidates.democrat.dismissal}
                  selected={choices[district.id] === 'fusionDem'}
                  onSelect={() => setChoices(c => ({ ...c, [district.id]: 'fusionDem' }))}
                  isAdvisorPick={brief.advisorChoice === 'fusionDem'}
                  advisorIcon={advisor.icon}
                  advisorFirstName={advisor.firstName}
                />
                {/* Republican candidate */}
                <CandidateFusionOption
                  candidate={candidates.republican}
                  advisorComment={brief.candidates.republican.fusionComment}
                  dismissal={brief.candidates.republican.dismissal}
                  selected={choices[district.id] === 'fusionRep'}
                  onSelect={() => setChoices(c => ({ ...c, [district.id]: 'fusionRep' }))}
                  isAdvisorPick={brief.advisorChoice === 'fusionRep'}
                  advisorIcon={advisor.icon}
                  advisorFirstName={advisor.firstName}
                />
                {/* Run Alone */}
                <button
                  onClick={() => setChoices(c => ({ ...c, [district.id]: 'alone' }))}
                  className={`btn-option flex items-start gap-3 ${choices[district.id] === 'alone' ? 'selected' : ''}`}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">{'\u{1F3C3}'}</span>
                  <div className="flex-1">
                    <div className="font-display text-sm font-bold text-walnut flex items-center gap-2">
                      <span>Run Alone</span>
                      {brief.advisorChoice === 'alone' && (
                        <span className="text-xs font-ticker text-brass-dark bg-brass/10 px-1.5 py-0.5 rounded">
                          {advisor.firstName}'s pick
                        </span>
                      )}
                    </div>
                    <div className="flex items-start gap-1.5 mt-1">
                      <span className="text-sm flex-shrink-0">{advisor.icon}</span>
                      <div className="font-body text-xs text-walnut-light/70 italic">
                        "{brief.aloneComment}"
                      </div>
                    </div>
                  </div>
                </button>
                {/* Stand Down */}
                <button
                  onClick={() => setChoices(c => ({ ...c, [district.id]: 'standDown' }))}
                  className={`btn-option flex items-start gap-3 ${choices[district.id] === 'standDown' ? 'selected' : ''}`}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">{'\u{1F6AB}'}</span>
                  <div className="flex-1">
                    <div className="font-display text-sm font-bold text-walnut flex items-center gap-2">
                      <span>Stand Down</span>
                      {brief.advisorChoice === 'standDown' && (
                        <span className="text-xs font-ticker text-brass-dark bg-brass/10 px-1.5 py-0.5 rounded">
                          {advisor.firstName}'s pick
                        </span>
                      )}
                    </div>
                    <div className="flex items-start gap-1.5 mt-1">
                      <span className="text-sm flex-shrink-0">{advisor.icon}</span>
                      <div className="font-body text-xs text-walnut-light/70 italic">
                        "{brief.standDownComment}"
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 max-w-md mx-auto w-full">
        <button
          onClick={() => onSubmit(choices)}
          disabled={!allChosen}
          className="btn-brass w-full text-lg disabled:opacity-40"
        >
          Lock In Endorsements
        </button>
      </div>
    </div>
  );
}

// Act II Round 1: The New Reality (per-district, no fusion)
export function FPTPDecision({ state, onSubmit }) {
  const [choices, setChoices] = useState({});
  const allChosen = DISTRICT_LIST.every(d => choices[d.id]);
  const advisorId = state.advisor || 'ezra';
  const advisor = ADVISORS[advisorId] || ADVISORS.ezra;
  const guidance = getDecisionGuidance('fptp', advisorId);
  const advisorChoices = getAdvisorFPTPChoices(state, advisorId);

  function letAdvisorDecide() {
    setChoices({ ...advisorChoices });
  }

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      <div className="text-center mb-6">
        <div className="font-display text-sm text-walnut-light uppercase tracking-wider">Act II &bull; Round 1</div>
        <h1 className="font-display text-2xl font-bold text-walnut mt-1">The New Reality</h1>
        <p className="font-body text-sm text-walnut-light mt-2 max-w-sm mx-auto">
          Fusion is banned. You can run alone {'—'} splitting the progressive vote {'—'} or stand down entirely.
        </p>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
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

      {/* Let Advisor Decide */}
      <div className="max-w-md mx-auto w-full mb-5">
        <button
          onClick={letAdvisorDecide}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded border-2 border-brass/40 bg-brass/5 hover:bg-brass/10 transition-colors"
        >
          <span className="text-xl">{advisor.icon}</span>
          <div className="text-left">
            <div className="font-display text-sm font-bold text-brass-dark">Let {advisor.firstName} Decide</div>
            <div className="font-body text-xs text-walnut-light/60">Trust {advisor.firstName}&rsquo;s strategic judgment on all districts</div>
          </div>
        </button>
      </div>

      <div className="flex flex-col gap-6 max-w-md mx-auto w-full">
        {DISTRICT_LIST.map(district => (
          <div key={district.id} className="card-gilded p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{district.icon}</span>
              <div>
                <h3 className="font-display font-bold text-walnut">{district.name}</h3>
                <p className="font-body text-xs text-walnut-light/70">{district.character}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {/* Fusion option — BANNED */}
              <div className="btn-option opacity-50 relative pointer-events-none">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0 mt-0.5">{'\u{1F91D}'}</span>
                  <div>
                    <div className="font-display text-sm font-bold text-walnut line-through">Offer Fusion</div>
                    <div className="font-body text-xs text-walnut-light/70 line-through">Cross-endorse a major-party candidate</div>
                  </div>
                </div>
                <div className="stamp-banned">BANNED</div>
              </div>

              {[
                { key: 'alone', icon: '\u{1F3C3}', label: 'Run Alone', desc: 'Every vote you win splits the progressive vote.' },
                { key: 'standDown', icon: '\u{1F6AB}', label: 'Stand Down', desc: "Disappear. Save what's left." },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setChoices(c => ({ ...c, [district.id]: opt.key }))}
                  className={`btn-option flex items-start gap-3 ${choices[district.id] === opt.key ? 'selected' : ''}`}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">{opt.icon}</span>
                  <div className="flex-1">
                    <div className="font-display text-sm font-bold text-walnut flex items-center gap-2">
                      <span>{opt.label}</span>
                      {advisorChoices[district.id] === opt.key && (
                        <span className="text-xs font-ticker text-brass-dark bg-brass/10 px-1.5 py-0.5 rounded">
                          {advisor.firstName}&rsquo;s pick
                        </span>
                      )}
                    </div>
                    <div className="font-body text-xs text-walnut-light/70">{opt.desc}</div>
                    {guidance.optionComments?.[opt.key] && (
                      <div className="flex items-start gap-1.5 mt-1">
                        <span className="text-sm flex-shrink-0">{advisor.icon}</span>
                        <div className="font-body text-xs text-walnut-light/60 italic">
                          &ldquo;{guidance.optionComments[opt.key]}&rdquo;
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 max-w-md mx-auto w-full">
        <button
          onClick={() => onSubmit(choices)}
          disabled={!allChosen}
          className="btn-brass w-full text-lg disabled:opacity-40"
        >
          Hold the Election
        </button>
      </div>
    </div>
  );
}

// Act II Round 2: Blame Game
export function BlameDecision({ state, onSubmit }) {
  const [choice, setChoice] = useState(null);
  const advisorId = state.advisor || 'ezra';
  const advisor = ADVISORS[advisorId] || ADVISORS.ezra;
  const guidance = getDecisionGuidance('blame', advisorId);

  const spoiledAny = Object.values(state.act2.electionResults).some(r => r.spoiled);
  const stoodDownAll = Object.values(state.act2.electionResults).every(r => r.stoodDown);

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      <div className="text-center mb-6">
        <div className="font-display text-sm text-walnut-light uppercase tracking-wider">Act II &bull; Round 2</div>
        <h1 className="font-display text-2xl font-bold text-walnut mt-1">The Blame Game</h1>
        <p className="font-body text-sm text-walnut-light mt-2 max-w-sm mx-auto">
          {spoiledAny
            ? "The Democrats are furious. You split the vote, and the Republicans won. Resources are draining."
            : stoodDownAll
            ? "The Democrats are dismissive. You stood down everywhere, and they didn't even notice."
            : "The Democrats are unimpressed. Your results were mixed, your resources are thin."}
        </p>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
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

      <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
        {[
          { key: 'apologize', icon: '\u{1F3F3}\uFE0F', label: 'Apologize & Coordinate', desc: "Tell your voters to back the Democrats. No ballot line, no credit. But maybe they'll stop blaming you." },
          { key: 'doubleDown', icon: '\u270A', label: 'Double Down', desc: "Run harder next time. Spoiler math be damned \u2014 you have a right to exist." },
          { key: 'pivot', icon: '\u{1F504}', label: 'Pivot Issues', desc: 'Find new ground to differentiate. Your coalition shrinks, but at least it\'s yours.' },
        ].map(opt => (
          <button
            key={opt.key}
            onClick={() => setChoice(opt.key)}
            className={`btn-option flex items-start gap-3 ${choice === opt.key ? 'selected' : ''}`}
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{opt.icon}</span>
            <div className="flex-1">
              <div className="font-display text-sm font-bold text-walnut flex items-center gap-2">
                <span>{opt.label}</span>
                {guidance.pick === opt.key && (
                  <span className="text-xs font-ticker text-brass-dark bg-brass/10 px-1.5 py-0.5 rounded">
                    {advisor.firstName}&rsquo;s pick
                  </span>
                )}
              </div>
              <div className="font-body text-xs text-walnut-light/70">{opt.desc}</div>
              {guidance.options?.[opt.key] && (
                <div className="flex items-start gap-1.5 mt-1.5">
                  <span className="text-sm flex-shrink-0">{advisor.icon}</span>
                  <div className="font-body text-xs text-walnut-light/60 italic">
                    &ldquo;{guidance.options[opt.key]}&rdquo;
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 max-w-md mx-auto w-full">
        <button
          onClick={() => onSubmit(choice)}
          disabled={!choice}
          className="btn-brass w-full text-lg disabled:opacity-40"
        >
          Choose Your Fate
        </button>
      </div>
    </div>
  );
}

// Act II Round 3: Absorption
export function AbsorptionDecision({ state, onSubmit }) {
  const [choice, setChoice] = useState(null);
  const advisorId = state.advisor || 'ezra';
  const advisor = ADVISORS[advisorId] || ADVISORS.ezra;
  const guidance = getDecisionGuidance('absorption', advisorId);
  const issueKey = typeof state.party.issues === 'string' ? state.party.issues : state.party.issues[0];
  const issue = ISSUES[issueKey]?.name || 'your key issue';

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      <div className="text-center mb-6">
        <div className="font-display text-sm text-walnut-light uppercase tracking-wider">Act II &bull; Round 3</div>
        <h1 className="font-display text-2xl font-bold text-walnut mt-1">Absorption</h1>
        <p className="font-body text-sm text-walnut-light mt-2 max-w-sm mx-auto">
          The Democrats are co-opting {issue} {'—'} your most popular issue {'—'} but watered down beyond recognition.
        </p>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
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

      <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
        {[
          { key: 'cryTheft', icon: '\u{1F4E3}', label: 'Cry Theft', desc: 'Accuse the Democrats publicly of stealing your platform. Sounds like sour grapes.' },
          { key: 'outflank', icon: '\u{1F4C8}', label: 'Outflank', desc: 'Push a more radical version. Keeps your base intense, but shrinks your appeal.' },
          { key: 'acceptReality', icon: '\u{1F480}', label: 'Accept Reality', desc: 'Endorse the Democrats and dissolve. Your ideas survive \u2014 diluted, in someone else\'s platform.' },
        ].map(opt => (
          <button
            key={opt.key}
            onClick={() => setChoice(opt.key)}
            className={`btn-option flex items-start gap-3 ${choice === opt.key ? 'selected' : ''}`}
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{opt.icon}</span>
            <div className="flex-1">
              <div className="font-display text-sm font-bold text-walnut flex items-center gap-2">
                <span>{opt.label}</span>
                {guidance.pick === opt.key && (
                  <span className="text-xs font-ticker text-brass-dark bg-brass/10 px-1.5 py-0.5 rounded">
                    {advisor.firstName}&rsquo;s pick
                  </span>
                )}
              </div>
              <div className="font-body text-xs text-walnut-light/70">{opt.desc}</div>
              {guidance.options?.[opt.key] && (
                <div className="flex items-start gap-1.5 mt-1.5">
                  <span className="text-sm flex-shrink-0">{advisor.icon}</span>
                  <div className="font-body text-xs text-walnut-light/60 italic">
                    &ldquo;{guidance.options[opt.key]}&rdquo;
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 max-w-md mx-auto w-full">
        <button
          onClick={() => onSubmit(choice)}
          disabled={!choice}
          className="btn-brass w-full text-lg disabled:opacity-40"
        >
          Face the Inevitable
        </button>
      </div>
    </div>
  );
}

// Act III Round 1: Issue Priority
export function IssuePriorityDecision({ state, onSubmit }) {
  const [priority, setPriority] = useState(null);
  const advisorId = state.advisor || 'ezra';
  const advisor = ADVISORS[advisorId] || ADVISORS.ezra;
  const guidance = getDecisionGuidance('issuePriority', advisorId);

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      <div className="text-center mb-6">
        <div className="font-display text-sm text-walnut-light uppercase tracking-wider">Act III &bull; Round 1</div>
        <h1 className="font-display text-2xl font-bold text-walnut mt-1">A Real Choice</h1>
        <p className="font-body text-sm text-walnut-light mt-2 max-w-sm mx-auto">
          Under proportional representation, voters can support you without fear of wasting their vote.
          Which issue do you push hardest in the campaign?
        </p>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
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

      <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
        {(Array.isArray(state.party.issues) ? state.party.issues : [state.party.issues]).map(issueKey => {
          const issue = ISSUES[issueKey];
          return (
            <button
              key={issueKey}
              onClick={() => setPriority(issueKey)}
              className={`btn-option ${priority === issueKey ? 'selected' : ''}`}
            >
              <div className="font-display font-bold text-walnut text-lg">
                {priority === issueKey && <span className="text-brass mr-2">&#x2605;</span>}
                {issue.name}
              </div>
              <div className="font-body text-xs text-walnut-light/70 mt-1">{issue.description}</div>
              <div className="font-ticker text-xs text-brass-dark/60 mt-1">
                Coalition: {issue.constituency}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 max-w-md mx-auto w-full">
        <button
          onClick={() => onSubmit(priority)}
          disabled={!priority}
          className="btn-brass w-full text-lg disabled:opacity-40"
        >
          Campaign on This Issue
        </button>
      </div>
    </div>
  );
}

// Act III Round 2: Coalition
export function CoalitionDecision({ state, onSubmit }) {
  const [choice, setChoice] = useState(null);
  const advisorId = state.advisor || 'ezra';
  const advisor = ADVISORS[advisorId] || ADVISORS.ezra;
  const guidance = getDecisionGuidance('coalition', advisorId);
  const seats = state.act3.seatResults;

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      <div className="text-center mb-6">
        <div className="font-display text-sm text-walnut-light uppercase tracking-wider">Act III &bull; Round 2</div>
        <h1 className="font-display text-2xl font-bold text-walnut mt-1">The Coalition</h1>
        <p className="font-body text-sm text-walnut-light mt-2 max-w-sm mx-auto">
          No party has a majority. With your {seats?.player} seats, you hold real power.
          Two coalition offers are on the table.
        </p>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
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

      <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
        {[
          { key: 'joinDemocrat', icon: '\u{1F3DB}\uFE0F', label: 'Join Democratic Coalition', desc: 'Junior partner. Minor cabinet post, one issue advanced. Safe but small.' },
          { key: 'holdOut', icon: '\u2696\uFE0F', label: 'Hold Out for More', desc: 'Demand a major post and both issues. Risky \u2014 they might cut you out.' },
          { key: 'buildAlternative', icon: '\u{1F525}', label: 'Build Alternative Coalition', desc: 'Assemble your party + Agrarian Alliance + Democratic dissidents. High risk, high reward.' },
        ].map(opt => (
          <button
            key={opt.key}
            onClick={() => setChoice(opt.key)}
            className={`btn-option flex items-start gap-3 ${choice === opt.key ? 'selected' : ''}`}
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{opt.icon}</span>
            <div className="flex-1">
              <div className="font-display text-sm font-bold text-walnut flex items-center gap-2">
                <span>{opt.label}</span>
                {guidance.pick === opt.key && (
                  <span className="text-xs font-ticker text-brass-dark bg-brass/10 px-1.5 py-0.5 rounded">
                    {advisor.firstName}&rsquo;s pick
                  </span>
                )}
              </div>
              <div className="font-body text-xs text-walnut-light/70">{opt.desc}</div>
              {guidance.options?.[opt.key] && (
                <div className="flex items-start gap-1.5 mt-1.5">
                  <span className="text-sm flex-shrink-0">{advisor.icon}</span>
                  <div className="font-body text-xs text-walnut-light/60 italic">
                    &ldquo;{guidance.options[opt.key]}&rdquo;
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 max-w-md mx-auto w-full">
        <button
          onClick={() => onSubmit(choice)}
          disabled={!choice}
          className="btn-brass w-full text-lg disabled:opacity-40"
        >
          Form Your Coalition
        </button>
      </div>
    </div>
  );
}

// Act III Round 3: The Vote
export function VoteDecision({ state, onSubmit }) {
  const [choice, setChoice] = useState(null);
  const advisorId = state.advisor || 'ezra';
  const advisor = ADVISORS[advisorId] || ADVISORS.ezra;
  const guidance = getDecisionGuidance('vote', advisorId);
  const fallbackIssue = typeof state.party.issues === 'string' ? state.party.issues : state.party.issues[0];
  const issue = ISSUES[state.act3.issuePriority || fallbackIssue]?.name || 'your issue';

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      <div className="text-center mb-6">
        <div className="font-display text-sm text-walnut-light uppercase tracking-wider">Act III &bull; Round 3</div>
        <h1 className="font-display text-2xl font-bold text-walnut mt-1">The Vote</h1>
        <p className="font-body text-sm text-walnut-light mt-2 max-w-sm mx-auto">
          A bill on {issue} comes to the floor. It can pass {'—'} but only with a weakening compromise.
        </p>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
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

      <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
        {[
          { key: 'compromise', icon: '\u2705', label: 'Vote Yes (Compromise)', desc: 'Pass the weakened bill. Half a loaf \u2014 but real bread.' },
          { key: 'principles', icon: '\u274C', label: 'Vote No (Principles)', desc: `Kill it. The bill isn't strong enough. Purity, no progress.` },
          { key: 'amend', icon: '\u{1F4DD}', label: 'Amend and Fight', desc: 'Push a stronger version. Might pass, might collapse your coalition.' },
        ].map(opt => (
          <button
            key={opt.key}
            onClick={() => setChoice(opt.key)}
            className={`btn-option flex items-start gap-3 ${choice === opt.key ? 'selected' : ''}`}
          >
            <span className="text-xl flex-shrink-0 mt-0.5">{opt.icon}</span>
            <div className="flex-1">
              <div className="font-display text-sm font-bold text-walnut flex items-center gap-2">
                <span>{opt.label}</span>
                {guidance.pick === opt.key && (
                  <span className="text-xs font-ticker text-brass-dark bg-brass/10 px-1.5 py-0.5 rounded">
                    {advisor.firstName}&rsquo;s pick
                  </span>
                )}
              </div>
              <div className="font-body text-xs text-walnut-light/70">{opt.desc}</div>
              {guidance.options?.[opt.key] && (
                <div className="flex items-start gap-1.5 mt-1.5">
                  <span className="text-sm flex-shrink-0">{advisor.icon}</span>
                  <div className="font-body text-xs text-walnut-light/60 italic">
                    &ldquo;{guidance.options[opt.key]}&rdquo;
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 max-w-md mx-auto w-full">
        <button
          onClick={() => onSubmit(choice)}
          disabled={!choice}
          className="btn-brass w-full text-lg disabled:opacity-40"
        >
          Cast Your Vote
        </button>
      </div>
    </div>
  );
}
