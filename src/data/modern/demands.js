// Demands system: negotiate with fusion partners after wins
// Milestone progression: Recognition → Ballot Line → Endorsements → Legislation Introduced → Legislation Passed
// Modern era: centrist reform party defending fusion voting against tech oligarch Orion Vex

// ─── DEMAND OPTIONS ─────────────────────────────────────────────

export const DEMANDS = [
  // Tier 1: Low leverage, early game — defensive, protect fusion
  {
    id: 'ballot_access_protection',
    label: 'Ballot Access Protection',
    description: 'Co-sponsor a bill to protect fusion voting from repeal. Your fusion partner publicly commits to keeping fusion legal.',
    milestonePoints: 2,
    leverageThreshold: 0.25,
    category: 'recognition',
    icon: '📋',
  },
  {
    id: 'campaign_finance_transparency',
    label: 'Campaign Finance Transparency',
    description: 'Support disclosure requirements for dark money PACs funneling cash into anti-reform campaigns.',
    milestonePoints: 2,
    leverageThreshold: 0.30,
    category: 'recognition',
    icon: '💰',
  },
  {
    id: 'public_endorsement',
    label: 'Public Endorsement of Reform',
    description: 'A major-party leader publicly supports electoral reform and defends fusion voting.',
    milestonePoints: 3,
    leverageThreshold: 0.35,
    category: 'endorsements',
    icon: '📢',
  },

  // Tier 2: Medium leverage — building institutional power
  {
    id: 'committee_seats',
    label: 'Committee Seats for Reform Allies',
    description: 'Place reform-minded members on elections and judiciary committees.',
    milestonePoints: 3,
    leverageThreshold: 0.40,
    category: 'endorsements',
    icon: '🪑',
  },
  {
    id: 'anti_algorithmic_manipulation',
    label: 'Anti-Algorithmic Manipulation Act',
    description: 'Co-sponsor a bill to regulate algorithmic amplification of political content — targeting Vex\'s platforms.',
    milestonePoints: 3,
    leverageThreshold: 0.40,
    category: 'endorsements',
    icon: '🤖',
  },
  {
    id: 'redistricting_commission',
    label: 'Independent Redistricting Commission',
    description: 'Support creating a nonpartisan redistricting body to end gerrymandering.',
    milestonePoints: 4,
    leverageThreshold: 0.50,
    category: 'legislation',
    icon: '🗺️',
  },

  // Tier 3: High leverage, late game — ambitious structural reform
  {
    id: 'fusion_protection_act',
    label: 'Fusion Voting Protection Act',
    description: 'Enshrine fusion voting in statute, making it harder to repeal. A direct counter to Vex\'s anti-fusion campaign.',
    milestonePoints: 4,
    leverageThreshold: 0.50,
    category: 'legislation',
    icon: '🛡️',
  },
  {
    id: 'proportional_representation',
    label: 'Proportional Representation Resolution',
    description: 'Introduce a resolution calling for proportional representation in state legislative elections.',
    milestonePoints: 5,
    leverageThreshold: 0.50,
    category: 'legislation',
    icon: '⚖️',
  },
  {
    id: 'tech_platform_regulation',
    label: 'Tech Platform Regulation Bill',
    description: 'Comprehensive regulation of social media platforms\' role in elections — transparency, algorithmic accountability, ad disclosure.',
    milestonePoints: 4,
    leverageThreshold: 0.50,
    category: 'legislation',
    icon: '📱',
  },
];

// ─── MILESTONES ─────────────────────────────────────────────────

export const MILESTONES = [
  { id: 'recognition',             label: 'Recognition',             threshold: 0,  description: 'Your party exists. People know your name.' },
  { id: 'ballot_line',             label: 'Ballot Line',             threshold: 4,  description: 'Permanent ballot access secured.' },
  { id: 'endorsements',            label: 'Endorsements',            threshold: 10, description: 'Major figures publicly back your cause.' },
  { id: 'legislation_introduced',  label: 'Bill Introduced',         threshold: 16, description: 'Reform legislation is on the floor.' },
  { id: 'legislation_passed',      label: 'Bill Passed',             threshold: 24, description: 'The law changed. You changed it.' },
];

export function getCurrentMilestone(milestonePoints) {
  let current = MILESTONES[0];
  for (const m of MILESTONES) {
    if (milestonePoints >= m.threshold) current = m;
  }
  return current;
}

export function getNextMilestone(milestonePoints) {
  for (const m of MILESTONES) {
    if (milestonePoints < m.threshold) return m;
  }
  return null; // All milestones achieved
}

export function getMilestoneProgress(milestonePoints) {
  const current = getCurrentMilestone(milestonePoints);
  const next = getNextMilestone(milestonePoints);
  if (!next) return { current, next: null, progress: 1, currentIndex: MILESTONES.length - 1 };

  const currentIdx = MILESTONES.indexOf(current);
  const range = next.threshold - current.threshold;
  const progress = range > 0 ? (milestonePoints - current.threshold) / range : 0;
  return { current, next, progress, currentIndex: currentIdx };
}

// ─── LEVERAGE CALCULATION ───────────────────────────────────────

