import { useReducer, useCallback } from 'react';
import { gameReducer, initialState, GameContext, parseElectionScreen } from './engine/v2/gameState.js';

import TitleScreen from './components/v2/TitleScreen.jsx';
import PartyCreation from './components/v2/PartyCreation.jsx';
import AdvisorSelection from './components/v2/AdvisorSelection.jsx';
import RaceSelect from './components/v2/RaceSelect.jsx';
import ElectionSetup from './components/v2/ElectionSetup.jsx';
import ElectionChoice from './components/v2/ElectionChoice.jsx';
import ElectionResult from './components/v2/ElectionResult.jsx';
import Demands from './components/v2/Demands.jsx';
import Dashboard from './components/v2/Dashboard.jsx';

function AppV2() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const renderScreen = useCallback(() => {
    // Check for election screens: E1_RACE_SELECT, E1_SETUP, E3_CHOICE, E2_DEMANDS, etc.
    const elMatch = parseElectionScreen(state.screen);
    if (elMatch) {
      const { round, phase } = elMatch;

      switch (phase) {
        case 'RACE_SELECT':
          return (
            <RaceSelect
              state={state}
              onSelect={(race) => dispatch({ type: 'SELECT_RACE', payload: { race } })}
            />
          );

        case 'SETUP':
          return (
            <ElectionSetup
              state={state}
              onContinue={() => dispatch({ type: 'GO_TO_SCREEN', payload: `E${round}_CHOICE` })}
            />
          );

        case 'CHOICE':
          return (
            <ElectionChoice
              state={state}
              onSubmit={(choice) => dispatch({ type: 'MAKE_CHOICE', payload: { choice } })}
            />
          );

        case 'RESULT':
          return (
            <ElectionResult
              state={state}
              onContinue={() => dispatch({ type: 'PROCEED_TO_DEMANDS' })}
            />
          );

        case 'DEMANDS':
          return (
            <Demands
              state={state}
              dispatch={dispatch}
            />
          );

        default:
          break;
      }
    }

    // Standard screens
    switch (state.screen) {
      case 'TITLE':
        return (
          <TitleScreen
            onStart={() => dispatch({ type: 'START_GAME' })}
            era={state.era}
            onSetEra={(era) => dispatch({ type: 'SET_ERA', payload: { era } })}
          />
        );

      case 'PARTY_CREATION':
        return (
          <PartyCreation
            era={state.era}
            onComplete={(payload) => dispatch({ type: 'CREATE_PARTY', payload })}
          />
        );

      case 'CHOOSE_ADVISOR':
        return (
          <AdvisorSelection
            era={state.era}
            onSelect={(id) => dispatch({ type: 'CHOOSE_ADVISOR', payload: { advisorId: id } })}
          />
        );

      case 'DASHBOARD':
        return (
          <Dashboard
            state={state}
            onPlayAgain={() => dispatch({ type: 'RESET_GAME' })}
            onSwitchEra={(era) => {
              dispatch({ type: 'RESET_GAME' });
              dispatch({ type: 'SET_ERA', payload: { era } });
            }}
          />
        );

      default:
        return (
          <TitleScreen
            onStart={() => dispatch({ type: 'START_GAME' })}
            era={state.era}
            onSetEra={(era) => dispatch({ type: 'SET_ERA', payload: { era } })}
          />
        );
    }
  }, [state]);

  // Show status bar during elections only
  const isElection = parseElectionScreen(state.screen) !== null;

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      <div className={`min-h-dvh ${isElection ? 'has-resource-bar' : ''} era-${state.era || 'historical'}`}>
        {renderScreen()}
      </div>
    </GameContext.Provider>
  );
}

export default AppV2;
