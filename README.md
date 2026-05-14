# PDF UI — React PDF Viewer with Annotations

A React-based PDF viewer with annotation tools. Load PDFs, navigate pages, zoom, highlight text, draw freehand strokes, and export the annotated PDF.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19.2.6 + TypeScript 6.0.2 |
| Build | Vite 8.0.12 + @tailwindcss/vite 4.3.0 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| PDF Rendering | react-pdf 10.4.1 (pdfjs-dist 5.4.296) |
| PDF Manipulation | pdf-lib 1.17.1 |
| UI Primitives | @base-ui/react 1.4.1 |
| Icons | lucide-react 1.14.0 |
| Compiler | Babel React Compiler |

## Features

### PDF Loading
Drop a PDF file onto the drop zone or click to open the file picker.

### Page Navigation
Use `<` and `>` buttons in the toolbar, or type a page number directly in the page input field.

### Zoom
Click `-` or `+` to zoom in/out by 0.25 steps. Click the reset icon to return to 1.0x scale.
- Scale limits: 25% — 500%
- Presets: `[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4]`

### Thumbnail Sidebar
Click the sidebar toggle icon in the toolbar to show/hide the thumbnail panel. Click any thumbnail to jump directly to that page.

### Highlight Tool
Click the highlight icon in the toolbar, pick a color, then select text on the PDF. A semi-transparent rectangle appears over the selection.
- Colors: Yellow, green, blue, rose, orange (plus custom color picker)

### Drawing Tool
Click the pencil icon in the toolbar, pick a color and stroke width, then click-and-drag on the PDF to draw freehand strokes.
- Colors: Red, orange, yellow, green, blue, violet, pink, black
- Stroke widths: 2, 4, 6, 8 pixels

### Eraser Tool
Click the eraser icon in the toolbar, then click (or click-drag) on any annotation to delete it. Works on both highlights and drawings.

### Save PDF
Click the download icon in the toolbar to export `annotated.pdf` — the original PDF with all annotations rendered on top.

## Usage

```tsx
import { PdfViewer } from './components/pdf';

function App() {
  return (
    <PdfViewer.Root url={pdfUrl} initialScale={1} className="w-screen h-screen">
      <PdfViewer.Toolbar />
      <PdfViewer.Thumbnails />
      <PdfViewer.Pages />
      <PdfViewer.HighlightTool />
      <PdfViewer.DrawingTool />
    </PdfViewer.Root>
  );
}
```

## Architecture

### Composite Component Pattern

All PDF components follow a composite pattern:

```tsx
export const PdfViewer = {
  Root: PdfViewerRoot,
  Page: PdfViewerPage,
  Pages: PdfViewerPages,
  Toolbar: PdfToolbar,
  Thumbnails: PdfThumbnails,
  AnnotationLayer: PdfAnnotationLayer,
  HighlightTool: PdfHighlightTool,
  DrawingTool: PdfDrawingTool,
};
```

### Context + Reducer State

- `PdfViewerContext` — Main state: file, pages, scale, activeTool, annotations, etc.
- `DrawingContext` — Transient drawing state: tempStroke, strokeColor, strokeWidth

### Percentage-Based Positioning

All annotation coordinates are stored as percentages (0–100) of page dimensions. Annotations maintain correct position/size at any zoom level.

### Annotation Data Model

```ts
interface PdfAnnotation {
  id: string;
  page: number;
  type: 'highlight' | 'drawing';
  x: number;       // percentage (0-100)
  y: number;      // percentage (0-100)
  width: number;  // percentage (0-100)
  height: number; // percentage (0-100)
  color: string;  // hex color
  content?: string;
  createdAt: number;
  points?: DrawingPoint[]; // for drawing type
}
```

## File Structure

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── utils/
│   ├── pdf-worker.ts
│   └── pdf-save-utils.ts
└── components/pdf/
    ├── index.ts
    ├── index.parts.ts
    ├── pdf-page.tsx
    ├── pdf-highlight-tool.tsx
    ├── pdf-drawing-tool.tsx
    ├── types/
    │   └── pdf-annotation.ts
    ├── viewer/
    │   ├── pdf-viewer-context.ts
    │   ├── pdf-viewer-reducer.ts
    │   ├── pdf-viewer-provider.tsx
    │   ├── pdf-viewer.tsx
    │   └── pdf-viewer-composite.ts
    ├── toolbar/
    │   └── pdf-toolbar.tsx
    ├── thumbnails/
    │   └── pdf-thumbnails.tsx
    ├── annotation-layer/
    │   └── pdf-annotation-layer.tsx
    ├── drawing-tool/
    │   ├── drawing-context.tsx
    │   └── use-drawing.ts
    └── hooks/
        ├── use-viewport-scale.ts
        ├── use-annotation-store.ts
        └── use-pdf-document.ts
```

## Development

```bash
# Install dependencies
yarn install

# Start dev server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## Expanding the Project

### Adding a New Tool

1. Define tool type in `ActiveTool` in `pdf-viewer-reducer.ts`
2. Add toggle button in `pdf-toolbar.tsx`
3. Create tool component following `pdf-highlight-tool.tsx` pattern
4. Add annotation type to `PdfAnnotation`
5. Handle rendering in `pdf-annotation-layer.tsx`
6. Handle save logic in `pdf-save-utils.ts`

### Keyboard Shortcuts (Not Implemented Yet)

```ts
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextPage();
    if (e.key === 'ArrowLeft') prevPage();
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, [nextPage]);
```