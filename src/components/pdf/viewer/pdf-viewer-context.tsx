import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type { PdfAnnotation, ActiveTool } from '../types/pdf-annotation';
import { pdfViewerReducer, initialState } from './pdf-viewer-reducer';

interface PdfViewerContextValue {
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

const PdfViewerContext = createContext<PdfViewerContextValue | null>(null);

export function usePdfViewer() {
  const context = useContext(PdfViewerContext);
  if (!context) {
    throw new Error('usePdfViewer must be used within a PdfViewer.Root');
  }
  return context;
}

interface PdfViewerProviderProps {
  children: ReactNode;
  file?: string | ArrayBuffer;
  initialAnnotations?: PdfAnnotation[];
}

export function PdfViewerProvider({
  children,
  file,
  initialAnnotations = [],
}: PdfViewerProviderProps) {
  const [state, dispatch] = useReducer(pdfViewerReducer, {
    ...initialState,
    file: file ?? null,
    annotations: initialAnnotations,
  });

  const setFile = useCallback((f: string | ArrayBuffer) => {
    dispatch({ type: 'SET_FILE', payload: f });
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  }, []);

  const nextPage = useCallback(() => {
    dispatch({ type: 'NEXT_PAGE' });
  }, []);

  const prevPage = useCallback(() => {
    dispatch({ type: 'PREV_PAGE' });
  }, []);

  const zoomIn = useCallback(() => {
    dispatch({ type: 'ZOOM_IN' });
  }, []);

  const zoomOut = useCallback(() => {
    dispatch({ type: 'ZOOM_OUT' });
  }, []);

  const resetZoom = useCallback(() => {
    dispatch({ type: 'RESET_ZOOM' });
  }, []);

  const setScale = useCallback((scale: number) => {
    dispatch({ type: 'SET_SCALE', payload: scale });
  }, []);

  const setRotation = useCallback((rotation: number) => {
    dispatch({ type: 'SET_ROTATION', payload: rotation });
  }, []);

  const setActiveTool = useCallback((tool: ActiveTool) => {
    dispatch({ type: 'SET_ACTIVE_TOOL', payload: tool });
  }, []);

  const setHighlightColor = useCallback((color: string) => {
    dispatch({ type: 'SET_HIGHLIGHT_COLOR', payload: color });
  }, []);

  const addAnnotation = useCallback(
    (annotation: Omit<PdfAnnotation, 'id' | 'createdAt'>) => {
      dispatch({
        type: 'ADD_ANNOTATION',
        payload: {
          ...annotation,
          id: `${annotation.type}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          createdAt: Date.now(),
        },
      });
    },
    []
  );

  const removeAnnotation = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ANNOTATION', payload: id });
  }, []);

  const updateAnnotation = useCallback((annotation: PdfAnnotation) => {
    dispatch({ type: 'UPDATE_ANNOTATION', payload: annotation });
  }, []);

  const toggleThumbnails = useCallback(() => {
    dispatch({ type: 'SET_SHOW_THUMBNAILS', payload: !state.showThumbnails });
  }, [state.showThumbnails]);

  const value: PdfViewerContextValue = {
    state,
    dispatch,
    setFile,
    setCurrentPage,
    nextPage,
    prevPage,
    zoomIn,
    zoomOut,
    resetZoom,
    setScale,
    setRotation,
    setActiveTool,
    setHighlightColor,
    addAnnotation,
    removeAnnotation,
    updateAnnotation,
    toggleThumbnails,
  };

  return (
    <PdfViewerContext.Provider value={value}>
      {children}
    </PdfViewerContext.Provider>
  );
}
