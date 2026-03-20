// 3 distinct advisor characters
import { DISTRICTS, DISTRICT_LIST, getIssueAlignment } from '../engine/districts.js';
import { getCandidateFriendliness, isFriendly } from './candidates.js';
import { ISSUES } from './issues.js';

// Utility: ensure issues is always an array (handles both string and array)
function ensureIssuesArray(issues) {
  if (!issues) return [];
  return Array.isArray(issues) ? issues : [issues];
}

// ============================================================================
// ADVISORS — 3 distinct strategic personalities
// ============================================================================

export const ADVISORS = {
  ezra: {
    id: 'ezra',
    name: 'Ezra Hatch',
    firstName: 'Ezra',
    title: 'Populist Campaign Strategist',
    icon: '\u{1F3A9}',
    catchphrase: 'Read the room.',
    description: "Organized three Farmers' Alliance chapters. Knows where the bodies are buried \u2014 and where the votes are hiding.",
    hint: 'Balanced evaluation. Fuses where the math works, stands down where hopeless.',
    fusionScoreThreshold: 0.3,
    aloneAlignmentThreshold: 0.5,
    friendlinessFloor: 0,
    neverStandDown: false,
    strictFriendlinessForFusion: false,
  },
  bull: {
    id: 'bull',
    name: 'Cornelius "Bull" McGraw',
    firstName: 'Bull',
    title: 'Railroad Worker Turned Organizer',
    icon: '\u{1F4AA}',
    catchphrase: 'Never retreat.',
    description: "Twenty-six years old and already blacklisted from every rail yard in the state. Fights like he has nothing to lose \u2014 because he doesn't.",
    hint: 'Fights everywhere. Lower bar for fusion, never stands down.',
    fusionScoreThreshold: 0.1,
    aloneAlignmentThreshold: 0.2,
    friendlinessFloor: -0.2,
    neverStandDown: true,
    strictFriendlinessForFusion: false,
  },
  pru: {
    id: 'pru',
    name: 'Prudence "Pru" Whitmore',
    firstName: 'Pru',
    title: 'Reform Organizer & Suffragist',
    icon: '\u{1F4DA}',
    catchphrase: 'Protect what you have.',
    description: "Sixty-two years old. Has watched four reform parties rise and fall. Knows exactly how each one died \u2014 and how not to repeat it.",
    hint: 'Cautious and principled. Only fuses with genuine allies.',
    fusionScoreThreshold: 0.5,
    aloneAlignmentThreshold: 0.65,
    friendlinessFloor: 0.3,
    neverStandDown: false,
    strictFriendlinessForFusion: true,
  },
};

// Backward compatibility
export const ADVISOR = ADVISORS.ezra;

// ============================================================================
// Advisor Introductions
// ============================================================================

const INTRODUCTIONS = {
  ezra: "Name's Ezra Hatch. I organized three Farmers' Alliance chapters before the party bosses and the bankers crushed us. I've seen fusion work in Kansas, Minnesota, and North Carolina. I've also seen it fail. I know every county chairman, every ward boss, and every newspaper editor between here and the Mississippi. Your state has three congressional districts \u2014 one urban, one mixed, one rural. That's your battlefield. You want to win seats? I'll tell you who to trust, who to avoid, and where to spend your money.",
  bull: "Name's McGraw. Bull McGraw. I was working the B&O Railroad when they cut our wages for the third time. I organized the walkout. They blacklisted me. Now I organize for you. I don't do careful. I don't do cautious. You've got three congressional districts and the major parties think they own every one of them. They're wrong. We fight in all of them. Every ballot with our name on it is a fist in their face. Let's get started.",
  pru: "My name is Prudence Whitmore. I've been organizing since before most of you were born. I watched the Liberty Party burn itself out. I watched the Free Soilers get absorbed. I watched the Greenbackers self-destruct. Every time, the same mistake: too much ambition, too little patience. You have three congressional districts, three elections, and a very small war chest. I intend to make sure you still exist at the end of it. That means we choose our battles carefully.",
};

export function getAdvisorIntroduction(advisorId) {
  return INTRODUCTIONS[advisorId] || INTRODUCTIONS.ezra;
}

export function getEzraIntroduction() {
  return getAdvisorIntroduction('ezra');
}

// ============================================================================
// Last Election Summary (shared/neutral)
// ============================================================================

export function getLastElectionSummary(districtId, prevResults) {
  if (!prevResults) return null;
  const dname = DISTRICTS[districtId]?.name || districtId;

  if (prevResults.fusionWin) {
    return `Our fusion ticket won ${dname} last time. The candidate owes us, and the voters know our name.`;
  }
  if (prevResults.spoiled) {
    return `We split the vote in ${dname}. The Republicans took the seat, and the Democrats blame us.`;
  }
  if (prevResults.stoodDown) {
    return `We sat out ${dname} last time. Nobody noticed we existed.`;
  }
  const pct = prevResults.yourPercent || 0;
  if (pct > 20) return `We ran a commanding campaign in ${dname} last time. The major parties are paying attention.`;
  if (pct > 15) return `We showed real strength in ${dname}. Enough to make the party bosses nervous.`;
  if (pct > 10) return `A respectable showing in ${dname} last time. We've got a foothold.`;
  if (pct > 5)  return `A thin showing in ${dname}. We exist here, but barely.`;
  return `Barely a blip in ${dname} last time. We're starting from scratch.`;
}

// ============================================================================
// Template infrastructure (shared)
// ============================================================================

function pickTemplate(templates, candidateId, election) {
  let hash = 0;
  const str = candidateId + String(election);
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return templates[Math.abs(hash) % templates.length];
}

function pronouns(candidate) {
  if (candidate.female) return { he: 'she', him: 'her', his: 'her', He: 'She', Him: 'Her', His: 'Her' };
  return { he: 'he', him: 'him', his: 'his', He: 'He', Him: 'Him', His: 'His' };
}

function fillTemplate(template, candidate, playerIssues) {
  const p = pronouns(candidate);
  const issues = ensureIssuesArray(playerIssues);
  const issue1 = ISSUES[issues[0]]?.name || issues[0] || '';
  const issue2 = issues[1] ? (ISSUES[issues[1]]?.name || issues[1]) : issue1;
  return template
    .replace(/\{name\}/g, candidate.name)
    .replace(/\{title\}/g, candidate.title)
    .replace(/\{fullName\}/g, `${candidate.title} ${candidate.name}`)
    .replace(/\{he\}/g, p.he).replace(/\{him\}/g, p.him).replace(/\{his\}/g, p.his)
    .replace(/\{He\}/g, p.He).replace(/\{Him\}/g, p.Him).replace(/\{His\}/g, p.His)
    .replace(/\{issue1\}/g, issue1).replace(/\{issue2\}/g, issue2);
}

// ============================================================================
// District-level flavor (shared neutral)
// ============================================================================

const DISTRICT_OPENERS = {
  district1: [
    'Down in the factory wards,',
    'In the tenement neighborhoods,',
    'Along the rail yards and the smokestacks,',
    'Where the mill whistles never stop blowing,',
    'In the crowded blocks near the waterfront,',
  ],
  district2: [
    'Out on Main Street,',
    'In the county seat,',
    'Among the shopkeepers and the courthouse crowd,',
    'Where the church steeples and the train depot mark the center of town,',
    'In the middle ground between city and country,',
  ],
  district3: [
    'Out in farm country,',
    'Among the wheat farmers and the prairie towns,',
    'Where the grain elevators line the railroad tracks,',
    'On the flatlands where the harvest makes or breaks a family,',
    'Among the homesteaders and the crossroads stores,',
  ],
};

const LEAN_PHRASES = {
  dem: [
    "This is Democratic territory \u2014 a friendly Democrat has the wind at their back.",
    "The Democrats run this district. Fusing with their candidate gives us a real shot.",
    "Democrats own the ward bosses here. We need their ballot line or a miracle.",
  ],
  rep: [
    "Republican country. Even a fused ticket faces long odds here.",
    "The Republicans have a lock on this district. Uphill battle either way.",
    "Republican patronage runs deep here. Breaking through means finding cracks in their machine.",
  ],
  swing: [
    "Swing ground \u2014 could go either way. That's where fusion wins elections.",
    "Neither party owns this district. That's an opportunity.",
    "A genuinely competitive district. These are the battlegrounds that decide everything.",
  ],
};

// ============================================================================
// Per-advisor voice templates
// ============================================================================

