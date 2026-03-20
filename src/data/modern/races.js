// Race pool for modern era: Two categories — State Legislative and Statewide
// Set in a fictional purple state (vaguely Wisconsin/Michigan). Rust belt, big lake city,
// college town, factory suburbs going through realignment, rural counties that used to
// be union strongholds. The state just legalized fusion voting.
// Names are Pratchett-esque — vaguely satirical, revealing character, but plausible.

export const RACE_CATEGORIES = {
  state_leg: {
    key: 'state_leg',
    label: 'State Legislative',
    shortLabel: 'State Leg.',
    description: 'Assembly and State Senate seats — smaller districts, closer to the people, and where fusion can tip the balance.',
  },
  statewide: {
    key: 'statewide',
    label: 'Statewide Office',
    shortLabel: 'Statewide',
    description: 'Attorney General, Governor, U.S. Senate — bigger stage, harder odds, but the victories that reshape politics.',
  },
};

// ─── STATE LEGISLATIVE RACES ────────────────────────────────────

const POOL_STATE_LEG = [
  {
    id: 'lakeside_assembly',
    category: 'state_leg',
    office: 'State Assembly',
    officeShort: 'Assembly',
    location: 'Lakeside District',
    description: 'Diverse urban district anchored by the university. Gentrifying fast — the coffee shops are winning, the laundromats are losing.',
    incumbent: 'Open Seat',
    incumbentName: null,
    partisanLean: 'D+3',
    partisanLeanValue: -3,
    yourProjectedSupport: '4-6%',
    handicapperRating: 'Toss-Up',
    pivotalFactor: 0.85,
    basePlayerSupport: 5,
    demBase: 49,
    repBase: 46,
    dem: {
      id: 'deepwell',
      name: 'Priya Deepwell',
      title: 'City Councilwoman',
      party: 'democrat',
      description: 'Community development director who actually developed communities.',
      friendliness: 0.6,
      baseFriendliness: 0.6,
    },
    rep: {
      id: 'stonebridge',
      name: 'Marcus Stonebridge',
      title: 'Small Business Owner',
      party: 'republican',
      description: 'Runs three restaurants. Thinks government should work like a kitchen — efficient, no waste.',
      friendliness: 0.45,
      baseFriendliness: 0.45,
    },
  },
  {
    id: 'kendrick_falls_senate',
    category: 'state_leg',
    office: 'State Senate',
    officeShort: 'State Senate',
    location: 'Kendrick Falls',
    description: 'Old factory suburb that was a union stronghold. The factories are condos now, and the politics are trending red.',
    incumbent: 'Republican',
    incumbentName: 'Rep. Karen Steadman',
    partisanLean: 'R+4',
    partisanLeanValue: 4,
    yourProjectedSupport: '3-5%',
    handicapperRating: 'Lean R',
    pivotalFactor: 0.7,
    basePlayerSupport: 4,
    demBase: 46,
    repBase: 50,
    dem: {
      id: 'forgeheart',
      name: 'Miguel Forgeheart',
      title: 'Union Organizer',
      party: 'democrat',
      description: 'Third generation steelworker. First generation to lose the pension.',
      friendliness: 0.65,
      baseFriendliness: 0.65,
    },
    rep: {
      id: 'steadman',
      name: 'Rep. Karen Steadman',
      title: 'Incumbent State Senator',
      party: 'republican',
      description: 'Twelve years in office. Voted with leadership every single time. Every. Single. Time.',
      friendliness: 0.15,
      baseFriendliness: 0.15,
    },
  },
  {
    id: 'orchard_heights_assembly',
    category: 'state_leg',
    office: 'State Assembly',
    officeShort: 'Assembly',
    location: 'Orchard Heights',
    description: 'Outer-ring suburb full of educated professionals. Used to be reliably red. The yard signs are getting confusing.',
    incumbent: 'Open Seat',
    incumbentName: null,
    partisanLean: 'Even',
    partisanLeanValue: 0,
    yourProjectedSupport: '4-6%',
    handicapperRating: 'Toss-Up',
    pivotalFactor: 0.9,
    basePlayerSupport: 5,
    demBase: 48,
    repBase: 48,
    dem: {
      id: 'okafor',
      name: 'Dr. Amara Okafor',
      title: 'Physician',
      party: 'democrat',
      description: 'Delivered 200 babies and one devastating report on healthcare access.',
      friendliness: 0.55,
      baseFriendliness: 0.55,
    },
    rep: {
      id: 'fairlawn',
      name: 'Connor Fairlawn',
      title: 'Tech Executive',
      party: 'republican',
      description: "Sold his startup, bought a conscience. Jury's still out on whether it's genuine.",
      friendliness: 0.5,
      baseFriendliness: 0.5,
    },
  },
  {
    id: 'tamarack_county_senate',
    category: 'state_leg',
    office: 'State Senate',
    officeShort: 'State Senate',
    location: 'Tamarack County',
    description: 'Rural county where the broadband stops and the hospital just closed. Three hours from the capitol and feeling every mile.',
    incumbent: 'Republican',
    incumbentName: 'Sen. Dale Fencepost',
    partisanLean: 'R+6',
    partisanLeanValue: 6,
    yourProjectedSupport: '2-4%',
    handicapperRating: 'Likely R',
    pivotalFactor: 0.55,
    basePlayerSupport: 3,
    demBase: 44,
    repBase: 52,
    dem: {
      id: 'plowman',
      name: 'Jesse Plowman',
      title: 'Farmer',
      party: 'democrat',
      description: "Grows corn, raises hell, and hasn't voted for either party's presidential candidate since 2008.",
      friendliness: 0.7,
      baseFriendliness: 0.7,
    },
    rep: {
      id: 'fencepost',
      name: 'Sen. Dale Fencepost',
      title: 'Incumbent State Senator',
      party: 'republican',
      description: 'Has introduced exactly one bill in eight years. It renamed a highway rest stop.',
      friendliness: 0.1,
      baseFriendliness: 0.1,
    },
  },
  {
    id: 'steelyard_crossing_assembly',
    category: 'state_leg',
    office: 'State Assembly',
    officeShort: 'Assembly',
    location: 'Steelyard Crossing',
    description: 'Mixed working-class district where the old economy meets the new. True swing territory — nobody takes this one for granted.',
    incumbent: 'Open Seat',
    incumbentName: null,
    partisanLean: 'D+1',
    partisanLeanValue: -1,
    yourProjectedSupport: '4-6%',
    handicapperRating: 'Toss-Up',
    pivotalFactor: 0.9,
    basePlayerSupport: 5,
    demBase: 48,
    repBase: 47,
    dem: {
      id: 'gearhart',
      name: 'Maria Gearhart',
      title: 'Union Organizer',
      party: 'democrat',
      description: "Organized the warehouse walkout that made national news. Management calls her 'difficult.' Workers call her 'about time.'",
      friendliness: 0.55,
      baseFriendliness: 0.55,
    },
    rep: {
      id: 'clearpath',
      name: 'Pastor Devon Clearpath',
      title: 'Community Leader',
      party: 'republican',
      description: 'Runs the food bank, the youth program, and out of patience with both parties.',
      friendliness: 0.5,
      baseFriendliness: 0.5,
    },
  },
  {
    id: 'harmon_township_senate',
    category: 'state_leg',
    office: 'State Senate',
    officeShort: 'State Senate',
    location: 'Harmon Township',
    description: 'University town with young voters and flaky turnout. Progressive bumper stickers everywhere, actual progressive votes less certain.',
    incumbent: 'Democrat',
    incumbentName: 'Sen. Vivian Chairback',
    partisanLean: 'D+5',
    partisanLeanValue: -5,
    yourProjectedSupport: '3-5%',
    handicapperRating: 'Lean D',
    pivotalFactor: 0.6,
    basePlayerSupport: 4,
    demBase: 51,
    repBase: 44,
    dem: {
      id: 'chairback',
      name: 'Sen. Vivian Chairback',
      title: 'Incumbent State Senator',
      party: 'democrat',
      description: 'Has a talent for sounding progressive while voting moderate.',
      friendliness: 0.3,
      baseFriendliness: 0.3,
    },
    rep: {
      id: 'flagstone',
      name: 'Jake Flagstone',
      title: 'Veteran',
      party: 'republican',
      description: 'Two tours, one Purple Heart, zero patience for partisan games.',
      friendliness: 0.45,
      baseFriendliness: 0.45,
    },
  },
  {
    id: 'gateway_assembly',
    category: 'state_leg',
    office: 'State Assembly',
    officeShort: 'Assembly',
    location: 'Gateway District',
    description: 'Immigrant-heavy small business corridor. The American dream, one storefront at a time — if the zoning board cooperates.',
    incumbent: 'Open Seat',
    incumbentName: null,
    partisanLean: 'D+3',
    partisanLeanValue: -3,
    yourProjectedSupport: '4-6%',
    handicapperRating: 'Lean D',
    pivotalFactor: 0.7,
    basePlayerSupport: 5,
    demBase: 49,
    repBase: 45,
    dem: {
      id: 'newbridge',
      name: 'Linh Newbridge',
      title: 'Small Business Owner',
      party: 'democrat',
      description: 'Came here at twelve, opened her shop at twenty-two, and ran for office at thirty because the zoning board was killing her block.',
      friendliness: 0.7,
      baseFriendliness: 0.7,
    },
    rep: {
      id: 'shieldwall',
      name: 'Officer Ray Shieldwall',
      title: 'Retired Police Officer',
      party: 'republican',
      description: 'Twenty years on the beat. Believes in the law. Also believes the law needs fixing.',
      friendliness: 0.35,
      baseFriendliness: 0.35,
    },
  },
];

