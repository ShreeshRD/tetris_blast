// components/GameInfo.tsx
'use client';
import { useGame } from '@/app/context/GameContext';
import { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import './GameInfo.css';

export default function GameInfo() {
  const { state } = useGame();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="infoPanel">
      <h2>CLEAR THE WALL</h2>
      <div className="info-item">
        <span className="info-label">SCORE</span>
        <span className="info-value">{state.score}</span>
      </div>
      <div className="info-item">
        <span className="info-label">LEVEL</span>
        <span className="info-value">{state.level}</span>
      </div>
      <div className="info-item">
        <span className="info-label">LINES</span>
        <span className="info-value">{state.lines}</span>
      </div>
      
      {/* Only render next tetromino after hydration */}
      {isMounted && state.nextTetromino && (
        <div className="nextTetromino">
          <h3>NEXT</h3>
          <div className="nextTetrominoGrid">
            {state.nextTetromino.shape.map((row, rowIndex) => (
              <div key={rowIndex} className="nextTetrominoRow">
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`nextTetrominoCell ${cell ? 'filled' : ''}`}
                    style={{ backgroundColor: cell ? state.nextTetromino!.color : 'transparent' }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <ProgressBar remainingWall={state.remainingWall} totalWall={state.totalWall} />
      <div className="controls">
        <p><strong>CONTROLS:</strong></p>
        <p>← → Move</p>
        <p>↑ Rotate</p>
        <p>↓ Soft Drop</p>
        <p>SPACE Hard Drop</p>
      </div>
    </div>
  );
}