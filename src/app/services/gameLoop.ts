import { GameState, GameAction } from '@/app/types';
import { riseWall } from './wallManager';

export const gameLoop = (
  state: GameState,
  dispatch: React.Dispatch<GameAction>
): (() => void) => {
  let fallTimer: NodeJS.Timeout | null = null;
  let wallTimer: NodeJS.Timeout | null = null;
  let gravityTimer: NodeJS.Timeout | null = null;

  if (state.isGravityActive) {
    gravityTimer = setInterval(() => {
      dispatch({ type: 'APPLY_GRAVITY' });
    }, 150); // 150ms delay for gravity animation
  } else {
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
  }

  return () => {
    if (fallTimer) clearInterval(fallTimer);
    if (wallTimer) clearInterval(wallTimer);
    if (gravityTimer) clearInterval(gravityTimer);
  };
};