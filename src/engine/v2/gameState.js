// v2.2 Game State: Kingmaker mechanics + Demands negotiation
// Supports both historical (1892) and modern (2026) eras
// TITLE → PARTY_CREATION → CHOOSE_ADVISOR → 5×(RACE_SELECT→SETUP→CHOICE→RESULT→DEMANDS) → DASHBOARD

import { createContext, useContext } from 'react';
import { getEraData } from '../../data/eraData.js';
import { resolveElection, computeFPTPCounterfactual, initRng, generateSeed, getRng, checkFusionRejection } from './electorate.js';

// Screen flow — DEMANDS phase after each RESULT
export const SCREENS = [
  'TITLE',
  'PARTY_CREATION',
  'CHOOSE_ADVISOR',
  'E1_RACE_SELECT', 'E1_SETUP', 'E1_CHOICE', 'E1_RESULT', 'E1_DEMANDS',
  'E2_RACE_SELECT', 'E2_SETUP', 'E2_CHOICE', 'E2_RESULT', 'E2_DEMANDS',
  'E3_RACE_SELECT', 'E3_SETUP', 'E3_CHOICE', 'E3_RESULT', 'E3_DEMANDS',
  'E4_RACE_SELECT', 'E4_SETUP', 'E4_CHOICE', 'E4_RESULT', 'E4_DEMANDS',
  'E5_RACE_SELECT', 'E5_SETUP', 'E5_CHOICE', 'E5_RESULT', 'E5_DEMANDS',
  'DASHBOARD',
];

// Parse election screen: 'E3_DEMANDS' → { round: 3, phase: 'DEMANDS' }
export function parseElectionScreen(screen) {
  const match = screen.match(/^E(\d)_(RACE_SELECT|SETUP|CHOICE|RESULT|DEMANDS)$/);
  if (!match) return null;
  return { round: parseInt(match[1]), phase: match[2] };
}

export const initialState = {
  screen: 'TITLE',
  era: 'historical',       // 'historical' | 'modern'
  partyName: null,
  partyNameKey: null,
  mascot: null,
  advisor: null,

  // Game progression
  round: 0,
  momentum: 0,         // -15 to +15
  tycoonThreat: 10,    // 0-100
  winsCount: 0,

  // Kingmaker growth
  baseBonus: 0,              // grows with wins (+0.7 each)
  milestonePoints: 0,         // from wins + demands
  goodwill: 0,                // accumulated from successful demands

  // Demands tracking
  demandResults: [],           // [{round, demandId, accepted, leverage, reaction}]
  currentLeverage: 0,          // set after MAKE_CHOICE
  currentFusionPartner: null,  // 'dem' | 'rep' | null

  // Race selection — now { stateLeg, statewide }
  availableRaces: null,
  selectedRace: null,

  // Per-round data: prepared candidates (with tycoon/vex effects applied)
  roundCandidates: null,

  // Performance cascading
  previousResults: [],
  highestTierReached: 1,

  // Election history
  elections: [],

  // Rejection tracking
  rejection: null,            // { candidateName, message } when fusion offer is declined

  // Dashboard data
  fptpCounterfactual: null,
};

// Calculate momentum change from result
function momentumChange(result) {
  if (result.fusionWin) return 2;
  if (result.winner === 'player') return 4;
  if (result.spoiled) return -3;
  return -2;
}

// Generate a headline for the result
function generateHeadline(round, result, partyName, demCandidate, repCandidate, office) {
  if (result.fusionWin) {
    const ally = result.choice === 'fuse_dem' ? demCandidate.name : repCandidate.name;
    return `FUSION TICKET TRIUMPHS: ${ally} Wins ${office} with Reform Support`;
  }
  if (result.winner === 'player') {
    return `STUNNING UPSET: ${partyName} Candidate Wins ${office} Outright`;
  }
  if (result.spoiled) {
    const winnerName = result.winner === 'republican' ? repCandidate.name : demCandidate.name;
    return `VOTE SPLIT HANDS ${office} TO ${winnerName.toUpperCase()} — Reform Voters Blamed`;
  }
  const winnerName = result.winner === 'republican' ? repCandidate.name : demCandidate.name;
  return `${winnerName} Takes ${office} — Reform Party Falls Short`;
}