const ALIGNMENT_QUALITY = {
  ezra: {
    strong: [
      "our message hits home. These people live the problems we're talking about.",
      "we're speaking their language. This is our territory.",
      "the voters are hungry for what we're selling.",
      "our platform reads like their wishlist. This is natural ground for us.",
      "everything we stand for lands here. These folks have been waiting for us.",
    ],
    moderate: [
      "some of our platform resonates, but it's not a sure thing.",
      "we've got an audience, but they're not convinced yet.",
      "there's interest, but also skepticism.",
      "half our message lands. The other half they'll need persuading on.",
    ],
    weak: [
      "our platform doesn't play well. We're outsiders here.",
      "it's tough ground. Our issues don't keep these folks up at night.",
      "we're shouting into the wind. Not much traction.",
      "our agenda feels foreign to most voters here. An uphill climb.",
    ],
  },
  bull: {
    strong: [
      "these people are angry and they should be. We give them a voice.",
      "our fight is their fight. They just don't know it yet.",
      "the ground is ready. All it needs is someone willing to plant the flag.",
      "they're suffering and they know who's to blame. We just point the finger louder.",
      "the working people here are ready to march. They just need someone to lead.",
    ],
    moderate: [
      "they're not sold yet, but nobody's really tried selling. We change that.",
      "mixed ground, sure. But mixed means winnable.",
      "there's an opening if we push hard enough.",
      "some of them are listening. We just need to talk louder.",
    ],
    weak: [
      "tough crowd. But tough crowds are just crowds that haven't heard the right speech yet.",
      "hostile territory \u2014 the bosses have them scared. We break through that.",
      "nobody said this would be easy. That's not the same as impossible.",
      "they don't know they need us yet. That's our job \u2014 to show them.",
    ],
  },
  pru: {
    strong: [
      "the conditions are favorable. Our platform addresses real needs here.",
      "these voters have been waiting for someone to take their problems seriously.",
      "this is where our investment pays the highest return.",
      "our issues match their concerns almost perfectly. A strong foundation to build on.",
      "the alignment is genuine. These aren't fair-weather supporters \u2014 they share our convictions.",
    ],
    moderate: [
      "there's potential, but we shouldn't overestimate it. Cautious engagement.",
      "some receptivity, but not enough to bet the farm.",
      "a careful campaign might move the needle. A reckless one will waste resources.",
      "we have partial alignment. That's workable with the right approach, dangerous with the wrong one.",
    ],
    weak: [
      "poor alignment with local concerns. This is not where we make our stand.",
      "our platform is a hard sell here. Better to conserve our resources.",
      "the voters here have other priorities. Wisdom is knowing when to pass.",
      "our issues don't resonate. Spending heavily here would be throwing money into the wind.",
    ],
  },
};

const FUSION_TEMPLATES = {
  ezra: {
    trueBeliever: [
      "{fullName} is the genuine article. {He} believes in {issue1} as much as we do. Fuse here and we've got a real champion.",
      "{fullName} is one of us, near as makes no difference. This is the deal you dream about.",
      "I've talked to {fullName}. {He}'s with us all the way on {issue1}. Take this deal.",
    ],
    reliable: [
      "{fullName} isn't a crusader, but {he}'ll vote right when it counts. A deal here is solid ground.",
      "{fullName} will move on {issue1} if we deliver the votes. Fair trade.",
      "I trust {fullName} to keep {his} word on the things that matter. Not a zealot, but reliable.",
    ],
    transactional: [
      "{fullName} needs our voters more than {he}'ll admit. It's a marriage of convenience, but that's how fusion works.",
      "Don't expect {fullName} to march in our parades. But {he}'ll take our endorsement and owe us a favor.",
      "{fullName} will deal. Don't expect love letters, but {he}'ll count our votes and remember who put {him} in office.",
    ],
    hostile: [
      "{fullName} wouldn't give us the time of day. No deal to be had.",
      "Don't waste ink on {fullName}. {He} despises everything we stand for.",
      "{fullName}? Forget it. Might as well petition the wind.",
      "{fullName} is no friend of ours. Save your breath.",
    ],
  },
  bull: {
    trueBeliever: [
      "{fullName} is a fighter. {He} gets it \u2014 {issue1} isn't a debate topic, it's people's lives. Fuse and win.",
      "{fullName} is the real deal. Not many like {him} in either party. Lock this down.",
      "Finally, a candidate with a spine. {fullName} is with us on {issue1}. Go.",
    ],
    reliable: [
      "{fullName} will do the right thing if we put {him} in a position where {he} has to. That's good enough.",
      "Not perfect, but {fullName} will deliver on {issue1} when pushed. We'll push.",
      "{fullName} isn't one of us, but {he}'s not one of them either. We can work with that.",
    ],
    transactional: [
      "{fullName} is a politician. {He}'ll take our votes and forget our names. But {his} name on our ballot line gets our people to the polls.",
      "I don't trust {fullName} further than I can throw {him}. But a deal's a deal, and we need wins.",
      "{fullName} will deal if {he} smells victory. Hold your nose and shake hands.",
    ],
    hostile: [
      "{fullName} is everything we're fighting against. No deal \u2014 we run against {him}.",
      "I wouldn't fuse with {fullName} if {he} were the last candidate in the state. Run alone.",
      "{fullName}? The bosses' pet. We don't kneel.",
    ],
  },
  pru: {
    trueBeliever: [
      "{fullName} is genuinely committed to {issue1}. This is the kind of alliance that builds a movement.",
      "{fullName} shares our principles, not just our ballot line. A rare and valuable partnership.",
      "I've vetted {fullName} carefully. {His} commitment to {issue1} is sincere. This is worth our endorsement.",
    ],
    reliable: [
      "{fullName} is dependable on the issues that matter most. Not passionate, but honest. I'd take the deal.",
      "{fullName} will keep {his} word. That's more than most politicians can say.",
      "A solid partner. {fullName} won't champion our cause, but {he} won't betray it either.",
    ],
    transactional: [
      "{fullName} will smile for our voters and forget us the day after the election. I've seen this before \u2014 it never ends well.",
      "Be careful with {fullName}. {He} wants our votes, not our platform. We've been burned by politicians like this.",
      "I wouldn't trust {fullName} with our endorsement. {He}'ll take our votes and give nothing back.",
    ],
    hostile: [
      "{fullName} is actively opposed to everything we stand for. Any deal would compromise our principles.",
      "Absolutely not. {fullName} would use our endorsement to legitimize policies that hurt our people.",
      "{fullName} represents the very interests we exist to oppose. No alliance is possible.",
    ],
  },
};

const ALONE_TEMPLATES = {
  ezra: {
    strong: [
      "Run alone here and we split the progressive vote. But our people will see our name on the ballot, and that counts for something.",
      "Going alone means a three-way race. We'll eat into the Democrats' margin \u2014 and they'll blame us for it.",
      "Solo run with good alignment could build name recognition. But the spoiler math is real \u2014 eyes wide open.",
    ],
    moderate: [
      "Running alone in a swing district? We split the vote and the party bosses laugh all the way to the capitol.",
      "A three-way race here is a gamble. We might make noise, or we might just play spoiler.",
      "Mixed returns. We'd get our name out there, but we'd also draw fire from both sides.",
    ],
    weak: [
      "Running alone where we've got no base? That's a vanity campaign. Save the money.",
      "We'd be lucky to break five percent running alone here. Think hard about this one.",
      "The numbers don't justify the cost. Running here alone is a losing proposition.",
    ],
  },
  bull: {
    strong: [
      "Run our own candidate. Show the voters there's a real alternative, not just two flavors of the same poison.",
      "Three-way race? Good. Let the Democrats earn their votes instead of inheriting them.",
      "This is where we prove we're not just somebody's junior partner. We run. We fight. We win or we learn.",
    ],
    moderate: [
      "Run anyway. Every ballot with our name on it is a recruitment poster. Win or lose, they'll remember we showed up.",
      "Spoiler? Please. We're the only ones telling the truth. If that splits the vote, blame the system, not us.",
      "We run. Period. You don't build a movement by asking permission.",
    ],
    weak: [
      "Even here, running alone puts our name in front of voters who've never seen it. That's not nothing.",
      "Long odds, sure. But every campaign starts somewhere. Plant the seed.",
      "Tough ground? So what. The mill towns were tough too, until we organized them.",
    ],
  },
  pru: {
    strong: [
      "Running alone risks splitting the progressive vote. Consider carefully whether the visibility is worth the spoiler risk.",
      "A solo run here shows strength, but it also hands seats to the opposition. We need to weigh that honestly.",
      "If we run alone, we'll win votes but potentially cost our allies the seat. That calculation matters.",
    ],
    moderate: [
      "The arithmetic is against us in a three-way race. We'd need extraordinary turnout to avoid simply playing spoiler.",
      "I'd think twice about running alone here. The margin is too thin and the risk is real.",
      "Running alone in contested territory is how third parties earn the spoiler label. Tread carefully.",
    ],
    weak: [
      "Running alone with no base is how third parties embarrass themselves. I've seen it destroy morale.",
      "This would drain resources we need elsewhere. A wise general doesn't attack every hill.",
      "Four reform parties before us made this same mistake. Running everywhere, winning nowhere.",
    ],
  },
};

