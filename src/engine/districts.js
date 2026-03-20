export const DISTRICTS = {
  district1: {
    id: 'district1',
    number: 1,
    type: 'Urban',
    name: 'District 1',
    shortName: 'Dist. 1',
    industry: 'Manufacturing, rail yards',
    wealth: 'Working poor',
    ethnic: 'Irish, German, Polish immigrants',
    character: 'Factory smoke, tenement rows, twelve-hour shifts',
    icon: '\u{1F3ED}',
    issueWeights: {
      laborRights: 0.9,
      antiCorruption: 0.7,
      railroadRegulation: 0.3,
      freeSilver: 0.2,
      womensSuffrage: 0.4,
    },
    partisanLean: -8, // negative = Democrat lean
    republicanBase: 36,
    democratBase: 44,
    thirdPartyCeiling: { fusion: 7, fptp: 3, pr: 12 },
    volatility: 0.15,
  },
  district2: {
    id: 'district2',
    number: 2,
    type: 'Mixed',
    name: 'District 2',
    shortName: 'Dist. 2',
    industry: 'Small business, trade',
    wealth: 'Middle',
    ethnic: 'Native-born, some German settlers',
    character: 'Main street shops, county courthouse, train depot',
    icon: '\u{1F3DB}\uFE0F',
    issueWeights: {
      antiCorruption: 0.7,
      railroadRegulation: 0.6,
      freeSilver: 0.5,
      laborRights: 0.4,
      womensSuffrage: 0.5,
    },
    partisanLean: 0, // Swing
    republicanBase: 41,
    democratBase: 41,
    thirdPartyCeiling: { fusion: 9, fptp: 4, pr: 14 },
    volatility: 0.2,
  },
  district3: {
    id: 'district3',
    number: 3,
    type: 'Rural',
    name: 'District 3',
    shortName: 'Dist. 3',
    industry: 'Farming, mining',
    wealth: 'Land-poor farmers',
    ethnic: 'Scandinavian, Anglo settlers',
    character: 'Rolling wheat fields, grain elevator, lonely crossroads',
    icon: '\u{1F33E}',
    issueWeights: {
      freeSilver: 0.9,
      railroadRegulation: 0.85,
      laborRights: 0.3,
      antiCorruption: 0.3,
      womensSuffrage: 0.2,
    },
    partisanLean: 6, // Republican lean
    republicanBase: 44,
    democratBase: 38,
    thirdPartyCeiling: { fusion: 6, fptp: 2, pr: 12 },
    volatility: 0.2,
  },
};

export const DISTRICT_LIST = Object.values(DISTRICTS);

export function getIssueAlignment(district, playerIssues) {
  const issues = Array.isArray(playerIssues) ? playerIssues : [playerIssues];
  let total = 0;
  for (const issue of issues) {
    total += district.issueWeights[issue] || 0;
  }
  // Single issue: dampen by 0.65 to keep alignment in similar range as old 2-issue average
  // Two issues (legacy): average as before
  return issues.length === 1 ? total * 0.65 : total / 2;
}

// Get district with scenario modifiers applied
export function getModifiedDistrict(districtId, scenario) {
  const base = DISTRICTS[districtId];
  if (!scenario?.districtModifiers?.[districtId]) return base;
  const mod = scenario.districtModifiers[districtId];

  const modifiedWeights = { ...base.issueWeights };
  for (const [issue, delta] of Object.entries(mod.issueWeightDeltas || {})) {
    modifiedWeights[issue] = Math.max(0, Math.min(1, (modifiedWeights[issue] || 0) + delta));
  }

  return {
    ...base,
    partisanLean: base.partisanLean + (mod.partisanLeanDelta || 0),
    republicanBase: base.republicanBase + (mod.partisanLeanDelta || 0) / 2,
    democratBase: base.democratBase - (mod.partisanLeanDelta || 0) / 2,
    issueWeights: modifiedWeights,
    volatility: Math.max(0.05, Math.min(0.3, base.volatility + (mod.volatilityDelta || 0))),
  };
}
