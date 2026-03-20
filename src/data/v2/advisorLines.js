// v2 Advisor Lines: Simplified for one-choice-per-round format
// Each advisor gives a recommendation and reactions for each choice.

export const ADVISORS = {
  ezra: {
    id: 'ezra',
    name: 'Ezra Hatch',
    firstName: 'Ezra',
    title: 'Populist Campaign Strategist',
    catchphrase: 'Read the room.',
    description: "Organized three Farmers' Alliance chapters. Knows every ward boss and newspaper editor between here and the Mississippi. Pragmatic to the bone.",
    hint: 'Reads the math. Recommends whatever is most likely to win.',
    portraitTraits: { faceShape: 'oval', hairStyle: 'wavy', hairColor: '#5C4033', facialHair: 'mustache', hat: 'bowler', collar: 'standard' },
  },
  bull: {
    id: 'bull',
    name: 'Cornelius "Bull" McGraw',
    firstName: 'Bull',
    title: 'Railroad Worker Turned Organizer',
    catchphrase: 'Never retreat.',
    description: "Blacklisted from every rail yard in the state at twenty-six. Fights like he has nothing to lose — because he doesn't.",
    hint: 'Prefers running alone. Only fuses reluctantly.',
    portraitTraits: { faceShape: 'round', hairStyle: 'short', hairColor: '#3D2B1F', facialHair: 'beard', hat: 'none', collar: 'standard' },
  },
  pru: {
    id: 'pru',
    name: 'Prudence "Pru" Whitmore',
    firstName: 'Pru',
    title: 'Reform Organizer & Suffragist',
    catchphrase: 'Protect what you have.',
    description: "Sixty-two years old. Watched four reform parties rise and fall. Knows exactly how each one died — and how not to repeat it.",
    hint: 'Cautious and principled. Only fuses with genuine allies.',
    portraitTraits: { faceShape: 'oval', hairStyle: 'updo', hairColor: '#8B8682', facialHair: 'none', hat: 'bonnet', collar: 'high' },
  },
};

// Introduction speeches (shown when advisor is selected)
export const INTRODUCTIONS = {
  ezra: "Name's Ezra Hatch. I've organized three Alliance chapters and watched every one get crushed by the bosses and the bankers. But fusion — cross-endorsement — that changes the math. You put our name on the ballot alongside a friendly candidate, our voters count, and the voters don't feel like they're wasting their vote. I'll tell you who to trust, who to avoid, and how to beat Blackwood at his own game.",
  bull: "Name's McGraw. Bull McGraw. I was working the B&O when they cut our wages for the third time. I organized the walkout. They blacklisted me. Now I organize for you. Fusion with the major parties? Sure, when we have to. But I didn't start this party to endorse their candidates. We're our own people. Every ballot with our name on it is a fist in Blackwood's face.",
  pru: "My name is Prudence Whitmore. I've been organizing since before most of you were born. I watched the Liberty Party burn itself out. I watched the Free Soilers get absorbed. Every time, the same mistake: trusting the wrong allies. Fusion can work — but only with candidates who genuinely share our cause. I'll tell you who's real and who's selling us out to Blackwood.",
};

