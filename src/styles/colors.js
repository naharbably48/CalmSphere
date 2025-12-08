export const colors = {
  light: {
    primary: '#E8F4F8',
    secondary: '#B0E0E6',
    accent: '#4A90E2',
    text: '#2C3E50',
    textLight: '#7F8C8D',
    border: '#BDC3C7',
    background: '#FFFFFF',
    backgroundAlt: '#F5F7FA',
  },
  dark: {
    primary: '#0F1419',
    secondary: '#1A1F2E',
    accent: '#6DB3F2',
    text: '#E0E0E0',
    textLight: '#A0A0A0',
    border: '#333333',
    background: '#0F1419',
    backgroundAlt: '#1A1F2E',
  },
};

export const getThemeColors = (isDark) => (isDark ? colors.dark : colors.light);

export const gradients = {
  light: {
    primary: 'linear-gradient(135deg, #E8F4F8 0%, #B0E0E6 100%)',
    breathing: 'linear-gradient(135deg, #4A90E2 0%, #7BC3E2 100%)',
    calm: 'linear-gradient(135deg, #6DB3F2 0%, #4A90E2 100%)',
  },
  dark: {
    primary: 'linear-gradient(135deg, #0F1419 0%, #1A1F2E 100%)',
    breathing: 'linear-gradient(135deg, #6DB3F2 0%, #4A90E2 100%)',
    calm: 'linear-gradient(135deg, #2A3F5F 0%, #1A1F2E 100%)',
  },
};
