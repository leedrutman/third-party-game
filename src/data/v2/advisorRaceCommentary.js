// Advisor race commentary — Gilded Age character voices
// Each advisor gives a multi-part analysis of available races
// v2.2: Two categories (state_leg / statewide) instead of 4 tiers

import { RACE_CATEGORIES } from './races.js';

// ─── HELPER: pick a random template ──────────────────────────────

function pick(arr, rng) {
  if (!arr || arr.length === 0) return '';
  return arr[Math.floor((rng ? rng() : Math.random()) * arr.length)];
}

function friendLabel(f) {
  if (f >= 0.6) return 'friendly';
  if (f >= 0.4) return 'open';
  if (f >= 0.2) return 'cool';
  return 'hostile';
}

// ─── EZRA HATCH: Vetinari meets county fair huckster ─────────────
// Numbers with folksy delivery, dry humor, card-game metaphors

const EZRA = {
  overview: {
    state_leg: [
      (r) => `${r.location}. State legislature — this is where fusion was born. Small chamber, tight margins, and a hundred votes either way changes everything. Which is precisely what we need.`,
      (r) => `${r.officeShort} in ${r.location}. Not the halls of Congress, I know. But you can't change the law from the outside. You have to be IN the legislature — or own the margin that puts someone there.`,
      (r) => `${r.location}. ${r.officeShort}. I've been counting noses all week. This is where our arithmetic actually works — a few thousand votes, and we're the difference between winning and losing.`,
    ],
    statewide: [
      (r) => `${r.office}. Now we're playing with real cards. Statewide race, statewide stakes — and statewide attention if we pull it off. The math gets harder, but the headlines get louder.`,
      (r) => `${r.officeShort}. Bigger pond, bigger fish. Our supporters are spread thinner at this level, but a showing here — even a strong one — puts us on every editor's desk in the state.`,
      (r) => `${r.office}. I won't lie to you — statewide races test a small party. But I've been doing this thirty years and I've never seen a reform party get this far. The question is: play it safe, or make history?`,
    ],
  },

  numbers: {
    tight: [
      (r) => `The handicappers call it ${r.handicapperRating.toLowerCase()}, which is their way of saying they haven't the foggiest. Partisan lean is ${r.partisanLean}. OUR numbers say we pull ${r.yourProjectedSupport}. Most people see that and laugh. I see the deciding votes in a dead-heat election.`,
      (r) => `${r.partisanLean} lean, ${r.handicapperRating.toLowerCase()} rating. We're projected at ${r.yourProjectedSupport}. Now, most people look at those numbers and see a rounding error. I look at them and see a kingmaker.`,
    ],
    lean: [
      (r) => `The lean is ${r.partisanLean}, handicappers say ${r.handicapperRating.toLowerCase()}. We're looking at ${r.yourProjectedSupport} of the vote. Not enough to win outright — never was, never will be. But enough to decide who does. And that's the whole game.`,
      (r) => `${r.partisanLean}. Handicappers rate it ${r.handicapperRating.toLowerCase()}. Our projected support is ${r.yourProjectedSupport}. Uphill, but not Everest. In a tight race, even three percent is a cannon.`,
    ],
    safe: [
      (r) => `This one leans ${r.partisanLean} — the handicappers say ${r.handicapperRating.toLowerCase()}. Our numbers land around ${r.yourProjectedSupport}. Honestly? The math is tough. But a strong showing here makes headlines that easy wins never will.`,
    ],
  },

  candidates: {
    dem_friendly: [
      (r) => `${r.dem.name} is our kind of candidate — ${r.dem.title.toLowerCase()}, reform-minded, and not yet owned by anyone who matters. I'd put our alignment at a solid seven out of ten. In this business, that practically makes them family.`,
      (r) => `The Democrat, ${r.dem.name}, is sympathetic to the cause. ${r.dem.description} They'll work with us if we make it worth their while.`,
    ],
    dem_hostile: [
      (r) => `${r.dem.name}? ${r.dem.title}. Don't let the party label fool you — this one answers to the machine, not the people. Fusion with them would be like hitching your wagon to a donkey that kicks.`,
      (r) => `The Democrat is ${r.dem.name}, and I'll be blunt: they're no friend of reform. ${r.dem.description} We'd need divine intervention for that alliance to work.`,
    ],
    rep_friendly: [
      (r) => `Now here's a surprise — ${r.rep.name}, a Republican, actually reads our pamphlets. Or at least pretends to convincingly. Either way, there's something to work with.`,
      (r) => `The Republican, ${r.rep.name}, is unexpectedly sympathetic. ${r.rep.description} Strange bedfellows, but stranger things have won elections.`,
    ],
    rep_hostile: [
      (r) => `${r.rep.name} is the boss's creature in a ${r.rep.title.toLowerCase()}'s costume. Don't waste your breath.`,
      (r) => `The Republican? ${r.rep.name}. ${r.rep.description} About as friendly to reform as a fox is to chickens.`,
    ],
  },

  recommendation: {
    strong: [
      () => `I'd put this at the top of our list. The numbers work, the candidate works, and the timing couldn't be better.`,
      () => `This is our race. Everything lines up — the math, the moment, the candidate. I say we take it.`,
    ],
    decent: [
      () => `Worth considering. The numbers aren't perfect, but they're workable — and I've won worse.`,
      () => `Not the easiest fight, but a winnable one. Sometimes you take the hand you're dealt and play it smart.`,
    ],
    weak: [
      () => `There are better fights. But if you want a challenge — and the headlines that come with it — I won't stop you.`,
      () => `I'll be honest, the arithmetic here gives me heartburn. But if you've got your heart set on it, I'll find a way to make the numbers dance.`,
    ],
  },

  incumbent_note: {
    yes: (r) => `${r.incumbentName} is the incumbent — ${r.incumbent} party. Incumbents are hard to beat, but they're also complacent. And complacent men make mistakes.`,
    open: () => `Open seat — no incumbent advantage to overcome. In my line of work, that's what we call a gift.`,
  },

  // Advice when player asks "Which race should I pick?"
  advice: {
    recommend_state_leg: [
      (sl, sw) => `Between the two? I'd take ${sl.officeShort} in ${sl.location}. State legislature is where fusion was invented — tighter margins, bigger leverage. Our ${sl.yourProjectedSupport} means more there than ${sw.yourProjectedSupport} means in a statewide race.`,
      (sl, sw) => `The ${sl.officeShort} seat. In a chamber of fifty or a hundred members, a two-percent swing wins elections. In a statewide race, two percent is just noise in the returns. Go where our votes are heaviest.`,
    ],
    recommend_statewide: [
      (sl, sw) => `The statewide race. I know it's riskier, but ${sw.officeShort} puts our name in every newspaper in the state. The ${sl.officeShort} seat is safer, sure — but safe doesn't build a movement.`,
      (sl, sw) => `I'm going to say something that surprises me: take the ${sw.officeShort} race. The candidate is better, the timing is right, and sometimes you have to bet on the bigger table to grow the party.`,
    ],
    toss_up: [
      (sl, sw) => `Honestly? Both races have merit. ${sl.officeShort} is the safer bet — tighter margins, more leverage. ${sw.officeShort} is the bigger stage. It comes down to what you want: a likely win or a louder statement.`,
    ],
  },
};

