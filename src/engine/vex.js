// Orion Vex — Tech Oligarch & Primary Antagonist (Modern Era)
// Owns a social media platform. Profits from polarization and the two-party duopoly.
// Peter Thiel + Marc Andreessen energy. Snarky tech-bro voice.
// The state has JUST legalized fusion voting. Vex wants to repeal it before the player proves it works.

export const VEX = {
  id: 'vex',
  name: 'Orion Vex',
  title: 'Tech Oligarch',
  portraitTraits: {
    faceShape: 'angular',
    hairStyle: 'slicked',
    hairColor: '#1C1C1C',
    facialHair: 'none',
    hat: null,
    collar: 'high',
    glasses: true,
    sunglasses: true,
    skin: '#F0DCC8',
  },
};

// Vex's escalation across 5 rounds
export const VEX_STAGES = [
  {
    round: 1,
    stage: 'dismissing',
    label: 'Dismissing',
    headline: 'Tech Mogul Shrugs Off New Fusion Party',
    description: 'Vex hasn\'t taken your party seriously. To him, you\'re a rounding error — another failed political startup.',
    vexQuote: '"Fusion voting is a coordination hack for low-status political actors. The market has already decided on two parties."',
    threatLevel: 10,
    mechanicalEffect: null,
  },
  {
    round: 2,
    stage: 'noticing',
    label: 'Taking Notice',
    headline: 'Vex Platform Tweaks Algorithm After Reform Party Gains',
    description: 'Your party\'s engagement metrics caught Vex\'s attention. He\'s suppressing your reach algorithmically and pressuring candidates to distance themselves.',
    vexQuote: '"Interesting. Their engagement metrics are actually... non-trivial. Tell my policy team to look into this fusion thing."',
    threatLevel: 30,
    mechanicalEffect: 'pressure_ally', // Algorithmic suppression + candidate pressure
  },
  {
    round: 3,
    stage: 'mobilizing',
    label: 'Mobilizing',
    headline: 'Super PAC "Committee for Simple Ballots" Launches with $2M',
    description: 'Vex\'s money is flooding in through a super PAC. A candidate who was friendly to fusion just flipped after a private meeting at Vex\'s compound.',
    vexQuote: '"I just wired $2M to the Committee for Simple Ballots. Sometimes democracy needs a little... venture capital."',
    threatLevel: 55,
    mechanicalEffect: 'buy_candidate', // A friendly candidate flips
  },
  {
    round: 4,
    stage: 'disinformation',
    label: 'Disinformation Campaign',
    headline: '"Fusion Voting Confuses Voters," Claims Viral Campaign',
    description: 'Vex\'s platform is amplifying a coordinated disinformation campaign against fusion voting. A/B tested attack ads are everywhere.',
    vexQuote: '"Our A/B testing shows \'fusion voting confuses seniors\' performs 3x better than \'fusion voting is dangerous.\' Ship it."',
    threatLevel: 75,
    mechanicalEffect: 'smear', // Player base support drops
  },
  {
    round: 5,
    stage: 'repealing',
    label: 'Repeal Vote',
    headline: '"Ballot Clarity Act" Heads to Floor Vote',
    description: 'Vex has the votes to repeal fusion voting. The "Ballot Clarity Act" passes committee tomorrow. This is your last chance to prove fusion works.',
    vexQuote: '"The Ballot Clarity Act passes committee tomorrow. Fusion voting was a fun experiment. Experiments end."',
    threatLevel: 95,
    mechanicalEffect: 'ban_threat', // Last chance framing
  },
];

// Get the Vex stage for a given round
export function getVexStage(round) {
  return VEX_STAGES[round - 1] || VEX_STAGES[0];
}

