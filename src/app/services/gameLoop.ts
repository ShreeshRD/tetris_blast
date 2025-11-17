// services/gameLoop.ts
import { GameState, GameAction } from '@/app/types';
import { riseWall } from './wallManager';
import { checkAndClearLines } from './tetrominoManager';

let fallTimer: NodeJS.Timeout | null = null;
let wallTimer: NodeJS.Timeout | null = null;

export const gameLoop = (
  state: GameState,
  dispatch: React.Dispatch<GameAction>
): (() => void) => {
  if (fallTimer) clearInterval(fallTimer);
  if (wallTimer) clearInterval(wallTimer);
  
  fallTimer = setInterval(() => {
    if (!state.isPaused && state.currentTetromino) {
      dispatch({ type: 'MOVE_TETROMINO', payload: { dx: 0, dy: 1 } });
    }
  }, state.fallSpeed);
  
  wallTimer = setInterval(() => {
    if (!state.isPaused && !state.levelComplete) {
      const result = riseWall(state.grid, state.currentPosition, state.wallGapPosition);
      dispatch({ type: 'RISE_WALL_COMPLETE', payload: result });
    }
  }, state.wallRiseInterval);
  
  return () => {
    if (fallTimer) clearInterval(fallTimer);
    if (wallTimer) clearInterval(wallTimer);
  };
};