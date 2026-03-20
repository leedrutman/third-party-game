export function AntiFusionTransition({ onContinue }) {
  return (
    <div className="screen-enter min-h-dvh flex flex-col items-center justify-center px-6 py-12 bg-walnut">
      <div className="max-w-sm text-center">
        <div className="telegraph-text text-cream text-lg mb-8">
          &#x26A1; TELEGRAPH DISPATCH &mdash; EXTRA EDITION &#x26A1;
        </div>

        <div className="telegraph-text text-cream/90 text-base leading-loose space-y-4">
          <p className="font-bold text-brass-light text-xl">
            TWELVE STATE LEGISLATURES VOTE TO BAN FUSION VOTING ON BALLOTS
          </p>

          <p className="text-cream/70">
            "Necessary reform to prevent voter confusion," say Republican and Democratic leaders alike.
          </p>

          <p className="text-cream/70">
            Critics call it what it is: the elimination of the only tool that made third parties viable.
          </p>
        </div>

        <div className="my-8 h-px bg-gradient-to-r from-transparent via-brass/50 to-transparent" />

        <div className="telegraph-text text-brass-light italic text-lg mb-8">
          What will you do now?
        </div>

        <div className="card-gilded bg-cream/10 px-4 py-3 mb-8 inline-block">
          <span className="font-ticker text-xs text-cream/50">
            This is historically accurate. Between 1896 and 1910, fusion was banned in most states by major party legislators.
          </span>
        </div>

        <div>
          <button onClick={onContinue} className="btn-brass text-lg px-8 py-4">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export function CounterfactualTransition({ onContinue }) {
  return (
    <div className="screen-enter min-h-dvh flex flex-col items-center justify-center px-6 py-12 paper-texture">
      <div className="max-w-sm text-center">
        <div className="font-display text-walnut-light italic text-xl mb-8 leading-relaxed">
          What if they hadn't banned fusion?
        </div>

        <div className="font-body text-walnut text-base leading-relaxed space-y-4 mb-8">
          <p>
            What if, instead, America had adopted proportional representation &mdash; a system already spreading across Europe?
          </p>
          <p>
            What kind of democracy might we have built?
          </p>
        </div>

        <div className="divider-ornate text-brass text-sm">&#x2726;</div>

        <div className="font-display text-2xl font-bold text-walnut mb-8">
          Let's find out.
        </div>

        <div>
          <button onClick={onContinue} className="btn-brass text-lg px-8 py-4">
            Enter the Counterfactual
          </button>
        </div>
      </div>
    </div>
  );
}