// ─── STATEWIDE RACES ────────────────────────────────────────────

const POOL_STATEWIDE = [
  {
    id: 'attorney_general',
    category: 'statewide',
    office: 'Attorney General',
    officeShort: 'Atty General',
    location: 'Statewide',
    description: "The state's top lawyer. Could prosecute dark money — if the office wasn't bought by it.",
    incumbent: 'Republican',
    incumbentName: 'AG Brennan Blindspot',
    partisanLean: 'R+3',
    partisanLeanValue: 3,
    yourProjectedSupport: '2-4%',
    handicapperRating: 'Lean R',
    pivotalFactor: 0.7,
    basePlayerSupport: 3,
    demBase: 47,
    repBase: 50,
    dem: {
      id: 'lawcraft',
      name: 'Keisha Lawcraft',
      title: 'Prosecutor',
      party: 'democrat',
      description: "Won three cases against dark money PACs. They're spending a fortune to stop a fourth.",
      friendliness: 0.65,
      baseFriendliness: 0.65,
    },
    rep: {
      id: 'blindspot',
      name: 'AG Brennan Blindspot',
      title: 'Incumbent Attorney General',
      party: 'republican',
      description: 'Has not prosecuted a single campaign finance violation in six years.',
      friendliness: 0.1,
      baseFriendliness: 0.1,
    },
  },
  {
    id: 'secretary_state',
    category: 'statewide',
    office: 'Secretary of State',
    officeShort: 'Sec. of State',
    location: 'Statewide',
    description: "Controls voter rolls, ballot access, election certification. Boring — and powerful.",
    incumbent: 'Republican',
    incumbentName: 'Sec. Morton Lostfile',
    partisanLean: 'R+4',
    partisanLeanValue: 4,
    yourProjectedSupport: '2-4%',
    handicapperRating: 'Lean R',
    pivotalFactor: 0.65,
    basePlayerSupport: 3,
    demBase: 46,
    repBase: 51,
    dem: {
      id: 'clearledger',
      name: 'Diana Clearledger',
      title: 'County Clerk',
      party: 'democrat',
      description: 'Runs the cleanest elections in the state. The party bosses hate her for it.',
      friendliness: 0.8,
      baseFriendliness: 0.8,
    },
    rep: {
      id: 'lostfile',
      name: 'Sec. Morton Lostfile',
      title: 'Incumbent Secretary of State',
      party: 'republican',
      description: "Has 'misplaced' more voter registrations than any other official in state history.",
      friendliness: 0.05,
      baseFriendliness: 0.05,
    },
  },
  {
    id: 'utilities_commissioner',
    category: 'statewide',
    office: 'Public Utilities Commissioner',
    officeShort: 'Utilities Comm.',
    location: 'Statewide',
    description: "Regulates energy, broadband, and water. The commission nobody watches and everybody suffers under.",
    incumbent: 'Republican',
    incumbentName: 'Commissioner Wendy Darkswitch',
    partisanLean: 'R+3',
    partisanLeanValue: 3,
    yourProjectedSupport: '3-5%',
    handicapperRating: 'Lean R',
    pivotalFactor: 0.75,
    basePlayerSupport: 4,
    demBase: 47,
    repBase: 49,
    dem: {
      id: 'brightgrid',
      name: 'Omar Brightgrid',
      title: 'Energy Advocate',
      party: 'democrat',
      description: 'Mapped every broadband dead zone in the state. Then ran for the office that could fix them.',
      friendliness: 0.7,
      baseFriendliness: 0.7,
    },
    rep: {
      id: 'darkswitch',
      name: 'Commissioner Wendy Darkswitch',
      title: 'Incumbent Utilities Commissioner',
      party: 'republican',
      description: 'Her campaign donors are her regulatory subjects. She sees no conflict.',
      friendliness: 0.05,
      baseFriendliness: 0.05,
    },
  },
  {
    id: 'governor',
    category: 'statewide',
    office: 'Governor',
    officeShort: 'Governor',
    location: 'Statewide',
    description: "The big prize. Appoints judges, signs bills, sets the agenda — and Vex owns the current one.",
    incumbent: 'Republican',
    incumbentName: 'Gov. Trent Gridlock',
    partisanLean: 'R+4',
    partisanLeanValue: 4,
    yourProjectedSupport: '2-4%',
    handicapperRating: 'Lean R',
    pivotalFactor: 0.6,
    basePlayerSupport: 3,
    demBase: 47,
    repBase: 50,
    dem: {
      id: 'inkwell',
      name: 'Professor Alan Inkwell',
      title: 'Professor',
      party: 'democrat',
      description: 'Published a paper on democratic reform that got him fired. Has nothing to lose.',
      friendliness: 0.55,
      baseFriendliness: 0.55,
    },
    rep: {
      id: 'gridlock',
      name: 'Gov. Trent Gridlock',
      title: 'Incumbent Governor',
      party: 'republican',
      description: "The establishment's establishment. Vex's handpicked governor.",
      friendliness: 0.1,
      baseFriendliness: 0.1,
    },
  },
  {
    id: 'lt_governor',
    category: 'statewide',
    office: 'Lieutenant Governor',
    officeShort: 'Lt. Governor',
    location: 'Statewide',
    description: "Presides over the state senate. One heartbeat from the governor's mansion.",
    incumbent: 'Open Seat',
    incumbentName: null,
    partisanLean: 'R+2',
    partisanLeanValue: 2,
    yourProjectedSupport: '3-5%',
    handicapperRating: 'Lean R',
    pivotalFactor: 0.7,
    basePlayerSupport: 4,
    demBase: 48,
    repBase: 48,
    dem: {
      id: 'sparkbridge',
      name: 'Nina Sparkbridge',
      title: 'State Senator',
      party: 'democrat',
      description: 'Electrifying speaker. The donors hate her, the voters love her.',
      friendliness: 0.55,
      baseFriendliness: 0.55,
    },
    rep: {
      id: 'goldhall',
      name: 'Chase Goldhall',
      title: 'Philanthropist',
      party: 'republican',
      description: 'Tech fortune. Funds homeless shelters. Genuinely horrified by inequality. Genuinely blind to his role in it.',
      friendliness: 0.5,
      baseFriendliness: 0.5,
    },
  },
  {
    id: 'us_senate_special',
    category: 'statewide',
    office: 'U.S. Senate (Special Election)',
    officeShort: 'U.S. Senate',
    location: 'Statewide',
    description: "Special election after a senator's sudden resignation. The fix is in — unless we unfix it.",
    incumbent: 'Open Seat',
    incumbentName: null,
    partisanLean: 'R+3',
    partisanLeanValue: 3,
    yourProjectedSupport: '2-4%',
    handicapperRating: 'Lean R',
    pivotalFactor: 0.6,
    basePlayerSupport: 3,
    demBase: 48,
    repBase: 49,
    dem: {
      id: 'grudgewell',
      name: 'Vanessa Grudgewell',
      title: 'Former Congresswoman',
      party: 'democrat',
      description: "Served two terms before they gerrymandered her out. She's back, and she remembers every name.",
      friendliness: 0.6,
      baseFriendliness: 0.6,
    },
    rep: {
      id: 'vanderchip',
      name: 'Aldrich Vanderchip',
      title: 'Tech Investor',
      party: 'republican',
      description: "Government is just a platform no one's disrupted yet.",
      friendliness: 0.1,
      baseFriendliness: 0.1,
    },
  },
  {
    id: 'us_senate_regular',
    category: 'statewide',
    office: 'U.S. Senate',
    officeShort: 'U.S. Senate',
    location: 'Statewide',
    description: "The upper chamber. Six-year term. The establishment's last fortress.",
    incumbent: 'Republican',
    incumbentName: 'Sen. J. Preston Crane IV',
    partisanLean: 'R+5',
    partisanLeanValue: 5,
    yourProjectedSupport: '2-3%',
    handicapperRating: 'Likely R',
    pivotalFactor: 0.5,
    basePlayerSupport: 3,
    demBase: 46,
    repBase: 51,
    dem: {
      id: 'shopfront',
      name: 'Marcus Shopfront',
      title: 'Small Business Owner',
      party: 'democrat',
      description: 'Lost his hardware store to a tech monopoly. Found his voice.',
      friendliness: 0.7,
      baseFriendliness: 0.7,
    },
    rep: {
      id: 'crane',
      name: 'Sen. J. Preston Crane IV',
      title: 'Incumbent Senator',
      party: 'republican',
      description: 'Fourth generation senator. Democracy as inheritance.',
      friendliness: 0.05,
      baseFriendliness: 0.05,
    },
  },
];

