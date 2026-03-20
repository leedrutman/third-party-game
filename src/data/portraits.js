// Portrait image mappings by candidate/character ID
// Images are in public/portraits/{historical,modern}/
const BASE = import.meta.env.BASE_URL;

export const HISTORICAL_PORTRAITS = {
  // Antagonist
  blackwood: `${BASE}portraits/historical/blackwood.png`,
  // Advisors
  ezra: `${BASE}portraits/historical/ezra.png`,
  bull: `${BASE}portraits/historical/bull.png`,
  pru: `${BASE}portraits/historical/pru.png`,
  // State Leg candidates
  quill: `${BASE}portraits/historical/quill.png`,
  graves: `${BASE}portraits/historical/graves.png`,
  cogg: `${BASE}portraits/historical/cogg.png`,
  fairweather: `${BASE}portraits/historical/fairweather.png`,
  goodacre: `${BASE}portraits/historical/goodacre.png`,
  grasp: `${BASE}portraits/historical/grasp.png`,
  caulk: `${BASE}portraits/historical/caulk.png`,
  drywell: `${BASE}portraits/historical/drywell.png`,
  benchwright: `${BASE}portraits/historical/benchwright.png`,
  chalk: `${BASE}portraits/historical/chalk.png`,
  hammerstone: `${BASE}portraits/historical/hammerstone.png`,
  rightaway: `${BASE}portraits/historical/rightaway.png`,
  broadsheet: `${BASE}portraits/historical/broadsheet.png`,
  swinton: `${BASE}portraits/historical/swinton.png`,
  // Statewide candidates
  fairfreight: `${BASE}portraits/historical/fairfreight.png`,
  nodwell: `${BASE}portraits/historical/nodwell.png`,
  trustbane: `${BASE}portraits/historical/trustbane.png`,
  blindeye: `${BASE}portraits/historical/blindeye.png`,
  faircount: `${BASE}portraits/historical/faircount.png`,
  lostledger: `${BASE}portraits/historical/lostledger.png`,
  inkhorn: `${BASE}portraits/historical/inkhorn.png`,
  griswold: `${BASE}portraits/historical/griswold.png`,
  firebrand: `${BASE}portraits/historical/firebrand.png`,
  goldheart: `${BASE}portraits/historical/goldheart.png`,
  grudge: `${BASE}portraits/historical/grudge.png`,
  vanderhorn: `${BASE}portraits/historical/vanderhorn.png`,
  shopfloor: `${BASE}portraits/historical/shopfloor.png`,
  crane: `${BASE}portraits/historical/crane.png`,
};

export const MODERN_PORTRAITS = {
  // Antagonist
  vex: `${BASE}portraits/modern/vex.png`,
  // Advisors
  sam: `${BASE}portraits/modern/sam.png`,
  rosa: `${BASE}portraits/modern/rosa.png`,
  hank: `${BASE}portraits/modern/hank.png`,
  // State Leg candidates
  deepwell: `${BASE}portraits/modern/deepwell.png`,
  stonebridge: `${BASE}portraits/modern/stonebridge.png`,
  forgeheart: `${BASE}portraits/modern/forgeheart.png`,
  steadman: `${BASE}portraits/modern/steadman.png`,
  okafor: `${BASE}portraits/modern/okafor.png`,
  fairlawn: `${BASE}portraits/modern/fairlawn.png`,
  plowman: `${BASE}portraits/modern/plowman.png`,
  fencepost: `${BASE}portraits/modern/fencepost.png`,
  gearhart: `${BASE}portraits/modern/gearhart.png`,
  clearpath: `${BASE}portraits/modern/clearpath.png`,
  chairback: `${BASE}portraits/modern/chairback.png`,
  flagstone: `${BASE}portraits/modern/flagstone.png`,
  newbridge: `${BASE}portraits/modern/newbridge.png`,
  shieldwall: `${BASE}portraits/modern/shieldwall.png`,
  // Statewide candidates
  lawcraft: `${BASE}portraits/modern/lawcraft.png`,
  blindspot: `${BASE}portraits/modern/blindspot.png`,
  clearledger: `${BASE}portraits/modern/clearledger.png`,
  lostfile: `${BASE}portraits/modern/lostfile.png`,
  brightgrid: `${BASE}portraits/modern/brightgrid.png`,
  darkswitch: `${BASE}portraits/modern/darkswitch.png`,
  inkwell: `${BASE}portraits/modern/inkwell.png`,
  gridlock: `${BASE}portraits/modern/gridlock.png`,
  sparkbridge: `${BASE}portraits/modern/sparkbridge.png`,
  goldhall: `${BASE}portraits/modern/goldhall.png`,
  grudgewell: `${BASE}portraits/modern/grudgewell.png`,
  vanderchip: `${BASE}portraits/modern/vanderchip.png`,
  shopfront: `${BASE}portraits/modern/shopfront.png`,
  crane: `${BASE}portraits/modern/crane_iv.png`,
};

export function getPortrait(id, era = 'historical') {
  if (era === 'modern') {
    return MODERN_PORTRAITS[id] || null;
  }
  return HISTORICAL_PORTRAITS[id] || null;
}
