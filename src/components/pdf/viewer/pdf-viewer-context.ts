import { createContext, useContext } from 'react';
import type { PdfAnnotation, ActiveTool } from '../types/pdf-annotation';
import type { pdfViewerReducer } from './pdf-viewer-reducer';

// Context value contract shared by provider and consumers
export interface PdfViewerContextValue {
  state: ReturnType<typeof pdfViewerReducer>;
  dispatch: React.Dispatch<Parameters<typeof pdfViewerReducer>[1]>;
  setFile: (file: string | ArrayBuffer) => void;
  setCurrentPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setScale: (scale: number) => void;
  setRotation: (rotation: number) => void;
  setActiveTool: (tool: ActiveTool) => void;
  setHighlightColor: (color: string) => void;
  addAnnotation: (annotation: Omit<PdfAnnotation, 'id' | 'createdAt'>) => void;
  removeAnnotation: (id: string) => void;
  updateAnnotation: (annotation: PdfAnnotation) => void;
  toggleThumbnails: () => void;
}

export const PdfViewerContext = createContext<PdfViewerContextValue | null>(null);

export function usePdfViewer() {
  const context = useContext(PdfViewerContext);
  if (!context) {
    throw new Error('usePdfViewer must be used within a PdfViewer.Root');
  }
  return context;
}
