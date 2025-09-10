'use client';

import React from 'react';
import { theme } from '@/lib/theme';
import Typography from './Typography';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    variant = 'info', 
    title, 
    message, 
    dismissible = false, 
    onDismiss, 
    className = '', 
    icon,
    ...props 
  }, ref) => {
    const variantStyles = {
      info: {
        backgroundColor: `${theme.colors.accent.primary}15`,
        borderColor: `${theme.colors.accent.primary}40`,
        iconColor: theme.colors.accent.primary,
        defaultIcon: 'ℹ️',
      },
      success: {
        backgroundColor: '#10B98115',
        borderColor: '#10B98140',
        iconColor: '#10B981',
        defaultIcon: '✅',
      },
      warning: {
        backgroundColor: '#F5940615',
        borderColor: '#F5940640',
        iconColor: '#F59406',
        defaultIcon: '⚠️',
      },
      error: {
        backgroundColor: '#EF444415',
        borderColor: '#EF444440',
        iconColor: '#EF4444',
        defaultIcon: '❌',
      },
    };

    const currentVariant = variantStyles[variant];

    const alertStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      backgroundColor: currentVariant.backgroundColor,
      border: `1px solid ${currentVariant.borderColor}`,
      borderRadius: theme.borderRadius.md,
      fontFamily: theme.typography.fontFamily.primary,
      position: 'relative',
    };

    const iconStyle: React.CSSProperties = {
      flexShrink: 0,
      fontSize: theme.typography.fontSize.lg,
      color: currentVariant.iconColor,
      marginTop: '2px',
    };

    const contentStyle: React.CSSProperties = {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.xs,
    };

    const dismissButtonStyle: React.CSSProperties = {
      position: 'absolute',
      top: theme.spacing.md,
      right: theme.spacing.md,
      background: 'none',
      border: 'none',
      color: theme.colors.text.tertiary,
      cursor: 'pointer',
      fontSize: '18px',
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      transition: theme.transitions.fast,
      lineHeight: 1,
    };

    return (
      <div
        ref={ref}
        className={className}
        style={alertStyle}
        role="alert"
        {...props}
      >
        {/* Icon */}
        <div style={iconStyle}>
          {icon || currentVariant.defaultIcon}
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {title && (
            <Typography 
              variant="caption" 
              color="primary" 
              style={{ 
                margin: 0, 
                fontWeight: theme.typography.fontWeight.semibold,
                color: currentVariant.iconColor 
              }}
            >
              {title}
            </Typography>
          )}
          <Typography 
            variant="body" 
            color="primary" 
            style={{ 
              margin: 0,
              fontSize: theme.typography.fontSize.sm,
              lineHeight: theme.typography.lineHeight.base 
            }}
          >
            {message}
          </Typography>
        </div>

        {/* Dismiss Button */}
        {dismissible && (
          <button
            style={dismissButtonStyle}
            onClick={onDismiss}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.background.tertiary;
              e.currentTarget.style.color = theme.colors.text.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = theme.colors.text.tertiary;
            }}
            aria-label="Dismiss alert"
          >
            ×
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;