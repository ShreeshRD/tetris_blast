// services/collision.ts
import { CellType, TetrominoShape } from '@/app/types';
import { EMPTY } from '@/app/config/constants';

export const checkCollision = (
  grid: CellType[][],
  shape: TetrominoShape,
  position: { x: number; y: number }
): boolean => {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] !== EMPTY) {
        const newX = position.x + x;
        const newY = position.y + y;
        
        if (
          newX < 0 ||
          newX >= grid[0].length ||
          newY >= grid.length ||
          (newY >= 0 && grid[newY][newX] !== EMPTY)
        ) {
          return true;
        }
      }
    }
  }
  return false;
};
