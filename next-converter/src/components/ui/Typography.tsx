'use client';

import React from 'react';
import { theme } from '@/lib/theme';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'small';
  color?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  className?: string;
  as?: React.ElementType;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ 
    children, 
    variant = 'body', 
    color = 'primary', 
    className = '', 
    as,
    ...props 
  }, ref) => {
    const colorStyles = {
      primary: theme.colors.text.primary,
      secondary: theme.colors.text.secondary,
      tertiary: theme.colors.text.tertiary,
      quaternary: theme.colors.text.quaternary,
    };

    const variantStyles = {
      h1: {
        fontSize: theme.typography.fontSize['5xl'],
        fontWeight: theme.typography.fontWeight.bold,
        lineHeight: theme.typography.lineHeight.tight,
        margin: '0 0 24px 0',
      },
      h2: {
        fontSize: theme.typography.fontSize['4xl'],
        fontWeight: theme.typography.fontWeight.semibold,
        lineHeight: theme.typography.lineHeight.tight,
        margin: '0 0 20px 0',
      },
      h3: {
        fontSize: theme.typography.fontSize['3xl'],
        fontWeight: theme.typography.fontWeight.semibold,
        lineHeight: theme.typography.lineHeight.heading,
        margin: '0 0 16px 0',
      },
      h4: {
        fontSize: theme.typography.fontSize['2xl'],
        fontWeight: theme.typography.fontWeight.medium,
        lineHeight: theme.typography.lineHeight.heading,
        margin: '0 0 12px 0',
      },
      body: {
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.normal,
        lineHeight: theme.typography.lineHeight.base,
        margin: '0 0 16px 0',
      },
      caption: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.medium,
        lineHeight: theme.typography.lineHeight.base,
        margin: '0 0 8px 0',
      },
      small: {
        fontSize: theme.typography.fontSize.xs,
        fontWeight: theme.typography.fontWeight.normal,
        lineHeight: theme.typography.lineHeight.base,
        margin: '0 0 8px 0',
      },
    };

    const defaultElements = {
      h1: 'h1',
      h2: 'h2', 
      h3: 'h3',
      h4: 'h4',
      body: 'p',
      caption: 'span',
      small: 'small',
    } as const;

    const Element: React.ElementType = as || defaultElements[variant];

    const combinedStyles = {
      ...variantStyles[variant],
      color: colorStyles[color],
      fontFamily: theme.typography.fontFamily.primary,
    };

    return React.createElement(
      Element,
      {
        ref,
        className,
        style: combinedStyles,
        ...props,
      },
      children
    );
  }
);

Typography.displayName = 'Typography';

export default Typography;
