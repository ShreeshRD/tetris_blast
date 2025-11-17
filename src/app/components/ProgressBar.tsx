// components/ProgressBar.tsx
"use client";
import './ProgressBar.css';

interface ProgressBarProps {
  remainingWall: number;
  totalWall: number;
}

export default function ProgressBar({ remainingWall, totalWall }: ProgressBarProps) {
  const percentage = totalWall > 0 ? (remainingWall / totalWall) * 100 : 0;
  
  return (
    <div className="wall-progress">
      <div>WALL STRENGTH</div>
      <div className="wall-progress-bar">
        <div className="wall-progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}