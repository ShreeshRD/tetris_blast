// services/wallManager.ts
import { CONFIG, ROWS, COLS, WALL, EMPTY, CellType } from '@/app/config/constants';

export const generateWall = (height: number): CellType[][] => {
  const grid = Array(ROWS).fill(null).map(() => Array(COLS).fill(EMPTY));
  let wallGapPosition = Math.floor(COLS / 2);
  
  for (let i = 0; i < height; i++) {
    const rowIndex = ROWS - 1 - i;
    const row = Array(COLS).fill(WALL);
    row[wallGapPosition] = EMPTY;
    grid[rowIndex] = row;
    
    if (i < height - 1 && Math.random() > 0.7) {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const newGapPos = wallGapPosition + direction;
      if (newGapPos >= 0 && newGapPos < COLS) {
        wallGapPosition = newGapPos;
      }
    }
  }
  
  return grid;
};

export const riseWall = (
  grid: CellType[][],
  currentPosition: { x: number; y: number },
  wallGapPosition: number
): { newGrid: CellType[][]; newGap: number } => {
  const newGrid = [...grid.slice(1)];
  let newGap = wallGapPosition;
  
  const newRow = Array(COLS).fill(WALL);
  if (Math.random() > 0.7) {
    const direction = Math.random() > 0.5 ? 1 : -1;
    const newGapPos = wallGapPosition + direction;
    if (newGapPos >= 0 && newGapPos < COLS) {
      newGap = newGapPos;
    }
  }
  
  newRow[newGap] = EMPTY;
  newGrid.push(newRow);
  
  return {
    newGrid,
    newGap
  };
};