// Cornelius Blackwood — Railroad Tycoon & Primary Antagonist
// Controls both major parties through campaign donations and backroom deals.
// Escalates across 5 rounds as the player's reform party threatens his grip.

export const BLACKWOOD = {
  id: 'blackwood',
  name: 'Cornelius Blackwood',
  title: 'Railroad Tycoon',
  portraitTraits: {
    faceShape: 'angular',
    hairStyle: 'parted',
    hairColor: '#8B8682',
    facialHair: 'sideburns',
    hat: 'tophat',
    collar: 'high',
    glasses: true,
    skin: '#E8D5B5',
  },
};

// Blackwood's escalation across 5 rounds
export const TYCOON_STAGES = [
  {
    round: 1,
    stage: 'ignoring',
    label: 'Unaware',
    headline: 'Business as Usual in the Capital',
    description: 'Blackwood hasn\'t noticed your party yet. He\'s busy consolidating rail lines and buying legislators.',
    blackwoodQuote: null,
    threatLevel: 10,
    mechanicalEffect: null,
  },
  {
    round: 2,
    stage: 'noticing',
    label: 'Taking Notice',
    headline: 'Railroad Interests Eye Reform Movement',
    description: 'Your party made noise. Blackwood is paying attention. He\'s pressuring candidates to distance themselves from your cause.',
    blackwoodQuote: '"These reform agitators are a nuisance. Remind our friends in the legislature who pays their campaign bills."',
    threatLevel: 30,
    mechanicalEffect: 'pressure_ally', // One candidate's friendliness drops
  },
  {
    round: 3,
    stage: 'buying',
    label: 'Buying Candidates',
    headline: 'Blackwood Money Floods State Races',
    description: 'Blackwood has bought a candidate outright. Your former ally now answers to the tycoon.',
    blackwoodQuote: '"Everyone has a price. I just found theirs."',
    threatLevel: 55,
    mechanicalEffect: 'buy_candidate', // One candidate flips hostile
  },
  {
    round: 4,
    stage: 'smearing',
    label: 'Smear Campaign',
    headline: '"Reform Party" Linked to Anarchists, Says Herald',
    description: 'Blackwood\'s newspapers are running smear campaigns against your party. Lies about anarchism, foreign influence, free love.',
    blackwoodQuote: '"If you can\'t beat them at the ballot box, beat them in the headlines."',
    threatLevel: 75,
    mechanicalEffect: 'smear', // Your base support drops
  },
  {
    round: 5,
    stage: 'banning',
    label: 'Anti-Fusion Bill',
    headline: 'Legislature to Vote on Fusion Ban',
    description: 'Blackwood is pushing a bill to ban fusion voting entirely. If you don\'t win big this round, your tool dies.',
    blackwoodQuote: '"Fusion voting is a loophole that breeds confusion. It\'s time to close it — permanently."',
    threatLevel: 95,
    mechanicalEffect: 'ban_threat', // Last chance framing
  },
];

// Get the tycoon stage for a given round
export function getTycoonStage(round) {
  return TYCOON_STAGES[round - 1] || TYCOON_STAGES[0];
}

