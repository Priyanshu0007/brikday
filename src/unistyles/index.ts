/**
 * Unistyles configuration — imported once at the app entry point.
 *
 * Re-exports the `rem` and `responsive` helpers so consumers
 * only need a single import path:
 *
 *   import { rem, responsive } from '@/unistyles';
 */

import { StyleSheet } from 'react-native-unistyles';
import { Colors, Fonts, Spacing } from '../constants/theme';

// ─── Breakpoints ─────────────────────────────────────────
export const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

// ─── Shared Theme Properties ─────────────────────────────
const sharedTheme = {
  borderWidth: 3,
  borderRadius: 4,
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
} as const;

// ─── Themes ──────────────────────────────────────────────
export const lightTheme = {
  colors: Colors.light,
  fonts: Fonts,
  spacing: Spacing,
  ...sharedTheme,
} as const;

export const darkTheme = {
  colors: Colors.dark,
  fonts: Fonts,
  spacing: Spacing,
  ...sharedTheme,
} as const;

// ─── TypeScript declaration merging ──────────────────────
export type AppTheme = typeof lightTheme | typeof darkTheme;
type AppBreakpoints = typeof breakpoints;
type AppThemes = {
  light: typeof lightTheme;
  dark: typeof darkTheme;
};

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesBreakpoints extends AppBreakpoints {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesThemes extends AppThemes {}
}

// ─── Initialise ──────────────────────────────────────────
StyleSheet.configure({
  breakpoints,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  settings: {
    initialTheme: 'light',
    adaptiveThemes: false,
  },
});
