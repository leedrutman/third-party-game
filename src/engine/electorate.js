import { DISTRICTS, getIssueAlignment } from './districts.js';

// Seeded random for reproducible variance
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

let rng = Math.random;
let rngSeed = 0;

export function initRng(seed) {
  rngSeed = seed;
  rng = seededRandom(seed);
}

export function getRng() {
  return rng;
}

function randomVariance(volatility) {
  return (rng() - 0.5) * 2 * volatility * 10;
}

// Calculate base support for the player's party in a district
export function calculateBaseSupport(districtId, playerIssues, system) {
  const district = DISTRICTS[districtId];
  const alignment = getIssueAlignment(district, playerIssues);
  const ceiling = district.thirdPartyCeiling[system];
  return alignment * ceiling;
}

// Strategic voting penalty: in FPTP, voters who prefer you still defect to a major party
export function calculateStrategicPenalty(baseSupport, districtId, system, viability) {
  if (system === 'pr') return 0;

  const district = DISTRICTS[districtId];
  const competitiveness = 1 - Math.abs(district.republicanBase - district.democratBase) / 100;

  // How much of your support defects due to strategic voting
  const viabilityFactor = 1 - Math.min(1, viability / 25);
  const penaltyRate = competitiveness * viabilityFactor * 0.4;

  if (system === 'fptp') {
    return baseSupport * penaltyRate * 1.2; // Harder without fusion
  }
  // fusion: less penalty because ballot line gives perceived viability
  return baseSupport * penaltyRate * 0.5;
}

// Helper to check if a choice is a fusion type
export function isFusionChoice(choice) {
  return choice === 'fusionDem' || choice === 'fusionRep';
}

// Calculate the boost from fund allocation
// Historically calibrated: third-party lines typically got 4-8% in fusion races,
// so funding adds a modest 1-2% boost on top of alignment-based support.
export function calculateFundingBoost(amount) {
  if (!amount || amount <= 0) return 0;
  if (amount < 100) return amount * 0.002; // negligible below threshold
  // Diminishing returns: sqrt-based curve
  // $100 -> ~1.0%, $200 -> ~1.25%, $300 -> ~1.44%, $500 -> ~1.74%
  return 0.4 + Math.sqrt(amount / 100) * 0.6;
}

// Full election calculation for a single district
export function calculateDistrictResult(districtId, playerIssues, system, options = {}) {
  const district = DISTRICTS[districtId];
  const {
    resourceBonus = 0,
    decisionBonus = 0,
    viability = 10,
    fusionChoice = null,
    fundingAmount = 0,        // allocated campaign funds for this district
    previousSupport = 0,      // carry-forward from last election (your % last time)
    incumbentBonus = 0,       // bonus if fusion incumbent in this district
  } = options;

  if (fusionChoice === 'standDown') {
    const repVar = randomVariance(district.volatility);
    const demVar = randomVariance(district.volatility);
    const repPct = district.republicanBase + repVar;
    const demPct = district.democratBase + 2 + demVar;
    return {
      districtId,
      yourVotes: 0,
      yourPercent: 0,
      republicanPercent: Math.round(repPct * 10) / 10,
      democratPercent: Math.round(demPct * 10) / 10,
      winner: demPct > repPct ? 'democrat' : 'republican',
      fusionWin: false,
      spoiled: false,
      stoodDown: true,
    };
  }

  let base = calculateBaseSupport(districtId, playerIssues, system);
  const fundingBoost = calculateFundingBoost(fundingAmount);
  const carryForward = previousSupport * 0.3; // 30% of previous result carries forward
  base += resourceBonus + decisionBonus + fundingBoost + carryForward + incumbentBonus;

  const penalty = calculateStrategicPenalty(base, districtId, system, viability);
  const finalSupport = Math.max(1, base - penalty + randomVariance(district.volatility));

  let repPct = district.republicanBase + randomVariance(district.volatility);
  let demPct = district.democratBase + randomVariance(district.volatility);

  // Your voters come partly from both major parties' pools
  demPct -= finalSupport * 0.6;
  repPct -= finalSupport * 0.1;

  // Normalize so it sums to ~100
  const total = repPct + demPct + finalSupport;
  const scale = 100 / total;
  repPct *= scale;
  demPct *= scale;
  const yourPct = finalSupport * scale;

  let winner, fusionWin = false, spoiled = false;

  if (fusionChoice === 'fusionDem') {
    const fusionTotal = demPct + yourPct;
    if (fusionTotal > repPct) {
      winner = 'fusionDem';
      fusionWin = true;
    } else {
      winner = 'republican';
    }
  } else if (fusionChoice === 'fusionRep') {
    const fusionTotal = repPct + yourPct;
    if (fusionTotal > demPct) {
      winner = 'fusionRep';
      fusionWin = true;
    } else {
      winner = 'democrat';
    }
  } else {
    // Three-way race
    if (repPct > demPct && repPct > yourPct) {
      winner = 'republican';
      if (demPct + yourPct > repPct) {
        spoiled = true;
      }
    } else if (demPct > yourPct) {
      winner = 'democrat';
    } else {
      winner = 'player';
    }
  }

  return {
    districtId,
    yourVotes: Math.round(yourPct * 1000 / 100),
    yourPercent: Math.round(yourPct * 10) / 10,
    republicanPercent: Math.round(repPct * 10) / 10,
    democratPercent: Math.round(demPct * 10) / 10,
    winner,
    fusionWin,
    spoiled,
    stoodDown: false,
  };
}

// Calculate PR seat allocation for Act III
export function calculatePRResults(playerIssues, issuePriority, coalitionStrength = 0) {
  const totalSeats = 100;

  let avgAlignment = 0;
  const districtIds = Object.keys(DISTRICTS);
  for (const did of districtIds) {
    avgAlignment += getIssueAlignment(DISTRICTS[did], playerIssues);
  }
  avgAlignment /= districtIds.length;

  let playerShare = 8 + avgAlignment * 14 + randomVariance(0.15);
  playerShare = Math.max(8, Math.min(20, playerShare));

  const playerSeats = Math.round(playerShare * totalSeats / 100);

  const remaining = totalSeats - playerSeats;
  const republicanSeats = Math.round(remaining * 0.38 + randomVariance(0.1));
  const democratSeats = Math.round(remaining * 0.33 + randomVariance(0.1));
  const agrarianSeats = Math.round(remaining * 0.17 + randomVariance(0.1));
  const traditionalSeats = totalSeats - playerSeats - republicanSeats - democratSeats - agrarianSeats;

  return {
    player: Math.max(8, playerSeats),
    republican: Math.max(25, republicanSeats),
    democrat: Math.max(20, democratSeats),
    agrarian: Math.max(5, agrarianSeats),
    traditionalist: Math.max(3, Math.abs(traditionalSeats)),
    totalSeats,
  };
}

// Generate a seed number from party creation choices
export function generateSeed(partyName, mascot, issues) {
  let hash = 0;
  const str = partyName + mascot + issues.join('');
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) || 42;
}
