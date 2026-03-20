export const ISSUES = {
  freeSilver: {
    key: 'freeSilver',
    name: 'Free Silver',
    plank: 'Free coinage of silver at the 16:1 ratio',
    description: 'Expand the money supply with silver coinage to ease the debt strangling farmers and workers.',
    constituency: 'Farmers, debtors, western miners',
    resourceBonus: { funds: 10, morale: 0, visibility: 0 },
    flagshipBill: {
      name: 'The Free Coinage Act',
      shortName: 'Free Coinage Act',
      stages: [
        {
          name: 'Introduction',
          description: 'Convince an ally to formally introduce a bill allowing limited silver coinage at the Treasury. The gold-standard lobby is already threatening anyone who puts their name on it.',
          successText: 'The Free Coinage Act has been formally introduced! The bankers are furious, but the bill is on the record. It advances to committee.',
          failText: 'No legislator would put their name on the silver bill. The gold lobby\'s threats were too effective. You\'ll need more leverage next time.',
        },
        {
          name: 'Committee Hearing',
          description: 'Push the Free Coinage Act through the Banking Committee. Eastern financiers are flooding the state capital with lobbyists. Your ally needs to hold firm under enormous pressure.',
          successText: 'The committee votes to advance the Free Coinage Act to the full floor! The bankers\' lobby failed to kill it in committee.',
          failText: 'The committee buried the bill. Too many members folded under pressure from the gold-standard interests. You\'ll need to try again.',
        },
        {
          name: 'Floor Vote',
          description: 'The full legislature votes on the Free Coinage Act. Wall Street has declared open war. Every vote counts. This is the moment your party was built for.',
          successText: 'THE FREE COINAGE ACT IS NOW LAW. Silver will flow. The farmers\' debts will ease. Your party delivered.',
          failText: 'The bill goes down on the floor. The gold interests held the line. Your signature legislation dies with this vote.',
        },
      ],
    },
  },
  railroadRegulation: {
    key: 'railroadRegulation',
    name: 'Railroad Regulation',
    plank: 'State commission with power to set maximum freight rates',
    description: 'Break the railroad monopolies that crush farmers and merchants with predatory pricing.',
    constituency: 'Farmers, small merchants',
    resourceBonus: { funds: 0, morale: 10, visibility: 0 },
    flagshipBill: {
      name: 'The Railroad Commission Act',
      shortName: 'Railroad Commission Act',
      stages: [
        {
          name: 'Introduction',
          description: 'Get an ally to introduce a rate transparency bill \u2014 the first step toward a full railroad commission. The railroads call it government tyranny.',
          successText: 'The Railroad Commission Act has been introduced! Rate transparency is now on the legislative agenda. The railroads are scrambling.',
          failText: 'The railroad lobby killed the bill before it could even be introduced. Their money speaks louder than your voters \u2014 for now.',
        },
        {
          name: 'Committee Hearing',
          description: 'The Commerce Committee holds hearings on rate regulation. The railroad lobby has bought half the committee. Your ally needs to hold the line.',
          successText: 'The committee advances the Railroad Commission Act! Farmers and merchants packed the hearing room. The bill moves to the floor.',
          failText: 'The committee voted to table the bill indefinitely. The railroad money was too much. You\'ll need more seats to overcome it.',
        },
        {
          name: 'Floor Vote',
          description: 'The full legislature votes on creating a railroad commission with real enforcement power. The railroads have promised to fight this to the death.',
          successText: 'THE RAILROAD COMMISSION ACT IS NOW LAW. A state commission with real teeth. The monopolies will finally answer to the people.',
          failText: 'Defeated on the floor. The railroad barons celebrate. Your commission dies, and freight rates stay where they are.',
        },
      ],
    },
  },
  laborRights: {
    key: 'laborRights',
    name: 'Labor Rights',
    plank: 'Eight-hour workday law for all industries',
    description: 'Eight-hour day, end child labor, right to organize unions without blacklisting.',
    constituency: 'Urban workers, immigrants',
    resourceBonus: { funds: 0, morale: 0, visibility: 10 },
    flagshipBill: {
      name: 'The Eight-Hour Workday Act',
      shortName: 'Eight-Hour Act',
      stages: [
        {
          name: 'Introduction',
          description: 'Find an ally to introduce a factory inspection bill \u2014 the opening wedge for labor reform. The mill owners say it will cost jobs and drive business out of state.',
          successText: 'The Eight-Hour Workday Act has been introduced! Factory inspection is now on the books. The labor movement has a foothold in the legislature.',
          failText: 'No legislator would sponsor the bill. The factory owners\' threats kept everyone in line. You need allies with more spine.',
        },
        {
          name: 'Committee Hearing',
          description: 'Push the Eight-Hour Act through the Labor Committee. Business interests are threatening to relocate factories. Your ally faces enormous pressure.',
          successText: 'The committee approves the Eight-Hour Act! Workers packed the gallery. The bill advances to the floor for a final vote.',
          failText: 'The committee killed the bill. Business interests won this round. The twelve-hour day continues \u2014 unless you can try again.',
        },
        {
          name: 'Floor Vote',
          description: 'The full legislature votes on the Eight-Hour Workday Act. The factory owners have deployed every lobbyist they have. This is the fight your party was born for.',
          successText: 'THE EIGHT-HOUR WORKDAY ACT IS NOW LAW. No more twelve-hour shifts. No more children in the mills. Your party changed workers\' lives.',
          failText: 'Defeated on the floor. The factory owners won. Workers will keep dying in twelve-hour shifts, and your bill dies with them.',
        },
      ],
    },
  },
  antiCorruption: {
    key: 'antiCorruption',
    name: 'Anti-Corruption',
    plank: 'Civil service reform and campaign finance disclosure',
    description: 'End machine politics, require civil service exams, and force disclosure of campaign donations.',
    constituency: 'Middle-class reformers, professionals',
    resourceBonus: { funds: 5, morale: 5, visibility: 0 },
    flagshipBill: {
      name: 'The Ballot Reform Act',
      shortName: 'Ballot Reform Act',
      stages: [
        {
          name: 'Introduction',
          description: 'Introduce the Australian (secret) ballot to prevent bosses from watching how workers vote. Both party machines oppose it \u2014 they profit from the current system.',
          successText: 'The Ballot Reform Act has been introduced! The secret ballot is officially on the legislative agenda. The machine bosses are nervous.',
          failText: 'Neither machine would let their members sponsor the bill. The bosses like knowing how people vote. You need more leverage.',
        },
        {
          name: 'Committee Hearing',
          description: 'Push ballot reform through committee. The political machines from both parties are working together to kill it. Your ally is caught between reform and party loyalty.',
          successText: 'The committee advances the Ballot Reform Act! The machines couldn\'t hold their members in line. A floor vote is next.',
          failText: 'The committee buried the bill. The machines still control enough votes. Clean government will have to wait.',
        },
        {
          name: 'Floor Vote',
          description: 'The full legislature votes on the Ballot Reform Act. Both major parties hate this one equally \u2014 it threatens their power. But the public wants it.',
          successText: 'THE BALLOT REFORM ACT IS NOW LAW. Secret ballots. No more bosses watching over your shoulder. Democracy just got a little more honest.',
          failText: 'Defeated on the floor. The machines won. Voters will keep casting their ballots under the watchful eyes of ward bosses.',
        },
      ],
    },
  },
  womensSuffrage: {
    key: 'womensSuffrage',
    name: "Women's Suffrage",
    plank: 'State constitutional amendment granting women the vote',
    description: 'The ballot for all citizens, regardless of sex. Half the population cannot currently vote.',
    constituency: 'Suffragists, progressives, temperance movement',
    resourceBonus: { funds: 0, morale: 5, visibility: 5 },
    flagshipBill: {
      name: 'The State Suffrage Amendment',
      shortName: 'Suffrage Amendment',
      stages: [
        {
          name: 'Introduction',
          description: 'Convince an ally to introduce a municipal suffrage resolution \u2014 the first step toward full women\'s suffrage. Opponents say it will destroy the family.',
          successText: 'The Suffrage Amendment has been introduced! Women\'s voting rights are officially on the legislative agenda for the first time.',
          failText: 'No legislator would sponsor the suffrage bill. The opposition was too fierce. Half the population remains voiceless \u2014 for now.',
        },
        {
          name: 'Committee Hearing',
          description: 'Push the suffrage amendment through the Judiciary Committee. The liquor lobby opposes it (they fear temperance votes). Traditionalists call it radical.',
          successText: 'The committee advances the Suffrage Amendment! Suffragists packed the hearing room. The full legislature will vote.',
          failText: 'The committee voted it down. The liquor lobby and traditionalists formed an unholy alliance. You\'ll need more allies.',
        },
        {
          name: 'Floor Vote',
          description: 'The full legislature votes on amending the state constitution to grant women the vote. This changes everything \u2014 the entire electorate doubles.',
          successText: 'THE STATE SUFFRAGE AMENDMENT PASSES. Women can vote. The electorate just doubled. Your party made history.',
          failText: 'Defeated on the floor. Half the population is still denied the ballot. The amendment dies, and with it, a generation\'s hopes.',
        },
      ],
    },
  },
};

