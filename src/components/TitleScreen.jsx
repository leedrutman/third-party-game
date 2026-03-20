export default function TitleScreen({ onStart }) {
  return (
    <div className="screen-enter min-h-dvh flex flex-col items-center justify-center px-6 py-12 paper-texture">
      {/* Decorative top border */}
      <div className="w-full max-w-sm mb-8">
        <div className="h-px bg-gradient-to-r from-transparent via-brass to-transparent" />
        <div className="h-0.5 mt-0.5 bg-gradient-to-r from-transparent via-brass/50 to-transparent" />
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <div className="font-ticker text-xs tracking-[0.3em] text-brass-dark uppercase mb-3">
          Presented for Your Edification
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-walnut leading-tight mb-2">
          THIRD PARTY
        </h1>
        <div className="divider-ornate text-brass text-sm">&#x2726;</div>
        <h2 className="font-display text-lg sm:text-xl italic text-walnut-light">
          An Electoral Survival Game
        </h2>
      </div>

      {/* Flavor text */}
      <div className="max-w-sm text-center mb-10">
        <p className="font-body text-sm text-walnut-light leading-relaxed">
          The year is 1892. You are the leader of a new political party.
          You have issues that matter and voters who believe in you.
        </p>
        <p className="font-body text-sm text-walnut-light/70 leading-relaxed mt-3">
          Can you use the rules of democracy to change who gets to play?
        </p>
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        className="btn-brass text-lg px-8 py-4 font-display tracking-wide"
      >
        Found Your Party
      </button>

      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="font-ticker text-xs text-walnut-light/40">
          A game about how the rules of democracy determine who gets to play
        </p>
        <p className="font-ticker text-xs text-walnut-light/30 mt-1">
          ~15 minutes &bull; Mobile-friendly &bull; No sign-up required
        </p>
      </div>

      {/* Decorative bottom border */}
      <div className="w-full max-w-sm mt-8">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-brass/50 to-transparent" />
        <div className="h-px mt-0.5 bg-gradient-to-r from-transparent via-brass to-transparent" />
      </div>
    </div>
  );
}
