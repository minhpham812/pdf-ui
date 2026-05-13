// Named component exports (alternative to composite PdfViewer object)
export { PdfViewerRoot } from './viewer/pdf-viewer';
export { PdfViewerPage } from './pdf-page';
export { PdfViewerPages } from './viewer/pdf-viewer';
export { PdfToolbar } from './toolbar/pdf-toolbar';
export { PdfThumbnails } from './thumbnails/pdf-thumbnails';
export { PdfAnnotationLayer } from './annotation-layer/pdf-annotation-layer';
export { PdfHighlightTool } from './pdf-highlight-tool';
export { PdfNoteTool } from './pdf-note-tool';
export { PdfDrawingTool } from './pdf-drawing-tool';
export { PdfViewer } from './viewer/pdf-viewer-composite';

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
export type { PdfViewerRootProps } from './viewer/pdf-viewer';
export type { PdfViewerPageProps } from './pdf-page';