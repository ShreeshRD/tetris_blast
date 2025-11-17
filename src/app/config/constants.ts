// config/constants.ts
export const CONFIG = {
  INITIAL_FALL_SPEED: 800,
  FALL_SPEED_ACCELERATION: 0.85,
  INITIAL_WALL_HEIGHT: 3,
  WALL_HEIGHT_INCREMENT: 2,
  WALL_RISE_INTERVAL: 3000,
  WALL_RISE_SPEED_REDUCTION: 0.95,
  LINES_PER_LEVEL: 5,
  BASE_LINE_SCORE: 100,
  SCORE_MULTIPLIER: 1.5,
  LEVEL_CLEAR_BONUS: 500,
  SOFT_DROP_POINTS: 1,
  HARD_DROP_POINTS: 2,
  CLEAR_ANIMATION_DURATION: 400,
} as const;

export const COLS = 10;
export const ROWS = 20;
export const EMPTY = 0 as const;
export const PLAYER = 1 as const;
export const WALL = 2 as const;
export const FLOATING = 3 as const;

export const TETROMINOES = {
  I: { shape: [[1,1,1,1]], color: '#00ffff' },
  O: { shape: [[1,1],[1,1]], color: '#ffff00' },
  T: { shape: [[0,1,0],[1,1,1]], color: '#ff00ff' },
  S: { shape: [[0,1,1],[1,1,0]], color: '#00ff00' },
  Z: { shape: [[1,1,0],[0,1,1]], color: '#ff0000' },
  J: { shape: [[1,0,0],[1,1,1]], color: '#0000ff' },
  L: { shape: [[0,0,1],[1,1,1]], color: '#ff8800' }
} as const;