// ─── BULL MCGRAW: Sam Vimes meets union boss ─────────────────────
// Blunt, passionate, working-class metaphors, period profanity

const BULL = {
  overview: {
    state_leg: [
      (r) => `${r.location}. Good. Start where the PEOPLE are, not where the fancy boys think they are. I laid rail through country like this — hard people, honest people, and sick to death of being told who to vote for.`,
      (r) => `${r.officeShort} in ${r.location}? Now you're talking. The state legislature is where the LAWS get made. Not the governor's mansion, not Washington — HERE. You win this seat, you're in the room where it happens.`,
      (r) => `${r.location}. State house race. Every revolution starts in some godforsaken district that nobody important was paying attention to. By the time they notice, it's too late.`,
    ],
    statewide: [
      (r) => `${r.office}. The bosses are going to notice us now — which means we're doing something RIGHT. ${r.location} has backbone. Let's put it to use.`,
      (r) => `${r.officeShort}! You want to know what scares the bosses? THIS scares the bosses. A reform party competing for statewide office. They'll throw everything they've got at us.`,
      (r) => `${r.office}. Bigger ring, harder punches. The machine's got more muscle at this level, but so do we. Every worker in this state knows what the railroad's done to them.`,
    ],
  },

  numbers: {
    tight: [
      (r) => `Lean's ${r.partisanLean}, handicappers say ${r.handicapperRating.toLowerCase()}. We're polling at ${r.yourProjectedSupport}. I say the handicappers can go hang — we MAKE our own odds. Every one of our votes is a vote that MEANS something in a race this tight.`,
      (r) => `The fancy men in their offices say it's ${r.handicapperRating.toLowerCase()}, lean of ${r.partisanLean}. We're at ${r.yourProjectedSupport}. You know what that is? That's the margin of VICTORY, is what that is. Without us, NOBODY wins.`,
    ],
    lean: [
      (r) => `${r.partisanLean} lean. Handicappers call it ${r.handicapperRating.toLowerCase()}. We're looking at ${r.yourProjectedSupport}. Uphill? Sure. But I've never met a hill I couldn't climb by putting one boot in front of the other.`,
    ],
    safe: [
      (r) => `The numbers... look, I'm not going to lie to you. ${r.partisanLean}, rated ${r.handicapperRating.toLowerCase()}, and we're at ${r.yourProjectedSupport}. On paper, it's a mountain. But paper doesn't vote. PEOPLE vote. And people are angry.`,
    ],
  },

  candidates: {
    dem_friendly: [
      (r) => `${r.dem.name}. ${r.dem.title}. One of US — or close enough. ${r.dem.description} I don't trust politicians as a rule, but this one? This one I'd share a drink with.`,
      (r) => `The Democrat's ${r.dem.name}. Real person, not a machine product. ${r.dem.description} I'd work with them. God help me, I'd ENDORSE them if that's what it takes.`,
    ],
    dem_hostile: [
      (r) => `${r.dem.name}? Hah! ${r.dem.title} who sold out years ago. ${r.dem.description} I wouldn't trust them to hold my coat, let alone carry our banner.`,
      (r) => `The Democrat is ${r.dem.name}, and let me save you some time — they're a machine creature wearing a reform hat. ${r.dem.description} Don't waste our name on them.`,
    ],
    rep_friendly: [
      (r) => `Now THIS is interesting. ${r.rep.name}, Republican, and they're actually decent. ${r.rep.description} I never thought I'd say this about a Republican, but — there it is.`,
    ],
    rep_hostile: [
      (r) => `${r.rep.name}. The machine's lapdog. ${r.rep.description} The day I endorse THAT is the day I hand in my union card.`,
      (r) => `The Republican is ${r.rep.name}. ${r.rep.title}. Just another railroad puppet with clean fingernails. Forget it.`,
    ],
  },

  recommendation: {
    strong: [
      () => `THIS is our fight. The right race, the right moment, the right candidate. Let's go in there and show them what a real party looks like.`,
      () => `I say we go here. Not because it's easy — because it MATTERS. And because we can WIN.`,
    ],
    decent: [
      () => `It's a fight worth having. Not the easiest punch to land, but since when do WE pick easy?`,
      () => `Could work. Could also end bloody. But that's never stopped us before, and by God it won't stop us now.`,
    ],
    weak: [
      () => `Look, I'm not going to pretend the odds are friendly. But sometimes you fight because the fight needs fighting, win or lose.`,
      () => `Tough one. Real tough. But there's honor in a hard fight, even if you lose — and sometimes the fight you lose today is the one that wins the war tomorrow.`,
    ],
  },

  incumbent_note: {
    yes: (r) => `The incumbent is ${r.incumbentName} — ${r.incumbent} party. Sitting pretty in their chair. Well, chairs tip over. I've seen it happen.`,
    open: () => `Open seat. No incumbent to drag out of their chair. That's not luck — that's opportunity knocking. And we're going to kick the damn door down.`,
  },

  advice: {
    recommend_state_leg: [
      (sl, sw) => `The ${sl.officeShort} seat. No question. The state legislature is where laws get WRITTEN. ${sw.officeShort} is a bigger stage, sure, but our people — the WORKERS — they win races in districts, not across a whole damn state.`,
      (sl, sw) => `Go to ${sl.location}. I know the ${sw.officeShort} race looks impressive, but you know what's MORE impressive? Actually WINNING. Our ${sl.yourProjectedSupport} means something in a tight legislative race.`,
    ],
    recommend_statewide: [
      (sl, sw) => `The ${sw.officeShort} race. I know it's bigger and meaner, but by GOD, look at that candidate! This is our chance to put our name on every broadsheet in the state. You don't build a movement by hiding in safe districts.`,
      (sl, sw) => `Statewide. I'm as surprised as you are. But the numbers on the ${sw.officeShort} race — the candidate, the timing — it's calling to us. Sometimes you swing for the fences because that's where the home runs are.`,
    ],
    toss_up: [
      (sl, sw) => `Both good fights. ${sl.officeShort} is where our fists hit hardest — small race, every vote a thunderbolt. ${sw.officeShort} is where the whole STATE hears the thunder. Depends on whether you want to win a battle or start a war.`,
    ],
  },
};

