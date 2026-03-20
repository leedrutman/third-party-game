import { useReducer, useCallback } from 'react';
import { gameReducer, initialState, GameContext, parseAct1Screen } from './engine/gameState.js';

import TitleScreen from './components/TitleScreen.jsx';
import PartyCreation from './components/PartyCreation.jsx';
import AdvisorSelection from './components/AdvisorSelection.jsx';
import ActIntro from './components/ActIntro.jsx';
import {
  FusionDecision,
  FPTPDecision,
  BlameDecision,
  AbsorptionDecision,
  IssuePriorityDecision,
  CoalitionDecision,
  VoteDecision,
} from './components/DecisionScreen.jsx';
import ResultScreen from './components/ResultScreen.jsx';
import ScoreScreen from './components/ScoreScreen.jsx';
import { AntiFusionTransition, CounterfactualTransition } from './components/TransitionScreen.jsx';
import Dashboard from './components/Dashboard.jsx';
import NewsTicker from './components/NewsTicker.jsx';
import ResourceBar from './components/ResourceBar.jsx';
import FundAllocation from './components/FundAllocation.jsx';
import { AdvisorLandscape, AdvisorRecommendation } from './components/AdvisorPanel.jsx';
import LegislativeVote from './components/LegislativeVote.jsx';
import LegislativeResult from './components/LegislativeResult.jsx';

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const next = useCallback(() => dispatch({ type: 'NEXT_SCREEN' }), []);
  const dismissHeadlines = useCallback(() => dispatch({ type: 'DISMISS_HEADLINES' }), []);

  function renderScreen() {
    // Check for Act I election cycle screens first (pattern matching)
    const act1Match = parseAct1Screen(state.screen);
    if (act1Match) {
      const { election, phase } = act1Match;
      switch (phase) {
        case 'LANDSCAPE':
          return <AdvisorLandscape election={election} state={state} onContinue={next} />;

        case 'FUSION_DECISION':
          return (
            <FusionDecision
              state={state}
              election={election}
              onSubmit={(choices) => dispatch({
                type: 'ACT1_FUSION_CHOICES',
                payload: { election, choices },
              })}
            />
          );

        case 'FUND_ALLOCATION':
          return (
            <FundAllocation
              fundPool={state.fundPool}
              state={state}
              election={election}
              onSubmit={(allocation) => dispatch({
                type: 'ACT1_ALLOCATE_FUNDS',
                payload: { election, allocation },
              })}
            />
          );

        case 'ADVISOR_REC':
          return (
            <AdvisorRecommendation
              election={election}
              state={state}
              onContinue={() => dispatch({
                type: 'ACT1_COMPUTE_ELECTION',
                payload: { election },
              })}
            />
          );

        case 'RESULTS':
          return <ResultScreen act={1} round={election} state={state} onContinue={next} />;

        case 'LEGISLATIVE':
          return (
            <LegislativeVote
              election={election}
              state={state}
              onSubmit={(choice) => {
                dispatch({ type: 'ACT1_LEGISLATIVE_CHOICE', payload: { election, choice } });
                // Use setTimeout to ensure the choice is set before computing result
                setTimeout(() => {
                  dispatch({ type: 'ACT1_LEGISLATIVE_RESULT', payload: { election } });
                }, 0);
              }}
            />
          );

        case 'VOTE_RESULT':
          return <LegislativeResult election={election} state={state} onContinue={next} />;

        default:
          break;
      }
    }

    // Standard screen routing
    switch (state.screen) {
      case 'TITLE':
        return <TitleScreen onStart={() => dispatch({ type: 'START_GAME' })} />;

      case 'PARTY_CREATION':
        return (
          <PartyCreation
            onComplete={(payload) => dispatch({ type: 'CREATE_PARTY', payload })}
          />
        );

      case 'CHOOSE_ADVISOR':
        return (
          <AdvisorSelection
            onSelect={(id) => dispatch({ type: 'CHOOSE_ADVISOR', payload: { advisorId: id } })}
          />
        );

      // === ACT I ===
      case 'ACT1_INTRO':
        return <ActIntro act={1} party={state.party} state={state} onContinue={next} />;

      case 'ACT1_SCORE': {
        // Calculate score if not yet done
        if (!state.act1.score) {
          dispatch({ type: 'ACT1_CALCULATE_SCORE' });
          return null;
        }
        return <ScoreScreen act={1} score={state.act1.score} party={state.party} onContinue={next} />;
      }

      // === TRANSITION ===
      case 'TRANSITION_ANTIFUSION':
        return <AntiFusionTransition onContinue={next} />;

      // === ACT II ===
      case 'ACT2_INTRO':
        return <ActIntro act={2} party={state.party} state={state} onContinue={next} />;

      case 'ACT2_R1':
        return <FPTPDecision state={state} onSubmit={(choices) => dispatch({ type: 'ACT2_RUN_CHOICES', payload: choices })} />;

      case 'ACT2_R1_RESULT':
        return <ResultScreen act={2} round={1} state={state} onContinue={next} />;

      case 'ACT2_R2':
        return <BlameDecision state={state} onSubmit={(choice) => dispatch({ type: 'ACT2_BLAME', payload: choice })} />;

      case 'ACT2_R2_RESULT':
        return <ResultScreen act={2} round={2} state={state} onContinue={next} />;

      case 'ACT2_R3':
        return <AbsorptionDecision state={state} onSubmit={(choice) => dispatch({ type: 'ACT2_ABSORPTION', payload: choice })} />;

      case 'ACT2_R3_RESULT':
        return <ResultScreen act={2} round={3} state={state} onContinue={() => dispatch({ type: 'ACT2_CALCULATE_SCORE' })} />;

      case 'ACT2_SCORE':
        return <ScoreScreen act={2} score={state.act2.score} party={state.party} onContinue={next} />;

      // === TRANSITION ===
      case 'TRANSITION_COUNTERFACTUAL':
        return <CounterfactualTransition onContinue={next} />;

      // === ACT III ===
      case 'ACT3_INTRO':
        return <ActIntro act={3} party={state.party} state={state} onContinue={next} />;

      case 'ACT3_R1':
        return <IssuePriorityDecision state={state} onSubmit={(priority) => dispatch({ type: 'ACT3_ISSUE_PRIORITY', payload: priority })} />;

      case 'ACT3_R1_RESULT':
        return <ResultScreen act={3} round={1} state={state} onContinue={next} />;

      case 'ACT3_R2':
        return <CoalitionDecision state={state} onSubmit={(choice) => dispatch({ type: 'ACT3_COALITION', payload: choice })} />;

      case 'ACT3_R2_RESULT':
        return <ResultScreen act={3} round={2} state={state} onContinue={next} />;

      case 'ACT3_R3':
        return <VoteDecision state={state} onSubmit={(choice) => dispatch({ type: 'ACT3_VOTE', payload: choice })} />;

      case 'ACT3_R3_RESULT':
        return <ResultScreen act={3} round={3} state={state} onContinue={() => dispatch({ type: 'ACT3_CALCULATE_SCORE' })} />;

      case 'ACT3_SCORE':
        return <ScoreScreen act={3} score={state.act3.score} party={state.party} onContinue={next} />;

      // === DASHBOARD ===
      case 'DASHBOARD':
        return <Dashboard state={state} onPlayAgain={() => dispatch({ type: 'RESET_GAME' })} />;

      default:
        return <TitleScreen onStart={() => dispatch({ type: 'START_GAME' })} />;
    }
  }

  const showResourceBar = state.party && !['TITLE', 'PARTY_CREATION', 'CHOOSE_ADVISOR'].includes(state.screen);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      <div className={`min-h-dvh ${showResourceBar ? 'has-resource-bar' : ''}`}>
        {showResourceBar && (
          <ResourceBar
            resources={state.resources}
            allyRelationship={state.allyRelationship}
            fundPool={state.fundPool}
            partyName={state.party?.name}
          />
        )}
        {renderScreen()}

        {state.headlines.length > 0 && (
          <NewsTicker headlines={state.headlines} onDismiss={dismissHeadlines} />
        )}
      </div>
    </GameContext.Provider>
  );
}

export default App;
