import { theme } from './theme';

/**
 * Responsive design utilities based on Linear.app theme
 */

export const breakpoints = {
  mobile: parseInt(theme.layout.mobileBreakpoint),
  tablet: parseInt(theme.layout.tabletBreakpoint),
  desktop: parseInt(theme.layout.desktopBreakpoint),
} as const;

export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.mobile - 1}px)`,
  tablet: `@media (min-width: ${breakpoints.mobile}px) and (max-width: ${breakpoints.tablet - 1}px)`,
  desktop: `@media (min-width: ${breakpoints.desktop}px)`,
  tabletAndUp: `@media (min-width: ${breakpoints.mobile}px)`,
  desktopAndUp: `@media (min-width: ${breakpoints.tablet}px)`,
} as const;

export const responsive = {
  fontSize: {
    mobile: {
      h1: '32px',
      h2: '24px',
      h3: '20px',
      h4: '18px',
      base: '14px',
    },
    tablet: {
      h1: '48px',
      h2: '32px',
      h3: '24px',
      h4: '20px',
      base: '15px',
    },
    desktop: {
      h1: '64px',
      h2: '48px',
      h3: '32px',
      h4: '24px',
      base: '16px',
    },
  },
  spacing: {
    mobile: {
      containerPadding: '16px',
      sectionGap: '32px',
      elementGap: '12px',
    },
    tablet: {
      containerPadding: '24px',
      sectionGap: '48px',
      elementGap: '16px',
    },
    desktop: {
      containerPadding: '32px',
      sectionGap: '64px',
      elementGap: '20px',
    },
  },
} as const;

/**
 * Hook for getting responsive values
 */
export function useResponsiveValue<T>(
  mobile: T,
  tablet?: T,
  desktop?: T
): T {
  if (typeof window === 'undefined') return mobile;
  
  const width = window.innerWidth;
  
  if (width >= breakpoints.desktop && desktop) {
    return desktop;
  }
  
  if (width >= breakpoints.mobile && tablet) {
    return tablet;
  }
  
  return mobile;
}

/**
 * Generate responsive styles object
 */
export function createResponsiveStyles(styles: {
  mobile: React.CSSProperties;
  tablet?: React.CSSProperties;
  desktop?: React.CSSProperties;
}): React.CSSProperties {
  return {
    ...styles.mobile,
    [`${mediaQueries.tablet}`]: styles.tablet,
    [`${mediaQueries.desktop}`]: styles.desktop,
  };
}