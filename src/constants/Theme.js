import COLORS from '../../constants/Color';

// Theme configuration
export const THEME = {
  light: {
    background: COLORS.LIGHT_GRAY,
    surface: COLORS.WHITE,
    text: COLORS.DARK,
    textSecondary: COLORS.GRAY,
    primary: COLORS.PRIMARY,
    accent: COLORS.ACCENT_ORANGE,
    success: COLORS.SUCCESS,
    error: COLORS.ERROR,
    warning: COLORS.WARNING,
    border: COLORS.LIGHT_GRAY,
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    primary: COLORS.PRIMARY_LIGHT,
    accent: COLORS.ACCENT_ORANGE,
    success: COLORS.SUCCESS,
    error: COLORS.ERROR,
    warning: COLORS.WARNING,
    border: '#333333',
  },
};

// Spacing configuration
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography configuration
export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: 'bold' },
  h2: { fontSize: 28, fontWeight: 'bold' },
  h3: { fontSize: 24, fontWeight: 'bold' },
  h4: { fontSize: 20, fontWeight: '600' },
  h5: { fontSize: 18, fontWeight: '600' },
  h6: { fontSize: 16, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: 'normal' },
  bodySmall: { fontSize: 14, fontWeight: 'normal' },
  caption: { fontSize: 12, fontWeight: 'normal' },
};

// Shadow configuration
export const SHADOWS = {
  small: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Border radius configuration
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 50,
};

export default { THEME, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS };