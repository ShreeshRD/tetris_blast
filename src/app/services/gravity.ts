// services/gravity.ts
import { COLS, EMPTY, PLAYER, FLOATING, WALL } from '@/app/config/constants';
import { CellType, Position } from '@/app/types';

export const findFloatingPieces = (grid: CellType[][]): { grid: CellType[][], hasFloatingPieces: boolean } => {
  const rows = grid.length;
  const cols = grid[0].length;
  const supported: boolean[][] = Array(rows).fill(null).map(() => Array(cols).fill(false));
  const queue: Position[] = [];

  // Find all initially supported PLAYER cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === PLAYER) {
        if (r === rows - 1 || grid[r + 1][c] === WALL) {
          queue.push({ x: c, y: r });
          supported[r][c] = true;
        }
      }
    }
  }

  // Propagate support through connected PLAYER cells
  let head = 0;
  while (head < queue.length) {
    const { x, y } = queue[head++];
    const neighbors = [
      { x, y: y - 1 }, { x, y: y + 1 },
      { x: x - 1, y }, { x: x + 1, y },
    ];
    for (const neighbor of neighbors) {
      const { x: nx, y: ny } = neighbor;
      if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && !supported[ny][nx] && grid[ny][nx] === PLAYER) {
        supported[ny][nx] = true;
        queue.push({ x: nx, y: ny });
      }
    }
  }

  // Mark floating pieces
  const newGrid = grid.map(row => [...row]);
  let hasFloatingPieces = false;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === PLAYER && !supported[r][c]) {
        newGrid[r][c] = FLOATING;
        hasFloatingPieces = true;
      }
    }
  }

  console.log('hasFloatingPieces', hasFloatingPieces);
  return { grid: newGrid, hasFloatingPieces };
};

export const applyGravity = (grid: CellType[][]): CellType[][] => {
  const newGrid = grid.map(row => [...row]);
  const rows = newGrid.length;
  const cols = newGrid[0].length;

  for (let r = rows - 2; r >= 0; r--) {
    for (let c = 0; c < cols; c++) {
      if (newGrid[r][c] === FLOATING && newGrid[r + 1][c] === EMPTY) {
        newGrid[r + 1][c] = FLOATING;
        newGrid[r][c] = EMPTY;
      }
    }
  }

  return newGrid;
};
