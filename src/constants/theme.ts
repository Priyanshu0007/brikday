/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    background: '#FFFFFF',
    paper: '#F4F4F0',
    border: '#000000',
    text: '#000000',
    textMuted: '#555555',
    success: '#4ADE80',
    warning: '#FBBF24',
    danger: '#EF4444',
  },
  dark: {
    background: '#090A0F', // Obsidian black
    paper: '#161824', // Deep slate/indigo card container
    border: '#E2E8F0', // Crisp slate off-white border
    text: '#F8FAFC', // Slate-50 bright text
    textMuted: '#94A3B8', // Slate-400 muted text
    success: '#0DF289', // High-voltage neon mint green
    warning: '#FFD000', // Bright vivid gold yellow
    danger: '#FF3366', // Electric neon rose red
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = {
  heading: 'SpaceGrotesk-Bold',
  body: 'PlusJakartaSans-Regular',
  bodyBold: 'PlusJakartaSans-Bold',
  mono: 'SpaceMono-Regular',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
