import { useCallback } from 'react';

export const ZOOM_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4] as const;

export type ZoomPreset = (typeof ZOOM_PRESETS)[number];

export interface ViewportDimensions {
  width: number;
  height: number;
}

/**
 * Calculate scale to fit page width within container width
 */
export function fitToWidth(containerWidth: number, pageWidth: number): number {
  if (pageWidth === 0 || containerWidth === 0) return 1;
  return containerWidth / pageWidth;
}

/**
 * Calculate scale to fit page within container (preserving aspect ratio)
 */
export function fitToPage(
  containerWidth: number,
  containerHeight: number,
  pageWidth: number,
  pageHeight: number
): number {
  if (pageWidth === 0 || pageHeight === 0 || containerWidth === 0 || containerHeight === 0) {
    return 1;
  }
  const scaleX = containerWidth / pageWidth;
  const scaleY = containerHeight / pageHeight;
  return Math.min(scaleX, scaleY);
}

/**
 * Clamp scale within min/max bounds
 */
export function clampScale(scale: number, min = 0.25, max = 5): number {
  return Math.max(min, Math.min(max, scale));
}

/**
 * Format scale as percentage string
 */
export function formatScalePercent(scale: number): string {
  return `${Math.round(scale * 100)}%`;
}

/**
 * Hook for zoom calculations
 */
export function useViewportScale() {
  const calculateFitWidth = useCallback((containerWidth: number, pageWidth: number) => {
    return fitToWidth(containerWidth, pageWidth);
  }, []);

  const calculateFitPage = useCallback(
    (containerWidth: number, containerHeight: number, pageWidth: number, pageHeight: number) => {
      return fitToPage(containerWidth, containerHeight, pageWidth, pageHeight);
    },
    []
  );

  const clamp = useCallback((scale: number, min = 0.25, max = 5) => {
    return clampScale(scale, min, max);
  }, []);

  return {
    presets: ZOOM_PRESETS,
    fitToWidth: calculateFitWidth,
    fitToPage: calculateFitPage,
    clampScale: clamp,
    formatPercent: formatScalePercent,
  };
}