// ─── PRU WHITMORE: Granny Weatherwax meets political operative ───
// Acerbic, knowing, historical references, devastating one-liners

const PRU = {
  overview: {
    state_leg: [
      (r) => `${r.location}. Small. Unglamorous. Exactly where we need to be. I've buried six reform parties in my lifetime, and every single one of them died trying to start at the top. The ones that survived? They started in the state legislature.`,
      (r) => `${r.officeShort}, ${r.location}. I know it doesn't sound like history. But history has a nasty habit of starting in places no one was watching. The Populists started in state races too.`,
      (r) => `${r.location}. Not the most glamorous battle in the war for democracy, I grant you. But the Liberty Party started with state seats too. Of course, they're dead now. Don't be the Liberty Party.`,
    ],
    statewide: [
      (r) => `${r.office}. We're moving up in the world. The question is whether we've earned it or we're just getting ambitious. I've seen the difference. It matters.`,
      (r) => `${r.officeShort}. The air is thinner at the statewide level and the knives are sharper. But if we've built our base properly, we belong at this table. If we haven't — well. We'll find out.`,
      (r) => `${r.office}. I've waited twenty years to see a reform party compete at this level. I should feel excited. Instead I feel cautious — because this is precisely where parties overreach and die.`,
    ],
  },

  numbers: {
    tight: [
      (r) => `The partisan lean is ${r.partisanLean}. Handicappers rate it ${r.handicapperRating.toLowerCase()}. Our projected support is ${r.yourProjectedSupport}. Not enough to win outright, but MORE than enough to decide who does. That is power, if you have the sense to use it.`,
      (r) => `${r.partisanLean}, ${r.handicapperRating.toLowerCase()} race. We're at ${r.yourProjectedSupport}. In a tight race, that makes us the most important voters in the district. Both sides know it. Use that.`,
    ],
    lean: [
      (r) => `The lean is ${r.partisanLean}, rated ${r.handicapperRating.toLowerCase()}. We project ${r.yourProjectedSupport}. The math is possible but unforgiving. Every vote must count, and every choice must be the right one.`,
    ],
    safe: [
      (r) => `${r.partisanLean}. ${r.handicapperRating}. Our support: ${r.yourProjectedSupport}. I won't dress it up — the numbers are hard. But I've seen harder numbers bend when the cause was right and the organization was sharp.`,
    ],
  },

  candidates: {
    dem_friendly: [
      (r) => `${r.dem.name} is... acceptable. ${r.dem.description} Reform-curious, which is the most you can ask from a Democrat in this state. They won't betray us. At least, not until Tuesday.`,
      (r) => `The Democrat, ${r.dem.name}. ${r.dem.description} A genuine ally, or close enough. I've seen worse foundations for a partnership. I've also seen better — but we work with what we have.`,
    ],
    dem_hostile: [
      (r) => `${r.dem.name}. ${r.dem.title}. ${r.dem.description} I've met their type before — the kind who calls themselves a reformer while cashing checks from the very people we're fighting. Pass.`,
      (r) => `The Democrat is ${r.dem.name}, and they are exactly as useful to our cause as a chocolate teapot. ${r.dem.description} Don't waste our credibility on them.`,
    ],
    rep_friendly: [
      (r) => `${r.rep.name}. Republican. And — this may surprise you — not entirely terrible. ${r.rep.description} Strange alliances win strange elections. I've seen it before.`,
    ],
    rep_hostile: [
      (r) => `${r.rep.name} is the establishment's creature in a ${r.rep.title.toLowerCase()}'s clothing. ${r.rep.description} Fusing with them would be like a lamb endorsing the butcher.`,
      (r) => `The Republican, ${r.rep.name}. ${r.rep.description} I have seen reform parties destroy themselves by allying with people like this. I will not watch it happen again.`,
    ],
  },

  recommendation: {
    strong: [
      () => `This is the one. The numbers work, the candidate is real, and the stakes are right. Don't overthink it.`,
      () => `If I were placing a bet — and I am NOT a gambling woman — this is where I'd put our chips. Everything aligns.`,
    ],
    decent: [
      () => `A reasonable fight. Not our best option, not our worst. The kind of race where smart strategy makes the difference.`,
      () => `Possible. Not certain, but possible — which is more than most reform parties ever get. I'd consider it.`,
    ],
    weak: [
      () => `Difficult. Very difficult. But difficulty has never been a reason not to try — only a reason to try CAREFULLY.`,
      () => `The prudent part of me says no. The part of me that's been fighting for twenty years says... maybe. But only if everything goes right.`,
    ],
  },

  incumbent_note: {
    yes: (r) => `${r.incumbentName} holds the seat — ${r.incumbent} party. Incumbents have the advantage of inertia, which in politics is remarkably powerful. We'll need to give voters a positive reason to change, not just anger.`,
    open: () => `Open seat. No incumbent advantage. In my experience, open seats are where reform parties do their best work — there's no personal loyalty to overcome, only the machine.`,
  },

  advice: {
    recommend_state_leg: [
      (sl, sw) => `The state legislature. Without hesitation. Our ${sl.yourProjectedSupport} in a tight legislative race is LEVERAGE. Our ${sw.yourProjectedSupport} in a statewide race is a footnote. I did not come here to be a footnote.`,
      (sl, sw) => `${sl.officeShort} in ${sl.location}. The statewide race is glamorous, but glamour is how reform parties die — reaching for the spotlight when they should be building the foundation. Build first. Shine later.`,
    ],
    recommend_statewide: [
      (sl, sw) => `The ${sw.officeShort} race. I'm not in the habit of recommending risk, but the candidate for ${sw.officeShort} is genuinely sympathetic, and the race is tight enough for our votes to matter. Sometimes the smart play is the ambitious one.`,
      (sl, sw) => `Statewide, and I'll tell you why: ${sw.officeShort} puts reform on the front page. The legislative seat is safer, yes. But safe choices don't change history. This one might.`,
    ],
    toss_up: [
      (sl, sw) => `Both are defensible choices. The ${sl.officeShort} race is where our leverage is strongest — small margins, decisive votes. The ${sw.officeShort} race is where our name travels furthest. Choose whether you want depth or breadth this round.`,
    ],
  },
};

