// v2 Candidates: 5 rounds, 2 candidates each (1 Dem + 1 Rep)
// Each candidate has a friendliness score (0-1) toward reform,
// portrait traits for CandidatePortrait, and flavor text.
// The tycoon system modifies friendliness at runtime.

export const ROUND_CANDIDATES = [
  // ROUND 1: The Opening — candidates are natural, no tycoon interference
  {
    round: 1,
    year: 1892,
    office: 'State Legislature',
    dem: {
      id: 'sullivan',
      name: 'Patrick Sullivan',
      title: 'Alderman',
      party: 'democrat',
      description: 'Union man from the factory wards. Owes the machine but hates the bosses.',
      friendliness: 0.7,
      baseFriendliness: 0.7,
      portraitTraits: { faceShape: 'round', hairStyle: 'short', hairColor: '#3D2B1F', facialHair: 'mustache', hat: 'bowler', collar: 'standard' },
    },
    rep: {
      id: 'whitfield',
      name: 'Cornelius Whitfield',
      title: 'Judge',
      party: 'republican',
      description: 'Good-government man on the surface. Factory owners\' friend underneath.',
      friendliness: 0.2,
      baseFriendliness: 0.2,
      portraitTraits: { faceShape: 'angular', hairStyle: 'parted', hairColor: '#8B8682', facialHair: 'none', hat: 'none', collar: 'high' },
    },
    demBase: 40,
    repBase: 40,
  },

  // ROUND 2: The Pushback — Blackwood pressures one candidate
  {
    round: 2,
    year: 1893,
    office: 'U.S. Congress',
    dem: {
      id: 'rawlings',
      name: 'Clara Rawlings',
      title: 'Schoolteacher',
      party: 'democrat',
      description: 'Sharp mind, sharp tongue. The suffragists love her, the machine tolerates her.',
      friendliness: 0.6,
      baseFriendliness: 0.6,
      female: true,
      portraitTraits: { faceShape: 'oval', hairStyle: 'updo', hairColor: '#3D2B1F', facialHair: 'none', hat: 'bonnet', collar: 'high' },
    },
    rep: {
      id: 'sterling',
      name: 'Arthur Sterling',
      title: 'County Judge',
      party: 'republican',
      description: 'Moderate Republican. Reads Populist pamphlets in private.',
      friendliness: 0.45,
      baseFriendliness: 0.45,
      portraitTraits: { faceShape: 'oval', hairStyle: 'parted', hairColor: '#5C4033', facialHair: 'sideburns', hat: 'none', collar: 'standard' },
    },
    demBase: 38,
    repBase: 42,
  },

  // ROUND 3: The Betrayal — Blackwood buys the friendly candidate
  {
    round: 3,
    year: 1894,
    office: 'State Senate',
    dem: {
      id: 'fletcher',
      name: 'James Fletcher',
      title: 'Newspaper Editor',
      party: 'democrat',
      description: 'Crusading reformer with a printing press and a grudge against the railroads.',
      friendliness: 0.65,
      baseFriendliness: 0.65,
      portraitTraits: { faceShape: 'oval', hairStyle: 'wavy', hairColor: '#5C4033', facialHair: 'mustache', hat: 'none', collar: 'standard' },
    },
    rep: {
      id: 'thornton',
      name: 'Margaret Thornton',
      title: 'Temperance Leader',
      party: 'republican',
      description: 'Moral authority in a corset. Underestimate her at your peril.',
      friendliness: 0.4,
      baseFriendliness: 0.4,
      female: true,
      portraitTraits: { faceShape: 'oval', hairStyle: 'updo', hairColor: '#8B8682', facialHair: 'none', hat: 'bonnet', collar: 'high' },
    },
    demBase: 39,
    repBase: 41,
  },

  // ROUND 4: The Smear — Blackwood attacks your party directly
  {
    round: 4,
    year: 1895,
    office: 'Governor',
    dem: {
      id: 'ashford',
      name: 'Edmund Ashford',
      title: 'Professor',
      party: 'democrat',
      description: 'Reform-minded academic. Published a pamphlet that got him fired. Has nothing to lose.',
      friendliness: 0.55,
      baseFriendliness: 0.55,
      portraitTraits: { faceShape: 'round', hairStyle: 'receding', hairColor: '#5C4033', facialHair: 'beard', hat: 'none', collar: 'standard', glasses: true },
    },
    rep: {
      id: 'griswold',
      name: 'Harrison Griswold',
      title: 'Militia Colonel',
      party: 'republican',
      description: 'Law and order, emphasis on order. Blackwood\'s enforcer.',
      friendliness: 0.15,
      baseFriendliness: 0.15,
      portraitTraits: { faceShape: 'angular', hairStyle: 'short', hairColor: '#3D2B1F', facialHair: 'mustache', hat: 'derby', collar: 'military' },
    },
    demBase: 37,
    repBase: 43,
  },

  // ROUND 5: The Last Stand — Anti-fusion bill looming
  {
    round: 5,
    year: 1896,
    office: 'U.S. Senate',
    dem: {
      id: 'ocallaghan',
      name: "Mary O'Callaghan",
      title: 'Union Organizer',
      party: 'democrat',
      description: 'Rose from the factory floor. The real deal. Blackwood fears her.',
      friendliness: 0.7,
      baseFriendliness: 0.7,
      female: true,
      portraitTraits: { faceShape: 'oval', hairStyle: 'updo', hairColor: '#3D2B1F', facialHair: 'none', hat: 'none', collar: 'high' },
    },
    rep: {
      id: 'crane',
      name: 'J. Rutherford Crane III',
      title: 'Governor',
      party: 'republican',
      description: 'The establishment\'s establishment. Blackwood\'s final card.',
      friendliness: 0.1,
      baseFriendliness: 0.1,
      portraitTraits: { faceShape: 'angular', hairStyle: 'slick', hairColor: '#8B8682', facialHair: 'sideburns', hat: 'tophat', collar: 'high' },
    },
    demBase: 38,
    repBase: 42,
  },
];

// Get candidates for a specific round
export function getRoundCandidates(round) {
  return ROUND_CANDIDATES[round - 1] || ROUND_CANDIDATES[0];
}

// Friendliness labels for display
export function getFriendlinessLabel(friendliness) {
  if (friendliness >= 0.6) return 'Reform ally';
  if (friendliness >= 0.4) return 'Open to reform';
  if (friendliness >= 0.2) return 'Cool to reform';
  return 'Hostile to reform';
}

export function getFriendlinessColor(friendliness) {
  if (friendliness >= 0.6) return 'text-forest';
  if (friendliness >= 0.4) return 'text-brass';
  if (friendliness >= 0.2) return 'text-walnut-light';
  return 'text-darkred';
}