const STANDDOWN_TEMPLATES = {
  ezra: {
    strong: [
      "Standing down where we've got real support? That's surrender. Our voters need to see us on the ballot.",
      "Sitting this one out wastes our strongest position. The whole point is to be visible.",
      "We built something here. Not running means telling our people their work didn't matter.",
    ],
    moderate: [
      "Standing down saves money, but it costs us visibility. Nobody remembers a party that doesn't run.",
      "If we don't contest here, we're telling the major parties we don't matter.",
      "Sitting out is cheap and safe, but it sends a message \u2014 and not the one we want.",
    ],
    weak: [
      "Save the powder for where it counts. Nothing to win here.",
      "Standing down makes sense when the ground is hostile. Focus elsewhere.",
      "No point bleeding dry on hostile ground. Redirect those resources.",
    ],
  },
  bull: {
    strong: [
      "Stand down? Where we're strong? Absolutely not. We fight here.",
      "If we won't run where we've got support, what are we even doing? Get on the ballot.",
      "Standing down where people want us? That's betraying the very voters who believe in us.",
    ],
    moderate: [
      "Standing down is quitting. I don't quit. But if you want to be a party that quits, this is how you do it.",
      "Every district we don't contest is a district where they can pretend we don't exist.",
      "You want to stand down? Fine. But remember this moment when they say we never showed up.",
    ],
    weak: [
      "Even here, standing down is retreat. I'd rather lose fighting than win hiding.",
      "Fine, the ground is bad. But running even a token campaign shows we won't be ignored.",
      "Bad ground, sure. But absence is worse than defeat. At least a loss gets you a headline.",
    ],
  },
  pru: {
    strong: [
      "We have real support here. Standing down would confuse our voters and waste our strongest position.",
      "I rarely recommend standing down where we have a base. This is one of those times we should be visible.",
      "Our supporters here expect to see us on the ballot. Disappointing them costs more than money.",
    ],
    moderate: [
      "Standing down preserves resources for where they matter most. Not every battle needs to be fought.",
      "Sometimes the wise choice is to conserve. Our party survives by being strategic, not by being everywhere.",
      "I'd rather save our strength than spread it thin. Parties that overextend don't survive.",
    ],
    weak: [
      "Stand down and focus your resources. The parties that survive are the ones that know where not to fight.",
      "This is hostile ground. Save your money, save your morale. Live to fight where it matters.",
      "Discretion, not cowardice. We stand down here to stand up where it counts.",
    ],
  },
};

// ============================================================================
// Helper functions
// ============================================================================

function getAlignmentTier(alignment) {
  if (alignment > 0.65) return 'strong';
  if (alignment > 0.35) return 'moderate';
  return 'weak';
}

function getFriendlinessTier(score) {
  if (score >= 0.8) return 'trueBeliever';
  if (score >= 0.4) return 'reliable';
  if (score > 0) return 'transactional';
  return 'hostile';
}

function getLeanCategory(district) {
  if (district.partisanLean < -3) return 'dem';
  if (district.partisanLean > 3) return 'rep';
  return 'swing';
}

function buildCandidateComment(candidate, playerIssues, election, advisorId) {
  const score = getCandidateFriendliness(candidate, playerIssues);
  const tier = getFriendlinessTier(score);
  const advisorTemplates = FUSION_TEMPLATES[advisorId] || FUSION_TEMPLATES.ezra;
  const templates = advisorTemplates[tier];
  const raw = pickTemplate(templates, candidate.id, election);
  const text = fillTemplate(raw, candidate, playerIssues);

  const profile = ADVISORS[advisorId] || ADVISORS.ezra;
  if (tier === 'hostile' || (profile.strictFriendlinessForFusion && tier === 'transactional')) {
    return { fusionComment: null, dismissal: text };
  }
  return { fusionComment: text, dismissal: null };
}

// ============================================================================
// District Brief — advisor's full analysis for one district
// ============================================================================

export function getDistrictBrief(districtId, state, election, advisorId = 'ezra') {
  const district = DISTRICTS[districtId];
  const candidates = state.candidates?.[districtId];
  const playerIssues = ensureIssuesArray(state.party?.issues);
  const alignment = getIssueAlignment(district, playerIssues);
  const alignTier = getAlignmentTier(alignment);
  const lean = getLeanCategory(district);

  const prevResults = election > 1
    ? state.act1.elections[election - 1]?.electionResults?.[districtId]
    : null;
  const lastElection = getLastElectionSummary(districtId, prevResults);

  const opener = pickTemplate(DISTRICT_OPENERS[districtId] || DISTRICT_OPENERS.district1, districtId, election);
  const qualityPhrases = (ALIGNMENT_QUALITY[advisorId] || ALIGNMENT_QUALITY.ezra)[alignTier];
  const qualityPhrase = pickTemplate(qualityPhrases, districtId, election);
  const leanPhrase = pickTemplate(LEAN_PHRASES[lean], districtId, election);
  const assessment = `${opener} ${qualityPhrase} ${leanPhrase}`;

  const demComment = candidates
    ? buildCandidateComment(candidates.democrat, playerIssues, election, advisorId)
    : { fusionComment: null, dismissal: null };
  const repComment = candidates
    ? buildCandidateComment(candidates.republican, playerIssues, election, advisorId)
    : { fusionComment: null, dismissal: null };

  const aloneTemplates = (ALONE_TEMPLATES[advisorId] || ALONE_TEMPLATES.ezra)[alignTier];
  const sdTemplates = (STANDDOWN_TEMPLATES[advisorId] || STANDDOWN_TEMPLATES.ezra)[alignTier];

  const aloneComment = fillTemplate(
    pickTemplate(aloneTemplates, districtId, election),
    { name: '', title: '', female: false },
    playerIssues,
  );
  const standDownComment = fillTemplate(
    pickTemplate(sdTemplates, districtId, election),
    { name: '', title: '', female: false },
    playerIssues,
  );

  const advisorChoice = computeAdvisorChoice(district, candidates, playerIssues, state, election, prevResults, advisorId);

  return {
    assessment,
    lastElection,
    aloneComment,
    standDownComment,
    candidates: {
      democrat: demComment,
      republican: repComment,
    },
    advisorChoice,
    ezraChoice: advisorChoice,
  };
}

// ============================================================================
// Advisor's auto-pick algorithm (parameterized by profile)
// ============================================================================

function computeAdvisorChoice(district, candidates, playerIssues, state, election, prevResults, advisorId = 'ezra') {
  const profile = ADVISORS[advisorId] || ADVISORS.ezra;

  if (!candidates) return profile.neverStandDown ? 'alone' : 'standDown';

  const alignment = getIssueAlignment(district, playerIssues);

  function scoreFusion(candidate, partyKey) {
    const friendliness = getCandidateFriendliness(candidate, playerIssues);
    if (friendliness <= profile.friendlinessFloor) return -999;

    if (profile.strictFriendlinessForFusion && getFriendlinessTier(friendliness) === 'transactional') {
      return -999;
    }

    let score = friendliness;

    const lean = district.partisanLean;
    if (partyKey === 'democrat' && lean < -3) score += 0.2;
    if (partyKey === 'republican' && lean > 3) score += 0.2;

    const fusionType = partyKey === 'democrat' ? 'fusionDem' : 'fusionRep';
    if (state.act1?.seatsHeld?.[district.id] === fusionType) score += 0.3;

    if (prevResults?.fusionWin && prevResults.fusionChoice === fusionType) score += 0.3;

    return score;
  }

  const demScore = scoreFusion(candidates.democrat, 'democrat');
  const repScore = scoreFusion(candidates.republican, 'republican');

  const bestScore = Math.max(demScore, repScore);
  if (bestScore > profile.fusionScoreThreshold) {
    return demScore >= repScore ? 'fusionDem' : 'fusionRep';
  }
  if (alignment > profile.aloneAlignmentThreshold) return 'alone';
  if (profile.neverStandDown) return 'alone';
  return 'standDown';
}

