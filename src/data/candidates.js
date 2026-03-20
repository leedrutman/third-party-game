// Expanded candidate pool for 3 election cycles with rotation
// Each district has 3 candidates per party (initial + replacements)
// Incumbents run again; losers generally move on

export const CANDIDATE_POOL = {
  district1: {
    democrat: [
      {
        id: 'sullivan',
        name: 'Patrick Sullivan',
        title: 'Alderman',
        party: 'democrat',
        description: 'Machine politician, pays lip service to workers.',
        stances: { laborRights: 0.4, antiCorruption: -0.4, freeSilver: 0.1, railroadRegulation: 0.1, womensSuffrage: -0.1 },
      },
      {
        id: 'ocallaghan',
        name: "Mary O'Callaghan",
        title: 'Union Organizer',
        party: 'democrat',
        description: 'Rose from the factory floor. The real deal.',
        female: true,
        stances: { laborRights: 0.8, antiCorruption: 0.3, freeSilver: 0.2, railroadRegulation: 0.2, womensSuffrage: 0.6 },
      },
      {
        id: 'mcginty',
        name: 'Thomas McGinty',
        title: 'Ward Boss',
        party: 'democrat',
        description: 'Tammany-style operator transplanted west.',
        stances: { laborRights: 0.3, antiCorruption: -0.6, freeSilver: 0.0, railroadRegulation: 0.0, womensSuffrage: -0.2 },
      },
    ],
    republican: [
      {
        id: 'whitfield',
        name: 'Cornelius Whitfield',
        title: 'Judge',
        party: 'republican',
        description: "Good-government man, factory owners' friend.",
        stances: { antiCorruption: 0.5, womensSuffrage: 0.2, laborRights: -0.3, freeSilver: -0.4, railroadRegulation: -0.1 },
      },
      {
        id: 'hargrove',
        name: 'Edwin Hargrove',
        title: 'Banker',
        party: 'republican',
        description: 'Sound money, sound business, sound asleep to suffering.',
        stances: { antiCorruption: 0.2, womensSuffrage: 0.0, laborRights: -0.5, freeSilver: -0.6, railroadRegulation: -0.3 },
      },
      {
        id: 'olmstead',
        name: 'Rev. Josiah Olmstead',
        title: 'Minister',
        party: 'republican',
        description: 'Temperance advocate with surprising labor sympathies.',
        stances: { antiCorruption: 0.4, womensSuffrage: 0.5, laborRights: 0.1, freeSilver: -0.2, railroadRegulation: 0.0 },
      },
    ],
  },
  district2: {
    democrat: [
      {
        id: 'jennings',
        name: 'Samuel Jennings',
        title: 'Farmer-Lawyer',
        party: 'democrat',
        description: 'Owes debts like everyone else in the county.',
        stances: { freeSilver: 0.6, railroadRegulation: 0.5, laborRights: 0.2, antiCorruption: 0.1, womensSuffrage: 0.0 },
      },
      {
        id: 'rawlings',
        name: 'Clara Rawlings',
        title: 'Schoolteacher',
        party: 'democrat',
        description: 'Sharp mind, sharp tongue. The suffragists love her.',
        female: true,
        stances: { womensSuffrage: 0.7, antiCorruption: 0.5, freeSilver: 0.3, railroadRegulation: 0.2, laborRights: 0.2 },
      },
      {
        id: 'oakes',
        name: 'Henry Oakes',
        title: 'Grain Merchant',
        party: 'democrat',
        description: 'Hates the railroads more than he loves the Democrats.',
        stances: { railroadRegulation: 0.7, freeSilver: 0.4, antiCorruption: 0.2, laborRights: 0.0, womensSuffrage: -0.1 },
      },
    ],
    republican: [
      {
        id: 'blackwell',
        name: 'Col. Horace Blackwell',
        title: 'Railroad Attorney',
        party: 'republican',
        description: 'Gold standard man. The railroad pays well.',
        stances: { freeSilver: -0.5, railroadRegulation: -0.5, laborRights: -0.3, antiCorruption: 0.2, womensSuffrage: 0.0 },
      },
      {
        id: 'sterling',
        name: 'Arthur Sterling',
        title: 'County Judge',
        party: 'republican',
        description: 'Moderate Republican. Secretly reads Populist pamphlets.',
        stances: { antiCorruption: 0.4, railroadRegulation: 0.1, freeSilver: -0.2, laborRights: 0.0, womensSuffrage: 0.1 },
      },
      {
        id: 'vandermeer',
        name: 'Otto Vandermeer',
        title: 'Land Speculator',
        party: 'republican',
        description: 'Owns half the county and wants the other half.',
        stances: { freeSilver: -0.4, railroadRegulation: -0.6, laborRights: -0.4, antiCorruption: -0.3, womensSuffrage: -0.2 },
      },
    ],
  },
  district3: {
    democrat: [
      {
        id: 'ashford',
        name: 'Edmund Ashford',
        title: 'Professor',
        party: 'democrat',
        description: 'Reform-minded academic at the state college.',
        stances: { antiCorruption: 0.6, womensSuffrage: 0.5, laborRights: 0.2, freeSilver: 0.0, railroadRegulation: 0.1 },
      },
      {
        id: 'fletcher',
        name: 'James Fletcher',
        title: 'Newspaper Editor',
        party: 'democrat',
        description: 'Crusading reformer with a printing press and a grudge.',
        stances: { antiCorruption: 0.7, womensSuffrage: 0.3, laborRights: 0.3, freeSilver: 0.1, railroadRegulation: 0.2 },
      },
      {
        id: 'beaumont',
        name: 'Robert Beaumont',
        title: 'State Senator',
        party: 'democrat',
        description: 'Professional moderate. Offends no one, inspires less.',
        stances: { antiCorruption: 0.2, womensSuffrage: 0.1, laborRights: 0.1, freeSilver: 0.0, railroadRegulation: 0.0 },
      },
    ],
    republican: [
      {
        id: 'crane',
        name: 'J. Rutherford Crane III',
        title: 'Governor',
        party: 'republican',
        description: "The establishment's establishment.",
        stances: { womensSuffrage: 0.4, antiCorruption: -0.3, laborRights: -0.4, freeSilver: -0.3, railroadRegulation: -0.2 },
      },
      {
        id: 'thornton',
        name: 'Margaret Thornton',
        title: 'Temperance Leader',
        party: 'republican',
        description: 'Moral authority in a corset. Underestimate her at your peril.',
        female: true,
        stances: { womensSuffrage: 0.6, antiCorruption: 0.4, laborRights: 0.0, freeSilver: -0.2, railroadRegulation: 0.0 },
      },
      {
        id: 'griswold',
        name: 'Harrison Griswold',
        title: 'Militia Colonel',
        party: 'republican',
        description: 'Law and order, emphasis on order.',
        stances: { antiCorruption: 0.1, womensSuffrage: -0.3, laborRights: -0.5, freeSilver: -0.3, railroadRegulation: -0.1 },
      },
    ],
  },
};

