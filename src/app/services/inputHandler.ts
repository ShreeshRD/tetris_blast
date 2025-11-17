// services/inputHandler.ts
import { GameState, GameAction } from '@/app/types';
import { CONFIG } from '@/app/config/constants';

export const handleInput = (
  state: GameState,
  dispatch: React.Dispatch<GameAction>
): (() => void) => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (state.gameOver || state.levelComplete) return;
    
    if (state.isPaused && e.key.toLowerCase() !== 'p') return;

    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        dispatch({ type: 'MOVE_TETROMINO', payload: { dx: -1, dy: 0 } });
        break;
        
      case 'ArrowRight':
        e.preventDefault();
        dispatch({ type: 'MOVE_TETROMINO', payload: { dx: 1, dy: 0 } });
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        dispatch({ type: 'ROTATE_TETROMINO' });
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        dispatch({ type: 'MOVE_TETROMINO', payload: { dx: 0, dy: 1 } });
        if (state.currentTetromino) {
          dispatch({ type: 'ADD_SCORE', payload: CONFIG.SOFT_DROP_POINTS });
        }
        break;
        
      case ' ':
        e.preventDefault();
        if (state.currentTetromino) {
          dispatch({ type: 'HARD_DROP' });
        }
        break;
        
      case 'p':
      case 'P':
        e.preventDefault();
        dispatch({ type: 'TOGGLE_PAUSE' });
        break;
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
};