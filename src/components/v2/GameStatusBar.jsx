// Persistent progress bar + threat meter during elections.
// Left: round dots. Center: wins + milestone. Right: Blackwood threat.

import { getCurrentMilestone } from '../../data/v2/demands.js';

export default function GameStatusBar({ round, momentum, tycoonThreat, winsCount, milestonePoints }) {
  const milestone = getCurrentMilestone(milestonePoints || 0);

  return (
    <div className="resource-bar">
      <div className="max-w-md mx-auto px-4 flex items-center justify-between gap-3">
        {/* Round indicator */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map(r => (
            <div
              key={r}
              className={`w-2.5 h-2.5 rounded-full border transition-all ${
                r < round
                  ? 'bg-brass border-brass' // completed
                  : r === round
                    ? 'bg-brass/50 border-brass ring-2 ring-brass/30' // current
                    : 'bg-transparent border-walnut/20' // future
              }`}
            />
          ))}
          <span className="font-ticker text-xs text-walnut-light/60 ml-1">
            {round}/5
          </span>
        </div>

        {/* Wins + Milestone */}
        <div className="flex items-center gap-1">
          <span className="font-ticker text-xs text-walnut-light/50">Wins:</span>
          <span className="font-ticker text-xs font-bold text-brass">{winsCount}</span>
          <span className="font-ticker text-xs text-walnut-light/30 mx-1">&bull;</span>
          <span className="font-ticker text-[10px] text-brass-dark font-bold truncate max-w-[80px]">
            {milestone.label}
          </span>
        </div>

        {/* Threat meter */}
        <div className="flex items-center gap-1">
          <span className="font-ticker text-xs text-walnut-light/50">Threat:</span>
          <div className="w-12 h-1.5 bg-walnut/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${tycoonThreat}%`,
                backgroundColor: tycoonThreat > 70 ? '#8B1A1A' : tycoonThreat > 40 ? '#B8860B' : '#4A3228',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
