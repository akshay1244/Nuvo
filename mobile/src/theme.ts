// src/theme.ts – UI design tokens for Nuvo
export const COLORS = {
  background: '#0A0A0A', // dark mode background
  surface: '#1A1A1A',
  primaryGradientStart: '#00BFFF', // electric blue
  primaryGradientEnd: '#8A2BE2', // violet
  accent: '#00CFFF',
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
};

export const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  bold: 'Inter_700Bold',
};

export const GRADIENT = {
  primary: [COLORS.primaryGradientStart, COLORS.primaryGradientEnd] as const,
};