// Modern advisors map to similar archetypes for race commentary
// sam → ezra (data pragmatist), rosa → bull (passionate organizer), hank → pru (veteran strategist)
const ADVISOR_VOICES = { ezra: EZRA, bull: BULL, pru: PRU, sam: EZRA, rosa: BULL, hank: PRU };

// ─── COMMENTARY GENERATOR ────────────────────────────────────────

function getRatingCategory(race) {
  const rating = race.handicapperRating.toLowerCase();
  if (rating.includes('toss') || rating === 'even') return 'tight';
  if (rating.includes('lean')) return 'lean';
  return 'safe'; // likely or safe
}

function getRecommendationStrength(race) {
  // Combine pivotal factor and best candidate friendliness
  const bestFriendly = Math.max(race.dem.friendliness, race.rep.friendliness);
  const score = race.pivotalFactor * 0.6 + bestFriendly * 0.4;
  if (score >= 0.6) return 'strong';
  if (score >= 0.4) return 'decent';
  return 'weak';
}

/**
 * Generate advisor commentary for a specific race.
 */
export function getAdvisorRaceCommentary(advisorId, race, round, winsCount, previousResults) {
  const voice = ADVISOR_VOICES[advisorId] || ADVISOR_VOICES.ezra;

  // Use a simple deterministic seed from race id for consistent picks
  let seed = 0;
  for (let i = 0; i < race.id.length; i++) seed += race.id.charCodeAt(i);
  const pseudoRng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

  // Category key (state_leg or statewide)
  const categoryKey = race.category || 'state_leg';
  const overviewTemplates = voice.overview[categoryKey] || voice.overview.state_leg;

  // Numbers category
  const numCat = getRatingCategory(race);
  const numTemplates = voice.numbers[numCat] || voice.numbers.lean;

  // Candidate assessment
  const demCat = race.dem.friendliness >= 0.4 ? 'dem_friendly' : 'dem_hostile';
  const repCat = race.rep.friendliness >= 0.4 ? 'rep_friendly' : 'rep_hostile';
  const demTemplates = voice.candidates[demCat];
  const repTemplates = voice.candidates[repCat];

  // Recommendation
  const strength = getRecommendationStrength(race);
  const recTemplates = voice.recommendation[strength];

  // Incumbent
  const incNote = race.incumbent === 'Open Seat'
    ? voice.incumbent_note.open()
    : voice.incumbent_note.yes(race);

  return {
    overview: pick(overviewTemplates, pseudoRng)(race),
    numbers: pick(numTemplates, pseudoRng)(race) + ' ' + incNote,
    candidateRead: pick(demTemplates, pseudoRng)(race) + ' ' + pick(repTemplates, pseudoRng)(race),
    recommendation: pick(recTemplates, pseudoRng)(),
    strength,
  };
}

