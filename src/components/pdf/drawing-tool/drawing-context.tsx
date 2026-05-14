/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';

export interface DrawingState {
  tempStroke: Array<{ x: number; y: number }> | null;
  strokeColor: string;
  strokeWidth: number;
  activeDrawingPage: number | null;
}

export interface DrawingContextValue extends DrawingState {
  setTempStroke: (stroke: Array<{ x: number; y: number }> | null) => void;
  setStrokeColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setActiveDrawingPage: (page: number | null) => void;
}

export const DrawingContext = createContext<DrawingContextValue | null>(null);

interface DrawingProviderProps {
  children: React.ReactNode;
}

export function DrawingProvider({ children }: DrawingProviderProps) {
  const [tempStroke, setTempStroke] = useState<Array<{ x: number; y: number }> | null>(null);
  const [strokeColor, setStrokeColor] = useState('#ef4444');
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [activeDrawingPage, setActiveDrawingPage] = useState<number | null>(null);

  return (
    <DrawingContext.Provider
      value={{ tempStroke, setTempStroke, strokeColor, setStrokeColor, strokeWidth, setStrokeWidth, activeDrawingPage, setActiveDrawingPage }}
    >
      {children}
    </DrawingContext.Provider>
  );
}