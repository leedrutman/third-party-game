// Era Data Resolver: provides the right data modules based on era ('historical' | 'modern')
// All game components call getEraData(era) to get era-specific data.

import { PARTY_NAMES as HIST_PARTY_NAMES, REFORM_CAUSE as HIST_REFORM_CAUSE } from './v2/issues.js';
import { PARTY_NAMES as MOD_PARTY_NAMES, REFORM_CAUSE as MOD_REFORM_CAUSE } from './modern/issues.js';

import {
  ADVISORS as HIST_ADVISORS,
  INTRODUCTIONS as HIST_INTRODUCTIONS,
  getAdvisorRecommendation as histGetAdvisorRecommendation,
  getAdvisorResultReaction as histGetAdvisorResultReaction,
  getAdvisorBriefing as histGetAdvisorBriefing,
} from './v2/advisorLines.js';

import {
  ADVISORS as MOD_ADVISORS,
  INTRODUCTIONS as MOD_INTRODUCTIONS,
  getAdvisorRecommendation as modGetAdvisorRecommendation,
  getAdvisorResultReaction as modGetAdvisorResultReaction,
  getAdvisorBriefing as modGetAdvisorBriefing,
} from './modern/advisorLines.js';

import { RACE_CATEGORIES as HIST_RACE_CATEGORIES, getAvailableRaces as histGetAvailableRaces } from './v2/races.js';
import { RACE_CATEGORIES as MOD_RACE_CATEGORIES, getAvailableRaces as modGetAvailableRaces } from './modern/races.js';

import {
  DEMANDS as HIST_DEMANDS,
  MILESTONES as HIST_MILESTONES,
  calculateLeverage as histCalculateLeverage,
  getCurrentMilestone as histGetCurrentMilestone,
  getNextMilestone as histGetNextMilestone,
  getMilestoneProgress as histGetMilestoneProgress,
  resolveDemand as histResolveDemand,
  getPartnerReaction as histGetPartnerReaction,
  getAdvisorDemandReaction as histGetAdvisorDemandReaction,
} from './v2/demands.js';

import {
  DEMANDS as MOD_DEMANDS,
  MILESTONES as MOD_MILESTONES,
  calculateLeverage as modCalculateLeverage,
  getCurrentMilestone as modGetCurrentMilestone,
  getNextMilestone as modGetNextMilestone,
  getMilestoneProgress as modGetMilestoneProgress,
  resolveDemand as modResolveDemand,
  getPartnerReaction as modGetPartnerReaction,
  getAdvisorDemandReaction as modGetAdvisorDemandReaction,
} from './modern/demands.js';

import {
  BLACKWOOD,
  getTycoonStage,
  applyTycoonEffect,
  getSmearPenalty as histGetSmearPenalty,
  applyTycoonToRacePool,
  getBlackwoodReaction,
} from '../engine/tycoon.js';

import {
  VEX,
  getVexStage,
  applyVexEffect,
  getVexSmearPenalty,
  applyVexToRacePool,
  getVexReaction,
} from '../engine/vex.js';

const HISTORICAL = {
  era: 'historical',
  year: 1892,
  PARTY_NAMES: HIST_PARTY_NAMES,
  REFORM_CAUSE: HIST_REFORM_CAUSE,
  ADVISORS: HIST_ADVISORS,
  INTRODUCTIONS: HIST_INTRODUCTIONS,
  getAdvisorRecommendation: histGetAdvisorRecommendation,
  getAdvisorResultReaction: histGetAdvisorResultReaction,
  getAdvisorBriefing: histGetAdvisorBriefing,
  RACE_CATEGORIES: HIST_RACE_CATEGORIES,
  getAvailableRaces: histGetAvailableRaces,
  calculateLeverage: histCalculateLeverage,
  DEMANDS: HIST_DEMANDS,
  MILESTONES: HIST_MILESTONES,
  getCurrentMilestone: histGetCurrentMilestone,
  getNextMilestone: histGetNextMilestone,
  getMilestoneProgress: histGetMilestoneProgress,
  resolveDemand: histResolveDemand,
  getPartnerReaction: histGetPartnerReaction,
  getAdvisorDemandReaction: histGetAdvisorDemandReaction,
  // Antagonist
  ANTAGONIST: BLACKWOOD,
  getAntagonistStage: getTycoonStage,
  applyAntagonistEffect: applyTycoonEffect,
  getSmearPenalty: histGetSmearPenalty,
  applyAntagonistToRacePool: applyTycoonToRacePool,
  getAntagonistReaction: getBlackwoodReaction,
  // Labels
  antagonistName: 'Blackwood',
  antagonistQuoteKey: 'blackwoodQuote',
};

const MODERN = {
  era: 'modern',
  year: 2026,
  PARTY_NAMES: MOD_PARTY_NAMES,
  REFORM_CAUSE: MOD_REFORM_CAUSE,
  ADVISORS: MOD_ADVISORS,
  INTRODUCTIONS: MOD_INTRODUCTIONS,
  getAdvisorRecommendation: modGetAdvisorRecommendation,
  getAdvisorResultReaction: modGetAdvisorResultReaction,
  getAdvisorBriefing: modGetAdvisorBriefing,
  RACE_CATEGORIES: MOD_RACE_CATEGORIES,
  getAvailableRaces: modGetAvailableRaces,
  calculateLeverage: modCalculateLeverage,
  DEMANDS: MOD_DEMANDS,
  MILESTONES: MOD_MILESTONES,
  getCurrentMilestone: modGetCurrentMilestone,
  getNextMilestone: modGetNextMilestone,
  getMilestoneProgress: modGetMilestoneProgress,
  resolveDemand: modResolveDemand,
  getPartnerReaction: modGetPartnerReaction,
  getAdvisorDemandReaction: modGetAdvisorDemandReaction,
  // Antagonist
  ANTAGONIST: VEX,
  getAntagonistStage: getVexStage,
  applyAntagonistEffect: applyVexEffect,
  getSmearPenalty: getVexSmearPenalty,
  applyAntagonistToRacePool: applyVexToRacePool,
  getAntagonistReaction: getVexReaction,
  // Labels
  antagonistName: 'Vex',
  antagonistQuoteKey: 'vexQuote',
};

export function getEraData(era) {
  return era === 'modern' ? MODERN : HISTORICAL;
}
