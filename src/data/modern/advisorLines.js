// Modern Advisor Lines: Same structure as v2, modern voices
// Three advisors: Sam Metric (data), Rosa Varga (fighter), Hank Boudreaux (veteran strategist)

export const ADVISORS = {
  sam: {
    id: 'sam',
    name: 'Sam Metric',
    firstName: 'Sam',
    title: 'Campaign Data Strategist',
    catchphrase: 'Run the numbers.',
    description: "Former party data director who quit in disgust. Speaks in polling crosstabs and path-to-victory math. Believes the spreadsheet never lies — only the people reading it.",
    hint: 'Reads the data. Recommends whatever path has the best win probability.',
    portraitTraits: { faceShape: 'oval', hairStyle: 'short', hairColor: '#3D2B1F', facialHair: 'none', hat: 'none', collar: 'standard', glasses: true },
  },
  rosa: {
    id: 'rosa',
    name: 'Rosa Varga',
    firstName: 'Rosa',
    title: 'Community Organizer',
    catchphrase: 'Fight for it.',
    description: "From the rust belt side of the state. Watched her factory town get hollowed out while both parties did nothing. Learned that marches alone don't change laws — but she still doesn't trust the system.",
    hint: 'Prefers direct action. Only fuses when the alternative is worse.',
    portraitTraits: { faceShape: 'round', hairStyle: 'wavy', hairColor: '#1C1C1C', facialHair: 'none', hat: 'none', collar: 'standard' },
  },
  hank: {
    id: 'hank',
    name: 'Hank Boudreaux',
    firstName: 'Hank',
    title: 'Retired Campaign Strategist',
    catchphrase: 'Trust the process.',
    description: "Been through every reform war since Perot. Cajun to the core. Tells stories at a bar but every word is calculated. The kind of guy who'll buy you a drink and steal your caucus.",
    hint: "Old hand. Only backs moves he's seen work before.",
    portraitTraits: { faceShape: 'square', hairStyle: 'parted', hairColor: '#8B8682', facialHair: 'none', hat: 'none', collar: 'standard' },
  },
};

// Introduction speeches (shown when advisor is selected)
export const INTRODUCTIONS = {
  sam: "I'm Sam Metric. I spent six years as a party data director, running the models, optimizing the targeting, watching us lose winnable races because leadership couldn't read a crosstab. I quit. Now I'm here. Fusion — cross-endorsement — it's the only math that works for a party our size. You put our name on the ballot next to a major-party candidate, our voters count double: once for the candidate, once for us. I'll show you where the numbers line up and where they don't.",
  rosa: "Rosa Varga. I'm from Kendrick Falls — or what's left of it. Both parties watched the plant close, watched the town empty out, and neither one did a damn thing. I organized the protests. Got arrested twice. Learned something: marching feels good but it doesn't pass laws. Fusion means we can actually put people in office who'll fight for our communities. I don't love working with the major parties. But I love losing less.",
  hank: "Hank Boudreaux. I tell you what, cher, I've been doing this since Ross Perot was polling at thirty percent and everybody thought the two-party system was finished. It wasn't. I've watched reform parties, third parties, independent candidates — twenty of them, easy. Nineteen are lobbyists now. Fusion is different. Cross-endorsement lets a small party punch above its weight without splitting the vote. I've seen it work. I've also seen it go wrong. Let's make sure we do it right.",
};

// Per-round advisor recommendations
// Each advisor recommends a different strategy for each round
export function getAdvisorRecommendation(advisorId, round, demCandidate, repCandidate) {
  const advisor = ADVISORS[advisorId] || ADVISORS.sam;
  const demFriendly = demCandidate.friendliness >= 0.4;
  const repFriendly = repCandidate.friendliness >= 0.4;
  const demBought = demCandidate.boughtByBlackwood;
  const repBought = repCandidate.boughtByBlackwood;

  // Check if the choice is genuinely ambiguous (both candidates similarly friendly)
  const friendlinessGap = Math.abs(demCandidate.friendliness - repCandidate.friendliness);
  const isAmbiguous = friendlinessGap < 0.15 && demFriendly && repFriendly && !demBought && !repBought;

  // Sam: pragmatic — fuse with whoever gives best odds
  if (advisorId === 'sam') {
    if (demBought && repBought) {
      return {
        recommended: 'alone',
        line: "Both candidates are compromised. The model says run alone and build name recognition.",
        fuseDemLine: demBought
          ? `${demCandidate.name} took Vex's money. Fusing with a puppet zeros out our credibility metric.`
          : demFriendly
            ? `${demCandidate.name} is workable. The crosstabs support it.`
            : `${demCandidate.name} is cool to us, but there might be a path in the margins.`,
        fuseRepLine: repBought
          ? `${repCandidate.name} is running Vex's playbook. Don't waste our brand on that.`
          : repFriendly
            ? `${repCandidate.name} — surprising, but the model gives it a positive coefficient.`
            : `${repCandidate.name} doesn't align with our base. The data is clear.`,
        aloneLine: "Three-way race is suboptimal, but at least we keep our integrity score intact.",
      };
    }
    if (isAmbiguous) {
      const rec = demCandidate.friendliness >= repCandidate.friendliness ? 'fuse_dem' : 'fuse_rep';
      return {
        recommended: rec,
        line: `The model is within the margin of error on this one. Both candidates are viable. I'd give ${rec === 'fuse_dem' ? demCandidate.name : repCandidate.name} a slight edge in the crosstabs, but this is a judgment call, not a data call.`,
        fuseDemLine: `${demCandidate.name} — the numbers work. Win probability is real.`,
        fuseRepLine: `${repCandidate.name} — also viable. Don't rule it out based on party label.`,
        aloneLine: "Running alone when the data shows two viable partners? That's leaving points on the board.",
      };
    }
    if (demCandidate.friendliness >= repCandidate.friendliness && !demBought) {
      return {
        recommended: 'fuse_dem',
        line: `Fuse with ${demCandidate.name}. The crosstabs say we win this by 2.3 points if we combine. That's not a guess, that's math.`,
        fuseDemLine: `${demCandidate.name} is our highest-probability path. Combined vote share beats the Republican cleanly.`,
        fuseRepLine: repFriendly && !repBought
          ? `${repCandidate.name} is possible, but the Democrat gives us better margins across every demographic slice.`
          : `${repCandidate.name} — the data doesn't support it.`,
        aloneLine: "Running alone splits the vote. We hand the seat to Vex's people. That's what the model says.",
      };
    }
    if (!repBought) {
      return {
        recommended: 'fuse_rep',
        line: `The Democrat's a dead end. Fuse with ${repCandidate.name} — it's unconventional, but the model gives it a positive win probability.`,
        fuseDemLine: demBought
          ? `${demCandidate.name} is running Vex's algorithm now. The data is contaminated.`
          : `${demCandidate.name} polls lukewarm with our base. Weak signal.`,
        fuseRepLine: `${repCandidate.name} is our best option this cycle. Sometimes the data surprises you.`,
        aloneLine: "Running alone is a negative-expected-value play. I don't recommend it.",
      };
    }
    return {
      recommended: 'alone',
      line: "Nobody worth fusing with this cycle. We run alone and build our dataset for next time.",
      fuseDemLine: `${demCandidate.name} — the trust metrics aren't there.`,
      fuseRepLine: `${repCandidate.name} — we'd be endorsing Vex's agenda. The model red-flags it.`,
      aloneLine: "Long shot, but at least we control the variables.",
    };
  }

  // Rosa: prefers alone — only fuses when the alternative is catastrophic
  if (advisorId === 'rosa') {
    if (round <= 2) {
      return {
        recommended: 'alone',
        line: "We didn't build this party to rubber-stamp their candidates. Run alone. Let people see our name and know we mean it.",
        fuseDemLine: demFriendly && !demBought
          ? `${demCandidate.name} talks a good game, but where were they when Kendrick Falls lost its last factory?`
          : `${demCandidate.name}? That's their candidate, not ours.`,
        fuseRepLine: `${repCandidate.name}? A Republican? After what they did to labor protections? You're kidding me.`,
        aloneLine: "Every ballot with our name on it tells the establishment we're not going away.",
      };
    }
    // Later rounds: Rosa grudgingly acknowledges fusion might be necessary
    if (isAmbiguous) {
      return {
        recommended: 'fuse_dem',
        line: `Both of them are... tolerable. I hate saying that. Either one could work. The Democrat at least showed up to the town hall in Kendrick Falls.`,
        fuseDemLine: `${demCandidate.name} — at least they've been to our side of the tracks. Barely.`,
        fuseRepLine: `${repCandidate.name} — I can't believe I'm even considering this, but they're not the worst I've seen.`,
        aloneLine: "Part of me wants to fight alone. But we've come too far to throw it away on pride.",
      };
    }
    if (demCandidate.friendliness >= 0.6 && !demBought) {
      return {
        recommended: 'fuse_dem',
        line: `Fine. ${demCandidate.name} is actually showing up for working people. I'll swallow my pride this once.`,
        fuseDemLine: `${demCandidate.name} actually walked a picket line. That matters to me.`,
        fuseRepLine: `${repCandidate.name}? I'd rather lose with our dignity intact.`,
        aloneLine: "Part of me says fight alone. But even organizers can count votes.",
      };
    }
    return {
      recommended: 'alone',
      line: "Neither of them earned our endorsement. Both parties sat there while communities like mine died. We fight our own fight.",
      fuseDemLine: demBought
        ? `${demCandidate.name} sold out to Vex. I'd sooner burn my voter card than fuse with a corporate puppet.`
        : `${demCandidate.name} — not enough spine for my taste.`,
      fuseRepLine: `${repCandidate.name} — I don't fuse with the people who killed my town.`,
      aloneLine: "We run alone. We fight. That's what we do.",
    };
  }

  // Hank: cautious — only fuses with genuinely friendly candidates
  if (advisorId === 'hank') {
    if (isAmbiguous) {
      return {
        recommended: demCandidate.friendliness >= repCandidate.friendliness ? 'fuse_dem' : 'fuse_rep',
        line: `I tell you what, cher, this is a coin-flip. I've been doing this long enough to know that sometimes there's no right answer. Both have merits. Both could burn you. Pick the one you can live with if it goes sideways.`,
        fuseDemLine: `${demCandidate.name} — a reasonable partner. Not a soulmate, but you don't need soulmates in politics.`,
        fuseRepLine: `${repCandidate.name} — stranger alliances have won elections. I've seen it.`,
        aloneLine: "Running alone when you got two possible allies? That dog won't hunt, cher.",
      };
    }
    if (demCandidate.friendliness >= 0.6 && !demBought) {
      return {
        recommended: 'fuse_dem',
        line: `${demCandidate.name} is the real thing. I've seen enough fakes to know the difference. This is the kind of fusion that actually works.`,
        fuseDemLine: `I've watched a lot of politicians break their word. ${demCandidate.name} hasn't broken theirs. Not yet, anyway.`,
        fuseRepLine: repFriendly && !repBought
          ? `${repCandidate.name} says the right things, but cher, I've heard Republicans promise reform before. Didn't end well.`
          : `${repCandidate.name} — I wouldn't trust that one with a borrowed nickel.`,
        aloneLine: "Running alone when we have a genuine ally? That's how reform parties die. I've buried enough of them.",
      };
    }
    if (repCandidate.friendliness >= 0.5 && !repBought) {
      return {
        recommended: 'fuse_rep',
        line: `Now this is unusual, but ${repCandidate.name} might actually be worth fusing with. I tell you what, politics makes strange bedfellows.`,
        fuseDemLine: demBought
          ? `${demCandidate.name} took Vex's money. I've seen this movie, cher. Walk away before the credits roll.`
          : `${demCandidate.name} — lukewarm allies are more dangerous than honest enemies. Trust me on that.`,
        fuseRepLine: `${repCandidate.name} seems genuine. And sometimes the unlikely alliance is the one that holds.`,
        aloneLine: "Running alone wastes every door our people knocked on.",
      };
    }
    // No good ally available
    return {
      recommended: 'alone',
      line: "Neither one passes the smell test, cher. Better to run alone than fuse with somebody who'll sell you out on election night.",
      fuseDemLine: demBought
        ? `${demCandidate.name} is running Vex's playbook. Fusing with that is how you end up on a lobbying firm's letterhead.`
        : `${demCandidate.name} — not committed enough. They'll fold when Vex's super PAC starts running ads.`,
      fuseRepLine: `${repCandidate.name} — cher, I've watched twenty reform parties die trusting the wrong people.`,
      aloneLine: "We stand alone. I've seen worse starting positions. At least we survive with our name intact.",
    };
  }

  // Fallback
  return {
    recommended: 'fuse_dem',
    line: 'Consider fusing with the Democrat.',
    fuseDemLine: 'The Democrat is a potential ally.',
    fuseRepLine: 'The Republican is a risky choice.',
    aloneLine: 'Running alone is always an option.',
  };
}

