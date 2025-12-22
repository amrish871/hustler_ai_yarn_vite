import { colors } from './colors';
import { spacing, breakpoints, containerWidth } from './spacing';
import { typography } from './typography';
import { animations } from './animations';

export const theme = {
  colors,
  spacing,
  breakpoints,
  containerWidth,
  typography,
  animations,
} as const;

export type Theme = typeof theme;
export * from './colors';
export * from './spacing';
export * from './typography';
export * from './animations';