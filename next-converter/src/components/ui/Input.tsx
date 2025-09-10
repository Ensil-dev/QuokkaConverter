'use client';

import React from 'react';
import { theme } from '@/lib/theme';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: boolean;
  label?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error = false, label, helperText, ...props }, ref) => {
    const baseStyles = {
      width: '100%',
      backgroundColor: theme.colors.background.secondary,
      border: `1px solid ${theme.colors.border.primary}`,
      borderRadius: theme.borderRadius.base,
      padding: '12px 16px',
      color: theme.colors.text.primary,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.primary,
      transition: theme.transitions.fast,
      outline: 'none',
    };

    const focusStyles = {
      borderColor: theme.colors.accent.primary,
      boxShadow: `0 0 0 2px rgba(94, 106, 210, 0.2)`,
    };

    const errorStyles = {
      borderColor: '#EF4444',
      boxShadow: `0 0 0 2px rgba(239, 68, 68, 0.2)`,
    };

    const labelStyles = {
      display: 'block',
      marginBottom: theme.spacing.sm,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.secondary,
      fontFamily: theme.typography.fontFamily.primary,
    };

    const helperTextStyles = {
      marginTop: theme.spacing.xs,
      fontSize: theme.typography.fontSize.xs,
      color: error ? '#EF4444' : theme.colors.text.tertiary,
      fontFamily: theme.typography.fontFamily.primary,
    };

    const inputStyles = error 
      ? { ...baseStyles, ...errorStyles }
      : baseStyles;

    return (
      <div className={className}>
        {label && (
          <label style={labelStyles}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          style={inputStyles}
          onFocus={(e) => {
            if (!error) {
              Object.assign(e.currentTarget.style, focusStyles);
            }
          }}
          onBlur={(e) => {
            Object.assign(e.currentTarget.style, inputStyles);
          }}
          {...props}
        />
        {helperText && (
          <div style={helperTextStyles}>
            {helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;