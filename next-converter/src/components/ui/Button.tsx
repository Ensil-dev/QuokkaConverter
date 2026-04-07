'use client';

import React from 'react';
import { theme } from '@/lib/theme';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, className = '', ...props }, ref) => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: theme.typography.fontWeight.linear,
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      textDecoration: 'none',
      userSelect: 'none' as const,
      transition: theme.transitions.fast,
      borderRadius: theme.borderRadius.md,
    };

    const sizeStyles = {
      sm: {
        fontSize: theme.typography.fontSize.sm,
        lineHeight: theme.typography.lineHeight.button,
        minHeight: '32px',
        padding: '0 12px',
      },
      md: {
        fontSize: theme.typography.fontSize.md,
        lineHeight: theme.typography.lineHeight.buttonLarge,
        minHeight: '40px',
        padding: '0 16px',
      },
      lg: {
        fontSize: theme.typography.fontSize.lg,
        lineHeight: theme.typography.lineHeight.buttonLarge,
        minHeight: '48px',
        padding: '0 24px',
      }
    };

    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.button.primaryBg,
        color: theme.colors.button.primaryText,
        border: `0.75px solid ${theme.colors.button.primaryBg}`,
      },
      ghost: {
        backgroundColor: theme.colors.button.ghostBg,
        color: theme.colors.button.ghostText,
        border: '0px none',
        borderRadius: theme.borderRadius.lg,
      }
    };

    const hoverStyles = {
      primary: {
        backgroundColor: 'rgb(220, 220, 220)',
        transform: 'translateY(-1px)',
      },
      ghost: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: 'rgb(200, 200, 200)',
      }
    };

    const activeStyles = {
      primary: {
        transform: 'translateY(0px)',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      ghost: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      }
    };

    const combinedStyles = {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };

    return (
      <button
        ref={ref}
        className={className}
        style={combinedStyles}
        onMouseEnter={(e) => {
          Object.assign(e.currentTarget.style, hoverStyles[variant]);
        }}
        onMouseLeave={(e) => {
          Object.assign(e.currentTarget.style, variantStyles[variant]);
        }}
        onMouseDown={(e) => {
          Object.assign(e.currentTarget.style, {
            ...variantStyles[variant],
            ...activeStyles[variant],
          });
        }}
        onMouseUp={(e) => {
          Object.assign(e.currentTarget.style, hoverStyles[variant]);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;