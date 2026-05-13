import { PdfViewerRoot } from './pdf-viewer';
import { PdfViewerPages } from './pdf-viewer';
import { PdfViewerPage } from '../pdf-page';
import { PdfToolbar } from '../toolbar/pdf-toolbar';
import { PdfThumbnails } from '../thumbnails/pdf-thumbnails';
import { PdfAnnotationLayer } from '../annotation-layer/pdf-annotation-layer';
import { PdfHighlightTool } from '../pdf-highlight-tool';
import { PdfNoteTool } from '../pdf-note-tool';
import { PdfDrawingTool } from '../pdf-drawing-tool';

// Composite export (base-ui style).
// Separated into its own file so each component file only exports React components,
// which is required for Fast Refresh to work correctly.
export const PdfViewer = {
  Root: PdfViewerRoot,
  Page: PdfViewerPage,
  Pages: PdfViewerPages,
  Toolbar: PdfToolbar,
  Thumbnails: PdfThumbnails,
  AnnotationLayer: PdfAnnotationLayer,
  HighlightTool: PdfHighlightTool,
  NoteTool: PdfNoteTool,
  DrawingTool: PdfDrawingTool,
};

export type { PdfViewerRootProps } from './pdf-viewer';
export type { PdfViewerPageProps } from '../pdf-page';