export function getAdvisorChoices(state, election, advisorId = 'ezra') {
  const choices = {};
  for (const district of DISTRICT_LIST) {
    const candidates = state.candidates?.[district.id];
    const prevResults = election > 1
      ? state.act1.elections[election - 1]?.electionResults?.[district.id]
      : null;
    choices[district.id] = computeAdvisorChoice(
      district, candidates, ensureIssuesArray(state.party?.issues), state, election, prevResults, advisorId,
    );
  }
  return choices;
}

// Backward compat
export function getEzraChoices(state, election) {
  return getAdvisorChoices(state, election, 'ezra');
}

// ============================================================================
// Fund allocation strategies
// ============================================================================

const STEP = 50;

function roundToStep(n) {
  return Math.round(n / STEP) * STEP;
}

function scoreDistrict(districtId, fusionChoice, state, election, advisorId = 'ezra') {
  const district = DISTRICTS[districtId];
  const playerIssues = ensureIssuesArray(state.party?.issues);
  const alignment = getIssueAlignment(district, playerIssues);

  if (fusionChoice === 'standDown') return { districtId, score: -999, active: false };

  let score = 0;
  const isFused = fusionChoice === 'fusionDem' || fusionChoice === 'fusionRep';
  if (isFused) score += 2;
  score += alignment * 3;

  if (isFused) {
    const lean = district.partisanLean;
    if (fusionChoice === 'fusionDem' && lean < -3) score += 1;
    else if (fusionChoice === 'fusionRep' && lean > 3) score += 1;
    else if (Math.abs(lean) <= 3) score += 0.5;
  }

  if (state.act1?.seatsHeld?.[districtId]) score += 1.5;

  if (election > 1) {
    const prev = state.act1.elections[election - 1]?.electionResults?.[districtId];
    if (prev?.fusionWin) score += 1;
    else if (prev && !prev.stoodDown && prev.yourPercent > 10) score += 0.5;
  }

  // Bull: bonus for alone districts (values fighting spirit)
  if (advisorId === 'bull' && !isFused && fusionChoice === 'alone') score += 0.5;
  // Pru: extra bonus for held seats (protect what you have)
  if (advisorId === 'pru' && state.act1?.seatsHeld?.[districtId]) score += 1;

  return { districtId, score, active: true };
}

function buildAllocations(ranked, fundPool) {
  const n = ranked.length;
  if (n === 0) return {};

  const zero = Object.fromEntries(DISTRICT_LIST.map(d => [d.id, 0]));

  const concentrate = { ...zero };
  if (n >= 2) {
    concentrate[ranked[0]] = roundToStep(fundPool * 0.7);
    concentrate[ranked[1]] = fundPool - concentrate[ranked[0]];
  } else {
    concentrate[ranked[0]] = fundPool;
  }

  const spread = { ...zero };
  const perDistrict = roundToStep(fundPool / n);
  let spreadRemaining = fundPool;
  for (let i = 0; i < n; i++) {
    const amount = i < n - 1 ? Math.min(perDistrict, spreadRemaining) : spreadRemaining;
    spread[ranked[i]] = amount;
    spreadRemaining -= amount;
  }

  const balanced = { ...zero };
  const splits = n === 1 ? [1] : n === 2 ? [0.65, 0.35] : [0.5, 0.3, 0.2];
  let balRemaining = fundPool;
  for (let i = 0; i < n; i++) {
    const amount = i < n - 1
      ? roundToStep(fundPool * (splits[i] || 0))
      : balRemaining;
    balanced[ranked[i]] = Math.min(amount, balRemaining);
    balRemaining -= balanced[ranked[i]];
  }

  return { concentrate, spread, balanced };
}

function getHeldDistricts(state) {
  const held = [];
  if (state.act1?.seatsHeld) {
    for (const [did, holder] of Object.entries(state.act1.seatsHeld)) {
      if (holder) held.push(did);
    }
  }
  return held;
}

function getClosestLoss(state, election) {
  if (election <= 1) return null;
  const prev = state.act1.elections[election - 1]?.electionResults;
  if (!prev) return null;
  let best = null;
  let bestPct = -1;
  for (const [did, r] of Object.entries(prev)) {
    if (!r.fusionWin && !r.stoodDown && r.yourPercent > bestPct) {
      bestPct = r.yourPercent;
      best = did;
    }
  }
  return best;
}

// Per-advisor fund strategy quotes keyed by context
const FUND_QUOTES = {
  ezra: {
    e1: {
      concentrate: (d) => `Pick your strongest district and bury the opposition. One seat in the legislature is worth more than three respectable losses. I say we pour everything into ${d}.`,
      spread: () => "Put our name on every ballot. Even a loss builds recognition for next time. This is a three-election war, not a one-night stand.",
      balanced: (d) => `Lock up the win where the math is best \u2014 that's ${d} \u2014 and put just enough in the others to keep the lights on.`,
    },
    e2held: {
      concentrate: (_, h) => `We hold ${h}. Don't let that slip \u2014 fund the defense, then put the rest toward taking new ground.`,
      spread: () => "We've got momentum. Spread the money. Show them we're not a one-district fluke.",
      balanced: () => "Lock down what we've got. There's no point conquering new territory if we lose what we built.",
    },
    e2open: {
      concentrate: (_, __, c) => `We came closest in ${c}. Pour everything in \u2014 this is our opening.`,
      spread: () => "Last time didn't work. Shift the money to where the candidates are stronger this cycle.",
      balanced: () => "Invest everywhere. The carry-forward from this election sets up our final push.",
    },
    e3held: {
      concentrate: () => "This is our last election. Defend every seat we hold. That record matters when the rules change.",
      spread: () => "Go for maximum seats. If they're going to ban fusion, make them ban something that was working.",
      balanced: () => "Fund every race. When they write the history, they'll see we competed everywhere.",
    },
    e3open: {
      concentrate: (d) => `One last shot. Every dollar on our best chance. Win one seat in ${d} so they can't say we never mattered.`,
      spread: () => "Spread it everywhere. One of these races might break our way.",
      balanced: () => "It's about the record now. Show up everywhere. The vote totals tell our story.",
    },
  },
  bull: {
    e1: {
      concentrate: (d) => `Hit them where it hurts. ${d} is our best shot \u2014 go in hard, win it, and watch the papers write about us.`,
      spread: () => "Fight everywhere. I don't care about the odds. You build a movement by showing up, not by hiding.",
      balanced: (d) => `Heavy on ${d}, but don't leave the other districts dark. Our people need to see us on every ballot.`,
    },
    e2held: {
      concentrate: (_, h) => `We own ${h}. Good. Now defend it like a fortress and spend the rest on an attack.`,
      spread: () => "We're winning. Don't slow down now. Hit every district. Make them fight us on three fronts.",
      balanced: () => "Defend our ground and keep pushing. They expect us to play it safe. We don't do safe.",
    },
    e2open: {
      concentrate: (_, __, c) => `We almost had ${c}. Almost isn't good enough. This time, we take it.`,
      spread: () => "Forget last time. New candidates, new fight. Spread the money and hit them everywhere.",
      balanced: () => "Learn from the losses, but don't play scared. Invest across the board and fight harder.",
    },
    e3held: {
      concentrate: () => "Last stand. Hold what we've got and put everything else into one final assault. Go out swinging.",
      spread: () => "Final election. Maximum aggression. They want to ban fusion? Make them ban it after we win everywhere.",
      balanced: () => "Protect our seats and take one more. Three districts, three fights. No retreats.",
    },
    e3open: {
      concentrate: (d) => `Everything on ${d}. One win. That's all we need to prove we belonged in this fight.`,
      spread: () => "Scatter it. Fight everywhere. One of these races breaks our way if we hit hard enough.",
      balanced: () => "Even spread. We go down fighting in every district. Nobody calls us quitters.",
    },
  },
  pru: {
    e1: {
      concentrate: (d) => `Focus our limited resources on ${d}, where conditions are most favorable. One genuine victory teaches more than three symbolic defeats.`,
      spread: () => "Distribute funds evenly to build name recognition everywhere. This is a marathon, not a sprint.",
      balanced: (d) => `Weight toward ${d} where we're strongest, but maintain a presence elsewhere. Balanced investment, measured expectations.`,
    },
    e2held: {
      concentrate: (_, h) => `Our seat in ${h} is everything we've built. Defending it must be our first priority.`,
      spread: () => "Spread our resources to show breadth. But if we lose what we hold, expansion means nothing.",
      balanced: () => "Protect our base first. Then \u2014 and only then \u2014 extend carefully. I've seen parties collapse by overreaching.",
    },
    e2open: {
      concentrate: (_, __, c) => `${c} showed the most promise. A careful, focused campaign there gives us the best chance.`,
      spread: () => "Diversify. If one approach didn't work, don't double down on the same strategy. Try different ground.",
      balanced: () => "A measured investment across the board. Build infrastructure for the final election. Patience.",
    },
    e3held: {
      concentrate: () => "Defend what we hold. Our legacy is measured in seats kept, not campaigns waged. Protect our record.",
      spread: () => "If this is our last fusion election, let the record show we competed with dignity everywhere.",
      balanced: () => "Balanced defense. Protect every seat. Let them explain why they banned something that was working responsibly.",
    },
    e3open: {
      concentrate: (d) => `Our best chance is ${d}. Concentrate resources there. One seat proves our model works.`,
      spread: () => "Cast a wide net. We may surprise ourselves where we least expect it.",
      balanced: () => "Steady investment everywhere. The historical record of our vote share will matter long after this election.",
    },
  },
};

