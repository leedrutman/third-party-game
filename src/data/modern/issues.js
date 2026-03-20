// Modern-era issues: party names and reform platform for a centrist/cross-cutting
// fusion party in a fictional purple state (vaguely Wisconsin/Michigan).

export const REFORM_CAUSE = {
  key: 'reform',
  name: 'Electoral Reform & Democratic Renewal',
  plank: 'Break the two-party duopoly and give voters real choices',
  description: 'End the rigged system that keeps both parties in power while ignoring the majority of Americans who want something different.',
  shortPitch: 'The duopoly works for donors. We work for voters.',
};

export const PARTY_NAMES = [
  {
    key: 'open_democracy',
    name: 'The Open Democracy Alliance',
    flavor: 'The system is rigged — not left or right, just rigged.',
    mascot: { key: 'key', name: 'The Key', meaning: 'Unlock democracy for everyone' },
  },
  {
    key: 'common_sense',
    name: 'The Common Sense Coalition',
    flavor: 'Both parties work for donors. We work for your neighborhood.',
    mascot: { key: 'compass', name: 'The Compass', meaning: 'Finding the common ground' },
  },
  {
    key: 'new_bridge',
    name: 'The New Bridge Party',
    flavor: "We're not left. We're not right. We're the 60% in the middle that nobody represents.",
    mascot: { key: 'bridge', name: 'The Bridge', meaning: "Connecting what's been divided" },
  },
];

export const MODERN_ISSUES = [
  {
    id: 'rule_of_law',
    label: 'Rule of Law',
    shortLabel: 'Rule of Law',
    description:
      'Democrats weaponize regulation while Republicans ignore court orders. Neither party defends the rule of law when it gets in their way.',
  },
  {
    id: 'campaign_finance',
    label: 'Campaign Finance Reform',
    shortLabel: 'Campaign Finance',
    description:
      'Both parties rake in dark money and super PAC cash while pretending to support reform. The donor class owns the process, and neither side will cut the cord.',
  },
  {
    id: 'two_party_duopoly',
    label: 'Ending the Two-Party Duopoly',
    shortLabel: 'End the Duopoly',
    description:
      'Republicans and Democrats agree on one thing: keeping everyone else off the ballot. They have rigged debate rules, ballot access laws, and media coverage to lock out competition.',
  },
  {
    id: 'big_tech',
    label: 'Regulating Big Tech',
    shortLabel: 'Big Tech',
    description:
      'Democrats take Silicon Valley money and look the other way on monopoly power. Republicans rage about censorship but block antitrust action. Neither party will actually regulate the platforms.',
  },
  {
    id: 'proportional_representation',
    label: 'Proportional Representation',
    shortLabel: 'Proportional Rep.',
    description:
      'Winner-take-all elections leave millions of voters unrepresented, but both parties benefit from safe seats and gerrymandered maps. Neither has any incentive to change the math.',
  },
  {
    id: 'electoral_reform',
    label: 'Electoral Reform',
    shortLabel: 'Electoral Reform',
    description:
      'Fusion voting, independent redistricting, open primaries — proven fixes that both parties resist because the current broken system is exactly how they keep power.',
  },
];