// Apply Vex effect to candidates for a given round
export function applyVexEffect(round, demCandidate, repCandidate) {
  const stage = getVexStage(round);
  const dem = { ...demCandidate };
  const rep = { ...repCandidate };

  switch (stage.mechanicalEffect) {
    case 'pressure_ally':
      // Algorithmic suppression + direct pressure on the friendlier candidate
      if (dem.friendliness > rep.friendliness) {
        dem.friendliness = Math.max(0.15, dem.friendliness - 0.3);
        dem.pressured = true;
        dem.pressureNote = 'Vex\'s platform just throttled their campaign posts to zero reach. "Algorithmic adjustment," his spokesman called it.';
      } else {
        rep.friendliness = Math.max(0.15, rep.friendliness - 0.3);
        rep.pressured = true;
        rep.pressureNote = 'Vex\'s platform just throttled their campaign posts to zero reach. "Algorithmic adjustment," his spokesman called it.';
      }
      break;

    case 'buy_candidate':
      // Super PAC money flips the originally friendlier candidate
      if (dem.baseFriendliness > rep.baseFriendliness) {
        dem.friendliness = 0.05;
        dem.boughtByVex = true;
        dem.pressureNote = `${dem.name} took a meeting at Vex's compound. They came back a different candidate.`;
      } else {
        rep.friendliness = 0.05;
        rep.boughtByVex = true;
        rep.pressureNote = `${rep.name} took a meeting at Vex's compound. They came back a different candidate.`;
      }
      break;

    case 'smear':
      // Disinformation campaign — doesn't change candidates, changes player's base (handled in election math)
      break;

    case 'ban_threat':
      // Repeal vote — narrative pressure, doesn't change candidates directly
      break;

    default:
      break;
  }

  return { dem, rep };
}

// Calculate momentum penalty from disinformation campaign (round 4+)
// With a 2-5% base, losing 2-3% is devastating
export function getVexSmearPenalty(round) {
  if (round >= 5) return 3.0;  // -3% from disinfo + repeal pressure (brutal)
  if (round >= 4) return 2.0;  // -2% from platform-amplified disinformation (significant hit)
  if (round >= 3) return 0.5;  // -0.5% from Vex pressure (minor but noticeable)
  return 0;
}

// Apply Vex influence to the available race pool (before player picks)
// Statewide races have more Vex entanglement
export function applyVexToRacePool(round, races) {
  if (round <= 2) return races; // No pool-level interference early

  // races is { stateLeg, statewide }
  const result = {};
  for (const [category, race] of Object.entries(races)) {
    const modified = {
      ...race,
      dem: { ...race.dem },
      rep: { ...race.rep },
    };

    // Round 3+: statewide races have a candidate under Vex pressure
    if (round >= 3 && category === 'statewide') {
      if (modified.dem.friendliness > modified.rep.friendliness && !modified.dem.boughtByVex) {
        modified.dem.friendliness = Math.max(0.15, modified.dem.friendliness - 0.15);
        modified.dem.vexPressure = true;
      } else if (!modified.rep.boughtByVex) {
        modified.rep.friendliness = Math.max(0.15, modified.rep.friendliness - 0.1);
        modified.rep.vexPressure = true;
      }
    }

    // Round 4+: even state leg races feel the squeeze
    if (round >= 4 && category === 'state_leg') {
      if (modified.dem.friendliness > 0.5 && !modified.dem.vexPressure && !modified.dem.boughtByVex) {
        modified.dem.friendliness = Math.max(0.3, modified.dem.friendliness - 0.1);
        modified.dem.vexPressure = true;
      }
    }

    result[category] = modified;
  }
  return result;
}

// Vex's reaction to election results — snarky tech-bro energy
export function getVexReaction(round, playerWon, choice) {
  const stage = getVexStage(round);

  if (playerWon && round === 1) {
    return '"Lol. Okay. One data point isn\'t a trend. Wake me when they have product-market fit."';
  }
  if (playerWon && round === 2) {
    return '"Two wins is a pattern, not a coincidence. Someone get me their growth metrics. And their donors."';
  }
  if (playerWon && round === 3) {
    return '"They won DESPITE the super PAC spend? That\'s... not supposed to happen. Time to pivot our strategy."';
  }
  if (playerWon && round === 4) {
    return '"The disinformation campaign had a negative ROI? Fire the consultants. Actually, fire everyone. I\'ll handle this myself."';
  }
  if (playerWon && round === 5) {
    return '"...They iterated faster than we could suppress them. Get my lawyers. And my lobbyists. And book me a flight to D.C."';
  }

  // Player lost
  if (!playerWon && round <= 2) {
    return '"Called it. Third parties are a solved problem. The Nash equilibrium is two players. Always has been."';
  }
  if (!playerWon && round === 3) {
    return '"Venture capital beats grassroots every time. That\'s not cynicism — it\'s market dynamics."';
  }
  if (!playerWon && round === 4) {
    return '"Turns out, controlling the information layer is more powerful than controlling the ballot. Who knew. Oh wait — I did."';
  }
  if (!playerWon && round === 5) {
    return '"Fusion voting has been sunset. The platform has been optimized. Democracy is back to its regularly scheduled programming."';
  }

  return '"The network effects of the two-party system are unbreakable. I\'m just the one who sees it clearly."';
}
