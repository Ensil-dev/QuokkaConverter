'use client';

import React from 'react';
import { theme } from '@/lib/theme';
import Typography from './Typography';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent';
  text?: string;
  className?: string;
  fullScreen?: boolean;
  overlay?: boolean;
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ 
    size = 'md', 
    color = 'accent', 
    text, 
    className = '', 
    fullScreen = false,
    overlay = false,
    ...props 
  }, ref) => {
    const sizeMap = {
      sm: '16px',
      md: '24px',
      lg: '32px',
      xl: '48px',
    };

    const colorMap = {
      primary: theme.colors.text.primary,
      secondary: theme.colors.text.secondary,
      accent: theme.colors.accent.primary,
    };

    const spinnerSize = sizeMap[size];
    const spinnerColor = colorMap[color];

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.md,
      fontFamily: theme.typography.fontFamily.primary,
      ...(fullScreen && {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: overlay ? 'rgba(8, 9, 10, 0.8)' : theme.colors.background.primary,
        backdropFilter: overlay ? 'blur(8px)' : 'none',
      }),
    };

    const spinnerStyle: React.CSSProperties = {
      width: spinnerSize,
      height: spinnerSize,
      border: `2px solid transparent`,
      borderTop: `2px solid ${spinnerColor}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    };

    // CSS 애니메이션을 위한 스타일 태그
    const spinKeyframes = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    return (
      <>
        <style>{spinKeyframes}</style>
        <div
          ref={ref}
          className={className}
          style={containerStyle}
          {...props}
        >
          <div style={spinnerStyle} />
          {text && (
            <Typography 
              variant="body" 
              color="secondary" 
              style={{ 
                margin: 0,
                fontSize: size === 'sm' ? theme.typography.fontSize.xs : theme.typography.fontSize.sm 
              }}
            >
              {text}
            </Typography>
          )}
        </div>
      </>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;