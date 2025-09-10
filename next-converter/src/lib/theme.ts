/**
 * Linear.app inspired dark theme configuration
 * Complete design system extracted from Linear.app
 */

export const theme = {
  colors: {
    background: {
      primary: 'rgb(8, 9, 10)',
      secondary: '#1A1C1F',
      tertiary: '#22262A',
      glass: 'rgba(10, 10, 10, 0.8)'
    },
    text: {
      primary: '#E2E4E6',
      secondary: '#949698',
      tertiary: '#62666D',
      quaternary: '#57595A',
      logo: 'rgb(247, 248, 248)',
      navigation: 'rgb(138, 143, 152)'
    },
    border: {
      primary: '#22262A',
      secondary: 'rgba(255, 255, 255, 0.1)',
      glass: 'rgba(255, 255, 255, 0.08)'
    },
    accent: {
      primary: '#5E6AD2',
      hover: '#4C59BD'
    },
    button: {
      primaryBg: 'rgb(230, 230, 230)',
      primaryText: 'rgb(8, 9, 10)',
      ghostBg: 'rgba(0, 0, 0, 0)',
      ghostText: 'rgb(138, 143, 152)'
    }
  },
  typography: {
    fontFamily: {
      primary: '"Inter Variable", "SF Pro Display", -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      heading: '"Inter Variable", "SF Pro Display", -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
    },
    fontSize: {
      xs: '12px',
      sm: '13px',
      base: '14px',
      md: '15px',
      lg: '16px',
      xl: '18px',
      '2xl': '24px',
      '3xl': '32px',
      '4xl': '48px',
      '5xl': '64px'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      linear: '510',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.1',
      heading: '1.2',
      base: '1.5',
      relaxed: '1.6',
      button: '32px',
      buttonLarge: '40px'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '48px',
    '5xl': '64px',
    '6xl': '80px'
  },
  borderRadius: {
    sm: '4px',
    base: '6px',
    md: '8px',
    lg: '10px',
    xl: '12px',
    '2xl': '16px',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px rgba(0, 0, 0, 0.12)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)'
  },
  transitions: {
    fast: '0.16s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    base: 'all 0.2s ease',
    slow: 'all 0.3s ease'
  },
  effects: {
    backdropBlur: 'blur(20px)',
    glassEffect: {
      background: 'rgba(10, 10, 10, 0.8)',
      backdropFilter: 'blur(20px)',
      border: '0.75px solid rgba(255, 255, 255, 0.08)'
    }
  },
  layout: {
    maxWidth: '1200px',
    containerPadding: '20px',
    headerHeight: '64.7461px',
    mobileBreakpoint: '768px',
    tabletBreakpoint: '1024px',
    desktopBreakpoint: '1200px'
  }
} as const;

export type Theme = typeof theme;

// CSS Custom Properties for easier usage
export const cssVariables = {
  '--color-bg-primary': theme.colors.background.primary,
  '--color-bg-secondary': theme.colors.background.secondary,
  '--color-bg-tertiary': theme.colors.background.tertiary,
  '--color-text-primary': theme.colors.text.primary,
  '--color-text-secondary': theme.colors.text.secondary,
  '--color-text-tertiary': theme.colors.text.tertiary,
  '--color-border-primary': theme.colors.border.primary,
  '--color-border-secondary': theme.colors.border.secondary,
  '--color-accent': theme.colors.accent.primary,
  '--font-family-primary': theme.typography.fontFamily.primary,
  '--border-radius-base': theme.borderRadius.md,
  '--transition-base': theme.transitions.fast,
  '--backdrop-blur': theme.effects.backdropBlur,
  '--header-height': theme.layout.headerHeight,
  '--container-max-width': theme.layout.maxWidth
};