// Strategy display order per advisor
const STRATEGY_ORDER = {
  ezra: ['balanced', 'concentrate', 'spread'],
  bull: ['concentrate', 'balanced', 'spread'],
  pru: ['spread', 'balanced', 'concentrate'],
};

const STRATEGY_NAMES = {
  e1: { concentrate: 'Concentrate Fire', spread: 'Broad Campaign', balanced: 'Hedged Bet' },
  e2held: { concentrate: 'Defend & Expand', spread: 'Press the Advantage', balanced: 'Protect the Base' },
  e2open: { concentrate: 'Second Chance', spread: 'Try New Ground', balanced: "Build for '96" },
  e3held: { concentrate: 'Fortress', spread: 'Final Push', balanced: 'The Full Record' },
  e3open: { concentrate: 'Last Stand', spread: 'Scatter Shot', balanced: 'Plant the Flag' },
};

function getFundContext(election, holdingSeats) {
  if (election === 1) return 'e1';
  if (election === 2) return holdingSeats ? 'e2held' : 'e2open';
  return holdingSeats ? 'e3held' : 'e3open';
}

export function getAdvisorFundStrategies(state, election, fusionChoices, fundPool, advisorId = 'ezra') {
  const scored = DISTRICT_LIST.map(d =>
    scoreDistrict(d.id, fusionChoices[d.id], state, election, advisorId)
  );
  const active = scored.filter(s => s.active).sort((a, b) => b.score - a.score);
  const ranked = active.map(s => s.districtId);

  if (ranked.length === 0) return [];

  const { concentrate, spread, balanced } = buildAllocations(ranked, fundPool);
  const dname = (did) => DISTRICTS[did]?.name || did;
  const heldSeats = getHeldDistricts(state);
  const holdingSeats = heldSeats.length > 0;
  const closestLoss = getClosestLoss(state, election);

  const ctx = getFundContext(election, holdingSeats);
  const quotes = (FUND_QUOTES[advisorId] || FUND_QUOTES.ezra)[ctx];
  const names = STRATEGY_NAMES[ctx];
  const order = STRATEGY_ORDER[advisorId] || STRATEGY_ORDER.ezra;

  const topName = dname(ranked[0]);
  const heldName = holdingSeats ? dname(heldSeats[0]) : '';
  const closestName = closestLoss ? dname(closestLoss) : topName;

  const allocationMap = { concentrate, spread, balanced };

  return order.map(id => ({
    id,
    name: names[id],
    advisorQuote: quotes[id](topName, heldName, closestName),
    get ezraQuote() { return this.advisorQuote; },
    allocation: allocationMap[id],
  }));
}

// Backward compat
export function getEzraFundStrategies(state, election, fusionChoices, fundPool) {
  return getAdvisorFundStrategies(state, election, fusionChoices, fundPool, 'ezra');
}

// ============================================================================
// Landscape + recommendation lines (per-advisor)
// ============================================================================

const LANDSCAPE_LINES = {
  ezra: {
    act1: {
      e1: [
        { check: () => true, landscape: "The year is 1892. We've got three congressional districts, three sets of candidates, and about five dollars to our name. The major parties have been at this for decades. We've been at it for about fifteen minutes. But here's what they don't understand: fusion is how third parties have won elections since the 1870s. We put our name on their ballot line. Our voters count on our line. And suddenly, we matter." },
      ],
      e2: [
        { check: (s) => s.act1.totalFusionWins > 0, landscape: "We won seats. That changes everything. The newspapers are writing about us. The candidates are returning our letters. This is exactly how the Greenbackers built power in the '80s \u2014 win through fusion, then use the leverage. The question now is: can we hold what we've got and push further?" },
        { check: () => true, landscape: "Last election taught us something. Even without winning outright, our vote totals got noticed. The major parties are doing the math \u2014 they can see our voters on the ballot line. That's the beauty of fusion: even when we lose, they know exactly how many voters we represent. Time to convert that attention into seats." },
      ],
      e3: [
        { check: (s) => s.act1.totalFusionWins >= 3, landscape: "Three elections deep and we're a force they can't ignore. This is what the Populists achieved in Kansas, in Colorado, in North Carolina. They fused, they won, and they governed. Now the question is: how far can we push before the establishment decides to change the rules on us?" },
        { check: (s) => s.act1.totalFusionWins > 0, landscape: "1896. The silver question is tearing the country apart. Bryan is running for President on a fusion ticket \u2014 Democratic and Populist both. At the state level, that's our model too. Every fusion win proves that third parties aren't spoilers. They're kingmakers." },
        { check: () => true, landscape: "This is our last shot before the winds change. The Republican Party is watching our fusion deals with growing alarm. They're already talking about passing laws to make this illegal. We need to show results now \u2014 while we still can." },
      ],
    },
  },
  bull: {
    act1: {
      e1: [
        { check: () => true, landscape: "1892. The bosses own both parties. The railroads own the bosses. And we've got three districts, a handful of dollars, and the truth. That's enough. Fusion means we put our name next to theirs on the ballot \u2014 and every vote on our line is a vote they can't ignore. Let's make some noise." },
      ],
      e2: [
        { check: (s) => s.act1.totalFusionWins > 0, landscape: "We won. They said we couldn't, and we did. The bosses are nervous. Good \u2014 they should be. Now we push harder. More districts, more votes, more seats. They built this system to keep us out. We walked in anyway." },
        { check: () => true, landscape: "Last time was a learning experience. This time it's a fight. Our voters showed up \u2014 they saw our name on the ballot and they pulled the lever. The major parties noticed. Now we show them that wasn't a fluke." },
      ],
      e3: [
        { check: (s) => s.act1.totalFusionWins >= 3, landscape: "We're winning and they're scared. That's why they're talking about changing the rules. Let them talk. Every seat we take between now and then is another nail in their coffin. Maximum pressure." },
        { check: (s) => s.act1.totalFusionWins > 0, landscape: "1896. Bryan's running on a fusion ticket for President. The whole country is watching what we've been doing at the state level. This is our moment. Win big and we change the course of history." },
        { check: () => true, landscape: "Last election before they try to shut us down. The bosses in the statehouse are already drafting bills to ban fusion. We've got one more shot to prove this works. Fight like it's the last round \u2014 because it is." },
      ],
    },
  },
  pru: {
    act1: {
      e1: [
        { check: () => true, landscape: "The year is 1892. Let me be direct with you: most third parties that form in this country are dead within a decade. The Greenbackers, the Know-Nothings, the Liberty Party \u2014 all gone. But fusion gives us something they never had: a way to win without splitting the vote. Three congressional districts. Limited funds. We must be strategic from the very beginning." },
      ],
      e2: [
        { check: (s) => s.act1.totalFusionWins > 0, landscape: "We've won seats. That's real. But I've seen parties celebrate too early and overextend. The Greenbackers won fourteen congressional seats in 1878 \u2014 and were irrelevant by 1884. Success brought ambition, and ambition brought recklessness. Let's not repeat that mistake." },
        { check: () => true, landscape: "Our first election provided valuable data. We know where our voters are, we know which candidates will work with us, and we know our limitations. That information is more valuable than any single victory. Now we use it wisely." },
      ],
      e3: [
        { check: (s) => s.act1.totalFusionWins >= 3, landscape: "Three elections, and we've built something real. I'm proud of what we've accomplished \u2014 but I'm also worried. The Republican state committee is discussing legislation to ban fusion voting. We need to protect our gains and build a record strong enough to survive whatever comes next." },
        { check: (s) => s.act1.totalFusionWins > 0, landscape: "1896 \u2014 a pivotal year. Bryan and the Populists are attempting a national fusion ticket. At the state level, we need to demonstrate that fusion produces responsible governance, not chaos. That's our best defense against the ban they're planning." },
        { check: () => true, landscape: "This may be our final election under fusion rules. Powerful interests want to ban cross-endorsement. Our best argument against that ban is a track record of responsible, effective campaigns. Every vote matters \u2014 not just for this election, but for the future of multi-party democracy." },
      ],
    },
  },
};

