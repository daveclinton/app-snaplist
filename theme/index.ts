const colors = {
  primary: {
    DEFAULT: '#007AFF',
    light: '#4DA2FF',
    dark: '#0055B3',
  },
  secondary: {
    DEFAULT: '#5856D6',
    light: '#7A79E0',
    dark: '#3634A8',
  },
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F2F2F7',
  },
  text: {
    primary: '#000000',
    secondary: '#6b7280',
    inverse: '#FFFFFF',
  },
};

const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
};

const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  full: '9999px',
};

const typography = {
  fontFamily: {
    sans: 'System',
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
  },
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
};