// Advisor reactions to election results
export function getAdvisorResultReaction(advisorId, playerWon, choice, round) {
  if (advisorId === 'sam') {
    if (playerWon) {
      return round >= 4
        ? "The model predicted this. We're in Vex's threat matrix now — and that means we're winning."
        : "Smart play. The data doesn't lie.";
    }
    if (choice === 'alone') {
      return "Three-way race. Exactly what the model flagged. The vote split killed us.";
    }
    return "We lost this cycle. But we generated data. Next round, we adjust the inputs.";
  }

  if (advisorId === 'rosa') {
    if (playerWon && choice === 'alone') {
      return "We won on our own terms! Nobody handed us that — we organized for it and we took it!";
    }
    if (playerWon) {
      return "A win is a win. I'll take it, even if we had to share the ballot to get it.";
    }
    if (choice !== 'alone') {
      return "Fusion didn't save us. Next time, maybe we trust our own people instead of theirs.";
    }
    return "We lost, but we fought under our own banner. I don't regret that for a second.";
  }

  if (advisorId === 'hank') {
    if (playerWon) {
      return round >= 4
        ? "Cher, careful choices add up. We're still standing, and in this game, that's everything."
        : "Good result. But stay sharp — Vex isn't done with us. Not by a long shot.";
    }
    if (choice === 'alone') {
      return "Running alone was a gamble. I wish we'd had a trustworthy partner on that one.";
    }
    return "The alliance didn't hold. We need to pick our partners more carefully next time, cher.";
  }

  return "The results are in.";
}

