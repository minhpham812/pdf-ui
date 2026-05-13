import { usePdfViewer } from '../viewer/pdf-viewer-context';

interface PdfAnnotationLayerProps {
  pageNumber: number;
  tempStroke?: Array<{ x: number; y: number }> | null;
  strokeColor?: string;
  strokeWidth?: number;
}

/**
 * Absolute-positioned overlay that renders annotations for a single page.
 * - Drawings: freehand strokes as SVG polylines
 * - Highlights: semi-transparent colored rectangles
 */
export function PdfAnnotationLayer({
  pageNumber,
  tempStroke,
  strokeColor = '#ef4444',
  strokeWidth = 2,
}: PdfAnnotationLayerProps) {
  const { state, removeAnnotation } = usePdfViewer();
  const { annotations } = state;

  const pageAnnotations = annotations.filter((a) => a.page === pageNumber);

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Saved annotations */}
      {pageAnnotations.map((annotation) => {
        if (annotation.type === 'drawing') {
          const points = annotation.points ?? [];
          if (points.length < 2) return null;
          const pathD = points
            .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
            .join(' ');
          return (
            <div
              key={annotation.id}
              className="absolute pointer-events-auto cursor-pointer"
              style={{ left: `${annotation.x}%`, top: `${annotation.y}%`, width: `${annotation.width}%`, height: `${annotation.height}%`, zIndex: 20 }}
              onClick={() => {
                if (state.activeTool === 'erase') {
                  removeAnnotation(annotation.id);
                }
              }}
              onMouseEnter={(e) => {
                if (e.buttons === 1 && state.activeTool === 'erase') {
                  removeAnnotation(annotation.id);
                }
              }}
              title="Eraser: click or drag to delete drawing"
            >
              <svg
                className="w-full h-full overflow-visible"
                viewBox={`${annotation.x} ${annotation.y} ${annotation.width} ${annotation.height}`}
                preserveAspectRatio="none"
              >
                <path
                  d={pathD}
                  fill="none"
                  stroke={annotation.color}
                  strokeWidth={Number(annotation.content) / 5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          );
        }

        if (annotation.type === 'highlight') {
          return (
            <div
              key={annotation.id}
              className="absolute pointer-events-auto cursor-pointer rounded-sm mix-blend-multiply hover:brightness-90 transition-all"
              style={{
                left: `${annotation.x}%`,
                top: `${annotation.y}%`,
                width: `${annotation.width}%`,
                height: `${annotation.height}%`,
                backgroundColor: annotation.color + '66',
                borderColor: annotation.color,
                borderWidth: '2px',
                borderStyle: 'solid',
                zIndex: 15,
              }}
              onClick={() => {
                if (state.activeTool === 'erase') {
                  removeAnnotation(annotation.id);
                }
              }}
              onMouseEnter={(e) => {
                if (e.buttons === 1 && state.activeTool === 'erase') {
                  removeAnnotation(annotation.id);
                }
              }}
              title="Eraser: click or drag to delete highlight"
            />
          );
        }

      })}

      {/* Live stroke preview */}
      {tempStroke && tempStroke.length >= 2 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ zIndex: 25 }}
        >
          <path
            d={tempStroke.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth / 5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}