const RECOMMENDATION_LINES = {
  ezra: {
    act1: {
      e1: [
        { check: (s) => { const i = ensureIssuesArray(s.party?.issues); return i.includes('freeSilver') || i.includes('railroadRegulation'); }, recommendation: "I'd concentrate your money in District 3. The rural farmers there are drowning in debt and the Republican incumbent couldn't care less. If you can find a friendly Democrat to fuse with, that's your beachhead. Don't spread yourself too thin \u2014 one solid win beats three close losses." },
        { check: (s) => { const i = ensureIssuesArray(s.party?.issues); return i.includes('laborRights'); }, recommendation: "District 1 is your natural base \u2014 factory workers, immigrants, twelve-hour shifts. Focus your funds there and find a Democrat who actually cares about labor. Even a machine politician will take your votes if the math works. That's the beauty of fusion: they don't have to love us, they just have to need us." },
        { check: () => true, recommendation: "Pick your strongest district \u2014 the one where your issues resonate most \u2014 and pour your funds there. We can't afford to compete everywhere. One fusion win gets us in the door. Zero wins gets us forgotten." },
      ],
      e2: [
        { check: (s) => s.act1.betrayalOccurred, recommendation: "They burned us. I know it stings. But listen \u2014 the Populists in Kansas got betrayed by Democratic allies three times before they finally won the governor's mansion. Betrayal is part of the game. The question is whether you let it make you smarter or just make you angry." },
        { check: (s) => s.act1.totalFusionWins > 0, recommendation: "We've got momentum. Double down where we won last time \u2014 incumbents are easier to work with, and the voters already know our name. But don't ignore the other districts entirely." },
        { check: () => true, recommendation: "Same strategy, better execution. Look at where our vote share was highest last time and invest there. The carry-over from one election to the next is how fusion parties build real power." },
      ],
      e3: [
        { check: (s) => Object.values(s.act1.seatsHeld).filter(Boolean).length >= 2, recommendation: "We're holding multiple seats. That's real power \u2014 we can make or break legislation now. Protect what we have and push for one more." },
        { check: () => true, recommendation: "Last chance to build our record before the backlash comes. Every seat we hold, every vote we deliver, makes the case that fusion works. And that case matters \u2014 because powerful people are already plotting to take this tool away from us." },
      ],
    },
  },
  bull: {
    act1: {
      e1: [
        { check: (s) => { const i = ensureIssuesArray(s.party?.issues); return i.includes('laborRights'); }, recommendation: "District 1. The workers. Our people. They're getting crushed and they know it. Put your money there and fight. Don't overthink it." },
        { check: () => true, recommendation: "Pick the district where the people are angriest and put everything there. Angry voters are our voters. If we can fuse with a decent candidate, great. If not, we run alone and make noise." },
      ],
      e2: [
        { check: (s) => s.act1.betrayalOccurred, recommendation: "They stabbed us in the back? Then we don't need them. Run harder. The voters saw what happened \u2014 they know who's honest and who isn't." },
        { check: (s) => s.act1.totalFusionWins > 0, recommendation: "We won last time. Now double down. Every dollar into expanding our footprint. The bosses thought we'd go away. We're not going anywhere." },
        { check: () => true, recommendation: "New election, same fight. Hit the districts harder this time. More money, more speeches, more pressure. We don't have time for caution." },
      ],
      e3: [
        { check: (s) => Object.values(s.act1.seatsHeld).filter(Boolean).length >= 2, recommendation: "Multiple seats. That's power. Don't get comfortable \u2014 use that power to push for more. This is our last shot at the old rules." },
        { check: () => true, recommendation: "Last election before they change the rules. Everything we've got, everywhere we can fight. Leave nothing in reserve." },
      ],
    },
  },
  pru: {
    act1: {
      e1: [
        { check: (s) => { const i = ensureIssuesArray(s.party?.issues); return i.includes('suffrage') || i.includes('directDemocracy'); }, recommendation: "Focus on the district where democratic reform resonates most. A single well-chosen race, with a trustworthy fusion partner, builds our credibility far more than spreading ourselves thin." },
        { check: () => true, recommendation: "Identify your most favorable district and invest carefully. A strong showing in one district \u2014 especially a fusion victory \u2014 builds the foundation for everything that follows." },
      ],
      e2: [
        { check: (s) => s.act1.betrayalOccurred, recommendation: "We were betrayed. That's painful, but it's also information. Now we know which partners are trustworthy and which are not. Be more selective this time." },
        { check: (s) => s.act1.totalFusionWins > 0, recommendation: "We have momentum, but momentum is not a strategy. Protect the seats we've won. Expand only where we have reliable partners." },
        { check: () => true, recommendation: "Review what worked and what didn't. Invest in districts where our vote share was strongest. Build on existing support rather than chasing new ground." },
      ],
      e3: [
        { check: (s) => Object.values(s.act1.seatsHeld).filter(Boolean).length >= 2, recommendation: "Multiple seats is a remarkable achievement for a third party. Defend them. Our primary goal now is demonstrating that fusion produces stable, responsible governance." },
        { check: () => true, recommendation: "This election is about building a record. Win or lose, our vote totals and our conduct will be cited for years to come. Show that third parties can be responsible stewards." },
      ],
    },
  },
};

function resolve(lines, state) {
  if (!lines) return '';
  for (const entry of lines) {
    if (entry.check(state)) {
      return entry.landscape || entry.recommendation || '';
    }
  }
  return '';
}

export function getAdvisorLandscape(act, election, state, advisorId = 'ezra') {
  const data = LANDSCAPE_LINES[advisorId] || LANDSCAPE_LINES.ezra;
  const lines = data[`act${act}`]?.[`e${election}`];
  return resolve(lines, state);
}

export function getAdvisorRecommendation(act, election, state, advisorId = 'ezra') {
  const data = RECOMMENDATION_LINES[advisorId] || RECOMMENDATION_LINES.ezra;
  const lines = data[`act${act}`]?.[`e${election}`];
  return resolve(lines, state);
}

// ============================================================================
// Acts II and III advisor lines (per-advisor)
// ============================================================================

const ADVISOR_LINES = {
  ezra: {
    act2: {
      r1: [
        "Welcome to the spoiler trap. Every vote you win is a vote they'll blame you for.",
        "You can stand down and save your dignity, or run and watch the Republicans send you flowers.",
      ],
      r2: [
        "There are no good options here. Pick the one that lets you sleep at night.",
        "They're stealing your platform. That's what major parties do \u2014 eat the little fish and call it leadership.",
      ],
      r3: [
        "They want you to disappear. The question is whether you go quietly or loudly.",
        "You can die on principle or live on compromise. Neither feels great. That's FPTP for you.",
      ],
    },
    act3: {
      r1: [
        "Five percent gets you through the door. Now the question is what you do inside.",
        "For the first time, your voters can vote for you without fear. That changes everything.",
      ],
      r2: [
        "Coalition politics is the art of being disappointed together. But at least you're in the room.",
        "Junior partner isn't glamorous, but it beats being a footnote. Push for what matters most.",
      ],
      r3: [
        "Half a loaf is still bread. No loaf is still nothing. Don't let the perfect be the enemy of the fed.",
        "This vote defines your party. Compromise and govern, or hold the line and hope.",
      ],
    },
  },
  bull: {
    act2: {
      r1: [
        "They banned fusion to shut us up. Run anyway. Let them explain why they're afraid of democracy.",
        "FPTP is a trap and they know it. Every vote for us 'splits' the opposition? Good. Maybe they should have earned those votes.",
      ],
      r2: [
        "They stole our platform? Fine. We go further. There's always territory beyond what the major parties are willing to claim.",
        "If the Democrats are co-opting our message, it means we were right. Now we prove we're more than a message.",
      ],
      r3: [
        "Disappear? Never. We go down fighting or we don't go down at all.",
        "They want us to fold. The Populists folded. The Greenbackers folded. Every time, the working people lost a voice. Not this time.",
      ],
    },
    act3: {
      r1: [
        "We're in. Not as guests \u2014 as elected representatives. Nobody gave us this. We took it.",
        "Every vote counted. Every vote mattered. That's what proportional representation does \u2014 it makes democracy honest.",
      ],
      r2: [
        "Coalition means compromise. I hate compromise. But I hate being powerless more. Get in that room and fight for everything.",
        "Don't settle for junior partner. Push hard. The worst they can say is no, and then you push harder.",
      ],
      r3: [
        "Vote your conscience. If the bill isn't good enough, kill it and write a better one. We didn't come this far to settle.",
        "This is what power looks like \u2014 messy, imperfect, and real. Cast the vote. Make it count.",
      ],
    },
  },
  pru: {
    act2: {
      r1: [
        "This is exactly how the Greenbackers died. Fusion banned, forced into spoiler status, then absorbed or forgotten. We must be smarter than they were.",
        "Under FPTP, every vote for us helps the party we like least. That's not a theory \u2014 it's arithmetic. Choose carefully.",
      ],
      r2: [
        "The Democrats are absorbing our platform. That's happened to every successful third party in American history. The question is whether we accept it gracefully or rage uselessly.",
        "When they steal your ideas, it means your ideas won. The party didn't \u2014 but the ideas did. There's a lesson in that.",
      ],
      r3: [
        "Most third parties end here. Absorbed, exhausted, or irrelevant. But the ideas survive \u2014 in different hands, under different banners.",
        "The system was designed to produce exactly this outcome. Two parties, no more. Reform the system, or accept the result.",
      ],
    },
    act3: {
      r1: [
        "Proportional representation does what fusion tried to do \u2014 let small parties exist without punishing their voters. We're finally playing a fair game.",
        "Seats proportional to votes. Simple. Elegant. This is what democracy should have looked like from the beginning.",
      ],
      r2: [
        "Coalition government requires patience and good faith. Both are in short supply, but both are essential.",
        "The junior partner's role is thankless but crucial. Make sure your priorities are in the agreement.",
      ],
      r3: [
        "This vote is about more than one bill. It's about proving that multi-party democracy can govern effectively. Vote wisely.",
        "A compromise that passes is better than a pure bill that fails. Our voters sent us here to govern, not to grandstand.",
      ],
    },
  },
};