// ─── RACE POOL ──────────────────────────────────────────────────

export const RACE_POOL = {
  state_leg: POOL_STATE_LEG,
  statewide: POOL_STATEWIDE,
};

// ─── RACE SELECTION ─────────────────────────────────────────────

/**
 * Get 2 available races: one state_leg, one statewide.
 * Round 5 with 3+ wins: statewide option is US Senate.
 * @returns {{ stateLeg: object, statewide: object }}
 */
export function getAvailableRaces(round, winsCount, momentum, previousResults, rng) {
  const playedIds = new Set(previousResults.map(r => r.raceId));

  // State leg pool: filter out played races
  const legPool = POOL_STATE_LEG.filter(r => !playedIds.has(r.id));
  // Statewide pool: filter out played races
  let swPool = POOL_STATEWIDE.filter(r => !playedIds.has(r.id));

  // Round 5 with 3+ wins: prefer US Senate as the statewide option
  if (round === 5 && winsCount >= 3) {
    const senateRaces = swPool.filter(r => r.id.startsWith('us_senate'));
    if (senateRaces.length > 0) {
      // Use a senate race as the statewide option
      const senateIdx = Math.floor(rng() * senateRaces.length);
      const statewide = senateRaces[senateIdx];
      const stateLeg = pickRace(legPool, rng);
      return { stateLeg, statewide };
    }
  }

  // Normal: pick one from each pool, preferring tighter races in early rounds
  const stateLeg = pickRace(legPool, rng, round);
  // For statewide, exclude US Senate unless round 4+ with 2+ wins
  if (round < 4 || winsCount < 2) {
    swPool = swPool.filter(r => !r.id.startsWith('us_senate'));
  }
  const statewide = pickRace(swPool, rng, round);

  return { stateLeg, statewide };
}

function pickRace(pool, rng, round) {
  if (pool.length === 0) {
    // Fallback: return first race from the full category (shouldn't happen in 5 rounds)
    return POOL_STATE_LEG[0];
  }
  if (pool.length === 1) return pool[0];

  // Weight toward tighter races (higher pivotalFactor) in earlier rounds
  if (round <= 2) {
    // Sort by pivotalFactor descending, pick from top half
    const sorted = [...pool].sort((a, b) => b.pivotalFactor - a.pivotalFactor);
    const topHalf = sorted.slice(0, Math.ceil(sorted.length / 2));
    return topHalf[Math.floor(rng() * topHalf.length)];
  }

  // Later rounds: random
  return pool[Math.floor(rng() * pool.length)];
}
