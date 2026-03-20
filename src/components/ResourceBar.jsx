export default function ResourceBar({ resources, allyRelationship, fundPool, partyName }) {
  const { funds, morale, visibility } = resources;

  const allyStatus = allyRelationship >= 60 ? 'Healthy'
    : allyRelationship >= 30 ? 'Strained'
    : 'Hostile';
  const allyColor = allyRelationship >= 60 ? 'text-forest'
    : allyRelationship >= 30 ? 'text-brass-dark'
    : 'text-darkred';

  return (
    <div className="resource-bar">
      <div className="flex items-center justify-between gap-2 max-w-lg mx-auto w-full px-4">
        {/* Funds */}
        <div className="flex items-center gap-1.5 flex-1">
          <span className="text-xs">{'$'}</span>
          <div className="flex-1">
            <div className="resource-meter">
              <div
                className="resource-meter-fill bg-brass"
                style={{ width: `${Math.min(100, funds)}%` }}
              />
            </div>
          </div>
          <span className="font-ticker text-xs text-walnut-light/80 w-6 text-right">{funds}</span>
        </div>

        {/* Morale */}
        <div className="flex items-center gap-1.5 flex-1">
          <span className="text-xs">{'⚡'}</span>
          <div className="flex-1">
            <div className="resource-meter">
              <div
                className="resource-meter-fill bg-forest"
                style={{ width: `${Math.min(100, morale)}%` }}
              />
            </div>
          </div>
          <span className="font-ticker text-xs text-walnut-light/80 w-6 text-right">{morale}</span>
        </div>

        {/* Visibility */}
        <div className="flex items-center gap-1.5 flex-1">
          <span className="text-xs">{'👁'}</span>
          <div className="flex-1">
            <div className="resource-meter">
              <div
                className="resource-meter-fill bg-burgundy"
                style={{ width: `${Math.min(100, visibility)}%` }}
              />
            </div>
          </div>
          <span className="font-ticker text-xs text-walnut-light/80 w-6 text-right">{visibility}</span>
        </div>

        {/* Ally status */}
        <div className="flex items-center gap-1 border-l border-walnut/10 pl-2">
          <span className={`font-ticker text-xs ${allyColor}`}>{allyStatus}</span>
        </div>
      </div>
    </div>
  );
}
