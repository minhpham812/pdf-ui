import { useState, useRef, useCallback } from 'react';
import { usePdfViewer } from '../viewer/pdf-viewer-context';
import type { PdfAnnotation } from '../types/pdf-annotation';
import { NotebookPen } from 'lucide-react';

interface PdfAnnotationLayerProps {
  pageNumber: number;
}

export function PdfAnnotationLayer({ pageNumber }: PdfAnnotationLayerProps) {
  const { state, addAnnotation, removeAnnotation, updateAnnotation, setActiveTool } = usePdfViewer();
  const { scale, activeTool, highlightColor, annotations } = state;
  const layerRef = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const pageAnnotations = annotations.filter((a) => a.page === pageNumber);

  const getRelativePos = useCallback(
    (e: React.MouseEvent) => {
      if (!layerRef.current) return null;
      const rect = layerRef.current.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / scale,
        y: (e.clientY - rect.top) / scale,
      };
    },
    [scale]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (activeTool === 'none') return;
      e.preventDefault();
      const pos = getRelativePos(e);
      if (!pos) return;
      setDrawing(true);
      setStartPos(pos);
      setCurrentRect({ x: pos.x, y: pos.y, w: 0, h: 0 });
    },
    [activeTool, getRelativePos]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!drawing || !startPos) return;
      const pos = getRelativePos(e);
      if (!pos) return;
      setCurrentRect({
        x: Math.min(startPos.x, pos.x),
        y: Math.min(startPos.y, pos.y),
        w: Math.abs(pos.x - startPos.x),
        h: Math.abs(pos.y - startPos.y),
      });
    },
    [drawing, startPos, getRelativePos]
  );

  const handleMouseUp = useCallback(() => {
    if (!drawing || !currentRect) return;
    setDrawing(false);

    if (activeTool === 'highlight' && currentRect.w > 5 && currentRect.h > 5) {
      addAnnotation({
        page: pageNumber,
        type: 'highlight',
        x: currentRect.x,
        y: currentRect.y,
        width: currentRect.w,
        height: currentRect.h,
        color: highlightColor,
      });
    }

    if (activeTool === 'note') {
      const noteId = `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      addAnnotation({
        page: pageNumber,
        type: 'note',
        x: startPos?.x ?? currentRect.x,
        y: startPos?.y ?? currentRect.y,
        width: 24,
        height: 24,
        color: '#f5efa3',
        content: '',
      });
      setEditingNote(noteId);
    }

    setStartPos(null);
    setCurrentRect(null);
    setActiveTool('none');
  }, [drawing, currentRect, activeTool, highlightColor, pageNumber, addAnnotation, setActiveTool, startPos]);

  const handleNoteClick = useCallback(
    (annotation: PdfAnnotation) => {
      if (annotation.type !== 'note') return;
      setEditingNote(annotation.id);
      setNoteText(annotation.content ?? '');
    },
    []
  );

  const saveNote = useCallback(() => {
    if (!editingNote) return;
    const annotation = annotations.find((a) => a.id === editingNote);
    if (annotation) {
      updateAnnotation({ ...annotation, content: noteText });
    }
    setEditingNote(null);
    setNoteText('');
  }, [editingNote, noteText, annotations, updateAnnotation]);

  const deleteAnnotation = useCallback(
    (id: string) => {
      removeAnnotation(id);
      if (editingNote === id) {
        setEditingNote(null);
      }
    },
    [removeAnnotation, editingNote]
  );

  const layerClasses = `absolute inset-0 z-10 cursor-default ${
    activeTool !== 'none' ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'
  }`;

  return (
    <div
      ref={layerRef}
      className={layerClasses}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {pageAnnotations.map((annotation) => {
        const isHighlight = annotation.type === 'highlight';
        const annotationClasses = `absolute border-2 border-transparent pointer-events-auto cursor-pointer ${
          isHighlight
            ? 'rounded-sm mix-blend-multiply hover:brightness-90'
            : 'flex items-center justify-center rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.2)]'
        }`;

        return (
          <div
            key={annotation.id}
            className={annotationClasses}
            style={{
              left: annotation.x * scale,
              top: annotation.y * scale,
              width: annotation.width * scale,
              height: annotation.height * scale,
              backgroundColor: isHighlight ? annotation.color + '66' : annotation.color,
              borderColor: annotation.color,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleNoteClick(annotation);
            }}
          >
            {annotation.type === 'note' && (
              <span className="text-sm leading-none">
                <NotebookPen className='w-4 h-4'/>
              </span>
            )}

            {editingNote === annotation.id && (
              <div
                className="absolute left-0 min-w-[200px] p-2.5 border rounded-lg z-20 bg-surface border-border shadow-[0_8px_24px_rgba(0,0,0,0.15)]"
                style={{ top: annotation.height * scale + 4 }}
              >
                <textarea
                  className="w-full min-h-[60px] p-2 mb-2 text-sm border rounded-md resize-y text-text-heading bg-surface border-border focus:outline-none focus:border-accent focus:shadow-[0_0_0_2px_var(--color-accent-bg)]"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter your note..."
                  rows={3}
                  autoFocus
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    className="px-3 py-1.5 text-xs rounded-md border cursor-pointer transition-all duration-150 bg-accent text-white border-accent hover:bg-[#9333ea]"
                    onClick={(e) => {
                      e.stopPropagation();
                      saveNote();
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="px-3 py-1.5 text-xs rounded-md border cursor-pointer transition-all duration-150 bg-transparent text-[#ef4444] border-[#ef4444] hover:bg-[#fef2f2]"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteAnnotation(annotation.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {drawing && currentRect && activeTool === 'highlight' && (
        <div
          className="absolute border-2 rounded-sm pointer-events-none"
          style={{
            left: currentRect.x * scale,
            top: currentRect.y * scale,
            width: currentRect.w * scale,
            height: currentRect.h * scale,
            backgroundColor: highlightColor + '44',
            borderColor: highlightColor,
          }}
        />
      )}
    </div>
  );
}
