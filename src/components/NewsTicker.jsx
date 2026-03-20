import { useState, useEffect } from 'react';

export default function NewsTicker({ headlines, onDismiss }) {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!headlines || headlines.length === 0) return;
    setVisibleIndex(0);
    setVisible(true);
  }, [headlines]);

  useEffect(() => {
    if (!headlines || headlines.length === 0 || !visible) return;

    const timer = setTimeout(() => {
      if (visibleIndex < headlines.length - 1) {
        setVisibleIndex(i => i + 1);
      } else {
        setVisible(false);
        setTimeout(() => onDismiss?.(), 500);
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, [visibleIndex, visible, headlines, onDismiss]);

  if (!headlines || headlines.length === 0 || !visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <button
        onClick={() => { setVisible(false); onDismiss?.(); }}
        className="headline-toast card-gilded px-4 py-3 max-w-md w-full pointer-events-auto
                   text-left border-l-4 border-brass cursor-pointer"
      >
        <div className="font-ticker text-sm text-walnut-light leading-relaxed">
          {headlines[visibleIndex]}
        </div>
        <div className="mt-1 text-xs text-walnut-light/50 font-body">
          Tap to dismiss {headlines.length > 1 && `\u2022 ${visibleIndex + 1}/${headlines.length}`}
        </div>
      </button>
    </div>
  );
}
