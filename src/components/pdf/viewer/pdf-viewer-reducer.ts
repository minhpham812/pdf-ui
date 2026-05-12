import type { PdfViewerState, PdfViewerAction } from '../types/pdf-annotation';

export const MIN_SCALE = 0.25;
export const MAX_SCALE = 5.0;
export const SCALE_STEP = 0.25;

export const initialState: PdfViewerState = {
  file: null,
  numPages: 0,
  currentPage: 1,
  scale: 1,
  defaultScale: 1,
  rotation: 0,
  isLoading: false,
  error: null,
  activeTool: 'none',
  highlightColor: '#ffe066',
  annotations: [],
  showThumbnails: true,
};

export function pdfViewerReducer(
  state: PdfViewerState,
  action: PdfViewerAction
): PdfViewerState {
  switch (action.type) {
    case 'SET_FILE':
      return {
        ...initialState,
        file: action.payload,
        isLoading: true,
      };
    case 'SET_NUM_PAGES':
      return { ...state, numPages: action.payload };
    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: Math.max(1, Math.min(action.payload, state.numPages)),
      };
    case 'SET_SCALE':
      return {
        ...state,
        scale: Math.max(MIN_SCALE, Math.min(action.payload, MAX_SCALE)),
      };
    case 'SET_DEFAULT_SCALE':
      return { ...state, defaultScale: action.payload, scale: action.payload };
    case 'SET_ROTATION':
      return { ...state, rotation: action.payload % 360 };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_ACTIVE_TOOL':
      return { ...state, activeTool: action.payload };
    case 'SET_HIGHLIGHT_COLOR':
      return { ...state, highlightColor: action.payload };
    case 'ADD_ANNOTATION':
      return {
        ...state,
        annotations: [...state.annotations, action.payload],
      };
    case 'REMOVE_ANNOTATION':
      return {
        ...state,
        annotations: state.annotations.filter((a) => a.id !== action.payload),
      };
    case 'UPDATE_ANNOTATION':
      return {
        ...state,
        annotations: state.annotations.map((a) =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    case 'SET_SHOW_THUMBNAILS':
      return { ...state, showThumbnails: action.payload };
    case 'NEXT_PAGE':
      return {
        ...state,
        currentPage: Math.min(state.currentPage + 1, state.numPages),
      };
    case 'PREV_PAGE':
      return {
        ...state,
        currentPage: Math.max(state.currentPage - 1, 1),
      };
    case 'ZOOM_IN':
      return {
        ...state,
        scale: Math.min(state.scale + SCALE_STEP, MAX_SCALE),
      };
    case 'ZOOM_OUT':
      return {
        ...state,
        scale: Math.max(state.scale - SCALE_STEP, MIN_SCALE),
      };
    case 'RESET_ZOOM':
      return { ...state, scale: state.defaultScale };
    default:
      return state;
  }
}
