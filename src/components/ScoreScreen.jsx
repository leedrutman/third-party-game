export default function ScoreScreen({ act, score, party, onContinue }) {
  return (
    <div className="screen-enter min-h-dvh flex flex-col px-5 py-8 paper-texture">
      <div className="text-center mb-6">
        <div className="font-ticker text-xs tracking-[0.2em] text-brass-dark uppercase mb-2">
          End of Act {act === 1 ? 'I' : act === 2 ? 'II' : 'III'}
        </div>
        <h1 className="font-display text-2xl font-bold text-walnut">
          {act === 1 ? 'The Fusion Gambit' : act === 2 ? "The Spoiler's Trap" : "The People's Assembly"}
        </h1>
        <div className="divider-ornate text-brass text-xs">&#x2726;</div>
      </div>

      <div className="max-w-md mx-auto w-full">
        {/* Party header */}
        <div className="card-gilded p-4 text-center mb-4">
          <span className="text-2xl mr-2">{party?.mascot?.icon}</span>
          <span className="font-display font-bold text-walnut">{party?.name}</span>
        </div>

        {/* Score card */}
        <div className="card-gilded p-5">
          {act === 1 && <Act1Score score={score} />}
          {act === 2 && <Act2Score score={score} />}
          {act === 3 && <Act3Score score={score} />}
        </div>

        {/* Flavor text */}
        <div className="mt-4 text-center">
          <p className="font-body text-sm text-walnut-light italic">
            {act === 1 && (score?.billPassed
              ? "Your bill is law. Fusion made it possible. But the major parties are coming for it."
              : "Fusion gave you a foothold. But the major parties are watching.")}
            {act === 2 && "Without fusion, the math is impossible. The system won."}
            {act === 3 && "Same party. Same issues. Different rules. Different outcome."}
          </p>
        </div>
      </div>

      <div className="mt-8 max-w-md mx-auto w-full">
        <button onClick={onContinue} className="btn-brass w-full text-lg">
          {act === 1 ? 'Continue to Act II' : act === 2 ? 'Continue to Act III' : 'The Dashboard of Reckoning'}
        </button>
      </div>
    </div>
  );
}

function ScoreLine({ label, value, color }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-walnut/10 last:border-0">
      <span className="font-body text-sm text-walnut-light">{label}</span>
      <span className={`font-display font-bold text-sm ${color || 'text-walnut'}`}>{value}</span>
    </div>
  );
}

function Act1Score({ score }) {
  if (!score) return null;

  // Bill progress display
  const stageLabels = ['Not Introduced', 'Introduced', 'Through Committee', 'PASSED INTO LAW'];
  const billStage = score.billStage || 0;
  const billLabel = stageLabels[billStage] || `Stage ${billStage}/3`;
  const billColor = score.billPassed ? 'text-forest' : billStage > 0 ? 'text-brass-dark' : 'text-darkred';

  return (
    <div>
      <ScoreLine label="Fusion Victories (3 elections)" value={score.totalFusionWins} color={score.totalFusionWins > 0 ? 'text-forest' : 'text-walnut-light'} />
      <ScoreLine label="Total Votes on Your Line" value={score.totalVotes.toLocaleString()} />
      <ScoreLine label={score.billShortName || 'Flagship Bill'} value={billLabel} color={billColor} />
      {/* Bill progress bar */}
      <div className="py-2 border-b border-walnut/10">
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex-1">
              <div className={`h-2 rounded-full ${i < billStage ? 'bg-forest' : 'bg-walnut/15'}`} />
            </div>
          ))}
        </div>
      </div>
      <ScoreLine label="Party Visibility" value={score.visibility} />
      <ScoreLine label="Ally Relations" value={score.relationship} color={score.relationship === 'Healthy' ? 'text-forest' : score.relationship === 'Strained' ? 'text-brass-dark' : 'text-darkred'} />
      {score.betrayalOccurred && (
        <ScoreLine label="Betrayed by Ally" value="Yes" color="text-darkred" />
      )}
    </div>
  );
}

function Act2Score({ score }) {
  if (!score) return null;
  return (
    <div>
      <ScoreLine label="Districts Won" value={score.districtsWon} color="text-darkred" />
      <ScoreLine label="Races Spoiled" value={score.spoiledRaces} color={score.spoiledRaces > 0 ? 'text-darkred' : 'text-walnut-light'} />
      <ScoreLine label="Policy Wins" value={score.policyWins} color="text-darkred" />
      <ScoreLine label="Party Status" value={score.partySurvival} color="text-darkred" />
      <ScoreLine label="Voter Satisfaction" value={score.voterSatisfaction} color="text-darkred" />
    </div>
  );
}

function Act3Score({ score }) {
  if (!score) return null;
  return (
    <div>
      <ScoreLine label="Seats Won" value={score.seatsWon} color="text-forest" />
      <ScoreLine label="In Government" value={score.inGovernment ? 'Yes' : 'No'} color={score.inGovernment ? 'text-forest' : 'text-brass-dark'} />
      <ScoreLine label="Policy Enacted" value={score.policyEnacted} color={score.policyEnacted === 'Full' ? 'text-forest' : score.policyEnacted === 'Partial' ? 'text-brass-dark' : 'text-darkred'} />
      <ScoreLine label="Coalition Stability" value={score.coalitionStability} color={score.coalitionStability === 'Stable' ? 'text-forest' : 'text-brass-dark'} />
      <ScoreLine label="Voter Satisfaction" value={score.voterSatisfaction} color="text-forest" />
    </div>
  );
}