export function getAdvisorLine(act, round, advisorId = 'ezra') {
  const key = `r${round}`;
  const data = ADVISOR_LINES[advisorId] || ADVISOR_LINES.ezra;
  const lines = data[`act${act}`]?.[key];
  if (!lines) return '';
  return lines[Math.floor(Math.random() * lines.length)];
}

// ============================================================================
// DECISION GUIDANCE — per-advisor picks & commentary for every decision screen
// ============================================================================

const DECISION_GUIDANCE = {
  // === ACT I: Legislative Pressure ===
  legislative: {
    ezra: {
      pick: 'negotiate',
      assessment: 'Leverage is a currency \u2014 spend it wisely. Public confrontation burns bridges we may need next session.',
      options: {
        pressAlly: "Public pressure works \u2014 once. After that, they'll never trust you again.",
        negotiate: 'Behind closed doors is where deals get made. Keep the relationship intact.',
        threatenStandalone: 'An empty threat weakens us. A real one could destroy the alliance.',
        goPublic: "The newspapers will love it. Your ally won't. Choose carefully.",
      },
    },
    bull: {
      pick: 'pressAlly',
      assessment: "They made promises. Hold them to it. If they squirm, good \u2014 that means it's working.",
      options: {
        pressAlly: "Make them sweat. They'll fold. Politicians always fold when the crowd is watching.",
        negotiate: "Backroom deals favor the powerful. That ain't us. Take it public.",
        threatenStandalone: "Tell 'em straight: deliver or face a fight. They need to know we're serious.",
        goPublic: 'Burn it down. They betrayed us, the voters deserve to know.',
      },
    },
    pru: {
      pick: 'negotiate',
      assessment: "Patience. We need these alliances to last beyond a single vote. Push too hard and we'll be alone next session.",
      options: {
        pressAlly: "Public confrontation is satisfying but counterproductive. We need long-term allies, not one-time victories.",
        negotiate: "Quiet diplomacy built every successful reform coalition in this country's history.",
        threatenStandalone: "Threats only work if you're willing to follow through \u2014 and running alone hurts us more than them.",
        goPublic: 'Exposing betrayal has its place, but consider: will this gain us votes or just sympathy?',
      },
    },
  },

  // === ACT II R1: The New Reality (FPTP) ===
  fptp: {
    ezra: {
      assessment: "Without fusion, every race we enter is a spoiler gambit. Pick your battles \u2014 run where we're strong, stand down where we'd only hand seats to the opposition.",
      optionComments: {
        alone: "Running alone is a statement. Make sure it's a statement you can afford.",
        standDown: "Sometimes the bravest move is knowing when not to fight.",
      },
    },
    bull: {
      assessment: "They banned fusion to kill us. I say we show up everywhere and make them regret it. Stand down? Never.",
      optionComments: {
        alone: "Plant the flag. Show them we're still here.",
        standDown: "I hate this. But if you insist \u2014 I won't pretend to like it.",
      },
    },
    pru: {
      assessment: "This is how third parties die \u2014 forced into spoiler role, blamed for every loss. Run only where we can genuinely compete.",
      optionComments: {
        alone: 'Only run if we can genuinely compete. Symbolic campaigns waste scarce resources.',
        standDown: "Conserve our strength for fights we can win. There's no shame in strategic patience.",
      },
    },
  },

  // === ACT II R2: Blame Game ===
  blame: {
    ezra: {
      pick: 'pivot',
      assessment: "We're being blamed for the spoiler effect \u2014 whether fairly or not. How we respond determines whether we survive.",
      options: {
        apologize: 'Surrendering our independence to avoid blame. It might stop the bleeding, but we lose our identity.',
        doubleDown: "Bold, but the math doesn't lie. Running hard under FPTP just proves the spoiler charge.",
        pivot: "Find new ground. If they're stealing our issues, find issues they won't touch.",
      },
    },
    bull: {
      pick: 'doubleDown',
      assessment: "They say we're spoilers? Good. Let them be afraid of us. Fear is the only leverage we have left.",
      options: {
        apologize: "Apologize? For what \u2014 existing? That's exactly the kind of surrender they're counting on.",
        doubleDown: "Run harder. Run angrier. Make them understand we aren't going anywhere.",
        pivot: 'Finding new ground sounds smart. But it also sounds like running away.',
      },
    },
    pru: {
      pick: 'pivot',
      assessment: "I've watched this exact pattern destroy the Greenbackers and the Anti-Monopolists. The question isn't blame \u2014 it's survival.",
      options: {
        apologize: 'Coordination saves resources, but it makes us a satellite party. The Greenbackers did this. They vanished within two cycles.',
        doubleDown: 'Defiant, yes. Strategic? No. The spoiler math is real, and voters know it.',
        pivot: "New issues give us a reason to exist that doesn't require splitting votes. This is how we survive.",
      },
    },
  },

  // === ACT II R3: Absorption ===
  absorption: {
    ezra: {
      pick: 'outflank',
      assessment: "They're stealing our platform \u2014 the sincerest form of flattery and the surest way to kill a third party.",
      options: {
        cryTheft: "Accusing them feels right but sounds petty. Voters don't care who had the idea first.",
        outflank: 'Push further. If they adopted our moderate position, take the radical one. Stay ahead of them.',
        acceptReality: "A dignified death. The ideas live on \u2014 but we don't. Think carefully.",
      },
    },
    bull: {
      pick: 'cryTheft',
      assessment: 'They took our ideas and watered them down to nothing. Our voters deserve to know exactly who sold them out.',
      options: {
        cryTheft: 'Name names. Show the voters what the Democrats did to their reform bill. Let the people judge.',
        outflank: 'Go bigger. Go louder. If they took our ten-percent solution, we demand fifty percent.',
        acceptReality: "Dissolve? Over my dead body. We didn't fight this hard to hand them the keys.",
      },
    },
    pru: {
      pick: 'acceptReality',
      assessment: "Platform absorption is how every successful third party ends. The question is whether we end gracefully or pointlessly.",
      options: {
        cryTheft: 'Understandable anger, but it achieves nothing. Voters already moved to the Democrats on this issue.',
        outflank: "Radicalization energizes the base but shrinks the tent. The Liberty Party tried this. It didn't end well.",
        acceptReality: "Our ideas won, even if our party didn't. Sometimes that's the best outcome reform movements can hope for.",
      },
    },
  },

  // === ACT III R1: Issue Priority ===
  issuePriority: {
    ezra: {
      assessment: 'Under proportional representation, every vote counts \u2014 no wasted votes, no spoiler fear. Campaign on the issue that builds the broadest coalition.',
    },
    bull: {
      assessment: "Finally \u2014 a fair fight. No more spoiler games. Pick the issue that fires people up, not the safe one. This is our moment to be bold.",
    },
    pru: {
      assessment: 'Proportional representation rewards sincere voting. Choose the issue you truly believe in \u2014 the system will give us seats matching our real support.',
    },
  },

  // === ACT III R2: Coalition ===
  coalition: {
    ezra: {
      pick: 'joinDemocrat',
      assessment: 'Coalition politics is the art of the possible. We have real seats and real leverage \u2014 use them wisely.',
      options: {
        joinDemocrat: 'Junior partner gets less glory but guaranteed policy wins. Safe, steady, and we live to fight another day.',
        holdOut: "Demanding more is tempting, but they might call our bluff. We'd lose everything.",
        buildAlternative: 'An alternative coalition could reshape politics \u2014 or collapse spectacularly. High risk.',
      },
    },
    bull: {
      pick: 'buildAlternative',
      assessment: "We have seats. We have leverage. Don't settle for scraps when we could lead the table.",
      options: {
        joinDemocrat: "Junior partner? We didn't come this far to carry their water. Demand more.",
        holdOut: "Push hard. They need us more than they'll admit. Make them prove it.",
        buildAlternative: 'Build something new. The Agrarian Alliance is ready. The dissidents are willing. Lead.',
      },
    },
    pru: {
      pick: 'joinDemocrat',
      assessment: 'Coalition government rewards patience and reliability. Prove we can govern, and voters will reward us next election.',
      options: {
        joinDemocrat: 'A reliable junior partner earns trust and influence over time. This is how small parties become permanent fixtures.',
        holdOut: "Overplaying our hand could leave us with nothing. We don't have the seats to demand the moon.",
        buildAlternative: 'An exciting gamble, but coalitions built on dissidents tend to fracture. Proceed with extreme caution.',
      },
    },
  },

  // === ACT III R3: The Vote ===
  vote: {
    ezra: {
      pick: 'compromise',
      assessment: "The bill isn't perfect \u2014 no bill ever is. The question is whether half a victory today is better than a pure defeat.",
      options: {
        compromise: 'Pass it. Imperfect policy that helps people is better than perfect policy that never happens.',
        principles: 'Principled, but our voters sent us here to get things done, not to grandstand.',
        amend: 'Amendments show we\'re fighting. But pushing too hard could sink the whole bill.',
      },
    },
    bull: {
      pick: 'amend',
      assessment: "This bill is weak tea. Our people didn't put us in these seats to pass someone else's half-measure.",
      options: {
        compromise: "Half a loaf? This isn't even a quarter. But I understand taking what you can get.",
        principles: 'Kill it and write a real one. Sending a message matters \u2014 but an empty victory is still empty.',
        amend: "Push the amendment. Make them vote on the real thing. If they kill it, at least the record shows where everyone stood.",
      },
    },
    pru: {
      pick: 'compromise',
      assessment: 'Governing means making difficult choices. A weak bill that passes is worth more than a strong bill that fails.',
      options: {
        compromise: 'Pass it. Build on it next session. This is how lasting reform actually works \u2014 incrementally.',
        principles: 'Admirable in theory, destructive in practice. Our credibility depends on delivering results.',
        amend: "Amendments are worth trying, but if they fail, be ready to vote yes on the original. Don't lose everything.",
      },
    },
  },
};

