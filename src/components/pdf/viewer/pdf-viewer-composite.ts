import { PdfViewerRoot } from './pdf-viewer';
import { PdfViewerPage, PdfViewerPages } from './pdf-viewer';
import { PdfToolbar } from '../toolbar/pdf-toolbar';
import { PdfThumbnails } from '../thumbnails/pdf-thumbnails';

// Composite export (base-ui style).
// Separated into its own file so each component file only exports React components,
// which is required for Fast Refresh to work correctly.
export const PdfViewer = {
  Root: PdfViewerRoot,
  Page: PdfViewerPage,
  Pages: PdfViewerPages,
  Toolbar: PdfToolbar,
  Thumbnails: PdfThumbnails,
};

export type { PdfViewerRootProps, PdfViewerPageProps } from './pdf-viewer';
