// components/GameOverModal.tsx
"use client";
import { useGame } from '@/app/context/GameContext';

export default function GameOverModal() {
  const { state, dispatch } = useGame();
  
  if (!state.gameOver) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Game Over!</h2>
        <p>{state.gameOverReason}</p>
        <p>Score: {state.score}</p>
        <button onClick={() => dispatch({ type: 'RESET_GAME' })}>Play Again</button>
      </div>
    </div>
  );
}