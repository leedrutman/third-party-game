import { useState } from 'react';
import { getEraData } from '../../data/eraData.js';
import { getPartyLogo } from '../../data/logos.js';

export default function PartyCreation({ onComplete, era = 'historical' }) {
  const { PARTY_NAMES, REFORM_CAUSE } = getEraData(era);
  const [selected, setSelected] = useState(null);

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="font-ticker text-xs tracking-[0.2em] text-brass-dark uppercase">
          Party Formation
        </div>
        <h1 className="font-display text-2xl font-bold text-walnut mt-1">
          Name Your Party
        </h1>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
      </div>

      {/* Cause display (fixed, not a choice) */}
      <div className="card-gilded p-4 mb-6 max-w-md mx-auto w-full">
        <div className="font-ticker text-xs text-brass-dark uppercase tracking-wider mb-1">
          Your Cause
        </div>
        <div className="font-display font-bold text-walnut text-lg">
          {REFORM_CAUSE.name}
        </div>
        <div className="font-body text-sm text-walnut-light mt-1">
          {REFORM_CAUSE.description}
        </div>
        <div className="font-body text-xs text-walnut-light/70 mt-2 italic">
          &ldquo;{REFORM_CAUSE.shortPitch}&rdquo;
        </div>
      </div>

      {/* Party name selection */}
      <div className="flex flex-col gap-3 max-w-md mx-auto w-full mb-8">
        {PARTY_NAMES.map(party => (
          <button
            key={party.key}
            onClick={() => setSelected(party.key)}
            className={`btn-option ${selected === party.key ? 'selected' : ''}`}
          >
            <div className="flex items-center gap-3">
              {getPartyLogo(party.key, era) && (
                <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden border border-walnut/20">
                  <img
                    src={getPartyLogo(party.key, era)}
                    alt={party.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-display font-bold text-walnut">
                  {party.name}
                </div>
                <div className="font-body text-xs text-walnut-light/70 mt-0.5">
                  {party.flavor}
                </div>
                <div className="font-ticker text-xs text-brass-dark/60 mt-1">
                  Mascot: {party.mascot.name} &mdash; &ldquo;{party.mascot.meaning}&rdquo;
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Confirm button */}
      {selected && (
        <div className="max-w-md mx-auto w-full">
          <button
            onClick={() => onComplete({ nameKey: selected })}
            className="btn-brass w-full text-base py-3"
          >
            Found {PARTY_NAMES.find(p => p.key === selected)?.name}
          </button>
        </div>
      )}
    </div>
  );
}
