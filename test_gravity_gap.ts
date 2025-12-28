// Constants
const columns = 10;
const ROWS = 20;
const EMPTY = 0;
const PLAYER = 1;
const WALL = 2;
const FLOATING = 3;

type CellType = 0 | 1 | 2 | 3;
type Position = { x: number; y: number };

// Gravity Logic (Copied from src/app/services/gravity.ts)
const findFloatingPieces = (grid: CellType[][]): { grid: CellType[][], hasFloatingPieces: boolean } => {
  const rows = grid.length;
  const columns = grid[0].length;
  const counter = 0;
  const supported: boolean[][] = Array(rows).fill(null).map(() => Array(columns).fill(false));
  const queue: Position[] = [];

  // Create a working grid where all FLOATING pieces are reset to PLAYER
  const workingGrid = grid.map(row => row.map(cell => cell === FLOATING ? PLAYER : cell));

  // Find all initially supported PLAYER cells
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (workingGrid[r][c] === PLAYER) {
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
      { x, y: y - 1 }, { x, y: y + 1 },
      { x: x - 1, y }, { x: x + 1, y },
    ];
    for (const neighbor of neighbors) {
      const { x: nx, y: ny } = neighbor;
      if (nx >= 0 && nx < columns && ny >= 0 && ny < rows && !supported[ny][nx] && workingGrid[ny][nx] === PLAYER) {
        supported[ny][nx] = true;
        queue.push({ x: nx, y: ny });
      }
    }
  }

  // Mark floating pieces in the new grid
  const newGrid = workingGrid.map(row => [...row]);
  let hasFloatingPieces = false;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (workingGrid[r][c] === PLAYER && !supported[r][c]) {
        newGrid[r][c] = FLOATING;
        hasFloatingPieces = true;
      }
    }
  }

  return { grid: newGrid, hasFloatingPieces };
};

// Test Runner
const createGrid = () => Array(ROWS).fill(null).map(() => Array(columns).fill(EMPTY));

const runTest = () => {
  const grid = createGrid();

  // Setup scenario:
  // Row 17: [X X X] (Should be floating)
  // Row 18: [. . .] (Empty row, cleared)
  // Row 19: [W W W] (Wall)
  
  // Fill Row 19 with WALL
  for (let c = 0; c < columns; c++) {
    grid[ROWS - 1][c] = WALL;
  }
  
  // Row 18 is EMPTY (simulating cleared line)
  
  // Fill Row 17 with PLAYER
  for (let c = 0; c < columns; c++) {
    grid[ROWS - 3][c] = PLAYER;
  }

  console.log('Initial Grid State (Bottom 4 rows):');
  printGrid(grid);

  const { grid: gridWithFloating, hasFloatingPieces } = findFloatingPieces(grid as CellType[][]);

  console.log('\nAfter findFloatingPieces:');
  console.log('Has Floating Pieces:', hasFloatingPieces);
  printGrid(gridWithFloating);

  if (hasFloatingPieces && gridWithFloating[ROWS - 3][0] === FLOATING) {
    console.log('\nSUCCESS: Block at [17, 0] correctly identified as FLOATING.');
  } else {
    console.log('\nFAILURE: Block at [17, 0] NOT identified as FLOATING.');
  }
};

const printGrid = (grid: any[][]) => {
  for (let r = ROWS - 4; r < ROWS; r++) {
    console.log(`Row ${r}: ${grid[r].map((c: any) => c === EMPTY ? '.' : c === PLAYER ? 'X' : c === WALL ? 'W' : c === FLOATING ? 'F' : c).join(' ')}`);
  }
};

runTest();
