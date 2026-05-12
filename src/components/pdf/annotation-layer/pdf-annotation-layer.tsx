import { useState, useRef, useCallback } from 'react';
import { usePdfViewer } from '../viewer/pdf-viewer-context';
import type { PdfAnnotation } from '../types/pdf-annotation';
import './pdf-annotation-layer.css';

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
        color: '#ffe066',
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

  return (
    <div
      ref={layerRef}
      className={`pdf-annotation-layer ${activeTool !== 'none' ? 'pdf-annotation-layer--drawing' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {pageAnnotations.map((annotation) => (
        <div
          key={annotation.id}
          className={`pdf-annotation ${annotation.type === 'highlight' ? 'pdf-annotation--highlight' : 'pdf-annotation--note'}`}
          style={{
            left: annotation.x * scale,
            top: annotation.y * scale,
            width: annotation.width * scale,
            height: annotation.height * scale,
            backgroundColor:
              annotation.type === 'highlight'
                ? annotation.color + '66'
                : annotation.color,
            borderColor: annotation.color,
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleNoteClick(annotation);
          }}
        >
          {annotation.type === 'note' && (
            <span className="pdf-annotation__note-icon">📝</span>
          )}

          {editingNote === annotation.id && (
            <div
              className="pdf-annotation__popover"
              style={{ top: annotation.height * scale + 4 }}
            >
              <textarea
                className="pdf-annotation__textarea"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter your note..."
                rows={3}
                autoFocus
              />
              <div className="pdf-annotation__actions">
                <button
                  className="pdf-annotation__btn pdf-annotation__btn--save"
                  onClick={(e) => {
                    e.stopPropagation();
                    saveNote();
                  }}
                >
                  Save
                </button>
                <button
                  className="pdf-annotation__btn pdf-annotation__btn--delete"
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
      ))}

      {drawing && currentRect && activeTool === 'highlight' && (
        <div
          className="pdf-annotation pdf-annotation--drawing"
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
