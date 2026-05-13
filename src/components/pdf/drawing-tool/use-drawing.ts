import { useContext } from 'react';
import { DrawingContext } from './drawing-context';

export function useDrawing() {
  const ctx = useContext(DrawingContext);
  if (!ctx) {
    throw new Error('useDrawing must be used within DrawingProvider');
  }
  return ctx;
}
