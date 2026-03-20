// Template variables: {PARTY}, {MASCOT}, {MASCOT_NOUN}, {DISTRICT}, {ISSUE}, {ISSUE2}, {X}, {Y}, {CANDIDATE}, {ALLY}

export const HEADLINE_TEMPLATES = {
  act1: {
    election_fusion: [
      "{PARTY} Cross-Endorses {CANDIDATE} in {DISTRICT} \u2014 '{MASCOT} Flies on Both Ballot Lines,' Reports Bemused Clerk",
      "Fusion Ticket Carries {DISTRICT} \u2014 {PARTY} Claims {X}% on Own Line; {ALLY} Claims All Credit",
      "Fusion Deal in {DISTRICT}: {PARTY} Voters Count on Their Own Line \u2014 'Democracy Gets Creative'",
      "{CANDIDATE} Wins in {DISTRICT} with {PARTY} Votes \u2014 Cross-Endorsement Proves Its Worth",
    ],
    election_alone: [
      "{PARTY} Runs Alone in {DISTRICT}, Takes {X}% \u2014 'Not Bad for a Party Nobody's Heard Of,' Says Advisor",
      "Three-Way Race in {DISTRICT}: {PARTY} Takes {X}%, Republicans Win by a Hair",
      "Vote Split in {DISTRICT} \u2014 Democrats Blame {PARTY}; {PARTY} Blames the System",
    ],
    election_standDown: [
      "{PARTY} Stands Down in {DISTRICT} \u2014 'Strategic Patience,' Says Leader; 'Cowardice,' Says Everyone Else",
      "No {MASCOT_NOUN} on the Ballot in {DISTRICT} \u2014 Supporters Express Range of Emotions, Mostly Sadness",
    ],
    legislative_pass: [
      "{ISSUE} Bill Passes \u2014 {PARTY} Leverages Fusion Victory into Real Policy",
      "Legislature Passes {ISSUE} Bill \u2014 {PARTY} Celebrates: 'This Is Why Fusion Works'",
      "Fusion Ally Honors Deal on {ISSUE} \u2014 {PARTY} Claims Credit, Rightly",
    ],
    legislative_partial: [
      "Watered-Down {ISSUE} Bill Squeaks Through \u2014 {PARTY}: 'Better Than Nothing. Barely.'",
      "Compromise on {ISSUE}: Neither Side Happy, Both Claim Victory",
    ],
    legislative_fail: [
      "{ISSUE} Bill Dies in Committee \u2014 {PARTY} Vows to Try Again Next Session",
      "Legislature Rejects {ISSUE} Bill \u2014 Fusion Ally Shrugs: 'I Voted My Conscience'",
    ],
    legislative_betrayal: [
      "Fusion Ally Votes Against {ISSUE} Bill \u2014 {PARTY} Cries Betrayal: 'We Gave Them Our Votes!'",
      "'{CANDIDATE}' Breaks Fusion Promise on {ISSUE} \u2014 {PARTY} Supporters Demand Blood (Figuratively)",
      "Betrayal in the Legislature: Fusion Partner Sides with Opposition on {ISSUE}",
    ],
  },
  act2: {
    r1_alone: [
      "{PARTY} Splits Vote in {DISTRICT} \u2014 Republicans Win by {X}. Democrats Send Strongly Worded Letter",
      "'{PARTY} Should Have Known Better,' Says Democratic Leader Who Offered Them Nothing",
      "Three-Way Split in {DISTRICT}: {PARTY} Takes {X}%, Nobody Wins, Democracy Loses",
    ],
    r1_standDown: [
      "{PARTY} Stands Down in {DISTRICT} \u2014 'Where Did They Go?' Asks Literally No One",
      "No {MASCOT_NOUN} Candidate in {DISTRICT} \u2014 Voters Who Liked {ISSUE} Have Nowhere to Go",
    ],
    r2_apologize: [
      "{PARTY} Tells Supporters to Back Democrats \u2014 'A Dignified Retreat,' Says One; 'Surrender,' Say the Rest",
      "'{MASCOT_NOUN} Party' Endorses Democrats \u2014 Own Platform: Forgotten. Own Voters: Confused.",
    ],
    r2_doubleDown: [
      "{PARTY} Doubles Down Despite Math \u2014 'Principles Don't Need Percentages,' Declares Defiant Leader",
      "Editorial: The {MASCOT_NOUN} Has Been Plucked \u2014 Is {PARTY} Finished?",
    ],
    r2_pivot: [
      "{PARTY} Pivots Platform \u2014 Base Shrinks but Intensifies. 'Quality Over Quantity,' Claims Spin Doctor",
      "New {PARTY} Platform: Same Spirit, Different Words, Fewer Supporters",
    ],
    r3_cryTheft: [
      "{PARTY} Accuses Democrats of Stealing Platform \u2014 Democrats: 'We Prefer \"Adopted\"'",
      "'They Took Our Ideas!' Cries {PARTY}; Public Response: 'At Least Someone Did'",
    ],
    r3_outflank: [
      "{PARTY} Goes Radical on {ISSUE} \u2014 Base Applauds, Electorate Recoils",
      "The {MASCOT_NOUN} Party's Last Stand: More Extreme, Less Electable",
    ],
    r3_acceptReality: [
      "{PARTY} Endorses Democrats, Dissolves \u2014 Ideas Live On, Diluted Beyond Recognition",
      "End of the {MASCOT_NOUN}: {PARTY} Folds Into the Democratic Party. The Platform Survived. The Party Didn't.",
    ],
  },
  act3: {
    r1: [
      "{PARTY} Wins {X} Seats \u2014 'The {MASCOT_NOUN} Enters Parliament,' Reports Astonished Press Gallery",
      "Proportional Results: Five Parties in Parliament \u2014 {PARTY} Takes {X} Seats on {ISSUE} Platform",
      "Voters Choose Freely; {PARTY} Gets Its Due \u2014 '{X} Seats!' Cheers Crowd of Genuine Supporters",
    ],
    r2_joinDemocrat: [
      "Coalition Formed: Democrats + {PARTY} \u2014 Junior Partner Gets Minor Post, Major Headaches",
      "{PARTY} Joins Government \u2014 'The {MASCOT_NOUN} Has a Seat at the Table,' Literally",
    ],
    r2_holdOut: [
      "Coalition Talks Enter Hour {X} \u2014 Catering Bills Exceed Campaign Budgets",
      "{PARTY} Demands Major Post \u2014 Democrats Weigh Options, Consider Alternatives",
    ],
    r2_buildAlternative: [
      "Surprise Coalition: {PARTY} + Agrarian Alliance Seek Democratic Dissidents",
      "The {MASCOT_NOUN} Party Tries to Build New Majority \u2014 'Ambitious,' Say Observers, Carefully",
    ],
    r3_compromise: [
      "{ISSUE} Bill Passes {X}-{Y} \u2014 {PARTY} Claims Credit; So Does Everyone Else",
      "Watered-Down {ISSUE} Bill Becomes Law \u2014 Half a Victory, Fully Celebrated",
    ],
    r3_principles: [
      "{ISSUE} Bill Dies on Floor \u2014 {PARTY} Votes No on 'Insufficient' Version",
      "Principled Stand or Self-Defeating Purity? {PARTY} Kills Own Bill \u2014 Debate Rages",
    ],
    r3_amend: [
      "Amended {ISSUE} Bill Goes to Vote \u2014 Stronger Version, Shakier Coalition",
      "{PARTY} Pushes Stronger {ISSUE} Bill \u2014 Coalition Holds? Or Cracks?",
    ],
  },
  ambient: [
    "Local Man Insists Both Parties Are Identical; Both Parties Agree for Once",
    "Railroad Baron Acquires Seventh State Legislature \u2014 'Diversification,' He Explains",
    "Factory Owner Praises Child Workers: 'Small Hands, Big Productivity'",
    "Suffragist Arrested for Attempting to Vote; Judge Calls It 'Adorable'",
    "Congress Debates Whether Farmers Actually Exist or Are Simply a Metaphor",
    "Noted Industrialist Donates to All Candidates \u2014 'Investing in Democracy,' He Says, Winking",
    "Pinkerton Agent Infiltrates Union Meeting; Contributes Surprisingly Good Casserole",
    "Democratic Candidate Promises Change; Neglects to Specify What Kind or When",
    "Bank Forecloses on Farm; Banker Describes Process as 'Regrettable' from New Yacht",
    "Labor Organizer Jailed; Charges Include 'Excessive Belief in Democracy'",
    "Third Party Supporter Asked 'Why Not Vote for Someone Who Can Win?' for 400th Time",
    "Prohibition Candidate Arrives at Rally Suspiciously Cheerful",
    "Senator Seen Dining with Lobbyist \u2014 'Discussing Weather,' Both Claim, in Different Restaurants",
    "Voter Turnout Reaches 80% \u2014 Politicians Express Concern",
    "New Study Confirms Voters Prefer Candidates Who Agree with Them \u2014 Congress Skeptical",
    "Gilded Age Economist Insists Inequality Is 'Temporary'; Defines Temporary as '50 to 100 Years'",
    "Political Machine Issues Denial of Thing Nobody Accused It Of",
    "Woman Asks When She Can Vote; Congressman Checks Calendar, Says 'How About Never?'",
    "Election Results Delayed \u2014 'Found Extra Ballots in the River,' Explains Official",
    "Major Party Platform Compared to Wallpaper \u2014 'Covers the Cracks, Nobody Reads It'",
    "Economic Experts Assure Public Gold Standard Benefits Everyone Except Those It Doesn't",
    "Populist Rally Draws Thousands; Eastern Press Describes It as 'Quaint'",
    "Tammany Hall Denies Corruption \u2014 'We Prefer Efficient Governance'",
    "Immigrant Workers Build Railroad, Then Told Railroad Isn't for Them",
    "Weather Report: Perfect Election Day Threatens Status Quo",
    "Editorial: Is Democracy Working? 'Define Working,' Replies Congress",
    "Rural Voters Express Frustration \u2014 Eastern Press Translates as 'Heartland Unrest'",
    "Republican Party Launches 'We're Not As Bad As You Think' Campaign \u2014 Polls Show It's Working",
    "Local Editor Asks What Third Parties Are Good For \u2014 Letters Suggest 'Hope and Keeping Major Parties Nervous'",
  ],
};

export default HEADLINE_TEMPLATES;
