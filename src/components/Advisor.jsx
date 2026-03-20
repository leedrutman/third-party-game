import { useState } from 'react';

export default function Advisor({ line, icon = '\u{1F3A9}' }) {
  const [expanded, setExpanded] = useState(false);

  if (!line) return null;

  return (
    <div className="fixed top-4 right-4 z-40">
      {expanded ? (
        <div className="card-gilded p-4 max-w-xs shadow-lg">
          <div className="flex items-start gap-3">
            <div className="text-2xl flex-shrink-0">{icon}</div>
            <div>
              <div className="font-display text-xs font-bold text-brass-dark mb-1 uppercase tracking-wider">
                Your Advisor
              </div>
              <div className="font-body text-sm text-walnut leading-relaxed italic">
                "{line}"
              </div>
            </div>
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="mt-2 text-xs text-walnut-light/60 hover:text-walnut-light"
          >
            Dismiss
          </button>
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          className="w-12 h-12 rounded-full card-gilded flex items-center justify-center
                     text-xl shadow-md hover:shadow-lg transition-shadow"
        >
          {icon}
        </button>
      )}
    </div>
  );
}
