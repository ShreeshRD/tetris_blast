// components/LevelCompleteModal.tsx
"use client";
import { useGame } from '@/app/context/GameContext';
import './LevelCompleteModal.css';
import { CONFIG } from '../config/constants';

export default function LevelCompleteModal() {
  const { state, dispatch } = useGame();
  
  if (!state.levelComplete) return null;
  
  return (
    <div className="modal-overlay">
      <div id="levelComplete">
        <h1>LEVEL CLEAR!</h1>
        <p>Wall Destroyed!</p>
        <p>Bonus: <span>{CONFIG.LEVEL_CLEAR_BONUS * state.level}</span> points</p>
        <button onClick={() => dispatch({ type: 'NEXT_LEVEL' })}>
          Next Level
        </button>
      </div>
    </div>
  );
}