// Initialize candidates for election 1 (first in each pool)
export function initializeCandidates() {
  const candidates = {};
  for (const [districtId, pool] of Object.entries(CANDIDATE_POOL)) {
    candidates[districtId] = {
      democrat: { ...pool.democrat[0], isIncumbent: false, terms: 0, poolIndex: 0 },
      republican: { ...pool.republican[0], isIncumbent: false, terms: 0, poolIndex: 0 },
    };
  }
  return candidates;
}

// Rotate candidates between elections based on results
// Winners become incumbents and run again. Losers are replaced (with some randomness).
export function rotateCandidates(currentCandidates, electionResults, rng) {
  const next = {};
  for (const [districtId, district] of Object.entries(currentCandidates)) {
    const result = electionResults[districtId];
    next[districtId] = {};

    for (const partyKey of ['democrat', 'republican']) {
      const current = district[partyKey];
      const won = result && (
        (partyKey === 'democrat' && (result.winner === 'democrat' || result.winner === 'fusionDem')) ||
        (partyKey === 'republican' && (result.winner === 'republican' || result.winner === 'fusionRep'))
      );

      if (won) {
        // Winner runs again as incumbent
        next[districtId][partyKey] = {
          ...current,
          isIncumbent: true,
          terms: current.terms + 1,
        };
      } else {
        // Loser replaced with ~70% probability
        const retires = rng() > 0.3;
        if (retires) {
          const pool = CANDIDATE_POOL[districtId][partyKey];
          const nextIndex = (current.poolIndex + 1) % pool.length;
          next[districtId][partyKey] = {
            ...pool[nextIndex],
            isIncumbent: false,
            terms: 0,
            poolIndex: nextIndex,
          };
        } else {
          // Loser tries again
          next[districtId][partyKey] = { ...current, isIncumbent: false };
        }
      }
    }
  }
  return next;
}

// Backward-compatible CANDIDATES export (maps district -> { democrat, republican })
// Used by components until they're rewritten in Phase 3 to use state.candidates
export const CANDIDATES = Object.fromEntries(
  Object.entries(CANDIDATE_POOL).map(([districtId, pool]) => [
    districtId,
    { democrat: pool.democrat[0], republican: pool.republican[0] },
  ])
);

// Friendliness scoring (unchanged API)
export function getCandidateFriendliness(candidate, playerIssues) {
  const issues = Array.isArray(playerIssues) ? playerIssues : [playerIssues];
  let score = 0;
  for (const issue of issues) {
    score += candidate.stances[issue] || 0;
  }
  return score;
}

export function isFriendly(candidate, playerIssues) {
  return getCandidateFriendliness(candidate, playerIssues) > 0;
}

export function getFriendlinessLabel(candidate, playerIssues) {
  const score = getCandidateFriendliness(candidate, playerIssues);
  if (score >= 0.8) return 'Strong ally';
  if (score > 0) return 'Potentially friendly';
  if (score === 0) return 'Indifferent';
  if (score > -0.5) return 'Cool';
  return 'Hostile';
}