/**
 * Calculate player's leverage based on election result.
 * Leverage = player's vote share as proportion of the winning margin.
 */
export function calculateLeverage(result) {
  if (!result.fusionWin || !result.playerWon) return 0;

  const winMargin = result.winMargin;
  if (winMargin <= 0) return 0;

  // How much of the winning margin did we provide?
  const leverageRatio = Math.min(1, result.playerContribution / winMargin);
  return Math.round(leverageRatio * 100) / 100;
}

// ─── DEMAND RESOLUTION ──────────────────────────────────────────

/**
 * Determine if a demand is accepted.
 * @param {object} demand - from DEMANDS
 * @param {number} leverage - 0-1
 * @param {number} goodwill - accumulated from previous successful demands
 * @param {number} partnerFriendliness - the fusion partner's friendliness score
 * @returns {{ accepted: boolean, reaction: 'graceful'|'grudging'|'refuse' }}
 */
export function resolveDemand(demand, leverage, goodwill, partnerFriendliness) {
  const effectiveLeverage = leverage + (goodwill * 0.05) + (partnerFriendliness * 0.1);

  if (effectiveLeverage >= demand.leverageThreshold + 0.15) {
    return { accepted: true, reaction: 'graceful' };
  }
  if (effectiveLeverage >= demand.leverageThreshold) {
    return { accepted: true, reaction: 'grudging' };
  }
  return { accepted: false, reaction: 'refuse' };
}

// ─── PARTNER REACTION TEMPLATES ─────────────────────────────────

const PARTNER_REACTIONS = {
  graceful: [
    (name) => `${name} nods readily. "Fair enough. You earned this one."`,
    (name) => `${name} extends a hand. "We're partners. This is what partnership looks like."`,
    (name) => `${name} signs without hesitation. "You delivered. So will I."`,
  ],
  grudging: [
    (name) => `${name} winces, but signs. "Don't make me regret this."`,
    (name) => `${name} hesitates a long moment. "...Fine. But don't push your luck."`,
    (name) => `${name} pulls the paper toward them slowly. "You drive a hard bargain for a party your size."`,
  ],
  refuse: [
    (name) => `${name} shakes their head. "You're asking too much for what you brought to the table."`,
    (name) => `${name} folds their arms. "I appreciate your support, but that's a bridge too far."`,
    (name) => `${name} pushes the paper back. "Win me a bigger margin next time, and we'll talk."`,
  ],
};

export function getPartnerReaction(reaction, partnerName, rng) {
  const templates = PARTNER_REACTIONS[reaction] || PARTNER_REACTIONS.refuse;
  const idx = rng ? Math.floor(rng() * templates.length) : 0;
  return templates[idx](partnerName);
}

// ─── ADVISOR DEMAND REACTIONS ───────────────────────────────────

const ADVISOR_DEMAND_REACTIONS = {
  ezra: {
    accepted: [
      (demand) => `That's one more chip on our side of the table. ${demand.label} — the kind of win you can build on.`,
      (demand) => `${demand.label}. Secured. I've been doing this a long time, and that right there is how reform parties survive past their first decade.`,
    ],
    refused: [
      (demand) => `They said no. I'd have preferred a yes, but the fact that we're at the table at all — that's the real win. We'll come back with better cards next time.`,
      (demand) => `Refused. Not surprising given our leverage. The arithmetic wasn't there. We need a bigger margin next time.`,
    ],
  },
  bull: {
    accepted: [
      (demand) => `They gave us ${demand.label.toLowerCase()}! By God, they actually did it. This is what POWER looks like — not begging, not asking. DEMANDING.`,
      (demand) => `${demand.label}. Ours. We EARNED that. Every vote we delivered, every door we knocked — this is what it was for.`,
    ],
    refused: [
      (demand) => `They said NO? After what we did for them? The ungrateful — no. No. We'll remember this. And next time, we'll come back with numbers they can't ignore.`,
      (demand) => `Refused! Blast it. We didn't have enough muscle this time. But we're building it. Every election, every win, we get stronger.`,
    ],
  },
  pru: {
    accepted: [
      (demand) => `${demand.label}. Accepted. Not because they wanted to — because they had to. That is the precise purpose of leverage, and we wielded it correctly.`,
      (demand) => `Good. ${demand.label} secured. I've watched reform parties accept symbolic gestures for twenty years. This is not symbolic. This is structural.`,
    ],
    refused: [
      (demand) => `They refused. I am not surprised — our leverage was insufficient for that demand. Choose your battles. We'll return better positioned.`,
      (demand) => `No. The math wasn't in our favor for that ask. A wiser choice would have been a lower-threshold demand. But we learn.`,
    ],
  },
};

export function getAdvisorDemandReaction(advisorId, demand, accepted, rng) {
  const voice = ADVISOR_DEMAND_REACTIONS[advisorId] || ADVISOR_DEMAND_REACTIONS.ezra;
  const templates = accepted ? voice.accepted : voice.refused;
  const idx = rng ? Math.floor(rng() * templates.length) : 0;
  return templates[idx](demand);
}
