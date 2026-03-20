// v2 Issues: Single fixed cause (anti-corruption + anti-monopoly)
// No player choice — the cause is what it is.

export const REFORM_CAUSE = {
  key: 'reform',
  name: 'Anti-Corruption & Anti-Monopoly',
  plank: 'Break the grip of the tycoons on American democracy',
  description: 'End machine politics, bust the railroad monopolies, and return government to the people.',
  shortPitch: 'The tycoons own both parties. We answer to the voters.',
};

// Party name options (player picks one)
export const PARTY_NAMES = [
  {
    key: 'reformLeague',
    name: "The People's Reform League",
    flavor: 'A broad coalition against corruption and monopoly',
    mascot: { key: 'torch', name: 'The Torch', meaning: 'Light against the darkness of corruption' },
  },
  {
    key: 'antiMonopoly',
    name: 'The Anti-Monopoly Alliance',
    flavor: 'Break the trusts, free the people',
    mascot: { key: 'hammer', name: 'The Hammer', meaning: 'The working class builds this country' },
  },
  {
    key: 'goodGov',
    name: 'The Good Government Party',
    flavor: 'Clean politics, honest elections',
    mascot: { key: 'scales', name: 'The Scales', meaning: 'Justice for the common man' },
  },
];
