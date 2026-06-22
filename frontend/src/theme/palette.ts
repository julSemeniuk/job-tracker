import type { PaletteMode, PaletteOptions } from '@mui/material'

declare module '@mui/material/styles' {
  interface TypeBackground {
    elevated: string
  }
}

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#6366F1',
    light: '#818CF8',
    dark: '#4F46E5',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#8B5CF6',
    light: '#A78BFA',
    dark: '#7C3AED',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F9FAFB',
    paper: '#FFFFFF',
    elevated: '#FFFFFF',
  },
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
  },
  divider: '#E5E7EB',
  success: {
    main: '#22C55E',
  },
  warning: {
    main: '#F59E0B',
  },
  error: {
    main: '#F43F5E',
  },
  info: {
    main: '#0EA5E9',
  },
}

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#818CF8',
    light: '#A5B4FC',
    dark: '#6366F1',
    contrastText: '#0B1020',
  },
  secondary: {
    main: '#A78BFA',
    light: '#C4B5FD',
    dark: '#8B5CF6',
    contrastText: '#0B1020',
  },
  background: {
    default: '#0B1020',
    paper: '#131A2A',
    elevated: '#1B2335',
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#A7B0C0',
    disabled: '#6F7A8E',
  },
  divider: '#273247',
  success: {
    main: '#34D399',
  },
  warning: {
    main: '#FBBF24',
  },
  error: {
    main: '#FB7185',
  },
  info: {
    main: '#38BDF8',
  },
}

export const getPalette = (mode: PaletteMode): PaletteOptions =>
  mode === 'dark' ? darkPalette : lightPalette
