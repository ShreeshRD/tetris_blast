import { checkAndClearLines } from './src/app/services/tetrominoManager';
import { CellType } from './src/app/types';

// This is some new game logic added in the conflict branch

const COLS = 10;
const ROWS = 20;
const EMPTY = 0;
const PLAYER = 1;

// Mock grid creation
const createGrid = () => Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY));

const runTest = () => {
  const grid = createGrid();
  
  // Fill the last row
  for (let c = 0; c < COLS; c++) {
    grid[ROWS - 1][c] = PLAYER;
  }
  
  console.log('Testing checkAndClearLines with one full row...');
  const { grid: newGrid, clearedLines } = checkAndClearLines(grid as CellType[][]);
  
  console.log(`Cleared Lines: ${clearedLines}`);
  
  if (clearedLines === 1) {
    console.log('SUCCESS: Row cleared.');
    // Verify the row is empty
    const isRowEmpty = newGrid[ROWS - 1].every((c: number) => c === EMPTY);
    if (isRowEmpty) {
      console.log('SUCCESS: Row is now empty.');
    } else {
      console.log('FAILURE: Row is NOT empty.');
    }
  } else {
    console.log('FAILURE: Row NOT cleared.');
  }
};

runTest();
