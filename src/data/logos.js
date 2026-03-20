// Party logo mappings by party key and era

export const HISTORICAL_LOGOS = {
  reformLeague: '/logos/historical/logo_reform_league.jpg',
  antiMonopoly: '/logos/historical/logo_anti_monopoly.jpg',
  goodGov: '/logos/historical/logo_good_gov.jpg',
};

export const MODERN_LOGOS = {
  open_democracy: '/logos/modern/logo_open_democracy_v2.jpg',
  common_sense: '/logos/modern/logo_common_sense_v2.jpg',
  new_bridge: '/logos/modern/logo_new_bridge_v2.jpg',
};

export function getPartyLogo(partyKey, era = 'historical') {
  if (era === 'modern') {
    return MODERN_LOGOS[partyKey] || null;
  }
  return HISTORICAL_LOGOS[partyKey] || null;
}