export const ISSUE_LIST = Object.values(ISSUES);

// Party names keyed to single issue
export const PARTY_NAMES_BY_ISSUE = {
  freeSilver: [
    { key: 'peoplesAlliance', name: "The People's Alliance", flavor: 'Agrarian populist coalition' },
    { key: 'silverParty', name: 'The Silver Party', flavor: 'Hard money for the common man' },
    { key: 'farmersLabor', name: "The Farmers' League", flavor: 'Rural populist uprising' },
  ],
  railroadRegulation: [
    { key: 'antiMonopoly', name: 'The Anti-Monopoly Party', flavor: 'Break the trusts, free the people' },
    { key: 'commonwealth', name: 'The Commonwealth Party', flavor: 'Fair markets, fair government' },
    { key: 'grangeParty', name: 'The Grange Party', flavor: 'Farmers against the railroads' },
  ],
  laborRights: [
    { key: 'workingmens', name: "The Workingmen's Party", flavor: 'Labor solidarity, workers\' power' },
    { key: 'peoplesLabor', name: "The People's Labor Party", flavor: 'Broad worker-populist coalition' },
    { key: 'solidarityParty', name: 'The Solidarity Party', flavor: 'Universal dignity for all who work' },
  ],
  antiCorruption: [
    { key: 'goodGovernment', name: 'The Good Government Party', flavor: 'Clean politics, honest elections' },
    { key: 'reformAlliance', name: 'The Reform Alliance', flavor: 'End machine politics forever' },
    { key: 'citizensParty', name: "The Citizens' Party", flavor: 'Government of, by, and for the people' },
  ],
  womensSuffrage: [
    { key: 'equalRights', name: 'The Equal Rights Party', flavor: 'The ballot for all citizens' },
    { key: 'newDemocracy', name: 'The New Democracy Party', flavor: 'Modernize the republic' },
    { key: 'libertyAlliance', name: 'The Liberty Alliance', flavor: 'Freedom means the vote for everyone' },
  ],
};

