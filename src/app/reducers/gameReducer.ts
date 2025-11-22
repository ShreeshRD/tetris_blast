// src/app/reducers/gameReducer.ts

import { CONFIG, COLS, ROWS, EMPTY } from '@/app/config/constants';
import { GameState, GameAction } from '@/app/types';
import { getRandomTetromino, lockTetromino, hardDrop, checkAndClearLines } from '@/app/services/tetrominoManager';
import { checkCollision } from '@/app/services/collision';
import { findFloatingPieces, applyGravity } from '@/app/services/gravity';
import { generateWall } from '@/app/services/wallManager';

// Generate initial tetrominos ONCE at module load
const initialTetromino = getRandomTetromino();
const initialNextTetromino = getRandomTetromino();

// DEFAULT EXPORT for initialState
const EMPTY_GRID = Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY));

export const initialState: GameState = {
  grid: EMPTY_GRID,
  currentTetromino: null,
  currentPosition: { x: 0, y: 0 },
  nextTetromino: null,
  score: 0,
  level: 1,
  lines: 0,
  fallSpeed: CONFIG.INITIAL_FALL_SPEED,
  wallRiseInterval: CONFIG.WALL_RISE_INTERVAL,
  gameOver: false,
  isPaused: false,
  levelComplete: false,
  wallHeight: CONFIG.INITIAL_WALL_HEIGHT,
  gameOverReason: '',
  wallGapPosition: Math.floor(COLS / 2),
  clearingRows: [],
  remainingWall: 0,
  totalWall: 0,
  isGravityActive: false,
};

