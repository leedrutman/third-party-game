export const NPC_PARTIES = {
  republican: {
    id: 'republican',
    name: 'The Republican Party',
    shortName: 'Republican',
    abbr: 'R',
    color: '#3B5975',
    description: "Tariffs, gold, and the railroads' best friend",
    prSeats: 35,
  },
  democrat: {
    id: 'democrat',
    name: 'The Democratic Party',
    shortName: 'Democrat',
    abbr: 'D',
    color: '#8B6340',
    description: 'The party of the South, Tammany Hall, and just enough populism to stay interesting',
    prSeats: 30,
  },
  agrarian: {
    id: 'agrarian',
    name: 'Agrarian Alliance',
    shortName: 'Agrarian',
    abbr: 'A',
    color: '#8B6914',
    description: 'Rural populist',
    prSeats: 12,
  },
  traditionalist: {
    id: 'traditionalist',
    name: 'Traditionalist Party',
    shortName: 'Traditionalist',
    abbr: 'T',
    color: '#8B1A1A',
    description: 'Cultural conservative',
    prSeats: 8,
  },
};

// Ally party cooperativeness depends on shared issues and relationship
export function getAllyCooperation(relationship, sharedIssueCount) {
  const base = relationship / 100;
  const issueBonus = sharedIssueCount * 0.1;
  return Math.min(1, base + issueBonus);
}
