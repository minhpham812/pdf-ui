/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';

export interface DrawingState {
  tempStroke: Array<{ x: number; y: number }> | null;
  strokeColor: string;
  strokeWidth: number;
}

export interface DrawingContextValue extends DrawingState {
  setTempStroke: (stroke: Array<{ x: number; y: number }> | null) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
}

export const DrawingContext = createContext<DrawingContextValue | null>(null);

interface DrawingProviderProps {
  children: React.ReactNode;
}

export function DrawingProvider({ children }: DrawingProviderProps) {
  const [tempStroke, setTempStroke] = useState<Array<{ x: number; y: number }> | null>(null);
  const [strokeColor, setStrokeColor] = useState('#ef4444');
  const [strokeWidth, setStrokeWidth] = useState(2);

  return (
    <DrawingContext.Provider
      value={{ tempStroke, setTempStroke, strokeColor, setStrokeColor, strokeWidth, setStrokeWidth }}
    >
      {children}
    </DrawingContext.Provider>
  );
}