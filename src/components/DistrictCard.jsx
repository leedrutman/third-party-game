import { DISTRICTS } from '../engine/districts.js';
import { NPC_PARTIES } from '../engine/parties.js';
import { CANDIDATES, isFriendly, getFriendlinessLabel } from '../data/candidates.js';
import { isFusionChoice } from '../engine/electorate.js';
import CandidatePortrait from './CandidatePortrait.jsx';

export default function DistrictCard({
  districtId,
  support,
  selected,
  onClick,
  choice,
  result,
  showResult = false,
  showCandidates = false,
  playerIssues = [],
  compact = false,
}) {
  const district = DISTRICTS[districtId];
  if (!district) return null;

  const supportPct = support ?? 0;
  const partyColor = '#B8860B';
  const candidates = CANDIDATES[districtId];

  return (
    <div
      onClick={onClick}
      className={`card-gilded p-4 transition-all ${onClick ? 'cursor-pointer hover:border-brass' : ''}
        ${selected ? 'border-brass ring-1 ring-brass' : ''} ${compact ? 'p-3' : ''}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{district.icon}</span>
        <div>
          <h3 className="font-display font-bold text-walnut text-lg leading-tight">
            {district.name}
          </h3>
          {!compact && (
            <>
              <p className="font-body text-xs text-walnut-light/70 mt-0.5">
                {district.type} &bull; {district.industry}
              </p>
              <p className="font-body text-xs text-walnut-light/50">
                {district.ethnic} &bull; {district.wealth}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Issue alignment indicators */}
      {!compact && (
        <div className="flex flex-wrap gap-1 mb-3">
          {Object.entries(district.issueWeights)
            .filter(([, w]) => w >= 0.6)
            .map(([issue]) => (
              <span
                key={issue}
                className="text-xs px-2 py-0.5 rounded-full bg-brass/10 text-brass-dark font-body"
              >
                {issue === 'freeSilver' ? 'Free Silver' :
                 issue === 'railroadRegulation' ? 'Railroad Reg.' :
                 issue === 'laborRights' ? 'Labor Rights' :
                 issue === 'antiCorruption' ? 'Anti-Corruption' :
                 "Women's Suffrage"}
              </span>
            ))}
        </div>
      )}

      {/* Candidate info */}
      {showCandidates && candidates && playerIssues.length > 0 && (
        <div className="mb-3 space-y-2">
          {['democrat', 'republican'].map(partyKey => {
            const c = candidates[partyKey];
            const friendly = isFriendly(c, playerIssues);
            const label = getFriendlinessLabel(c, playerIssues);
            const abbr = partyKey === 'democrat' ? 'D' : 'R';
            const color = NPC_PARTIES[partyKey].color;
            return (
              <div key={partyKey} className={`flex items-start gap-2 p-2 rounded ${friendly ? 'bg-forest/5 border border-forest/20' : 'bg-walnut/5'}`}>
                <div className="flex-shrink-0 mt-0.5">
                  <CandidatePortrait candidateId={c.id} size={32} />
                </div>
                <div>
                  <div className="font-display text-xs font-bold text-walnut">
                    {c.title} {c.name} <span className="text-walnut-light/60">({abbr})</span>
                  </div>
                  <div className="font-body text-xs text-walnut-light/70 italic">{c.description}</div>
                  <div className={`font-body text-xs mt-0.5 ${friendly ? 'text-forest' : 'text-darkred'}`}>
                    {label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Support meter */}
      {supportPct > 0 && (
        <div className="mb-2">
          <div className="flex justify-between text-xs font-body text-walnut-light mb-1">
            <span>Your Support</span>
            <span className="font-bold">{Math.round(supportPct)}%</span>
          </div>
          <div className="support-meter">
            <div
              className="support-meter-fill"
              style={{
                width: `${Math.min(100, supportPct * 3)}%`,
                backgroundColor: partyColor,
              }}
            />
          </div>
        </div>
      )}

      {/* Choice indicator */}
      {choice && (
        <div className={`text-sm font-display font-bold mt-2 px-2 py-1 rounded text-center
          ${isFusionChoice(choice) ? 'bg-forest/10 text-forest' :
            choice === 'alone' ? 'bg-brass/10 text-brass-dark' :
            'bg-walnut/10 text-walnut-light'}`}>
          {isFusionChoice(choice) ? '\u{1F91D} Fusion' :
           choice === 'alone' ? '\u{1F3C3} Running Alone' :
           '\u{1F6AB} Standing Down'}
        </div>
      )}

      {/* Election result */}
      {showResult && result && (
        <div className="mt-3 pt-3 border-t border-walnut/10">
          {result.stoodDown ? (
            <div className="text-sm text-walnut-light/60 italic font-body text-center">
              Did not contest
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-body">
                <div>
                  <div className="font-bold" style={{ color: NPC_PARTIES.republican.color }}>{result.republicanPercent}%</div>
                  <div className="text-walnut-light/60">Rep.</div>
                </div>
                <div>
                  <div className="font-bold" style={{ color: NPC_PARTIES.democrat.color }}>{result.democratPercent}%</div>
                  <div className="text-walnut-light/60">Dem.</div>
                </div>
                <div>
                  <div className="font-bold text-brass">{result.yourPercent}%</div>
                  <div className="text-walnut-light/60">You</div>
                </div>
              </div>

              {/* Fusion math breakdown */}
              {result.fusionWin && (
                <div className="mt-2 p-2 rounded bg-forest/5 border border-forest/20">
                  <div className="text-xs font-body text-walnut-light space-y-0.5">
                    <div className="flex justify-between">
                      <span>{result.fusionChoice === 'fusionDem' ? 'Dem.' : 'Rep.'} line:</span>
                      <span className="font-bold">{result.fusionChoice === 'fusionDem' ? result.democratPercent : result.republicanPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>+ Your line:</span>
                      <span className="font-bold text-brass">{result.yourPercent}%</span>
                    </div>
                    <div className="h-px bg-forest/30" />
                    <div className="flex justify-between font-bold text-forest">
                      <span>= Combined:</span>
                      <span>{result.fusionChoice === 'fusionDem'
                        ? (result.democratPercent + result.yourPercent).toFixed(1)
                        : (result.republicanPercent + result.yourPercent).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Spoiler math breakdown */}
              {result.spoiled && (
                <div className="mt-2 p-2 rounded bg-darkred/5 border border-darkred/20">
                  <div className="text-xs font-body text-walnut-light space-y-0.5">
                    <div className="flex justify-between">
                      <span>Republicans:</span>
                      <span className="font-bold">{result.republicanPercent}%</span>
                    </div>
                    <div className="h-px bg-darkred/20 my-0.5" />
                    <div className="flex justify-between">
                      <span>Democrats:</span>
                      <span className="font-bold">{result.democratPercent}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>+ Your votes:</span>
                      <span className="font-bold text-brass">{result.yourPercent}%</span>
                    </div>
                    <div className="h-px bg-darkred/30" />
                    <div className="flex justify-between font-bold text-darkred">
                      <span>= Would be:</span>
                      <span>{(result.democratPercent + result.yourPercent).toFixed(1)}%</span>
                    </div>
                    <div className="text-center text-darkred/80 italic mt-1">
                      Your voters split the progressive vote
                    </div>
                  </div>
                </div>
              )}

              <div className={`mt-2 text-center text-sm font-display font-bold
                ${result.fusionWin ? 'text-forest' :
                  result.winner === 'player' ? 'text-brass' :
                  result.spoiled ? 'text-darkred' :
                  'text-walnut-light'}`}>
                {result.fusionWin ? '\u2713 Fusion Victory!' :
                 result.winner === 'player' ? '\u2713 You Win!' :
                 result.spoiled ? '\u2717 Vote Split \u2014 Republicans Win' :
                 result.winner === 'democrat' ? 'Democrats Win' :
                 'Republicans Win'}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
