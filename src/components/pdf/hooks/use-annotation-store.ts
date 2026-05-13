import { useCallback } from 'react';
import type { PdfAnnotation } from '../types/pdf-annotation';

/**
 * Hook for annotation CRUD operations
 * Note: localStorage persistence not included in v1 (YAGNI)
 */
export function useAnnotationStore() {
  const createAnnotation = useCallback(
    (
      annotation: Omit<PdfAnnotation, 'id' | 'createdAt'>
    ): PdfAnnotation => {
      return {
        ...annotation,
        id: `${annotation.type}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        createdAt: Date.now(),
      };
    },
    []
  );

  const updateAnnotation = useCallback(
    (annotations: PdfAnnotation[], id: string, updates: Partial<PdfAnnotation>): PdfAnnotation[] => {
      return annotations.map((a) => (a.id === id ? { ...a, ...updates } : a));
    },
    []
  );

  const removeAnnotation = useCallback((annotations: PdfAnnotation[], id: string): PdfAnnotation[] => {
    return annotations.filter((a) => a.id !== id);
  }, []);

  const filterByPage = useCallback((annotations: PdfAnnotation[], pageNumber: number): PdfAnnotation[] => {
    return annotations.filter((a) => a.page === pageNumber);
  }, []);

  return {
    createAnnotation,
    updateAnnotation,
    removeAnnotation,
    filterByPage,
  };
}