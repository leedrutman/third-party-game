import { createContext, useContext } from 'react';
import { ISSUES } from '../data/issues.js';
import { calculateDistrictResult, calculatePRResults, generateSeed, initRng, getRng, isFusionChoice, calculateFundingBoost } from './electorate.js';
import { generateResultHeadlines, generateAmbientHeadline } from './headlines.js';
import { DISTRICTS } from './districts.js';
import { initializeCandidates, rotateCandidates } from '../data/candidates.js';
import { getFlagshipBill, getCurrentStage, calculateBillOutcome } from './legislativeVotes.js';
import { generateScenario } from '../data/scenarios.js';

// Clamp helper
function clamp(v, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

// Parse Act I screen names: 'ACT1_E2_FUSION_DECISION' -> { election: 2, phase: 'FUSION_DECISION' }
export function parseAct1Screen(screen) {
  const match = screen.match(/^ACT1_E(\d)_(.+)$/);
  if (!match) return null;
  return { election: parseInt(match[1]), phase: match[2] };
}

// Screen flow
export const SCREENS = [
  'TITLE',
  'PARTY_CREATION',
  'CHOOSE_ADVISOR',

  // === ACT I: Fusion (3 election cycles) ===
  'ACT1_INTRO',

  // Election 1 (1892)
  'ACT1_E1_LANDSCAPE',
  'ACT1_E1_FUSION_DECISION',
  'ACT1_E1_FUND_ALLOCATION',
  'ACT1_E1_ADVISOR_REC',
  'ACT1_E1_RESULTS',
  'ACT1_E1_LEGISLATIVE',
  'ACT1_E1_VOTE_RESULT',

  // Election 2 (1894)
  'ACT1_E2_LANDSCAPE',
  'ACT1_E2_FUSION_DECISION',
  'ACT1_E2_FUND_ALLOCATION',
  'ACT1_E2_ADVISOR_REC',
  'ACT1_E2_RESULTS',
  'ACT1_E2_LEGISLATIVE',
  'ACT1_E2_VOTE_RESULT',

  // Election 3 (1896)
  'ACT1_E3_LANDSCAPE',
  'ACT1_E3_FUSION_DECISION',
  'ACT1_E3_FUND_ALLOCATION',
  'ACT1_E3_ADVISOR_REC',
  'ACT1_E3_RESULTS',
  'ACT1_E3_LEGISLATIVE',
  'ACT1_E3_VOTE_RESULT',

  'ACT1_SCORE',

  // === TRANSITION ===
  'TRANSITION_ANTIFUSION',

  // === ACT II ===
  'ACT2_INTRO',
  'ACT2_R1',
  'ACT2_R1_RESULT',
  'ACT2_R2',
  'ACT2_R2_RESULT',
  'ACT2_R3',
  'ACT2_R3_RESULT',
  'ACT2_SCORE',

  // === TRANSITION ===
  'TRANSITION_COUNTERFACTUAL',

  // === ACT III ===
  'ACT3_INTRO',
  'ACT3_R1',
  'ACT3_R1_RESULT',
  'ACT3_R2',
  'ACT3_R2_RESULT',
  'ACT3_R3',
  'ACT3_R3_RESULT',
  'ACT3_SCORE',

  'DASHBOARD',
];

function makeElectionState() {
  return {
    fundAllocation: {},
    fusionChoices: {},
    electionResults: {},
    legislativeVote: null,
  };
}

export const initialState = {
  screen: 'TITLE',
  party: null,
  advisor: null,
  scenario: null,

  resources: { funds: 50, morale: 50, visibility: 5 },
  fundPool: 500,
  allyRelationship: 60,

  candidates: {},

  act1: {
    elections: {
      1: makeElectionState(),
      2: makeElectionState(),
      3: makeElectionState(),
    },
    seatsHeld: {},
    totalFusionWins: 0,
    totalVotesOnLine: 0,
    betrayalOccurred: false,
    betrayalDetails: null,
    billProgress: { stage: 0, stageHistory: [] },
    score: null,
  },

  act2: {
    runChoices: {},
    electionResults: {},
    blameChoice: null,
    absorptionChoice: null,
    score: null,
  },
  act3: {
    issuePriority: null,
    seatResults: null,
    coalitionChoice: null,
    coalitionResult: null,
    voteChoice: null,
    voteResult: null,
    score: null,
  },

  headlines: [],
  showingHeadlines: false,
};

function calculateStartingResources(issues) {
  const issueList = Array.isArray(issues) ? issues : [issues];
  let funds = 50, morale = 50, visibility = 5;
  for (const issueKey of issueList) {
    const issue = ISSUES[issueKey];
    if (issue?.resourceBonus) {
      funds += issue.resourceBonus.funds;
      morale += issue.resourceBonus.morale;
      visibility += issue.resourceBonus.visibility;
    }
  }
  return { funds, morale, visibility };
}

function calculateAct1Score(state) {
  let totalFusionWins = 0;
  let totalVotes = 0;
  let legislativeWins = 0;

  for (let e = 1; e <= 3; e++) {
    const el = state.act1.elections[e];
    if (el.electionResults) {
      for (const r of Object.values(el.electionResults)) {
        totalVotes += r.yourVotes || 0;
        if (r.fusionWin) totalFusionWins++;
      }
    }
    if (el.legislativeVote?.outcome === 'full') legislativeWins++;
    else if (el.legislativeVote?.outcome === 'partial') legislativeWins += 0.5;
  }

  let visibility = 'Low';
  if (state.resources.visibility > 40) visibility = 'Medium';
  if (state.resources.visibility > 65) visibility = 'High';

  let relationship = 'Healthy';
  if (state.allyRelationship < 40) relationship = 'Hostile';
  else if (state.allyRelationship < 60) relationship = 'Strained';

  const billStage = state.act1.billProgress?.stage || 0;
  const billPassed = billStage >= 3;
  const issueKey = typeof state.party?.issues === 'string' ? state.party.issues : state.party?.issues?.[0];
  const bill = issueKey ? getFlagshipBill(issueKey) : null;

  return {
    totalFusionWins,
    totalVotes,
    legislativeWins,
    visibility,
    relationship,
    betrayalOccurred: state.act1.betrayalOccurred,
    billStage,
    billPassed,
    billName: bill?.name || 'Your Bill',
    billShortName: bill?.shortName || 'Your Bill',
  };
}

function calculateAct2Score(state) {
  const results = state.act2.electionResults;
  let spoiledRaces = 0;

  for (const r of Object.values(results)) {
    if (r.spoiled) spoiledRaces++;
  }

  let partySurvival = 'Dying';
  if (state.act2.absorptionChoice === 'acceptReality') partySurvival = 'Dead';
  else if (state.act2.absorptionChoice === 'outflank') partySurvival = 'Undead';

  return {
    districtsWon: 0,
    spoiledRaces,
    policyWins: 0,
    partySurvival,
    voterSatisfaction: 'Abysmal',
  };
}

function calculateAct3Score(state) {
  const seats = state.act3.seatResults;
  const inGov = state.act3.coalitionResult === 'inGovernment';

  let policyEnacted = 'None';
  if (state.act3.voteResult === 'passed') policyEnacted = 'Full';
  else if (state.act3.voteResult === 'partial') policyEnacted = 'Partial';

  let coalitionStability = 'Collapsed';
  if (state.act3.coalitionResult === 'inGovernment') coalitionStability = 'Stable';
  else if (state.act3.coalitionResult === 'shaky') coalitionStability = 'Shaky';

  return {
    seatsWon: seats?.player || 0,
    inGovernment: inGov,
    policyEnacted,
    coalitionStability,
    voterSatisfaction: 'High',
  };
}

export function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return { ...initialState, screen: 'PARTY_CREATION' };

    case 'CREATE_PARTY': {
      const { name, mascot, issues } = action.payload;
      // issues can be a string (single issue) or array (legacy)
      const issueKey = typeof issues === 'string' ? issues : issues[0];
      const issuesForSeed = Array.isArray(issues) ? issues : [issues];
      const seed = generateSeed(name.key, mascot.key, issuesForSeed);
      initRng(seed);
      const rng = getRng();
      const scenario = generateScenario(rng);
      const resources = calculateStartingResources(issueKey);
      const candidates = initializeCandidates();
      return {
        ...state,
        screen: 'CHOOSE_ADVISOR',
        party: { name: name.name, nameKey: name.key, mascot, issues: issueKey },
        scenario,
        resources,
        fundPool: 500,
        candidates,
      };
    }

    case 'CHOOSE_ADVISOR': {
      return {
        ...state,
        advisor: action.payload.advisorId,
        screen: 'ACT1_INTRO',
      };
    }

    case 'NEXT_SCREEN': {
      const idx = SCREENS.indexOf(state.screen);
      if (idx < SCREENS.length - 1) {
        return { ...state, screen: SCREENS[idx + 1], headlines: [] };
      }
      return state;
    }

    case 'GO_TO_SCREEN':
      return { ...state, screen: action.payload, headlines: [] };

    // ============================================
    // ACT I: Three election cycles with fusion
    // ============================================

    case 'ACT1_FUSION_CHOICES': {
      const { election, choices } = action.payload;
      return {
        ...state,
        act1: {
          ...state.act1,
          elections: {
            ...state.act1.elections,
            [election]: { ...state.act1.elections[election], fusionChoices: choices },
          },
        },
        screen: `ACT1_E${election}_FUND_ALLOCATION`,
      };
    }

    case 'ACT1_ALLOCATE_FUNDS': {
      const { election, allocation } = action.payload;
      const totalAllocated = Object.values(allocation).reduce((s, v) => s + v, 0);
      return {
        ...state,
        act1: {
          ...state.act1,
          elections: {
            ...state.act1.elections,
            [election]: { ...state.act1.elections[election], fundAllocation: allocation },
          },
        },
        fundPool: state.fundPool - totalAllocated,
        screen: `ACT1_E${election}_ADVISOR_REC`,
      };
    }

    case 'ACT1_COMPUTE_ELECTION': {
      const { election } = action.payload;
      const elData = state.act1.elections[election];
      const electionResults = {};

      for (const [districtId, choice] of Object.entries(elData.fusionChoices)) {
        const prevElection = election > 1 ? state.act1.elections[election - 1] : null;
        const prevResult = prevElection?.electionResults?.[districtId];
        const result = calculateDistrictResult(districtId, state.party.issues, 'fusion', {
          viability: state.resources.visibility / 4,
          fusionChoice: choice,
          fundingAmount: elData.fundAllocation[districtId] || 0,
          previousSupport: prevResult?.yourPercent || 0,
          incumbentBonus: state.act1.seatsHeld[districtId] ? 3 : 0,
        });
        result.districtName = DISTRICTS[districtId].name;
        result.fusionChoice = choice;
        electionResults[districtId] = result;
      }

      // Update seats held
      const newSeatsHeld = { ...state.act1.seatsHeld };
      let fusionWinsThisElection = 0;
      let votesThisElection = 0;
      let visChange = 0, moraleChange = 0, fundPoolGrowth = 0;

      for (const [did, r] of Object.entries(electionResults)) {
        votesThisElection += r.yourVotes || 0;
        if (r.fusionWin) {
          newSeatsHeld[did] = r.fusionChoice;
          fusionWinsThisElection++;
          visChange += 8;
          moraleChange += 6;
          fundPoolGrowth += 75;
        } else if (r.spoiled) {
          visChange += 3;
          moraleChange -= 5;
        } else if (r.stoodDown) {
          visChange -= 3;
          moraleChange -= 3;
        } else {
          visChange += 2;
          moraleChange += 1;
        }
      }

      const headlines = generateResultHeadlines(1, election, state, electionResults);

      return {
        ...state,
        act1: {
          ...state.act1,
          elections: {
            ...state.act1.elections,
            [election]: { ...state.act1.elections[election], electionResults },
          },
          seatsHeld: newSeatsHeld,
          totalFusionWins: state.act1.totalFusionWins + fusionWinsThisElection,
          totalVotesOnLine: state.act1.totalVotesOnLine + votesThisElection,
        },
        resources: {
          funds: clamp(state.resources.funds),
          morale: clamp(state.resources.morale + moraleChange),
          visibility: clamp(state.resources.visibility + visChange),
        },
        fundPool: state.fundPool + fundPoolGrowth,
        headlines,
        screen: `ACT1_E${election}_RESULTS`,
      };
    }

    case 'ACT1_LEGISLATIVE_CHOICE': {
      const { election, choice } = action.payload;
      const issueKey = typeof state.party.issues === 'string' ? state.party.issues : state.party.issues[0];
      const currentStage = state.act1.billProgress.stage;
      const stageData = getCurrentStage(issueKey, currentStage);
      const bill = getFlagshipBill(issueKey);

      return {
        ...state,
        act1: {
          ...state.act1,
          elections: {
            ...state.act1.elections,
            [election]: {
              ...state.act1.elections[election],
              legislativeVote: {
                issueKey,
                bill: {
                  title: bill?.shortName || bill?.name || 'the bill',
                  fullName: bill?.name,
                  description: stageData?.description || '',
                  stageName: stageData?.name || '',
                  stageIndex: currentStage,
                  stakes: currentStage === 2 ? 'high' : currentStage === 1 ? 'medium' : 'low',
                },
                playerChoice: choice,
                outcome: null,
              },
            },
          },
        },
      };
    }

    case 'ACT1_LEGISLATIVE_RESULT': {
      const { election } = action.payload;
      const elData = state.act1.elections[election];
      const legVote = elData.legislativeVote;
      const rng = getRng();
      const currentStage = state.act1.billProgress.stage;

      const result = calculateBillOutcome(
        legVote.playerChoice,
        state.allyRelationship,
        state.act1.seatsHeld,
        currentStage,
        rng,
      );

      // Advance bill progress if successful
      const newStage = result.advanced ? currentStage + 1 : currentStage;
      const stageHistory = [
        ...state.act1.billProgress.stageHistory,
        { election, stage: currentStage, advanced: result.advanced, betrayal: result.betrayal },
      ];

      // Map to legacy outcome format for display compat
      const outcomeCompat = result.advanced ? 'full' : 'none';

      let betrayalOccurred = state.act1.betrayalOccurred;
      let betrayalDetails = state.act1.betrayalDetails;

      if (result.betrayal && !betrayalOccurred) {
        betrayalOccurred = true;
        const betrayingEntry = Object.entries(state.act1.seatsHeld).find(([, v]) => v);
        if (betrayingEntry) {
          const [distId, fusionType] = betrayingEntry;
          const partyKey = fusionType === 'fusionDem' ? 'democrat' : 'republican';
          const candidate = state.candidates[distId]?.[partyKey];
          if (candidate) {
            const issueKey = typeof state.party.issues === 'string' ? state.party.issues : state.party.issues[0];
            const bill = getFlagshipBill(issueKey);
            betrayalDetails = {
              type: 'votedAgainst',
              districtId: distId,
              candidateId: candidate.id,
              candidateName: `${candidate.title} ${candidate.name}`,
              description: `${candidate.title} ${candidate.name} voted against ${bill?.shortName || 'your bill'} despite your fusion deal.`,
            };
          }
        }
      }

      // Rotate candidates between elections (if not last election)
      let newCandidates = state.candidates;
      if (election < 3) {
        newCandidates = rotateCandidates(
          state.candidates,
          elData.electionResults,
          rng,
        );
      }

      const headlines = generateResultHeadlines(1, election + 0.5, state, {
        legislativeOutcome: outcomeCompat,
        betrayal: result.betrayal,
      });

      return {
        ...state,
        act1: {
          ...state.act1,
          elections: {
            ...state.act1.elections,
            [election]: {
              ...state.act1.elections[election],
              legislativeVote: {
                ...legVote,
                outcome: outcomeCompat,
                advanced: result.advanced,
                betrayal: result.betrayal,
              },
            },
          },
          betrayalOccurred,
          betrayalDetails,
          billProgress: { stage: newStage, stageHistory },
        },
        candidates: newCandidates,
        allyRelationship: clamp(state.allyRelationship + result.relationshipChange),
        resources: {
          ...state.resources,
          morale: clamp(state.resources.morale + result.resourceChanges.morale),
          visibility: clamp(state.resources.visibility + result.resourceChanges.visibility),
        },
        headlines,
        screen: `ACT1_E${election}_VOTE_RESULT`,
      };
    }

    case 'ACT1_CALCULATE_SCORE': {
      const score = calculateAct1Score(state);
      return {
        ...state,
        act1: { ...state.act1, score },
        screen: 'ACT1_SCORE',
      };
    }

    // ============================================
    // ACT II: FPTP (after fusion banned)
    // ============================================

    case 'ACT2_RUN_CHOICES': {
      const choices = action.payload;
      const electionResults = {};
      const headlineResults = {};

      for (const [districtId, choice] of Object.entries(choices)) {
        const result = calculateDistrictResult(districtId, state.party.issues, 'fptp', {
          viability: Math.max(3, state.resources.visibility / 6),
          fusionChoice: choice === 'alone' ? 'alone' : 'standDown',
          resourceBonus: state.resources.funds / 80,
        });
        result.districtName = DISTRICTS[districtId].name;
        electionResults[districtId] = result;
        headlineResults[districtId] = result;
      }

      let visibilityChange = 0, moraleChange = -5;
      for (const r of Object.values(electionResults)) {
        if (r.spoiled) { moraleChange -= 8; visibilityChange += 5; }
        if (r.stoodDown) { visibilityChange -= 8; }
      }

      const headlines = generateResultHeadlines(2, 1, state, headlineResults);

      return {
        ...state,
        act2: { ...state.act2, runChoices: choices, electionResults },
        resources: {
          ...state.resources,
          visibility: clamp(state.resources.visibility + visibilityChange),
          morale: clamp(state.resources.morale + moraleChange),
        },
        headlines,
        screen: 'ACT2_R1_RESULT',
      };
    }

    case 'ACT2_BLAME': {
      const choice = action.payload;
      let relationshipChange, moraleChange, visibilityChange;

      if (choice === 'apologize') {
        relationshipChange = 10; moraleChange = -15; visibilityChange = -10;
      } else if (choice === 'doubleDown') {
        relationshipChange = -20; moraleChange = 5; visibilityChange = 5;
      } else {
        relationshipChange = -5; moraleChange = -5; visibilityChange = -3;
      }

      const headlines = generateResultHeadlines(2, 2, state, { choice });

      return {
        ...state,
        act2: { ...state.act2, blameChoice: choice },
        allyRelationship: clamp(state.allyRelationship + relationshipChange),
        resources: {
          ...state.resources,
          morale: clamp(state.resources.morale + moraleChange),
          visibility: clamp(state.resources.visibility + visibilityChange),
        },
        headlines,
        screen: 'ACT2_R2_RESULT',
      };
    }

    case 'ACT2_ABSORPTION': {
      const choice = action.payload;
      let moraleChange, visibilityChange;

      if (choice === 'cryTheft') {
        moraleChange = -5; visibilityChange = 5;
      } else if (choice === 'outflank') {
        moraleChange = 5; visibilityChange = -10;
      } else {
        moraleChange = -20; visibilityChange = -15;
      }

      const headlines = generateResultHeadlines(2, 3, state, { choice });

      return {
        ...state,
        act2: { ...state.act2, absorptionChoice: choice },
        resources: {
          ...state.resources,
          morale: clamp(state.resources.morale + moraleChange),
          visibility: clamp(state.resources.visibility + visibilityChange),
        },
        headlines,
        screen: 'ACT2_R3_RESULT',
      };
    }

    case 'ACT2_CALCULATE_SCORE': {
      const score = calculateAct2Score(state);
      return { ...state, act2: { ...state.act2, score }, screen: 'ACT2_SCORE' };
    }

    // ============================================
    // ACT III: PR
    // ============================================

    case 'ACT3_ISSUE_PRIORITY': {
      const issuePriority = action.payload;
      const seatResults = calculatePRResults(state.party.issues, issuePriority);
      const headlines = generateResultHeadlines(3, 1, state, { playerSeats: seatResults.player });

      return {
        ...state,
        act3: { ...state.act3, issuePriority, seatResults },
        resources: {
          ...state.resources,
          morale: Math.min(100, state.resources.morale + 20),
          visibility: Math.min(100, state.resources.visibility + 25),
        },
        headlines,
        screen: 'ACT3_R1_RESULT',
      };
    }

    case 'ACT3_COALITION': {
      const choice = action.payload;
      let coalitionResult, moraleChange = 0;

      if (choice === 'joinDemocrat') {
        coalitionResult = 'inGovernment';
        moraleChange = 5;
      } else if (choice === 'holdOut') {
        coalitionResult = Math.random() > 0.4 ? 'inGovernment' : 'shaky';
        moraleChange = coalitionResult === 'inGovernment' ? 10 : -5;
      } else {
        coalitionResult = Math.random() > 0.6 ? 'inGovernment' : 'opposition';
        moraleChange = coalitionResult === 'inGovernment' ? 15 : -10;
      }

      const headlines = generateResultHeadlines(3, 2, state, { choice });

      return {
        ...state,
        act3: { ...state.act3, coalitionChoice: choice, coalitionResult },
        resources: {
          ...state.resources,
          morale: clamp(state.resources.morale + moraleChange),
        },
        headlines,
        screen: 'ACT3_R2_RESULT',
      };
    }

    case 'ACT3_VOTE': {
      const choice = action.payload;
      let voteResult, votesFor, votesAgainst;

      if (choice === 'compromise') {
        voteResult = 'passed';
        votesFor = 55 + Math.floor(Math.random() * 10);
        votesAgainst = 100 - votesFor;
      } else if (choice === 'principles') {
        voteResult = 'failed';
        votesFor = 35 + Math.floor(Math.random() * 10);
        votesAgainst = 100 - votesFor;
      } else {
        const roll = Math.random();
        if (roll > 0.5) {
          voteResult = 'passed';
          votesFor = 51 + Math.floor(Math.random() * 5);
        } else if (roll > 0.2) {
          voteResult = 'partial';
          votesFor = 48 + Math.floor(Math.random() * 5);
        } else {
          voteResult = 'failed';
          votesFor = 40 + Math.floor(Math.random() * 8);
        }
        votesAgainst = 100 - votesFor;
      }

      const headlines = generateResultHeadlines(3, 3, state, { choice, votesFor, votesAgainst });

      return {
        ...state,
        act3: { ...state.act3, voteChoice: choice, voteResult, votesFor, votesAgainst },
        headlines,
        screen: 'ACT3_R3_RESULT',
      };
    }

    case 'ACT3_CALCULATE_SCORE': {
      const score = calculateAct3Score(state);
      return { ...state, act3: { ...state.act3, score }, screen: 'ACT3_SCORE' };
    }

    case 'DISMISS_HEADLINES':
      return { ...state, headlines: [] };

    case 'RESET_GAME':
      return { ...initialState };

    default:
      return state;
  }
}

export const GameContext = createContext(null);
export const useGame = () => useContext(GameContext);