// NAMED EXPORT for reducer function
export function gameReducer(state: GameState, action: GameAction): GameState {
  if (!state) return initialState;

  switch (action.type) {
    case 'START_GAME': {
      const firstTetromino = getRandomTetromino();
      const secondTetromino = getRandomTetromino();
      return {
        ...initialState,
        grid: generateWall(CONFIG.INITIAL_WALL_HEIGHT),
        currentTetromino: firstTetromino,
        nextTetromino: secondTetromino,
        currentPosition: {
          x: Math.floor((COLS - firstTetromino.shape[0].length) / 2),
          y: 0,
        },
      };
    }
    case 'INITIALIZE_WALL':
      return { ...state, grid: generateWall(CONFIG.INITIAL_WALL_HEIGHT) };
    case 'MOVE_TETROMINO': {
      if (!state.currentTetromino) return state;
      
      const { dx, dy } = action.payload;
      const newPosition = { ...state.currentPosition, x: state.currentPosition.x + dx, y: state.currentPosition.y + dy };
      
      if (!checkCollision(state.grid, state.currentTetromino.shape, newPosition)) {
        return { ...state, currentPosition: newPosition };
      }
      
      if (dy > 0) {
        // Step 1: Lock the piece to the grid (just adds piece, doesn't clear lines)
        const gridWithPiece = lockTetromino(state.grid, state.currentTetromino, state.currentPosition);
        
        // Step 2: Clear any completed lines
        const { grid, clearedLines } = checkAndClearLines(gridWithPiece);
        
        // Step 3: Check for floating pieces (now unsupported after line clear)
        const { grid: gridWithFloating, hasFloatingPieces } = findFloatingPieces(grid);
        const lineScore = clearedLines > 0 ? CONFIG.BASE_LINE_SCORE * clearedLines * CONFIG.SCORE_MULTIPLIER : 0;
        
        if (hasFloatingPieces) {
          // Activate gravity, don't spawn next piece yet
          return {
            ...state,
            grid: gridWithFloating,
            score: state.score + lineScore,
            lines: state.lines + clearedLines,
            currentTetromino: null,
            isGravityActive: true,
          };
        }

        // No floating pieces - spawn next tetromino
        const newTetromino = state.nextTetromino;
        const newTetrominoPosition = { x: Math.floor((COLS - newTetromino!.shape[0].length) / 2), y: 0 };

        if (checkCollision(gridWithFloating, newTetromino!.shape, newTetrominoPosition)) {
          return { ...state, grid: gridWithFloating, gameOver: true, gameOverReason: 'Game Over' };
        }
        
        return {
          ...state,
          grid: gridWithFloating,
          score: state.score + lineScore,
          lines: state.lines + clearedLines,
          currentTetromino: newTetromino,
          nextTetromino: getRandomTetromino(),
          currentPosition: newTetrominoPosition,
        };
      }
      
      return state;
    }
    
    case 'ROTATE_TETROMINO': {
      if (!state.currentTetromino) return state;
      
      const rotated = state.currentTetromino.shape[0].map((_, index) =>
        state.currentTetromino!.shape.map(row => row[index]).reverse()
      );
      
      if (!checkCollision(state.grid, rotated, state.currentPosition)) {
        return { ...state, currentTetromino: { ...state.currentTetromino, shape: rotated } };
      }
      
      return state;
    }
    
    case 'HARD_DROP': {
      if (!state.currentTetromino) return state;
      
      const { newPosition, dropDistance } = hardDrop(state.grid, state.currentTetromino, state.currentPosition);
      
      // Step 1: Lock the piece to the grid
      const gridWithPiece = lockTetromino(state.grid, state.currentTetromino, newPosition);
      
      // Step 2: Clear any completed lines
      const { grid, clearedLines } = checkAndClearLines(gridWithPiece);
      
      // Step 3: Check for floating pieces (now unsupported after line clear)
      const { grid: gridWithFloating, hasFloatingPieces } = findFloatingPieces(grid);
      const lineScore = clearedLines > 0 ? CONFIG.BASE_LINE_SCORE * clearedLines * CONFIG.SCORE_MULTIPLIER : 0;
      
      if (hasFloatingPieces) {
        return {
          ...state,
          grid: gridWithFloating,
          score: state.score + dropDistance * CONFIG.HARD_DROP_POINTS + lineScore,
          lines: state.lines + clearedLines,
          currentTetromino: null,
          isGravityActive: true,
        };
      }

      // No floating pieces - spawn next tetromino
      const newTetromino = state.nextTetromino;
      const newTetrominoPosition = { x: Math.floor((COLS - newTetromino!.shape[0].length) / 2), y: 0 };

      if (checkCollision(gridWithFloating, newTetromino!.shape, newTetrominoPosition)) {
        return { 
          ...state, 
          grid: gridWithFloating, 
          gameOver: true, 
          gameOverReason: 'Game Over',
          score: state.score + dropDistance * CONFIG.HARD_DROP_POINTS + lineScore
        };
      }

      return { 
        ...state, 
        grid: gridWithFloating,
        currentPosition: newTetrominoPosition,
        currentTetromino: newTetromino,
        nextTetromino: getRandomTetromino(),
        score: state.score + dropDistance * CONFIG.HARD_DROP_POINTS + lineScore,
        lines: state.lines + clearedLines
      };
    }
    
    case 'ADD_SCORE':
      return { ...state, score: state.score + action.payload };
      
    case 'TOGGLE_PAUSE':
      return { ...state, isPaused: !state.isPaused };
      
    case 'RISE_WALL_COMPLETE': {
      const { newGrid, newGap } = action.payload;
      let newPosition = state.currentPosition;

      // Check for collision with the new wall
      if (state.currentTetromino && checkCollision(newGrid, state.currentTetromino.shape, newPosition)) {
        newPosition = { ...newPosition, y: newPosition.y - 1 };
      }

      if (newPosition.y + state.currentTetromino!.shape.length <= 0) {
        return { ...state, gameOver: true, gameOverReason: 'Piece pushed off screen!' };
      }
      
      if (newGrid[0].some(cell => cell !== EMPTY)) {
        return { ...state, gameOver: true, gameOverReason: 'Wall reached the top!' };
      }
      
      return { 
        ...state, 
        grid: newGrid, 
        currentPosition: newPosition,
        wallGapPosition: newGap
      };
    }
    
    case 'APPLY_GRAVITY': {
      if (!state.isGravityActive) return state;
      
      const { grid: gridWithFloating, hasFloatingPieces } = findFloatingPieces(state.grid);
      
      if (!hasFloatingPieces) {
        // Gravity settled - spawn next tetromino
        const newTetromino = state.nextTetromino || getRandomTetromino();
        const newTetrominoPosition = { x: Math.floor((COLS - newTetromino.shape[0].length) / 2), y: 0 };
        
        if (checkCollision(state.grid, newTetromino.shape, newTetrominoPosition)) {
          return { ...state, isGravityActive: false, gameOver: true, gameOverReason: 'Game Over' };
        }
        
        return {
          ...state,
          isGravityActive: false,
          currentTetromino: newTetromino,
          nextTetromino: getRandomTetromino(),
          currentPosition: newTetrominoPosition,
        };
      }
      
      // Apply one step of gravity
      const newGrid = applyGravity(gridWithFloating);
      
      return { ...state, grid: newGrid };
    }
    
    case 'GAME_OVER':
      return { ...state, gameOver: true, gameOverReason: action.payload };
      
    case 'LEVEL_COMPLETE':
      return { ...state, levelComplete: true, score: state.score + CONFIG.LEVEL_CLEAR_BONUS * state.level };
      
    case 'NEXT_LEVEL':
      return {
        ...state,
        level: state.level + 1,
        wallHeight: state.wallHeight + CONFIG.WALL_HEIGHT_INCREMENT,
        levelComplete: false,
        fallSpeed: Math.max(100, state.fallSpeed * CONFIG.FALL_SPEED_ACCELERATION),
        wallRiseInterval: Math.max(1000, state.wallRiseInterval * CONFIG.WALL_RISE_SPEED_REDUCTION),
        grid: generateWall(state.wallHeight + CONFIG.WALL_HEIGHT_INCREMENT),
        currentTetromino: state.nextTetromino,
        nextTetromino: getRandomTetromino(),
        currentPosition: { x: Math.floor((COLS - state.nextTetromino!.shape[0].length) / 2), y: 0 }
      };
      
    case 'RESET_GAME':
      return initialState;
      
    default:
      return state;
  }
}