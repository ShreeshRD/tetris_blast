// src/app/components/GridCell.tsx

'use client';
import { CellType } from '@/app/types';
import { WALL, PLAYER, FLOATING } from '@/app/config/constants';
import '@/app/components/GridCell.css';

interface GridCellProps {
  cell: CellType;
  row: number;
  col: number;
  isClearing: boolean;
}

export default function GridCell({ cell, row, col, isClearing }: GridCellProps) {
  // Build className consistently on both server and client
  const classes = ['cell'];
  if (cell === WALL) classes.push('wall');
  if (cell === PLAYER) classes.push('player');
  if (cell === FLOATING) classes.push('floating');
  if (isClearing) classes.push('clearing');
  
  return <div id={`cell-${row}-${col}`} className={classes.join(' ')} />;
}