// Portrait image mappings by candidate/character ID
// Images are in public/portraits/{historical,modern}/

export const HISTORICAL_PORTRAITS = {
  // Antagonist
  blackwood: '/portraits/historical/blackwood.png',
  // Advisors
  ezra: '/portraits/historical/ezra.png',
  bull: '/portraits/historical/bull.png',
  pru: '/portraits/historical/pru.png',
  // State Leg candidates
  quill: '/portraits/historical/quill.png',
  graves: '/portraits/historical/graves.png',
  cogg: '/portraits/historical/cogg.png',
  fairweather: '/portraits/historical/fairweather.png',
  goodacre: '/portraits/historical/goodacre.png',
  grasp: '/portraits/historical/grasp.png',
  caulk: '/portraits/historical/caulk.png',
  drywell: '/portraits/historical/drywell.png',
  benchwright: '/portraits/historical/benchwright.png',
  chalk: '/portraits/historical/chalk.png',
  hammerstone: '/portraits/historical/hammerstone.png',
  rightaway: '/portraits/historical/rightaway.png',
  broadsheet: '/portraits/historical/broadsheet.png',
  swinton: '/portraits/historical/swinton.png',
  // Statewide candidates
  fairfreight: '/portraits/historical/fairfreight.png',
  nodwell: '/portraits/historical/nodwell.png',
  trustbane: '/portraits/historical/trustbane.png',
  blindeye: '/portraits/historical/blindeye.png',
  faircount: '/portraits/historical/faircount.png',
  lostledger: '/portraits/historical/lostledger.png',
  inkhorn: '/portraits/historical/inkhorn.png',
  griswold: '/portraits/historical/griswold.png',
  firebrand: '/portraits/historical/firebrand.png',
  goldheart: '/portraits/historical/goldheart.png',
  grudge: '/portraits/historical/grudge.png',
  vanderhorn: '/portraits/historical/vanderhorn.png',
  shopfloor: '/portraits/historical/shopfloor.png',
  crane: '/portraits/historical/crane.png',
};

export const MODERN_PORTRAITS = {
  // Antagonist
  vex: '/portraits/modern/vex.png',
  // Advisors
  sam: '/portraits/modern/sam.png',
  rosa: '/portraits/modern/rosa.png',
  hank: '/portraits/modern/hank.png',
  // State Leg candidates
  deepwell: '/portraits/modern/deepwell.png',
  stonebridge: '/portraits/modern/stonebridge.png',
  forgeheart: '/portraits/modern/forgeheart.png',
  steadman: '/portraits/modern/steadman.png',
  okafor: '/portraits/modern/okafor.png',
  fairlawn: '/portraits/modern/fairlawn.png',
  plowman: '/portraits/modern/plowman.png',
  fencepost: '/portraits/modern/fencepost.png',
  gearhart: '/portraits/modern/gearhart.png',
  clearpath: '/portraits/modern/clearpath.png',
  chairback: '/portraits/modern/chairback.png',
  flagstone: '/portraits/modern/flagstone.png',
  newbridge: '/portraits/modern/newbridge.png',
  shieldwall: '/portraits/modern/shieldwall.png',
  // Statewide candidates
  lawcraft: '/portraits/modern/lawcraft.png',
  blindspot: '/portraits/modern/blindspot.png',
  clearledger: '/portraits/modern/clearledger.png',
  lostfile: '/portraits/modern/lostfile.png',
  brightgrid: '/portraits/modern/brightgrid.png',
  darkswitch: '/portraits/modern/darkswitch.png',
  inkwell: '/portraits/modern/inkwell.png',
  gridlock: '/portraits/modern/gridlock.png',
  sparkbridge: '/portraits/modern/sparkbridge.png',
  goldhall: '/portraits/modern/goldhall.png',
  grudgewell: '/portraits/modern/grudgewell.png',
  vanderchip: '/portraits/modern/vanderchip.png',
  shopfront: '/portraits/modern/shopfront.png',
  crane: '/portraits/modern/crane_iv.png',
};

export function getPortrait(id, era = 'historical') {
  if (era === 'modern') {
    return MODERN_PORTRAITS[id] || null;
  }
  return HISTORICAL_PORTRAITS[id] || null;
}
