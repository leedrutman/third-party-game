import { useState, useMemo } from 'react';
import { DISTRICTS, DISTRICT_LIST } from '../engine/districts.js';
import { isFusionChoice } from '../engine/electorate.js';
import CandidatePortrait from './CandidatePortrait.jsx';
import { getAdvisorFundStrategies, ADVISORS } from '../data/advisorLines.js';

const STEP = 50;

function getFusionLabel(choice, candidate, partyAbbr) {
  if (choice === 'fusionDem' || choice === 'fusionRep') {
    return {
      icon: null,
      label: `Fused with ${candidate?.title || ''} ${candidate?.name || 'ally'} (${partyAbbr})`,
      hint: 'Ally on the ballot \u2014 investment amplifies fusion.',
      color: 'text-forest',
      active: true,
    };
  }
  if (choice === 'alone') {
    return {
      icon: '\u{1F3C3}',
      label: 'Running Alone',
      hint: "Three-way race \u2014 money helps but you're the underdog.",
      color: 'text-brass-dark',
      active: true,
    };
  }
  return {
    icon: '\u{1F6AB}',
    label: 'Standing Down',
    hint: 'No candidate on the ballot. Funds would be wasted.',
    color: 'text-walnut-light/50',
    active: false,
  };
}

// Compact allocation preview for a strategy card
function AllocationPreview({ allocation, fusionChoices }) {
  const parts = DISTRICT_LIST.map(d => {
    const amount = allocation[d.id] || 0;
    const isStoodDown = fusionChoices[d.id] === 'standDown';
    if (isStoodDown) return null;
    return { name: d.name.replace('District ', 'D'), amount };
  }).filter(Boolean);

  return (
    <div className="font-ticker text-xs text-walnut-light/50 mt-1.5">
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && ' \u00B7 '}
          <span className={p.amount > 0 ? 'text-brass-dark' : ''}>
            {p.name}: ${p.amount}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function FundAllocation({ fundPool, state, election, onSubmit }) {
  const fusionChoices = state.act1.elections[election]?.fusionChoices || {};
  const advisorId = state.advisor || 'ezra';
  const advisor = ADVISORS[advisorId] || ADVISORS.ezra;

  // Compute advisor's strategies once
  const strategies = useMemo(
    () => getAdvisorFundStrategies(state, election, fusionChoices, fundPool, advisorId),
    [state, election, fundPool, advisorId],
  );

  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [showSliders, setShowSliders] = useState(false);
  const [allocation, setAllocation] = useState(
    Object.fromEntries(DISTRICT_LIST.map(d => [d.id, 0]))
  );

  const spent = Object.values(allocation).reduce((s, v) => s + v, 0);
  const remaining = fundPool - spent;

  function selectStrategy(strategy) {
    setSelectedStrategy(strategy.id);
    setAllocation({ ...strategy.allocation });
    setShowSliders(true);
  }

  function doItMyself() {
    setSelectedStrategy('manual');
    setAllocation(Object.fromEntries(DISTRICT_LIST.map(d => [d.id, 0])));
    setShowSliders(true);
  }

  function adjust(districtId, delta) {
    setAllocation(prev => {
      const current = prev[districtId] || 0;
      const next = current + delta;
      if (next < 0) return prev;
      const currentSpent = Object.values(prev).reduce((s, v) => s + v, 0);
      const currentRemaining = fundPool - currentSpent;
      if (delta > 0 && currentRemaining < delta) return prev;
      return { ...prev, [districtId]: next };
    });
    // Mark as modified if a strategy was selected
    if (selectedStrategy && selectedStrategy !== 'manual') {
      setSelectedStrategy(selectedStrategy + '_modified');
    }
  }

  const electionYears = { 1: 1892, 2: 1894, 3: 1896 };

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      <div className="text-center mb-4">
        <div className="font-ticker text-xs tracking-[0.2em] text-brass-dark uppercase">
          Act I &bull; {electionYears[election]} Election
        </div>
        <h1 className="font-display text-2xl font-bold text-walnut mt-1">
          Allocate Campaign Funds
        </h1>
        <p className="font-body text-xs text-walnut-light/70 mt-2 max-w-sm mx-auto">
          Campaign funds boost your vote share. $100 minimum to be competitive;
          higher investment has diminishing returns (~2{'\u2013'}4% boost).
        </p>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
      </div>

      {/* Fund pool display */}
      <div className="max-w-md mx-auto w-full mb-4">
        <div className="card-gilded p-3 text-center">
          <div className="font-display text-lg font-bold text-brass-dark">
            ${remaining} <span className="text-sm font-body text-walnut-light/60">remaining of ${fundPool}</span>
          </div>
        </div>
      </div>

      {/* Strategy picker */}
      <div className="flex flex-col gap-3 max-w-md mx-auto w-full mb-5">
        {strategies.map(strategy => {
          const isSelected = selectedStrategy === strategy.id
            || selectedStrategy === strategy.id + '_modified';
          const isModified = selectedStrategy === strategy.id + '_modified';
          return (
            <button
              key={strategy.id}
              onClick={() => selectStrategy(strategy)}
              className={`btn-option w-full text-left ${isSelected ? 'selected' : ''}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">{advisor.icon}</span>
                <div className="flex-1">
                  <div className="font-display text-sm font-bold text-walnut flex items-center gap-2">
                    <span>{strategy.name}</span>
                    {isModified && (
                      <span className="text-xs font-ticker text-walnut-light/40">(modified)</span>
                    )}
                  </div>
                  <div className="font-body text-xs text-walnut leading-relaxed italic mt-1">
                    &ldquo;{strategy.advisorQuote}&rdquo;
                  </div>
                  <AllocationPreview
                    allocation={strategy.allocation}
                    fusionChoices={fusionChoices}
                  />
                </div>
              </div>
            </button>
          );
        })}

        {/* Do it myself */}
        <button
          onClick={doItMyself}
          className={`btn-option w-full text-left ${selectedStrategy === 'manual' ? 'selected' : ''}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg flex-shrink-0 mt-0.5">{'\u270F\uFE0F'}</span>
            <div>
              <div className="font-display text-sm font-bold text-walnut">I'll Decide Myself</div>
              <div className="font-body text-xs text-walnut-light/60 mt-0.5">
                Allocate funds manually across districts
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* District sliders — shown after a strategy is picked */}
      {showSliders && (
        <div className="flex flex-col gap-4 max-w-md mx-auto w-full">
          {DISTRICT_LIST.map(district => {
            const amount = allocation[district.id] || 0;

            // Fusion context
            const choice = fusionChoices[district.id];
            const isFused = isFusionChoice(choice);
            const partyKey = choice === 'fusionDem' ? 'democrat' : 'republican';
            const candidate = isFused ? state.candidates?.[district.id]?.[partyKey] : null;
            const partyAbbr = choice === 'fusionDem' ? 'D' : 'R';
            const fusion = getFusionLabel(choice, candidate, partyAbbr);

            // Effectiveness indicator
            let effectiveness = 'Below threshold';
            let effColor = 'text-darkred';
            if (amount >= 100) { effectiveness = 'Competitive'; effColor = 'text-brass-dark'; }
            if (amount >= 250) { effectiveness = 'Strong investment'; effColor = 'text-forest'; }

            return (
              <div key={district.id} className={`card-gilded p-4 ${!fusion.active ? 'opacity-50' : ''}`}>
                {/* District header */}
                <div className="flex items-start gap-3 mb-2">
                  {isFused && candidate ? (
                    <CandidatePortrait candidateId={candidate.id} size={36} />
                  ) : (
                    <span className="text-xl flex-shrink-0 mt-0.5">{district.icon}</span>
                  )}
                  <div className="flex-1">
                    <div className="font-display font-bold text-walnut">
                      {district.name}
                    </div>
                    <div className="font-body text-xs text-walnut-light/60">
                      {district.type} &bull; {district.industry}
                    </div>
                  </div>
                </div>

                {/* Fusion choice badge */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded bg-walnut/5 mb-3 ${fusion.color}`}>
                  {fusion.icon && <span className="text-sm">{fusion.icon}</span>}
                  <div>
                    <div className="font-display text-xs font-bold">{fusion.label}</div>
                    <div className="font-body text-xs opacity-70">{fusion.hint}</div>
                  </div>
                </div>

                {/* Allocation controls */}
                {fusion.active ? (
                  <>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => adjust(district.id, -STEP)}
                        disabled={amount <= 0}
                        className="w-10 h-10 rounded-full bg-walnut/10 font-display font-bold text-walnut disabled:opacity-30 flex items-center justify-center"
                      >
                        -
                      </button>
                      <div className="flex-1 text-center">
                        <div className="font-display text-xl font-bold text-brass-dark">${amount}</div>
                        <div className={`font-ticker text-xs ${effColor}`}>{effectiveness}</div>
                      </div>
                      <button
                        onClick={() => adjust(district.id, STEP)}
                        disabled={remaining < STEP}
                        className="w-10 h-10 rounded-full bg-walnut/10 font-display font-bold text-walnut disabled:opacity-30 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    {/* Allocation bar */}
                    <div className="support-meter mt-2">
                      <div
                        className="support-meter-fill bg-brass"
                        style={{ width: `${Math.min(100, amount / 5)}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-2">
                    <div className="font-ticker text-xs text-walnut-light/40">No funds needed</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="max-w-md mx-auto w-full mt-6">
        <button
          onClick={() => onSubmit(allocation)}
          disabled={!showSliders}
          className="btn-brass w-full text-lg disabled:opacity-40"
        >
          Deploy Funds {spent > 0 && `($${spent})`}
        </button>
        {showSliders && spent === 0 && (
          <p className="font-body text-xs text-walnut-light/50 text-center mt-2">
            You can proceed without spending, but your candidates will be at a disadvantage.
          </p>
        )}
      </div>
    </div>
  );
}
