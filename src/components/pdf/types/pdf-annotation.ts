export type AnnotationType = 'highlight' | 'note' | 'drawing';

export interface DrawingPoint {
  x: number; // percentage of page width
  y: number; // percentage of page height
}

export interface PdfAnnotation {
  id: string;
  page: number;
  type: AnnotationType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  content?: string;
  createdAt: number;
  points?: DrawingPoint[]; // for drawing type
}

export interface PdfViewport {
  width: number;
  height: number;
  scale: number;
}

export type ActiveTool = 'none' | 'highlight' | 'note' | 'draw' | 'erase';

export interface PdfViewerState {
  file: string | ArrayBuffer | null;
  numPages: number;
  currentPage: number;
  scale: number;
  defaultScale: number;
  rotation: number;
  isLoading: boolean;
  error: string | null;
  activeTool: ActiveTool;
  highlightColor: string;
  annotations: PdfAnnotation[];
  showThumbnails: boolean;
}

export type PdfViewerAction =
  | { type: 'SET_FILE'; payload: string | ArrayBuffer }
  | { type: 'SET_NUM_PAGES'; payload: number }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_SCALE'; payload: number }
  | { type: 'SET_DEFAULT_SCALE'; payload: number }
  | { type: 'SET_ROTATION'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ACTIVE_TOOL'; payload: ActiveTool }
  | { type: 'SET_HIGHLIGHT_COLOR'; payload: string }
  | { type: 'ADD_ANNOTATION'; payload: PdfAnnotation }
  | { type: 'REMOVE_ANNOTATION'; payload: string }
  | { type: 'UPDATE_ANNOTATION'; payload: PdfAnnotation }
  | { type: 'SET_SHOW_THUMBNAILS'; payload: boolean }
  | { type: 'NEXT_PAGE' }
  | { type: 'PREV_PAGE' }
  | { type: 'ZOOM_IN' }
  | { type: 'ZOOM_OUT' }
  | { type: 'RESET_ZOOM' };
