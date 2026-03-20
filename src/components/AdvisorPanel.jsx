import { getAdvisorLandscape, getAdvisorRecommendation, getAdvisorIntroduction, ADVISORS } from '../data/advisorLines.js';

const FORESHADOWING = {
  2: {
    headline: 'REPUBLICAN CAUCUS FLOATS "BALLOT INTEGRITY" MEASURE',
    subhead: 'Would bar candidates from appearing on multiple party lines',
    detail: 'Prominent legislators from both parties are quietly discussing a bill that would ban fusion voting \u2014 the practice that lets third parties cross-endorse major-party candidates. Supporters call it a "reform." Critics call it a power grab.',
    source: 'The Evening Tribune, March 1894',
  },
  3: {
    headline: 'ANTI-FUSION BILL ADVANCES IN STATE HOUSE',
    subhead: 'Twelve states considering similar measures to outlaw cross-endorsement',
    detail: 'The bill to ban fusion voting has cleared committee with bipartisan support. Both Republican and Democratic leaders agree: third parties sharing a ballot line with major candidates must end. This may be the last election where fusion is legal.',
    source: 'The Daily Standard, January 1896',
  },
};

export function AdvisorLandscape({ election, state, onContinue }) {
  const advisorId = state.advisor || 'ezra';
  const advisor = ADVISORS[advisorId] || ADVISORS.ezra;
  const text = getAdvisorLandscape(1, election, state, advisorId);
  const electionYears = { 1: 1892, 2: 1894, 3: 1896 };
  const isFirstElection = election === 1;
  const foreshadow = FORESHADOWING[election];

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      <div className="text-center mb-4">
        <div className="font-ticker text-xs tracking-[0.2em] text-brass-dark uppercase">
          Act I &bull; {electionYears[election]} Election
        </div>
        <h1 className="font-display text-xl font-bold text-walnut mt-1">
          {isFirstElection ? 'Your Campaign Advisor' : 'The Political Landscape'}
        </h1>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
      </div>

      <div className="max-w-md mx-auto w-full flex-1 flex flex-col gap-4 justify-center">
        {/* Fusion ban foreshadowing (elections 2 & 3) */}
        {foreshadow && (
          <div className="relative p-4 bg-walnut/95 text-cream rounded border border-brass/30 shadow-lg">
            <div className="absolute -top-2 left-4 bg-darkred text-cream text-[10px] font-ticker tracking-wider px-2 py-0.5 uppercase">
              {election === 2 ? 'Breaking News' : '\u26A0 Urgent'}
            </div>
            <div className="font-display text-sm font-bold text-brass-light leading-snug mt-1">
              {foreshadow.headline}
            </div>
            <div className="font-body text-xs text-cream/60 italic mt-1">
              {foreshadow.subhead}
            </div>
            <div className="h-px bg-brass/30 my-2" />
            <div className="font-body text-xs text-cream/80 leading-relaxed">
              {foreshadow.detail}
            </div>
            <div className="font-ticker text-[10px] text-cream/40 mt-2 text-right">
              {foreshadow.source}
            </div>
          </div>
        )}

        {/* Advisor introduction card (election 1 only) */}
        {isFirstElection && (
          <div className="card-gilded p-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-walnut/10 flex-shrink-0 flex items-center justify-center text-2xl border border-walnut/15">
                {advisor.icon}
              </div>
              <div className="flex-1">
                <div className="font-display text-sm font-bold text-brass-dark">{advisor.name}</div>
                <div className="font-body text-xs text-walnut-light/60 mb-1">{advisor.title}</div>
                <div className="font-body text-xs text-walnut-light/50 mb-3 italic">{advisor.description}</div>
                <div className="font-body text-sm text-walnut leading-relaxed italic">
                  "{getAdvisorIntroduction(advisorId)}"
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Situation card */}
        <div className="card-gilded p-5">
          <div className="flex items-start gap-4">
            {!isFirstElection && (
              <div className="w-14 h-14 rounded-full bg-walnut/10 flex-shrink-0 flex items-center justify-center text-2xl border border-walnut/15">
                {advisor.icon}
              </div>
            )}
            <div className="flex-1">
              {isFirstElection ? (
                <div className="font-display text-sm font-bold text-brass-dark mb-2">The Situation:</div>
              ) : (
                <>
                  <div className="font-display text-sm font-bold text-brass-dark">{advisor.name}</div>
                  <div className="font-body text-xs text-walnut-light/60 mb-3">{advisor.title}</div>
                </>
              )}
              <div className="font-body text-sm text-walnut leading-relaxed italic">
                "{text}"
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 max-w-md mx-auto w-full">
        <button onClick={onContinue} className="btn-brass w-full text-lg">
          Survey the Candidates
        </button>
      </div>
    </div>
  );
}

export function AdvisorRecommendation({ election, state, onContinue }) {
  const advisorId = state.advisor || 'ezra';
  const advisor = ADVISORS[advisorId] || ADVISORS.ezra;
  const text = getAdvisorRecommendation(1, election, state, advisorId);
  const electionYears = { 1: 1892, 2: 1894, 3: 1896 };

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      <div className="text-center mb-4">
        <div className="font-ticker text-xs tracking-[0.2em] text-brass-dark uppercase">
          Act I &bull; {electionYears[election]} &bull; Advisor
        </div>
        <h1 className="font-display text-xl font-bold text-walnut mt-1">
          A Word of Advice
        </h1>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
      </div>

      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="card-gilded p-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-walnut/10 flex-shrink-0 flex items-center justify-center text-2xl border border-walnut/15">
              {advisor.icon}
            </div>
            <div className="flex-1">
              <div className="font-display text-sm font-bold text-brass-dark">{advisor.name}</div>
              <div className="font-ticker text-xs text-walnut-light/60 mb-3">My recommendation:</div>
              <div className="font-body text-sm text-walnut leading-relaxed italic">
                "{text}"
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 max-w-md mx-auto w-full">
        <button onClick={onContinue} className="btn-brass w-full text-lg">
          Head to the Polls
        </button>
      </div>
    </div>
  );
}