// Advisor landscape briefing (shown before the choice)
export function getAdvisorBriefing(advisorId, round, demCandidate, repCandidate) {
  const stage = round;

  if (advisorId === 'sam') {
    if (stage === 1) return "First election cycle. We're polling at noise level. We need to prove fusion works — pick a viable partner and generate a win.";
    if (stage === 2) return "We're on the radar now. Vex's algorithm is flagging us. The data environment just got more complicated.";
    if (stage === 3) return "Vex's super PAC is buying candidates. The model shows new variables we didn't have before. Read the updated data.";
    if (stage === 4) return "Targeted digital ads against us. Our favorables took a hit. We need a high-efficiency play.";
    return "Final cycle. If we don't win big, they'll push the anti-fusion bill through. Every variable matters now.";
  }

  if (advisorId === 'rosa') {
    if (stage === 1) return "Our first fight. Let's make it count. I say we show them that real people still run for office.";
    if (stage === 2) return "Vex noticed us. Good. Let the billionaires worry for once.";
    if (stage === 3) return "They're buying people off with super PAC money? That just proves we're a threat.";
    if (stage === 4) return "Attack ads? Algorithms targeting our voters? They're scared of us. Fight harder.";
    return "Last round. They want to ban fusion? Then let's win so big they choke on it.";
  }

  if (advisorId === 'hank') {
    if (stage === 1) return "First test, cher. Let's not overreach. Find a genuine ally and build from there. I've seen too many parties blow it in round one.";
    if (stage === 2) return "Vex is leaning on candidates. Watch for anyone who's suddenly gone quiet on reform. I've seen that silence before.";
    if (stage === 3) return "Somebody took Vex's super PAC money. I tell you what, I've seen this movie before. Be very careful who you trust.";
    if (stage === 4) return "The digital smear campaign is ugly but predictable. Stay focused on who we can actually count on, cher.";
    return "The anti-fusion bill is coming. This is the moment, cher. Everything I've learned in thirty years of reform wars comes down to this.";
  }

  return "Here's the situation.";
}
