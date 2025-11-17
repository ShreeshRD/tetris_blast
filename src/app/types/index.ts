// types/index.ts
export type CellType = 0 | 1 | 2 | 3;
export type Position = { x: number; y: number };
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Tetromino {
  shape: number[][];
  color: string;
  type: TetrominoType;
}

export interface GameState {
  grid: CellType[][];
  currentTetromino: Tetromino | null;
  currentPosition: Position;
  nextTetromino: Tetromino | null;
  score: number;
  level: number;
  lines: number;
  fallSpeed: number;
  wallRiseInterval: number;
  gameOver: boolean;
  isPaused: boolean;
  levelComplete: boolean;
  wallHeight: number;
  gameOverReason: string;
  wallGapPosition: number;
  clearingRows: number[];
  remainingWall: number;
  totalWall: number;
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'MOVE_TETROMINO'; payload: { dx: number; dy: number } }
  | { type: 'ROTATE_TETROMINO' }
  | { type: 'HARD_DROP' }
  | { type: 'ADD_SCORE'; payload: number }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'SPAWN_TETROMINO'; payload: { tetromino: Tetromino; position: Position } }
  | { type: 'LOCK_TETROMINO' }
  | { type: 'CLEAR_LINES'; payload: number[] }
  | { type: 'RISE_WALL_COMPLETE'; payload: { newGrid: CellType[][]; newGap: number } }
  | { type: 'GAME_OVER'; payload: string }
  | { type: 'LEVEL_COMPLETE' }
  | { type: 'NEXT_LEVEL' }
  | { type: 'RESET_GAME' }
  | { type: 'INITIALIZE_WALL' }
  | { type: 'APPLY_GRAVITY' };