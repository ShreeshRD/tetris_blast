import { CellType, Position } from '@/app/types';
import { COLS, ROWS, EMPTY, PLAYER, WALL, FLOATING } from '@/app/config/constants';

export const findFloatingPieces = (grid: CellType[][]): { grid: CellType[][], hasFloatingPieces: boolean } => {
  const rows = grid.length;
  const cols = grid[0].length;
  const supported: boolean[][] = Array(rows).fill(null).map(() => Array(cols).fill(false));
  const queue: Position[] = [];

  // Create a working grid where all FLOATING pieces are reset to PLAYER
  // This ensures we re-evaluate support from scratch
  const workingGrid = grid.map(row => row.map(cell => cell === FLOATING ? PLAYER : cell));

  // Find all initially supported PLAYER cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (workingGrid[r][c] === PLAYER) {
        // Supported if at bottom or on top of a WALL
        if (r === rows - 1 || workingGrid[r + 1][c] === WALL) {
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
      { x, y: y - 1 }, // Above
      { x, y: y + 1 }, // Below
      { x: x - 1, y }, // Left
      { x: x + 1, y }, // Right
    ];

    for (const neighbor of neighbors) {
      const { x: nx, y: ny } = neighbor;
      
      if (
        nx >= 0 && nx < cols && 
        ny >= 0 && ny < rows && 
        !supported[ny][nx] && 
        workingGrid[ny][nx] === PLAYER
      ) {
        supported[ny][nx] = true;
        queue.push({ x: nx, y: ny });
      }
    }
  }

  // Mark floating pieces in the new grid
  const newGrid: CellType[][] = workingGrid.map(row => [...row]);
  let hasFloatingPieces = false;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (workingGrid[r][c] === PLAYER && !supported[r][c]) {
        newGrid[r][c] = FLOATING;
        hasFloatingPieces = true;
      }
    }
  }

  return { grid: newGrid, hasFloatingPieces };
};

export const applyGravity = (grid: CellType[][]): CellType[][] => {
  const newGrid = grid.map(row => [...row]);
  const rows = newGrid.length;
  const cols = newGrid[0].length;

  // Move floating pieces down one step if possible
  // Iterate from bottom up to avoid overwriting
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
