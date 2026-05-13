import { useCallback } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';

interface UsePdfDocumentResult {
  handleLoadSuccess: (pdf: PDFDocumentProxy) => void;
  handleLoadError: (error: Error) => void;
}

/**
 * Hook to wrap react-pdf Document's onLoadSuccess callback
 * Extracts numPages and dispatches to context
 */
export function usePdfDocument(
  onNumPagesLoaded: (numPages: number) => void,
  onLoadingChange?: (loading: boolean) => void,
  onError?: (message: string | null) => void
): UsePdfDocumentResult {
  const handleLoadSuccess = useCallback(
    (pdf: PDFDocumentProxy) => {
      onNumPagesLoaded(pdf.numPages);
      onLoadingChange?.(false);
    },
    [onNumPagesLoaded, onLoadingChange]
  );

  const handleLoadError = useCallback(
    (error: Error) => {
      onError?.(error.message);
      onLoadingChange?.(false);
    },
    [onError, onLoadingChange]
  );

  return {
    handleLoadSuccess,
    handleLoadError,
  };
}