// ─── RACE ADVICE (Ask for Advice button) ─────────────────────────

/**
 * Generate advisor's recommendation when player clicks "Ask for Advice".
 * Compares the two available races and recommends one.
 */
export function getAdvisorRaceAdvice(advisorId, stateLegRace, statewideRace, round, winsCount) {
  const voice = ADVISOR_VOICES[advisorId] || ADVISOR_VOICES.ezra;

  const slStrength = getRecommendationStrength(stateLegRace);
  const swStrength = getRecommendationStrength(statewideRace);

  const strengthOrder = { strong: 3, decent: 2, weak: 1 };
  const slScore = strengthOrder[slStrength] || 1;
  const swScore = strengthOrder[swStrength] || 1;

  let category;
  if (slScore > swScore) {
    category = 'recommend_state_leg';
  } else if (swScore > slScore) {
    category = 'recommend_statewide';
  } else {
    category = 'toss_up';
  }

  // Deterministic pick based on round
  let seed = round * 7 + (winsCount * 13);
  const pseudoRng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

  const templates = voice.advice[category];
  return {
    text: pick(templates, pseudoRng)(stateLegRace, statewideRace),
    recommendation: category === 'recommend_state_leg' ? 'state_leg' : category === 'recommend_statewide' ? 'statewide' : null,
  };
}

