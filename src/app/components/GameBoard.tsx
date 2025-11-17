// components/GameBoard.tsx
"use client";
import { useEffect, useCallback } from 'react';
import { useGame } from '@/app/context/GameContext';
import GridCell from './GridCell';
import { PLAYER } from '@/app/config/constants';
import { gameLoop } from '@/app/services/gameLoop';
import { handleInput } from '@/app/services/inputHandler';
import './GameBoard.css';
import { CellType } from '@/app/types';

export default function GameBoard() {
  const { state, dispatch } = useGame();
  
  useEffect(() => {
    dispatch({ type: 'START_GAME' });
  }, [dispatch]);

  useEffect(() => {
    if (!state.gameOver && !state.levelComplete && state.currentTetromino) {
      const cleanup = gameLoop(state, dispatch);
      return cleanup;
    }
  }, [state.gameOver, state.levelComplete, state.fallSpeed, state.wallRiseInterval, state.isPaused, state.currentTetromino, dispatch]);
  
  useEffect(() => {
    const cleanup = handleInput(state, dispatch);
    return cleanup;
  }, [state.gameOver, state.levelComplete, state.isPaused, dispatch]);

  const renderGrid = useCallback(() => {
    const tempGrid = state.grid.map(row => [...row]);

    if (state.currentTetromino) {
      state.currentTetromino.shape.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            const gridX = state.currentPosition.x + x;
            const gridY = state.currentPosition.y + y;
            if (gridY >= 0 && gridY < tempGrid.length && gridX >= 0 && gridX < tempGrid[0].length) {
              tempGrid[gridY][gridX] = PLAYER;
            }
          }
        });
      });
    }

    return tempGrid.map((row: CellType[], rowIndex: number) =>
      row.map((cell, colIndex) => (
        <GridCell
          key={`${rowIndex}-${colIndex}`}
          cell={cell}
          row={rowIndex}
          col={colIndex}
          isClearing={state.clearingRows.includes(rowIndex)}
        />
      ))
    );
  }, [state.grid, state.clearingRows, state.currentTetromino, state.currentPosition]);

  return (
    <div className="gameBoard">
      <div className="grid">{renderGrid()}</div>
    </div>
  );
}