/**
 * Get advisor guidance for a decision screen.
 * Returns { pick, assessment, options, optionComments } depending on screen type.
 */
export function getDecisionGuidance(screen, advisorId = 'ezra') {
  return DECISION_GUIDANCE[screen]?.[advisorId] || DECISION_GUIDANCE[screen]?.ezra || {};
}

// ============================================================================
// ADVISOR RESULT REACTIONS — contextual responses after elections
// ============================================================================

const RESULT_REACTIONS = {
  act1: {
    ezra: {
      bigWin: "That's how fusion is supposed to work. Votes on our line, seats at the table. We're building something real here.",
      smallWin: "One win is still a win. We've got a foothold. Now we need to keep it.",
      noWins: "No wins this round, but we moved the numbers. Fusion is a long game. We'll adjust and come back stronger.",
      spoiled: "We split the vote. That's the risk of running alone in a two-party system. We need to be smarter about where we fight.",
      stoodDown: "Sitting out hurts, but it's better than being the spoiler. We live to fight another day.",
    },
    bull: {
      bigWin: "Now we're talking! Two fists in the air! They can't ignore us when we're winning seats.",
      smallWin: "One seat? It's a start. Next time we take two. Then three. Then they can't stop us.",
      noWins: "We got knocked down. So what? We get up. We always get up. Nobody said this would be easy.",
      spoiled: "They're calling us spoilers? Good. Let them be afraid of what we can do. Fear is leverage.",
      stoodDown: "Standing down makes me sick, but I'll remember every district we surrendered. Next time, we fight.",
    },
    pru: {
      bigWin: "Excellent. Measured campaigns, careful alliances, real results. This is how you build a party that lasts.",
      smallWin: "One victory, earned the right way. That's worth more than three victories that burn your bridges.",
      noWins: "No victories, but no catastrophes either. We're still here, still organized, still solvent. That matters more than people think.",
      spoiled: "This is exactly what I warned about. Running alone in hostile territory doesn't prove courage \u2014 it proves bad judgment.",
      stoodDown: "Discretion is the better part of valor. We preserved our resources for battles we can actually win.",
    },
  },
  act2: {
    ezra: {
      spoiled: "Without fusion, this was always going to happen. Every vote we win is a vote that splits the opposition. The math doesn't lie.",
      noSpoil: "We avoided the worst of it, but look at these numbers. Under fusion, we'd have won seats. Under FPTP, we're invisible.",
      stoodDown: "Standing down was the pragmatic call. We saved our resources, but we also proved the system's point \u2014 third parties can't compete alone.",
    },
    bull: {
      spoiled: "So we split the vote. You know what? At least we were on the ballot. At least people had a choice. That's more than they'd get if we just disappeared.",
      noSpoil: "We showed up, we fought, and we didn't even spoil anything. But nobody's giving us credit for that, are they? The system's rigged.",
      stoodDown: "I can't believe we're standing down. This is what they want \u2014 for us to quit. Every time we don't run, they win without a fight.",
    },
    pru: {
      spoiled: "And there it is. The spoiler trap, sprung. Without fusion, we're not a party \u2014 we're a mathematical curiosity that hurts our own cause.",
      noSpoil: "Small mercies. We didn't spoil anything. But we didn't accomplish anything either. This is what FPTP does to third parties.",
      stoodDown: "The only rational choice in an irrational system. We stood down because running would have hurt the people closest to our values.",
    },
  },
};

/**
 * Get advisor's reaction to election results.
 * Pass act ('act1' or 'act2') and the results object.
 */
export function getAdvisorResultReaction(act, results, advisorId = 'ezra') {
  const reactions = RESULT_REACTIONS[act]?.[advisorId] || RESULT_REACTIONS[act]?.ezra;
  if (!reactions) return '';

  const resultsList = Object.values(results);

  if (act === 'act1') {
    const fusionWins = resultsList.filter(r => r.fusionWin).length;
    const spoiled = resultsList.filter(r => r.spoiled).length;
    const stoodDown = resultsList.filter(r => r.stoodDown).length;

    if (fusionWins >= 2) return reactions.bigWin;
    if (fusionWins === 1) return reactions.smallWin;
    if (spoiled > 0) return reactions.spoiled;
    if (stoodDown === resultsList.length) return reactions.stoodDown;
    return reactions.noWins;
  }

  if (act === 'act2') {
    const spoiled = resultsList.filter(r => r.spoiled).length;
    const stoodDown = resultsList.filter(r => r.stoodDown).length;

    if (stoodDown === resultsList.length) return reactions.stoodDown;
    if (spoiled > 0) return reactions.spoiled;
    return reactions.noSpoil;
  }

  return '';
}

/**
 * Get advisor's per-district FPTP choices (alone vs standDown).
 * Bull always picks 'alone'. Pru/Ezra base it on alignment thresholds.
 */
export function getAdvisorFPTPChoices(state, advisorId = 'ezra') {
  const profile = ADVISORS[advisorId] || ADVISORS.ezra;
  const choices = {};
  DISTRICT_LIST.forEach(d => {
    if (profile.neverStandDown) {
      choices[d.id] = 'alone';
    } else {
      const alignment = getIssueAlignment(d, ensureIssuesArray(state.party?.issues));
      choices[d.id] = alignment >= profile.aloneAlignmentThreshold ? 'alone' : 'standDown';
    }
  });
  return choices;
}

export default ADVISOR_LINES;
