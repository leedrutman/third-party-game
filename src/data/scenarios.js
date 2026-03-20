// Alternate History Scenario Generator
// Each playthrough generates a slightly different 1890s America

export const PRESIDENTS = [
  {
    key: 'harrison',
    name: 'Benjamin Harrison',
    party: 'Republican',
    flavor: 'The iceberg in the White House. A cold man for a cold era.',
    partisanShift: 2, // shifts national environment R
  },
  {
    key: 'cleveland',
    name: 'Grover Cleveland',
    party: 'Democrat',
    flavor: 'The bourbon Democrat. Sound money, small government, big mustache.',
    partisanShift: -2,
  },
  {
    key: 'weaver',
    name: 'James B. Weaver',
    party: 'Populist',
    flavor: 'The impossible happened: a Populist in the White House. The banks are terrified.',
    partisanShift: 0,
    issueBoost: { freeSilver: 0.1, railroadRegulation: 0.1, womensSuffrage: 0.1 },
  },
  {
    key: 'blaine',
    name: 'James G. Blaine',
    party: 'Republican',
    flavor: 'The continental liar from the state of Maine. Tariffs and patronage.',
    partisanShift: 3,
    issueBoost: { antiCorruption: 0.1 },
  },
  {
    key: 'altgeld',
    name: 'John Peter Altgeld',
    party: 'Democrat',
    flavor: 'The radical governor somehow won the presidency. Labor has a friend.',
    partisanShift: -3,
    issueBoost: { laborRights: 0.15 },
  },
  {
    key: 'reed',
    name: 'Thomas B. Reed',
    party: 'Republican',
    flavor: 'The Czar of the House now rules the nation. Order above all.',
    partisanShift: 4,
  },
];

export const WORLD_EVENTS = [
  {
    key: 'panic1893',
    name: 'The Panic of 1893',
    description: 'Banks are failing. Railroads are collapsing. Unemployment is at 20%.',
    issueBoost: { freeSilver: 0.15, laborRights: 0.1 },
    volatilityBoost: 0.03,
  },
  {
    key: 'pullmanStrike',
    name: 'The Pullman Strike',
    description: 'Railroad workers have shut down the nation\'s rail system. Federal troops are mobilized.',
    issueBoost: { laborRights: 0.15, railroadRegulation: 0.1 },
    volatilityBoost: 0.02,
  },
  {
    key: 'coxeysArmy',
    name: 'Coxey\'s Army',
    description: 'An army of unemployed men marches on Washington demanding public works.',
    issueBoost: { laborRights: 0.1, antiCorruption: 0.05 },
    volatilityBoost: 0.02,
  },
  {
    key: 'silverCrisis',
    name: 'The Silver Crisis',
    description: 'The Treasury\'s gold reserves are nearly depleted. J.P. Morgan offers a private bailout.',
    issueBoost: { freeSilver: 0.2, antiCorruption: 0.1 },
    volatilityBoost: 0.02,
  },
  {
    key: 'hullHouse',
    name: 'The Settlement House Movement',
    description: 'Jane Addams and the settlement houses are changing how America thinks about poverty.',
    issueBoost: { laborRights: 0.05, womensSuffrage: 0.1 },
    volatilityBoost: 0,
  },
  {
    key: 'temperanceCrusade',
    name: 'The Temperance Crusade',
    description: 'The WCTU is smashing saloons and demanding the vote. The liquor lobby is spending millions.',
    issueBoost: { womensSuffrage: 0.15, antiCorruption: 0.05 },
    volatilityBoost: 0.01,
  },
  {
    key: 'grangerRebellion',
    name: 'The Granger Rebellion',
    description: 'Farmers are organizing cooperatives and demanding state railroad commissions.',
    issueBoost: { railroadRegulation: 0.15, freeSilver: 0.05 },
    volatilityBoost: 0.02,
  },
];

// Generate a complete scenario from seeded RNG
export function generateScenario(rng) {
  // Pick president
  const presIdx = Math.floor(rng() * PRESIDENTS.length);
  const president = PRESIDENTS[presIdx];

  // Pick 1-2 world events (never duplicates)
  const eventCount = rng() > 0.4 ? 2 : 1;
  const shuffled = [...WORLD_EVENTS].sort(() => rng() - 0.5);
  const events = shuffled.slice(0, eventCount);

  // Calculate cumulative issue boosts
  const issueBoosts = {};
  if (president.issueBoost) {
    for (const [issue, boost] of Object.entries(president.issueBoost)) {
      issueBoosts[issue] = (issueBoosts[issue] || 0) + boost;
    }
  }
  for (const event of events) {
    for (const [issue, boost] of Object.entries(event.issueBoost)) {
      issueBoosts[issue] = (issueBoosts[issue] || 0) + boost;
    }
  }

  // Generate per-district modifiers
  const districtIds = ['district1', 'district2', 'district3'];
  const districtModifiers = {};

  for (const did of districtIds) {
    // Small random partisan lean shift ±3
    const partisanLeanDelta = Math.round((rng() - 0.5) * 6) + (president.partisanShift > 0 ? 1 : president.partisanShift < 0 ? -1 : 0);

    // Issue weight deltas from scenario events + small random noise
    const issueWeightDeltas = {};
    for (const [issue, boost] of Object.entries(issueBoosts)) {
      // Each district gets the boost ± some noise
      const noise = (rng() - 0.5) * 0.06;
      issueWeightDeltas[issue] = Math.round((boost + noise) * 100) / 100;
    }

    // Small volatility change from events
    let volatilityDelta = 0;
    for (const event of events) {
      volatilityDelta += event.volatilityBoost || 0;
    }
    volatilityDelta += (rng() - 0.5) * 0.02;

    districtModifiers[did] = {
      partisanLeanDelta: Math.max(-5, Math.min(5, partisanLeanDelta)),
      issueWeightDeltas,
      volatilityDelta: Math.round(volatilityDelta * 100) / 100,
    };
  }

  // Timeline number for display (each seed → different number)
  const timelineNumber = Math.floor(rng() * 99) + 1;

  return {
    president,
    events,
    districtModifiers,
    issueBoosts,
    year: 1892,
    timelineNumber,
  };
}