// Per-round advisor recommendations
// Each advisor recommends a different strategy for each round
export function getAdvisorRecommendation(advisorId, round, demCandidate, repCandidate) {
  const advisor = ADVISORS[advisorId] || ADVISORS.ezra;
  const demFriendly = demCandidate.friendliness >= 0.4;
  const repFriendly = repCandidate.friendliness >= 0.4;
  const demBought = demCandidate.boughtByBlackwood;
  const repBought = repCandidate.boughtByBlackwood;

  // Check if the choice is genuinely ambiguous (both candidates similarly friendly)
  const friendlinessGap = Math.abs(demCandidate.friendliness - repCandidate.friendliness);
  const isAmbiguous = friendlinessGap < 0.15 && demFriendly && repFriendly && !demBought && !repBought;

  // Ezra: pragmatic — fuse with whoever gives best odds
  if (advisorId === 'ezra') {
    if (demBought && repBought) {
      return {
        recommended: 'alone',
        line: "Both candidates are bought. We run alone and build our name.",
        fuseDemLine: demBought
          ? `${demCandidate.name} took Blackwood's money. Fusing with a puppet helps nobody.`
          : demFriendly
            ? `${demCandidate.name} is friendly enough. The math works.`
            : `${demCandidate.name} is cool to us, but the numbers might still add up.`,
        fuseRepLine: repBought
          ? `${repCandidate.name} is Blackwood's creature. Don't waste our credibility.`
          : repFriendly
            ? `${repCandidate.name} — surprising, but the numbers work.`
            : `${repCandidate.name} doesn't share our values. The math is bad.`,
        aloneLine: "Three-way race is risky, but at least we keep our integrity.",
      };
    }
    if (isAmbiguous) {
      const rec = demCandidate.friendliness >= repCandidate.friendliness ? 'fuse_dem' : 'fuse_rep';
      return {
        recommended: rec,
        line: `I could argue this either way. Both candidates are workable. I'd give ${rec === 'fuse_dem' ? demCandidate.name : repCandidate.name} a slight edge, but trust your gut on this one.`,
        fuseDemLine: `${demCandidate.name} is a genuine option. The numbers add up.`,
        fuseRepLine: `${repCandidate.name} is a genuine option too. Don't rule it out.`,
        aloneLine: "Running alone when we have two possible allies? That's leaving votes on the table.",
      };
    }
    if (demCandidate.friendliness >= repCandidate.friendliness && !demBought) {
      return {
        recommended: 'fuse_dem',
        line: `Fuse with ${demCandidate.name}. The numbers say we win together.`,
        fuseDemLine: `${demCandidate.name} is our best shot. Combined votes beat the Republican.`,
        fuseRepLine: repFriendly && !repBought
          ? `${repCandidate.name} is possible, but the Democrat gives us better odds.`
          : `${repCandidate.name} — I wouldn't trust it.`,
        aloneLine: "Running alone splits the vote. We hand it to Blackwood's people.",
      };
    }
    if (!repBought) {
      return {
        recommended: 'fuse_rep',
        line: `The Democrat's no good. Fuse with ${repCandidate.name} — unusual, but the math works.`,
        fuseDemLine: demBought
          ? `${demCandidate.name} answers to Blackwood now. Forget it.`
          : `${demCandidate.name} is lukewarm at best.`,
        fuseRepLine: `${repCandidate.name} is our best option this round. Sometimes you take what you can get.`,
        aloneLine: "Running alone is a gamble I don't recommend.",
      };
    }
    return {
      recommended: 'alone',
      line: "Nobody worth fusing with this round. We run alone and make noise.",
      fuseDemLine: `${demCandidate.name} — not trustworthy enough to fuse with.`,
      fuseRepLine: `${repCandidate.name} — we'd be endorsing Blackwood's agenda.`,
      aloneLine: "It's a long shot, but at least we stand for something.",
    };
  }

  // Bull: prefers alone — only fuses when the alternative is catastrophic
  if (advisorId === 'bull') {
    if (round <= 2) {
      return {
        recommended: 'alone',
        line: "We didn't start this party to endorse their candidates. Run alone. Show them we exist.",
        fuseDemLine: demFriendly && !demBought
          ? `${demCandidate.name} seems decent, but we lose ourselves when we fuse.`
          : `${demCandidate.name}? That's their candidate, not ours.`,
        fuseRepLine: `${repCandidate.name}? A Republican? You're kidding.`,
        aloneLine: "Every ballot with our name on it is a fist in Blackwood's face.",
      };
    }
    // Later rounds: Bull grudgingly acknowledges fusion might be necessary
    if (isAmbiguous) {
      return {
        recommended: 'fuse_dem',
        line: `Both of them are... tolerable. I hate to say it, but either one could work. The Democrat at least pretends to care about working people.`,
        fuseDemLine: `${demCandidate.name} — at least they're on our side of the fence. Barely.`,
        fuseRepLine: `${repCandidate.name} — I can't believe I'm saying this, but they're not the worst.`,
        aloneLine: "Part of me wants to fight alone. But we've come too far to throw it away.",
      };
    }
    if (demCandidate.friendliness >= 0.6 && !demBought) {
      return {
        recommended: 'fuse_dem',
        line: `Fine. ${demCandidate.name} is the real deal. I'll swallow my pride this once.`,
        fuseDemLine: `${demCandidate.name} actually believes in this. That's rare.`,
        fuseRepLine: `${repCandidate.name}? I'd rather lose honestly.`,
        aloneLine: "Part of me says fight alone. But even I can count votes.",
      };
    }
    return {
      recommended: 'alone',
      line: "Neither of them earned our endorsement. We fight our own fight.",
      fuseDemLine: demBought
        ? `${demCandidate.name} sold out. I'd die before I fuse with a Blackwood puppet.`
        : `${demCandidate.name} — not enough spine for my taste.`,
      fuseRepLine: `${repCandidate.name} — I don't fuse with the enemy.`,
      aloneLine: "We run alone. We fight. That's what we do.",
    };
  }

  // Pru: cautious — only fuses with genuinely friendly candidates
  if (advisorId === 'pru') {
    if (isAmbiguous) {
      return {
        recommended: demCandidate.friendliness >= repCandidate.friendliness ? 'fuse_dem' : 'fuse_rep',
        line: `This is a genuinely difficult call. I've been doing this long enough to know that sometimes there's no clear answer. Both have merits. Both have risks. Choose the one you can live with if it goes wrong.`,
        fuseDemLine: `${demCandidate.name} — a reasonable ally. Not a soulmate, but a partner.`,
        fuseRepLine: `${repCandidate.name} — stranger alliances have worked before. The suffragists taught me that.`,
        aloneLine: "Running alone when you have two possible allies is a luxury we cannot afford.",
      };
    }
    if (demCandidate.friendliness >= 0.6 && !demBought) {
      return {
        recommended: 'fuse_dem',
        line: `${demCandidate.name} is genuinely with us. This is the kind of fusion that works.`,
        fuseDemLine: `I've watched a lot of politicians betray their promises. ${demCandidate.name} isn't one of them. Not yet.`,
        fuseRepLine: repFriendly && !repBought
          ? `${repCandidate.name} says the right things, but I've seen Republicans promise before.`
          : `${repCandidate.name} — I wouldn't trust that one with a borrowed nickel.`,
        aloneLine: "Running alone when we have a genuine ally? That's how parties die.",
      };
    }
    if (repCandidate.friendliness >= 0.5 && !repBought) {
      return {
        recommended: 'fuse_rep',
        line: `I never thought I'd say this, but ${repCandidate.name} might be worth fusing with.`,
        fuseDemLine: demBought
          ? `${demCandidate.name} took Blackwood's money. I've seen this before. Walk away.`
          : `${demCandidate.name} — lukewarm allies are worse than honest enemies.`,
        fuseRepLine: `${repCandidate.name} seems genuine. And sometimes the unlikely alliance is the strongest.`,
        aloneLine: "Running alone wastes our voters' courage.",
      };
    }
    // No good ally available
    return {
      recommended: 'alone',
      line: "Neither candidate is trustworthy enough. Better to run alone than fuse with a traitor.",
      fuseDemLine: demBought
        ? `${demCandidate.name} answers to Blackwood. Fusing with that is suicide.`
        : `${demCandidate.name} — not committed enough. They'll betray us when it counts.`,
      fuseRepLine: `${repCandidate.name} — I've watched four parties die trusting the wrong people.`,
      aloneLine: "We stand alone. We've done it before. At least we survive with our principles.",
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
  if (advisorId === 'ezra') {
    if (playerWon) {
      return round >= 4
        ? "We did it. The math worked. Blackwood's going to lose sleep tonight."
        : "Smart play. The numbers don't lie.";
    }
    if (choice === 'alone') {
      return "Three-way race. Exactly what I warned about. The vote split cost us.";
    }
    return "We lost this one. But we learned something. Next round, we adjust.";
  }

  if (advisorId === 'bull') {
    if (playerWon && choice === 'alone') {
      return "We won on our own terms! Nobody gave us that victory — we took it!";
    }
    if (playerWon) {
      return "A win is a win. I'll take it, even if we had to share the ballot.";
    }
    if (choice !== 'alone') {
      return "Fusion didn't save us. Next time, we fight on our own.";
    }
    return "We lost, but we fought under our own banner. I don't regret it.";
  }

  if (advisorId === 'pru') {
    if (playerWon) {
      return round >= 4
        ? "Careful choices add up. We're still standing, and that's everything."
        : "A good result. But stay cautious — Blackwood isn't done with us.";
    }
    if (choice === 'alone') {
      return "Running alone was risky. I wish we'd had a trustworthy ally.";
    }
    return "The alliance didn't hold. We need to choose our partners more carefully.";
  }

  return "The results are in.";
}

// Advisor landscape briefing (shown before the choice)
export function getAdvisorBriefing(advisorId, round, demCandidate, repCandidate) {
  const stage = round;

  if (advisorId === 'ezra') {
    if (stage === 1) return "First election. Nobody knows who we are yet. We need to prove fusion works — pick an ally and win.";
    if (stage === 2) return "People are watching now. Blackwood's people are sniffing around. Choose carefully.";
    if (stage === 3) return "Blackwood's buying candidates. The landscape just changed. Read the new terrain.";
    if (stage === 4) return "They're running attack ads against us. Our support took a hit. We need a smart play.";
    return "This is it. If we don't win big, they'll ban fusion entirely. Everything rides on this.";
  }

  if (advisorId === 'bull') {
    if (stage === 1) return "Our first fight. Let's make it count. I say we show them what we're made of.";
    if (stage === 2) return "Blackwood noticed us. Good. Let him worry.";
    if (stage === 3) return "They're buying people off? That just proves we're winning.";
    if (stage === 4) return "Smear campaign? They're scared of us. Fight harder.";
    return "Last round. They want to ban fusion? Then let's win so big they can't.";
  }

  if (advisorId === 'pru') {
    if (stage === 1) return "Our first test. Let's not overreach. Find a genuine ally and build from there.";
    if (stage === 2) return "Blackwood is pressuring candidates. Watch for anyone who's suddenly less enthusiastic.";
    if (stage === 3) return "Someone took Blackwood's money. I've seen this before. Be very careful who you trust.";
    if (stage === 4) return "The smear campaign is despicable but predictable. Stay focused on who we can actually trust.";
    return "The anti-fusion bill is coming. This is the moment I've been preparing for all my life.";
  }

  return "Here's the situation.";
}
