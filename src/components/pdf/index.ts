export { PdfViewer } from './viewer';
export { usePdfViewer } from './viewer/pdf-viewer-context';
export { useViewportScale, ZOOM_PRESETS } from './hooks/use-viewport-scale';
export { useAnnotationStore } from './hooks/use-annotation-store';
export { usePdfDocument } from './hooks/use-pdf-document';

export type {
  PdfAnnotation,
  AnnotationType,
  PdfViewport,
  ActiveTool,
  PdfViewerState,
} from './types/pdf-annotation';

// Named part exports (index.parts.ts)
export {
  PdfViewerRoot,
  PdfViewerPage,
  PdfViewerPages,
  PdfToolbar,
  PdfThumbnails,
  PdfAnnotationLayer,
  PdfHighlightTool,
  PdfNoteTool,
  PdfDrawingTool,
} from './index.parts';
