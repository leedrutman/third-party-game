import { useRef, useCallback } from 'react';
import Hemicycle from './Hemicycle.jsx';

export default function Dashboard({ state, onPlayAgain }) {
  const { party, act1, act2, act3 } = state;
  const canvasRef = useRef(null);

  const score1 = act1.score || {};
  const score2 = act2.score || {};
  const score3 = act3.score || {};

  // Influence bars (visual width percentage)
  const fusionInfluence = Math.min(100, (score1.totalFusionWins || 0) * 12 + (score1.totalVotes || 0) / 30);
  const fptpInfluence = Math.min(100, 8);
  const prInfluence = Math.min(100, (score3.seatsWon || 0) * 5);

  const billPassed = score1.billPassed || false;
  const billName = score1.billShortName || 'the bill';
  const partyLabel = (party?.name || '').startsWith('The ') ? party.name : `My ${party?.name}`;
  const shareText = `I played THIRD PARTY. ${partyLabel} ${party?.mascot?.icon} won ${score1.totalFusionWins || 0} fusion victories across 3 elections, ${billPassed ? `passed ${billName} into law` : `couldn't pass ${billName}`}, won 0 seats under FPTP, and governed with ${score3.seatsWon || 0} seats under PR. Same party. Same voters. Different rules.`;

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Copied to clipboard!');
    }
  }, [shareText]);

  return (
    <div className="screen-enter min-h-dvh flex flex-col px-4 py-8 paper-texture">
      <div className="text-center mb-6">
        <div className="font-ticker text-xs tracking-[0.3em] text-brass-dark uppercase mb-2">
          The Final Reckoning
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-walnut">
          THE DASHBOARD OF RECKONING
        </h1>
        <p className="font-display text-sm italic text-walnut-light mt-1">
          Same Party. Same Issues. Three Systems.
        </p>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>

        {/* Party info */}
        <div className="inline-block card-gilded px-4 py-2 mb-4">
          <span className="text-xl mr-2">{party?.mascot?.icon}</span>
          <span className="font-display font-bold text-walnut">{party?.name}</span>
        </div>
      </div>

      {/* Three-column comparison */}
      <div className="max-w-lg mx-auto w-full">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {/* Fusion Column */}
          <div className="card-gilded p-3 text-center">
            <div className="text-2xl mb-1">{'🤝'}</div>
            <h3 className="font-display text-sm font-bold text-walnut">FUSION</h3>
            <div className="font-ticker text-xs text-walnut-light/60 mb-3">1892&ndash;1900</div>

            <div className="space-y-3 text-left">
              <DashRow label="Victories" value={`${score1.totalFusionWins || 0}`} color="text-brass-dark" />
              <DashBar label="Influence" pct={fusionInfluence} color="#B8860B" />
              <DashRow label={billName} value={billPassed ? 'PASSED' : `Stage ${score1.billStage || 0}/3`} color={billPassed ? 'text-forest' : 'text-brass-dark'} />
              <DashRow label="Party" value="Viable" color="text-forest" />
              <DashQuote text={`"We matter"`} />
            </div>
          </div>

          {/* FPTP Column */}
          <div className="card-gilded p-3 text-center border-darkred/20">
            <div className="text-2xl mb-1">{'💀'}</div>
            <h3 className="font-display text-sm font-bold text-walnut">FPTP</h3>
            <div className="font-ticker text-xs text-walnut-light/60 mb-3">1904&ndash;1912</div>

            <div className="space-y-3 text-left">
              <DashRow label="Seats" value="0" color="text-darkred" />
              <DashBar label="Influence" pct={fptpInfluence} color="#8B1A1A" />
              <DashRow label="Policy" value="None" color="text-darkred" />
              <DashRow label="Party" value={score2.partySurvival || 'Dead'} color="text-darkred" />
              <DashQuote text={`"Why bother?"`} />
            </div>
          </div>

          {/* PR Column */}
          <div className="card-gilded p-3 text-center border-forest/20">
            <div className="text-2xl mb-1">{'🏛️'}</div>
            <h3 className="font-display text-sm font-bold text-walnut">PR</h3>
            <div className="font-ticker text-xs text-walnut-light/60 mb-3">Counterfactual</div>

            <div className="space-y-3 text-left">
              <DashRow label="Seats" value={`${score3.seatsWon || 0}`} color="text-forest" />
              <DashBar label="Influence" pct={prInfluence} color="#2D5F2D" />
              <DashRow label="Policy" value={score3.policyEnacted || 'None'} color={score3.policyEnacted === 'Full' ? 'text-forest' : 'text-brass-dark'} />
              <DashRow label="Party" value="Established" color="text-forest" />
              <DashQuote text={`"I'm represented"`} />
            </div>
          </div>
        </div>

        {/* Hemicycle for PR */}
        {act3.seatResults && (
          <div className="mt-6">
            <Hemicycle seatResults={act3.seatResults} animate={false} />
          </div>
        )}

        {/* Tagline */}
        <div className="mt-8 text-center">
          <div className="h-px bg-gradient-to-r from-transparent via-brass to-transparent mb-6" />
          <p className="font-display text-lg sm:text-xl font-bold text-walnut italic">
            "The voters didn't change. The rules did."
          </p>
          <div className="h-px bg-gradient-to-r from-transparent via-brass to-transparent mt-6" />
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <button onClick={onPlayAgain} className="btn-brass w-full text-lg">
            {'🔄'} Play Again
          </button>
          <button
            onClick={handleShare}
            className="btn-option text-center w-full"
          >
            <span className="font-display font-bold text-walnut">{'📤'} Share Your Result</span>
          </button>
        </div>

        {/* Share preview */}
        <div className="mt-4 card-gilded p-4">
          <p className="font-body text-xs text-walnut-light leading-relaxed">
            {shareText}
          </p>
        </div>
      </div>
    </div>
  );
}

function DashRow({ label, value, color = 'text-walnut' }) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-body text-xs text-walnut-light">{label}</span>
      <span className={`font-display text-xs font-bold ${color}`}>{value}</span>
    </div>
  );
}

function DashBar({ label, pct, color }) {
  return (
    <div>
      <span className="font-body text-xs text-walnut-light">{label}</span>
      <div className="support-meter mt-1">
        <div
          className="support-meter-fill"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function DashQuote({ text }) {
  return (
    <div className="pt-1">
      <span className="font-body text-xs italic text-walnut-light/60">{text}</span>
    </div>
  );
}