// Helper to get party name options for a single issue
export function getPartyNamesForIssue(issueKey) {
  return PARTY_NAMES_BY_ISSUE[issueKey] || [
    { key: 'thirdParty', name: 'The Third Party', flavor: 'A new voice in politics' },
  ];
}


export const MASCOTS = [
  { key: 'eagle', name: 'The Eagle', icon: '\u{1F985}', noun: 'Eagle', meaning: "We're the real Americans" },
  { key: 'honeybee', name: 'The Honeybee', icon: '\u{1F41D}', noun: 'Bee', meaning: 'Labor solidarity, collective action' },
  { key: 'libertyBell', name: 'The Liberty Bell', icon: '\u{1F514}', noun: 'Bell', meaning: "Democracy is broken, we'll fix it" },
  { key: 'wheatSheaf', name: 'The Wheat Sheaf', icon: '\u{1F33E}', noun: 'Sheaf', meaning: 'Agrarian populism, heartland' },
  { key: 'torch', name: 'The Torch', icon: '\u{1F525}', noun: 'Torch', meaning: 'Light against the darkness of corruption' },
  { key: 'scales', name: 'The Scales', icon: '\u2696\uFE0F', noun: 'Scales', meaning: 'Justice for the common man' },
  { key: 'hammer', name: 'The Hammer', icon: '\u2692\uFE0F', noun: 'Hammer', meaning: 'The working class builds this country' },
  { key: 'star', name: 'The Star', icon: '\u{1F31F}', noun: 'Star', meaning: 'A guiding light for the Republic' },
  { key: 'anchor', name: 'The Anchor', icon: '\u2693', noun: 'Anchor', meaning: 'Steady in the storm, unmoved by bosses' },
  { key: 'shield', name: 'The Shield', icon: '\u{1F6E1}\uFE0F', noun: 'Shield', meaning: 'Defend the people against the powerful' },
];