// Apply tycoon effect to candidates for a given round
export function applyTycoonEffect(round, demCandidate, repCandidate) {
  const stage = getTycoonStage(round);
  const dem = { ...demCandidate };
  const rep = { ...repCandidate };

  switch (stage.mechanicalEffect) {
    case 'pressure_ally':
      // Pressure the friendlier candidate — reduce their friendliness significantly
      if (dem.friendliness > rep.friendliness) {
        dem.friendliness = Math.max(0.15, dem.friendliness - 0.3);
        dem.pressured = true;
        dem.pressureNote = 'Blackwood\'s associates paid a visit. "Nice campaign you have. Shame if something happened to your funding."';
      } else {
        rep.friendliness = Math.max(0.15, rep.friendliness - 0.3);
        rep.pressured = true;
        rep.pressureNote = 'Blackwood\'s associates paid a visit. "Nice campaign you have. Shame if something happened to your funding."';
      }
      break;

    case 'buy_candidate':
      // Buy the originally friendlier candidate — flip them hostile
      if (dem.baseFriendliness > rep.baseFriendliness) {
        dem.friendliness = 0.05;
        dem.boughtByBlackwood = true;
        dem.pressureNote = `${dem.name} took Blackwood's money. They've abandoned reform entirely.`;
      } else {
        rep.friendliness = 0.05;
        rep.boughtByBlackwood = true;
        rep.pressureNote = `${rep.name} took Blackwood's money. They've abandoned reform entirely.`;
      }
      break;

    case 'smear':
      // Smear campaign — doesn't change candidates, changes player's base (handled in election math)
      break;

    case 'ban_threat':
      // Anti-fusion bill — narrative pressure, doesn't change candidates directly
      break;

    default:
      break;
  }

  return { dem, rep };
}

// Calculate momentum penalty from smear campaign (round 4+)
// With a 2-5% base, losing 2-3% is devastating
export function getSmearPenalty(round) {
  if (round >= 5) return 3.0;  // -3% from smear + anti-fusion bill pressure (brutal)
  if (round >= 4) return 2.0;  // -2% from smear campaign (significant hit)
  if (round >= 3) return 0.5;  // -0.5% from Blackwood pressure (minor but noticeable)
  return 0;
}

// Apply tycoon influence to the available race pool (before player picks)
// Statewide races have more Blackwood entanglement
export function applyTycoonToRacePool(round, races) {
  if (round <= 2) return races; // No pool-level interference early

  // races is { stateLeg, statewide }
  const result = {};
  for (const [category, race] of Object.entries(races)) {
    const modified = {
      ...race,
      dem: { ...race.dem },
      rep: { ...race.rep },
    };

    // Round 3+: statewide races have a candidate under Blackwood pressure
    if (round >= 3 && category === 'statewide') {
      if (modified.dem.friendliness > modified.rep.friendliness && !modified.dem.boughtByBlackwood) {
        modified.dem.friendliness = Math.max(0.15, modified.dem.friendliness - 0.15);
        modified.dem.blackwoodPressure = true;
      } else if (!modified.rep.boughtByBlackwood) {
        modified.rep.friendliness = Math.max(0.15, modified.rep.friendliness - 0.1);
        modified.rep.blackwoodPressure = true;
      }
    }

    // Round 4+: even state leg races feel the squeeze
    if (round >= 4 && category === 'state_leg') {
      if (modified.dem.friendliness > 0.5 && !modified.dem.blackwoodPressure && !modified.dem.boughtByBlackwood) {
        modified.dem.friendliness = Math.max(0.3, modified.dem.friendliness - 0.1);
        modified.dem.blackwoodPressure = true;
      }
    }

    result[category] = modified;
  }
  return result;
}

// Blackwood's reaction to election results
export function getBlackwoodReaction(round, playerWon, choice) {
  const stage = getTycoonStage(round);

  if (playerWon && round === 1) {
    return '"A fluke. These reformers will burn out by next election."';
  }
  if (playerWon && round === 2) {
    return '"They won again? Get me the names of every legislator they talked to."';
  }
  if (playerWon && round === 3) {
    return '"This is unacceptable. Double our contributions. Triple them."';
  }
  if (playerWon && round === 4) {
    return '"The smear campaign failed? Fine. We\'ll just change the rules."';
  }
  if (playerWon && round === 5) {
    return '"...They actually did it. Get my lawyers on the phone."';
  }

  // Player lost
  if (!playerWon && round <= 2) {
    return '"See? The system works just fine as it is."';
  }
  if (!playerWon && round === 3) {
    return '"Money talks. Reform walks."';
  }
  if (!playerWon && round === 4) {
    return '"The headlines did their job. The people believe what we tell them."';
  }
  if (!playerWon && round === 5) {
    return '"Fusion is dead. And so is their little party."';
  }

  return '"The natural order prevails."';
}
