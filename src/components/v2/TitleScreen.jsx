import CandidatePortrait from '../CandidatePortrait.jsx';
import { BLACKWOOD } from '../../engine/tycoon.js';
import { VEX } from '../../engine/vex.js';

export default function TitleScreen({ onStart, era = 'historical', onSetEra }) {
  const isModern = era === 'modern';

  return (
    <div className="screen-enter min-h-dvh flex flex-col items-center justify-center px-6 py-12 paper-texture">
      {/* Decorative header */}
      <div className="w-full max-w-sm mb-6">
        <img
          src={isModern ? `${import.meta.env.BASE_URL}decorative/header_ballot_modern.jpg` : `${import.meta.env.BASE_URL}decorative/header_ballot_historical.jpg`}
          alt=""
          className="w-full h-auto object-contain opacity-80 rounded"
          loading="lazy"
        />
      </div>

      {/* Title */}
      <div className="text-center mb-6">
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

      {/* Era toggle */}
      {onSetEra && (
        <div className="flex gap-2 mb-6 max-w-sm mx-auto">
          <button
            onClick={() => onSetEra('historical')}
            className={`flex-1 py-2 px-4 rounded-lg font-ticker text-sm tracking-wider transition-all border-2 ${
              !isModern
                ? 'border-brass bg-brass/15 text-walnut font-bold'
                : 'border-walnut/15 bg-transparent text-walnut-light hover:border-brass/50'
            }`}
          >
            1892
          </button>
          <button
            onClick={() => onSetEra('modern')}
            className={`flex-1 py-2 px-4 rounded-lg font-ticker text-sm tracking-wider transition-all border-2 ${
              isModern
                ? 'border-brass bg-brass/15 text-walnut font-bold'
                : 'border-walnut/15 bg-transparent text-walnut-light hover:border-brass/50'
            }`}
          >
            Today
          </button>
        </div>
      )}

      {/* The Problem: Doom Loop */}
      <div className="max-w-sm text-center mb-4">
        <div className="card-gilded p-4">
          <div className="font-ticker text-xs text-darkred uppercase tracking-wider mb-2">
            The Two-Party Doom Loop
          </div>
          {isModern ? (
            <>
              <p className="font-body text-sm text-walnut leading-relaxed">
                It&apos;s 2026. Voters are fed up with both parties but feel trapped.
                Vote third party and you &ldquo;waste&rdquo; your vote. Pick the lesser
                of two disasters and the doom loop continues.
              </p>
              <p className="font-body text-sm text-walnut-light leading-relaxed mt-2">
                Your state just legalized fusion voting &mdash; but the tech oligarchs
                and mega-donors who profit from the two-party duopoly want it repealed
                before anyone proves it works.
              </p>
            </>
          ) : (
            <>
              <p className="font-body text-sm text-walnut leading-relaxed">
                The year is 1892. The railroad tycoons own both parties.
                Voters hate the corruption, but feel trapped &mdash; vote for the
                lesser evil, or &ldquo;waste&rdquo; your vote on someone you believe in.
              </p>
              <p className="font-body text-sm text-walnut-light leading-relaxed mt-2">
                Third parties rise and die. The same two machines keep winning.
                The tycoons keep paying. The people keep losing.
              </p>
            </>
          )}
        </div>
      </div>

      {/* The Enemy */}
      <div className="max-w-sm text-center mb-4">
        <div className="card-gilded p-4 border-l-4 border-darkred">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-14 h-14 flex-shrink-0 rounded-full overflow-hidden border-2 border-darkred/50 shadow-md">
              <CandidatePortrait id={isModern ? 'vex' : 'blackwood'} traits={isModern ? VEX.portraitTraits : BLACKWOOD.portraitTraits} size={56} era={era} />
            </div>
            <div className="text-left">
              <div className="font-ticker text-xs text-darkred uppercase tracking-wider">
                Your Adversary
              </div>
              <div className="font-display text-base font-bold text-walnut">
                {isModern ? 'Orion Vex' : 'Cornelius Blackwood III'}
              </div>
              <div className="font-ticker text-[10px] text-walnut-light/60">
                {isModern ? 'Tech Oligarch \u2022 Platform Owner' : 'Railroad Tycoon \u2022 Political Kingpin'}
              </div>
            </div>
          </div>
          {isModern ? (
            <>
              <p className="font-body text-sm text-walnut leading-relaxed">
                He owns the biggest social media platform in the country. Both parties
                court his ad dollars and data. Polarization is his business model.
              </p>
              <div className="mt-2 p-2 bg-darkred/5 rounded border border-darkred/15">
                <p className="font-body text-sm text-darkred italic leading-relaxed">
                  &ldquo;Fusion voting is a coordination hack for low-status political actors.
                  The market has already decided on two parties.&rdquo;
                </p>
              </div>
              <p className="font-body text-xs text-walnut-light/70 leading-relaxed mt-2">
                He&apos;ll dismiss you at first. Then fund opposition research.
                Then buy your allies&apos; silence. And if you&apos;re still standing,
                he&apos;ll lobby to repeal fusion before your first win even counts.
              </p>
            </>
          ) : (
            <>
              <p className="font-body text-sm text-walnut leading-relaxed">
                He owns the railroad, the legislature, the party machines, and
                most of the newspapers. Both parties answer to him.
                He likes things exactly the way they are.
              </p>
              <div className="mt-2 p-2 bg-darkred/5 rounded border border-darkred/15">
                <p className="font-body text-sm text-darkred italic leading-relaxed">
                  &ldquo;Two parties is the perfect number. One for the people
                  to argue about, and one for me to control. A third party?
                  That&apos;s one too many.&rdquo;
                </p>
              </div>
              <p className="font-body text-xs text-walnut-light/70 leading-relaxed mt-2">
                He&apos;ll ignore you at first. Then he&apos;ll pressure your allies.
                Then buy your candidates. Then smear your name in every newspaper
                he owns. And if you&apos;re still standing, he&apos;ll try to ban
                your most powerful tool entirely.
              </p>
            </>
          )}
        </div>
      </div>

      {/* The Solution: Fusion */}
      <div className="max-w-sm text-center mb-8">
        <div className="card-gilded p-4 border-l-4 border-forest">
          <div className="font-ticker text-xs text-forest uppercase tracking-wider mb-2">
            How You Break It
          </div>
          <p className="font-body text-sm text-walnut leading-relaxed font-bold">
            Fusion voting. Cross-endorse a friendly major-party candidate, and
            every ballot cast on YOUR line still counts.
          </p>
          <p className="font-body text-xs text-walnut-light/80 leading-relaxed mt-2">
            Your 3&ndash;5% of voters can&apos;t win alone. But in a tight race,
            those votes tip the balance. You become the kingmaker &mdash; and
            kingmakers get to make demands.
          </p>
        </div>
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
          {isModern
            ? 'Can you prove fusion works before Vex gets it repealed?'
            : 'Can you break the two-party doom loop before Blackwood bans your tool?'}
        </p>
        <p className="font-ticker text-xs text-walnut-light/30 mt-1">
          ~12 minutes &bull; Mobile-friendly &bull; No sign-up required
        </p>
        <p className="font-ticker text-xs text-walnut-light/40 mt-2">
          <a href="https://centerforballotfreedom.org/about-fusion-voting/"
             target="_blank" rel="noopener noreferrer"
             className="underline hover:text-brass transition-colors">
            Learn more about fusion voting
          </a>
        </p>
      </div>

      {/* Decorative bunting */}
      <div className="w-full max-w-sm mt-8">
        <img
          src={isModern ? `${import.meta.env.BASE_URL}decorative/bunting_modern.png` : `${import.meta.env.BASE_URL}decorative/bunting_historical.png`}
          alt=""
          className="w-full h-auto max-h-20 object-contain opacity-60"
          loading="lazy"
        />
      </div>
    </div>
  );
}
