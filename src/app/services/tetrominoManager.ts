// services/tetrominoManager.ts
import { TETROMINOES, COLS, PLAYER, CONFIG, ROWS, EMPTY } from '@/app/config/constants';
import { Tetromino, CellType } from '@/app/types';
import { checkCollision } from './collision';

export const getRandomTetromino = (): Tetromino => {
  const keys = Object.keys(TETROMINOES) as Array<keyof typeof TETROMINOES>;
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  const tetromino = TETROMINOES[randomKey];
  return {
    shape: tetromino.shape,
    color: tetromino.color,
    type: randomKey
  };
};

export const lockTetromino = (
  grid: CellType[][],
  tetromino: Tetromino,
  position: { x: number; y: number }
): { grid: CellType[][]; clearedLines: number } => {
  const newGrid = grid.map(row => [...row]);
  
  for (let row = 0; row < tetromino.shape.length; row++) {
    for (let col = 0; col < tetromino.shape[0].length; col++) {
      if (tetromino.shape[row][col]) {
        const gridRow = position.y + row;
        const gridCol = position.x + col;
        
        if (gridRow >= 0 && gridRow < ROWS && gridCol >= 0 && gridCol < COLS) {
          newGrid[gridRow][gridCol] = PLAYER;
        }
      }
    }
  }
  
  return checkAndClearLines(newGrid);
};

export const hardDrop = (
  grid: CellType[][],
  tetromino: Tetromino,
  position: { x: number; y: number }
): { newPosition: { x: number; y: number }; dropDistance: number } => {
  let dropDistance = 0;
  const testPosition = { ...position };
  
  while (true) {
    testPosition.y++;
    if (!checkCollision(grid, tetromino.shape, testPosition)) {
      dropDistance++;
    } else {
      break;
    }
  }
  
  return {
    newPosition: { ...position, y: position.y + dropDistance },
    dropDistance
  };
};

export const checkAndClearLines = (grid: CellType[][]): { grid: CellType[][]; clearedLines: number } => {
  const fullRows = grid.filter(row => row.every(cell => cell !== EMPTY));
  const clearedLines = fullRows.length;
  
  const newGrid = grid.filter(row => row.some(cell => cell === EMPTY));
  
  for (let i = 0; i < clearedLines; i++) {
    newGrid.unshift(Array(COLS).fill(EMPTY));
  }
  
  return { grid: newGrid, clearedLines };
};