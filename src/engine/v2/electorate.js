// v2.2 Electorate: Kingmaker math for a 2-5% party
// The player can NEVER win alone. Fusion is the only path.
// Your tiny vote share tips the balance in tight races.

// Seeded random for reproducible variance
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

let rng = Math.random;

export function initRng(seed) {
  rng = seededRandom(seed);
}

export function getRng() {
  return rng;
}

export function generateSeed(partyNameKey) {
  let hash = 0;
  const str = partyNameKey + 'v2reform';
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash) || 42;
}

function variance(amount = 2) {
  return (rng() - 0.5) * 2 * amount;
}

/**
 * Resolve a single-race election. Player is a 2-5% kingmaker.
 *
 * @param {object} params
 * @param {string} params.choice - 'fuse_dem' | 'fuse_rep' | 'alone'
 * @param {number} params.playerBase - player's base support (~3-10 with growth)
 * @param {number} params.demBase - Democrat's base percentage (~46-51)
 * @param {number} params.repBase - Republican's base percentage (~46-51)
 * @param {number} params.demFriendliness - 0-1
 * @param {number} params.repFriendliness - 0-1
 * @param {number} params.momentum - from previous rounds
 * @param {number} params.smearPenalty - from Blackwood (0 or 1)
 * @param {string} params.category - 'state_leg' | 'statewide'
 * @param {number} params.pivotalFactor - 0-1, how tight the race is
 * @returns {object} Election result
 */
export function resolveElection({
  choice,
  playerBase = 4,
  demBase = 48,
  repBase = 49,
  demFriendliness = 0.5,
  repFriendliness = 0.3,
  momentum = 0,
  smearPenalty = 0,
  category = 'state_leg',
  pivotalFactor = 0.7,
}) {
  // Category penalty: statewide races are harder to mobilize
  const categoryPenalty = category === 'statewide' ? 1.0 : 0;

  // Player support: base + small variance, minus penalties
  let playerSupport = playerBase - smearPenalty - categoryPenalty + variance(1);
  playerSupport = Math.max(1, Math.min(15, playerSupport));

  // Major party bases with variance — more swing means more uncertainty
  const marginVariance = (1 - pivotalFactor) * 3 + 1.5; // 1.5-4.5 range (more uncertainty)
  let demVotes = demBase + variance(marginVariance);
  let repVotes = repBase + variance(marginVariance);

  let winner, fusionWin = false, spoiled = false;
  let yourPct, demPct, repPct;
  let playerContribution = 0;

  if (choice === 'fuse_dem') {
    // Fusion with Democrat: your votes add to theirs
    const fusionEfficiency = 0.45 + demFriendliness * 0.35; // 0.45-0.80
    playerContribution = playerSupport * fusionEfficiency;

    // Fusion total vs Republican
    const fusionTotal = demVotes + playerContribution;
    const total = fusionTotal + repVotes;
    yourPct = (playerContribution / total) * 100;
    demPct = (demVotes / total) * 100;
    repPct = (repVotes / total) * 100;

    if (fusionTotal > repVotes) {
      winner = 'fusion_dem';
      fusionWin = true;
    } else {
      winner = 'republican';
    }
  } else if (choice === 'fuse_rep') {
    // Fusion with Republican: your votes add to theirs
    const fusionEfficiency = 0.45 + repFriendliness * 0.35;
    playerContribution = playerSupport * fusionEfficiency;

    const fusionTotal = repVotes + playerContribution;
    const total = fusionTotal + demVotes;
    yourPct = (playerContribution / total) * 100;
    repPct = (repVotes / total) * 100;
    demPct = (demVotes / total) * 100;

    if (fusionTotal > demVotes) {
      winner = 'fusion_rep';
      fusionWin = true;
    } else {
      winner = 'democrat';
    }
  } else {
    // Run alone: massive strategic defection — you cannot win with 2-5%
    const defectionRate = 0.55 + 0.05 * Math.min(5, playerBase); // 60-80%
    const strategicDefection = playerSupport * defectionRate;
    const effectiveSupport = playerSupport - strategicDefection;

    // Defectors split between major parties (lean D)
    demVotes += strategicDefection * 0.65;
    repVotes += strategicDefection * 0.35;

    const total = effectiveSupport + demVotes + repVotes;
    yourPct = (effectiveSupport / total) * 100;
    demPct = (demVotes / total) * 100;
    repPct = (repVotes / total) * 100;

    // Player can never win with 1-2% effective support
    if (repPct > demPct) {
      winner = 'republican';
      // Spoiler check: would dem have won if we hadn't run?
      const demWithout = demVotes + effectiveSupport;
      if (demWithout > repVotes) spoiled = true;
    } else {
      winner = 'democrat';
    }
  }

  // Calculate win margin for leverage
  let winMargin = 0;
  if (fusionWin) {
    const fusionTotal = yourPct + (choice === 'fuse_dem' ? demPct : repPct);
    const opponentPct = choice === 'fuse_dem' ? repPct : demPct;
    winMargin = fusionTotal - opponentPct;
  }

  return {
    choice,
    winner,
    fusionWin,
    spoiled,
    yourPct: Math.round(yourPct * 10) / 10,
    demPct: Math.round(demPct * 10) / 10,
    repPct: Math.round(repPct * 10) / 10,
    playerWon: fusionWin || winner === 'player',
    playerContribution: Math.round(yourPct * 10) / 10,
    winMargin: Math.round(winMargin * 10) / 10,
  };
}

