// ─── Hafsum Design Tokens ────────────────────────────────────────────────────

export const Colors = {
  // Brand
  primary: '#492760',
  primaryDark: '#2E1540',
  primaryLight: '#6B3A8A',
  primaryFade: 'rgba(73,39,96,0.12)',
  accent: '#C9963A',       // gold / amber for CTAs
  accentLight: '#E8B55A',

  // Neutrals
  white: '#FFFFFF',
  offWhite: '#F8F4FB',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3EEF8',
  border: '#E8E0F0',

  // Text
  textPrimary: '#1A0D2E',
  textSecondary: '#6B5F7A',
  textMuted: '#A89DB8',
  textOnPrimary: '#FFFFFF',

  // Status
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',

  // Order statuses
  statusReceived: '#17A2B8',
  statusConfirmed: '#FF8C00',
  statusPreparing: '#FFC107',
  statusReady: '#28A745',
  statusCompleted: '#6B5F7A',
  statusCancelled: '#DC3545',

  // Misc
  overlay: 'rgba(26,13,46,0.55)',
  shadow: 'rgba(73,39,96,0.18)',
};

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 30,
    xxxl: 38,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
};