export function gameReducer(state, action) {
  // Get era-specific data
  const eraData = getEraData(state.era);

  switch (action.type) {
    case 'SET_ERA':
      return { ...initialState, era: action.payload.era };

    case 'START_GAME':
      return { ...initialState, screen: 'PARTY_CREATION', era: state.era };

    case 'CREATE_PARTY': {
      const { nameKey } = action.payload;
      const partyData = eraData.PARTY_NAMES.find(p => p.key === nameKey);
      initRng(generateSeed(nameKey));
      return {
        ...state,
        screen: 'CHOOSE_ADVISOR',
        partyName: partyData.name,
        partyNameKey: nameKey,
        mascot: partyData.mascot,
      };
    }

    case 'CHOOSE_ADVISOR': {
      // After choosing advisor, prepare available races for round 1
      const round = 1;
      const rng = getRng();
      let races = eraData.getAvailableRaces(round, 0, 0, [], rng);
      races = eraData.applyAntagonistToRacePool(round, races);
      return {
        ...state,
        advisor: action.payload.advisorId,
        screen: 'E1_RACE_SELECT',
        round,
        availableRaces: races,
        tycoonThreat: eraData.getAntagonistStage(round).threatLevel,
      };
    }

    case 'SELECT_RACE': {
      // Player picks a race — apply antagonist effects to candidates and go to SETUP
      const race = action.payload.race;
      const round = state.round;
      const { dem, rep } = eraData.applyAntagonistEffect(round, { ...race.dem }, { ...race.rep });
      return {
        ...state,
        screen: `E${round}_SETUP`,
        selectedRace: race,
        roundCandidates: {
          dem,
          rep,
          office: race.office,
          officeShort: race.officeShort,
          year: race.year || (state.era === 'modern' ? 2025 + round : 1891 + round),
          demBase: race.demBase,
          repBase: race.repBase,
          basePlayerSupport: race.basePlayerSupport,
          category: race.category,
          location: race.location,
          incumbent: race.incumbent,
          incumbentName: race.incumbentName,
          partisanLean: race.partisanLean,
          handicapperRating: race.handicapperRating,
          yourProjectedSupport: race.yourProjectedSupport,
          pivotalFactor: race.pivotalFactor,
        },
      };
    }

    case 'MAKE_CHOICE': {
      const { choice } = action.payload;
      const round = state.round;
      const { dem, rep, office, demBase, repBase, basePlayerSupport, category, pivotalFactor } = state.roundCandidates;

      // Check for fusion rejection (candidate declines your endorsement)
      if (choice === 'fuse_dem' || choice === 'fuse_rep') {
        const candidate = choice === 'fuse_dem' ? dem : rep;
        const rejectionCheck = checkFusionRejection(candidate, round);
        if (rejectionCheck.rejected) {
          return {
            ...state,
            screen: `E${round}_CHOICE`,
            rejection: {
              candidateName: candidate.name,
              choice,
              message: rejectionCheck.message,
            },
          };
        }
      }

      // Kingmaker math: base + bonus from wins + momentum adjustment
      const playerBase = (basePlayerSupport || 4) + state.baseBonus + (state.momentum * 0.2);
      const smearPenalty = eraData.getSmearPenalty(round);

      const result = resolveElection({
        choice,
        playerBase,
        demBase,
        repBase,
        demFriendliness: dem.friendliness,
        repFriendliness: rep.friendliness,
        momentum: state.momentum,
        smearPenalty,
        category: category || 'state_leg',
        pivotalFactor: pivotalFactor || 0.7,
      });

      const headline = generateHeadline(round, result, state.partyName, dem, rep, office);
      const antagonistReaction = eraData.getAntagonistReaction(round, result.playerWon, choice);

      const newMomentum = Math.max(-15, Math.min(15, state.momentum + momentumChange(result)));
      const newWins = state.winsCount + (result.playerWon ? 1 : 0);

      // Growth mechanic: each fusion win grows your base (but slower than before)
      const newBaseBonus = state.baseBonus + (result.playerWon ? 0.7 : -0.3);

      // Milestone points for wins
      const newMilestonePoints = state.milestonePoints + (result.playerWon ? 3 : 0);

      // Calculate leverage for demands
      const leverage = eraData.calculateLeverage(result);

      // Track which partner we fused with (for demands screen)
      let fusionPartner = null;
      if (result.fusionWin) {
        fusionPartner = choice === 'fuse_dem' ? 'dem' : 'rep';
      }

      const electionRecord = {
        round,
        choice,
        result,
        headline,
        antagonistReaction,
        // Keep blackwoodReaction for backward compatibility with components
        blackwoodReaction: antagonistReaction,
        office,
        officeShort: state.roundCandidates.officeShort,
        year: state.roundCandidates.year,
        category: category || 'state_leg',
        location: state.roundCandidates.location,
        demCandidate: dem,
        repCandidate: rep,
        playerBase,
        demBase,
        repBase,
        raceId: state.selectedRace?.id,
      };

      const newPreviousResults = [...state.previousResults, {
        round,
        raceId: state.selectedRace?.id,
        playerWon: result.playerWon,
        spoiled: result.spoiled,
        category: category || 'state_leg',
      }];

      return {
        ...state,
        screen: `E${round}_RESULT`,
        rejection: null,
        elections: [...state.elections, electionRecord],
        momentum: newMomentum,
        winsCount: newWins,
        baseBonus: newBaseBonus,
        milestonePoints: newMilestonePoints,
        currentLeverage: leverage,
        currentFusionPartner: fusionPartner,
        previousResults: newPreviousResults,
      };
    }

    case 'PROCEED_TO_DEMANDS': {
      const round = state.round;
      const lastElection = state.elections[state.elections.length - 1];

      // Only go to demands if we won via fusion
      if (lastElection?.result.fusionWin) {
        return {
          ...state,
          screen: `E${round}_DEMANDS`,
        };
      }

      // Lost or ran alone — skip demands, go to next round
      return advanceToNextRound(state);
    }

    case 'SUBMIT_DEMAND': {
      const { demand, accepted, reaction, partnerReaction, advisorReaction } = action.payload;

      const newMilestonePoints = state.milestonePoints + (accepted ? demand.milestonePoints : 0);
      const newGoodwill = state.goodwill + (accepted ? 1 : 0);

      const demandRecord = {
        round: state.round,
        demandId: demand.id,
        demandLabel: demand.label,
        accepted,
        reaction,
        leverage: state.currentLeverage,
        milestonePoints: accepted ? demand.milestonePoints : 0,
      };

      return {
        ...state,
        milestonePoints: newMilestonePoints,
        goodwill: newGoodwill,
        demandResults: [...state.demandResults, demandRecord],
      };
    }

    case 'FINISH_DEMANDS': {
      return advanceToNextRound(state);
    }

    case 'NEXT_ROUND': {
      // Legacy action — redirect through advanceToNextRound for losses
      return advanceToNextRound(state);
    }

    case 'GO_TO_SCREEN':
      return { ...state, screen: action.payload };

    case 'RESET_GAME':
      return { ...initialState };

    case 'SWITCH_ERA': {
      // Switch to modern era and restart
      const newEra = state.era === 'modern' ? 'historical' : 'modern';
      return { ...initialState, era: newEra, screen: 'TITLE' };
    }

    default:
      return state;
  }
}

// Advance to the next round or dashboard
function advanceToNextRound(state) {
  const eraData = getEraData(state.era);
  const nextRound = state.round + 1;

  if (nextRound > 5) {
    const fptpCounterfactual = computeFPTPCounterfactual(state.elections);
    return {
      ...state,
      screen: 'DASHBOARD',
      fptpCounterfactual,
      currentLeverage: 0,
      currentFusionPartner: null,
    };
  }

  // Prepare available races for the next round
  const rng = getRng();
  let races = eraData.getAvailableRaces(nextRound, state.winsCount, state.momentum, state.previousResults, rng);
  races = eraData.applyAntagonistToRacePool(nextRound, races);

  return {
    ...state,
    screen: `E${nextRound}_RACE_SELECT`,
    round: nextRound,
    availableRaces: races,
    selectedRace: null,
    roundCandidates: null,
    tycoonThreat: eraData.getAntagonistStage(nextRound).threatLevel,
    currentLeverage: 0,
    currentFusionPartner: null,
  };
}

export const GameContext = createContext(null);
export const useGame = () => useContext(GameContext);