// ─── TRANSITION LINES (round-to-round) ───────────────────────────

const TRANSITION = {
  ezra: {
    win: [
      (prev) => `After that win, the arithmetic just changed. People are paying attention — three state legislators returned my calls this week who wouldn't spit on us before. We've got options now.`,
      (prev) => `A win is a win, and this one COUNTS. The handicappers are adjusting their numbers. The newspapers are writing our name without quotation marks. Time to think bigger.`,
    ],
    loss: [
      () => `We lost. It happens. The smart move is to learn from the numbers, not cry about them. We've still got cards to play — just fewer of them.`,
      () => `Not the result we wanted. The math was always tight, and it didn't break our way. But we're still standing, still organizing, still in the game. Let's find a fight we can win.`,
    ],
    spoiler: [
      () => `We split the vote. I know — not what we planned. The papers are calling us a spoiler, which is their way of saying we mattered. Cold comfort, but comfort nonetheless. Let's be smarter this time.`,
      () => `Vote split. The worst outcome. Our voters did exactly what the doom loop predicts — and the establishment's man walked in. This is why fusion matters. Let's not make that mistake again.`,
    ],
    first_round: [
      () => `All right, first race. Let me walk you through what we're looking at. Remember — we're new, we're small, and nobody knows our name yet. The goal here isn't to conquer the world. It's to get on the map and prove our votes can decide an election.`,
    ],
  },
  bull: {
    win: [
      () => `We WON. By God, we actually won. The bosses are furious, the workers are cheering, and I haven't slept in three days but who the HELL needs sleep? We've got bigger fights to pick now.`,
      () => `Victory. REAL victory, not the watered-down kind the machine hands out. They're scared of us now — I can feel it. Let's give them something to be scared ABOUT.`,
    ],
    loss: [
      () => `We lost. All right. I've been knocked down before. The trick is you get back up angrier than you went down. Nobody promised us this would be easy — they promised us it would be WORTH IT.`,
      () => `Didn't win this one. Damn it. But I'll tell you what — I've seen elections stolen by men with less backbone than a jellyfish, and I've STILL come back to fight the next one. We're not done.`,
    ],
    spoiler: [
      () => `We split the damn vote. THAT is what happens when we try to go it alone in a rigged system. I hate endorsing other people's candidates — HATE it — but I hate losing to the machine more. Lesson learned.`,
    ],
    first_round: [
      () => `First fight. Listen up. We're new, we're small, and every political boss in this state thinks we're a joke that'll be dead by Christmas. I say we prove them wrong, starting TODAY. It won't be pretty. It won't be big. But it'll be OURS.`,
    ],
  },
  pru: {
    win: [
      () => `We won. I'd like to say I'm surprised, but I'm not — I'm relieved. There is a difference. Relief means we did the work and the work paid off. Now: don't get drunk on it. The next fight is always harder than the last.`,
      () => `A win. A real, counted, certified win. The seventh reform party I've worked with is the first one to have more victories than funerals. Let's keep it that way.`,
    ],
    loss: [
      () => `We lost. I've lost before. The question isn't whether you fall — every party falls. The question is whether you've built something strong enough to stand back up. We have. Let's prove it.`,
      () => `Not the outcome we wanted. But I've seen parties destroyed by one loss — the ones that panicked, changed everything, abandoned their strategy. We will not be those people. We adjust. We continue.`,
    ],
    spoiler: [
      () => `We split the vote and handed the election to the worst candidate on the ballot. I warned that this could happen. I do not say that to be cruel — I say it because we must NEVER let it happen again. Fusion exists for precisely this reason.`,
    ],
    first_round: [
      () => `Our first election. I've been here before — the hope, the energy, the terrifying suspicion that it's all going to end in tears. Six times I've watched reform parties charge into their first race. The ones that survived were the ones that were REALISTIC about what a first race means. It means survival. Not glory. Survival.`,
    ],
  },
};

// Modern advisor transition mappings
const TRANSITION_MAP = { ...TRANSITION, sam: TRANSITION.ezra, rosa: TRANSITION.bull, hank: TRANSITION.pru };

/**
 * Generate transition commentary between rounds.
 */
export function getAdvisorTransitionLine(advisorId, round, winsCount, previousResults) {
  const voice = TRANSITION_MAP[advisorId] || TRANSITION_MAP.ezra;

  if (round === 1) {
    return pick(voice.first_round)();
  }

  const lastResult = previousResults[previousResults.length - 1];
  if (!lastResult) return pick(voice.first_round)();

  let category;
  if (lastResult.spoiled) category = 'spoiler';
  else if (lastResult.playerWon) category = 'win';
  else category = 'loss';

  return pick(voice[category])(lastResult);
}
