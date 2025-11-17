// services/gravity.test.ts
import { findFloatingPieces } from './gravity';
import { EMPTY, PLAYER, WALL, FLOATING } from '../config/constants';
import { CellType } from '../types';

describe('findFloatingPieces', () => {
  it('should identify a simple floating piece', () => {
    const grid: CellType[][] = [
      [EMPTY, EMPTY, EMPTY, EMPTY],
      [EMPTY, PLAYER, PLAYER, EMPTY],
      [EMPTY, EMPTY, EMPTY, EMPTY],
      [WALL, WALL, WALL, WALL],
    ];
    const { grid: newGrid, hasFloatingPieces } = findFloatingPieces(grid);
    expect(hasFloatingPieces).toBe(true);
    expect(newGrid[1][1]).toBe(FLOATING);
    expect(newGrid[1][2]).toBe(FLOATING);
  });

  it('should not identify a supported piece', () => {
    const grid: CellType[][] = [
      [EMPTY, EMPTY, EMPTY, EMPTY],
      [EMPTY, PLAYER, PLAYER, EMPTY],
      [EMPTY, WALL, WALL, EMPTY],
      [WALL, WALL, WALL, WALL],
    ];
    const { grid: newGrid, hasFloatingPieces } = findFloatingPieces(grid);
    expect(hasFloatingPieces).toBe(false);
    expect(newGrid[1][1]).toBe(PLAYER);
    expect(newGrid[1][2]).toBe(PLAYER);
  });

  it('should identify a complex floating shape', () => {
    const grid: CellType[][] = [
      [EMPTY, PLAYER, EMPTY, EMPTY],
      [EMPTY, PLAYER, PLAYER, EMPTY],
      [EMPTY, EMPTY, EMPTY, EMPTY],
      [WALL, WALL, WALL, WALL],
    ];
    const { grid: newGrid, hasFloatingPieces } = findFloatingPieces(grid);
    expect(hasFloatingPieces).toBe(true);
    expect(newGrid[0][1]).toBe(FLOATING);
    expect(newGrid[1][1]).toBe(FLOATING);
    expect(newGrid[1][2]).toBe(FLOATING);
  });

  it('should handle multiple floating groups', () => {
    const grid: CellType[][] = [
      [PLAYER, EMPTY, PLAYER, EMPTY],
      [EMPTY, EMPTY, EMPTY, EMPTY],
      [PLAYER, PLAYER, EMPTY, PLAYER],
      [EMPTY, EMPTY, EMPTY, EMPTY],
      [WALL, WALL, WALL, WALL],
    ];
    const { grid: newGrid, hasFloatingPieces } = findFloatingPieces(grid);
    expect(hasFloatingPieces).toBe(true);
    expect(newGrid[0][0]).toBe(FLOATING);
    expect(newGrid[0][2]).toBe(FLOATING);
    expect(newGrid[2][0]).toBe(FLOATING);
    expect(newGrid[2][1]).toBe(FLOATING);
    expect(newGrid[2][3]).toBe(FLOATING);
  });
});
