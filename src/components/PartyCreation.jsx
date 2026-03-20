import { useState } from 'react';
import { MASCOTS, ISSUE_LIST, ISSUES, getPartyNamesForIssue } from '../data/issues.js';

// Deterministic mascot assignment from party name + issue
function assignMascot(nameKey, issueKey) {
  let hash = 0;
  const str = nameKey + issueKey;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return MASCOTS[Math.abs(hash) % MASCOTS.length];
}

export default function PartyCreation({ onComplete }) {
  const [step, setStep] = useState(0); // 0: issue, 1: name
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [partyName, setPartyName] = useState(null);

  function selectIssue(issue) {
    setSelectedIssue(issue.key);
    setPartyName(null); // Reset name when issue changes
  }

  function handleComplete() {
    if (partyName && selectedIssue) {
      const mascot = assignMascot(partyName.key, selectedIssue);
      onComplete({ name: partyName, mascot, issues: selectedIssue });
    }
  }

  const partyNameOptions = selectedIssue
    ? getPartyNamesForIssue(selectedIssue)
    : [];

  const previewMascot = partyName
    ? assignMascot(partyName.key, selectedIssue)
    : null;

  const issueData = selectedIssue ? ISSUES[selectedIssue] : null;
  const flagshipBill = issueData?.flagshipBill;

  const stepTitles = ['Choose Your Cause', 'Name Your Party'];

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="font-ticker text-xs tracking-[0.2em] text-brass-dark uppercase">
          Charter of Incorporation
        </div>
        <h1 className="font-display text-2xl font-bold text-walnut mt-1">
          {stepTitles[step]}
        </h1>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
      </div>

      {/* Progress */}
      <div className="flex justify-center gap-2 mb-6">
        {[0, 1].map(i => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i <= step ? 'bg-brass' : 'bg-walnut/15'
            }`}
          />
        ))}
      </div>

      {/* Step 0: Choose 1 issue */}
      {step === 0 && (
        <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
          <p className="font-body text-sm text-walnut-light text-center mb-2">
            What will your party fight for? Choose 1 cause.
          </p>
          {ISSUE_LIST.map(issue => {
            const isSelected = selectedIssue === issue.key;
            return (
              <button
                key={issue.key}
                onClick={() => selectIssue(issue)}
                className={`btn-option ${isSelected ? 'selected' : ''}`}
              >
                <div className="font-display font-bold text-walnut">
                  {isSelected && <span className="text-brass mr-2">&#x2713;</span>}
                  {issue.name}
                </div>
                <div className="font-body text-xs text-walnut-light/70 mt-1">
                  {issue.plank || issue.description}
                </div>
                <div className="font-ticker text-xs text-brass-dark/60 mt-1">
                  Base: {issue.constituency}
                </div>
              </button>
            );
          })}

          {/* Flagship bill preview */}
          {selectedIssue && flagshipBill && (
            <div className="card-gilded p-4 mt-2">
              <div className="font-ticker text-xs tracking-[0.15em] text-brass-dark uppercase mb-1">
                Your Mission
              </div>
              <div className="font-display text-sm font-bold text-walnut mb-2">
                Pass {flagshipBill.name}
              </div>
              <div className="flex gap-1">
                {flagshipBill.stages.map((stage, i) => (
                  <div key={i} className="flex-1 text-center">
                    <div className="h-1.5 rounded-full bg-walnut/15 mb-1" />
                    <div className="font-ticker text-[9px] text-walnut-light/50">
                      {stage.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => selectedIssue && setStep(1)}
            disabled={!selectedIssue}
            className="btn-brass mt-4 w-full disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 1: Party Name (based on chosen issue) */}
      {step === 1 && (
        <div className="flex flex-col gap-3 max-w-md mx-auto w-full">
          <p className="font-body text-sm text-walnut-light text-center mb-2">
            Fighting for <strong>{issueData?.name}</strong>:
          </p>
          {partyNameOptions.map(pn => {
            const mascotForName = assignMascot(pn.key, selectedIssue);
            return (
              <button
                key={pn.key}
                onClick={() => setPartyName(pn)}
                className={`btn-option ${partyName?.key === pn.key ? 'selected' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{mascotForName.icon}</span>
                  <div>
                    <div className="font-display font-bold text-walnut">{pn.name}</div>
                    <div className="font-body text-xs text-walnut-light/70 mt-0.5">{pn.flavor}</div>
                  </div>
                </div>
              </button>
            );
          })}
          <div className="flex gap-3 mt-4">
            <button onClick={() => setStep(0)} className="btn-option text-center flex-1 py-3">
              <span className="font-display text-sm">Back</span>
            </button>
            <button
              onClick={handleComplete}
              disabled={!partyName}
              className="btn-brass flex-[2] disabled:opacity-40"
            >
              Found {partyName?.name || 'Your Party'}
            </button>
          </div>
        </div>
      )}

      {/* Summary preview */}
      {(selectedIssue || partyName) && (
        <div className="mt-auto pt-6 text-center">
          <div className="card-gilded inline-block px-4 py-2">
            <span className="font-display text-sm text-walnut-light">
              {previewMascot?.icon || '?'} {partyName?.name || '...'}{' '}
              {selectedIssue && (
                <span className="text-xs text-walnut-light/60">
                  &bull; {ISSUES[selectedIssue]?.name}
                </span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