/**
 * Check if a candidate rejects the fusion offer.
 * Low-friendliness candidates may refuse. Blackwood pressure increases rejection odds.
 * @returns {{ rejected: boolean, message: string|null }}
 */
export function checkFusionRejection(candidate, round) {
  const f = candidate.friendliness;

  // Bought candidates always reject
  if (candidate.boughtByBlackwood || candidate.boughtByVex) return {
    rejected: true,
    message: candidate.boughtByVex
      ? `${candidate.name} just got a seven-figure donation from Vex's PAC. They won't even take the meeting.`
      : `${candidate.name} is in Blackwood's pocket. They won't even take the meeting.`,
  };

  // Candidates above 0.5 friendliness never reject
  if (f >= 0.5) return { rejected: false, message: null };

  // Below 0.5: rejection chance scales with hostility
  let rejectChance = (0.5 - f) * 1.2; // 0-0.6 range for f=0 to f=0.5
  // Blackwood pressure in later rounds makes candidates more skittish
  if (round >= 3) rejectChance += 0.1;
  if (round >= 4) rejectChance += 0.15;
  // Pressured candidates are more likely to reject
  if (candidate.pressured || candidate.blackwoodPressure) rejectChance += 0.15;

  const roll = rng();
  if (roll < rejectChance) {
    // Different rejection messages based on friendliness level
    const message = f >= 0.3
      ? `${candidate.name} has declined your endorsement. "I sympathize with your cause, but I can't afford the association right now. Blackwood's people are watching."`
      : `${candidate.name} has declined your endorsement. "I don't need reform votes — and I don't want the trouble that comes with them."`;
    return { rejected: true, message };
  }
  return { rejected: false, message: null };
}

/**
 * Compute FPTP counterfactual for the dashboard.
 * With 2-5% support and no fusion, you're always irrelevant or a spoiler.
 */
export function computeFPTPCounterfactual(elections) {
  return elections.map((el) => {
    const playerBase = el.playerBase || 4;
    // In FPTP with tiny support: massive defection
    const defectionRate = 0.7;
    const strategicDefection = playerBase * defectionRate;
    const effectiveSupport = playerBase - strategicDefection;

    const demVotes = (el.demBase || 48) + strategicDefection * 0.6;
    const repVotes = (el.repBase || 49) + strategicDefection * 0.4;
    const total = effectiveSupport + demVotes + repVotes;

    const yourPct = (effectiveSupport / total) * 100;
    const demPct = (demVotes / total) * 100;
    const repPct = (repVotes / total) * 100;

    // Player never wins. Always irrelevant or spoiler.
    const winner = repPct > demPct ? 'republican' : 'democrat';
    const spoiled = yourPct > 0.5 && ((demVotes + effectiveSupport) > repVotes) && winner === 'republican';

    return {
      round: el.round,
      winner,
      yourPct: Math.round(yourPct * 10) / 10,
      demPct: Math.round(demPct * 10) / 10,
      repPct: Math.round(repPct * 10) / 10,
      spoiled,
      playerWon: false,
    };
  });
}
