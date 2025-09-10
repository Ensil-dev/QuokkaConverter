'use client';

import React from 'react';
import { theme } from '@/lib/theme';

export interface ModeSelectorOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface ModeSelectorProps {
  options: ModeSelectorOption[];
  selectedMode: string;
  onModeChange: (mode: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const ModeSelector = React.forwardRef<HTMLSelectElement, ModeSelectorProps>(
  ({ 
    options, 
    selectedMode, 
    onModeChange, 
    label = "Mode Selection",
    className = '',
    disabled = false,
    ...props 
  }, ref) => {
    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.sm,
      fontFamily: theme.typography.fontFamily.primary,
    };

    const labelStyle: React.CSSProperties = {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.primary,
    };

    const selectStyle: React.CSSProperties = {
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      backgroundColor: theme.colors.background.secondary,
      border: `1px solid ${theme.colors.border.primary}`,
      borderRadius: theme.borderRadius.base,
      color: theme.colors.text.primary,
      fontSize: theme.typography.fontSize.base,
      fontFamily: theme.typography.fontFamily.primary,
      fontWeight: theme.typography.fontWeight.medium,
      outline: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: theme.transitions.fast,
      minHeight: '48px',
    };

    const optionStyle: React.CSSProperties = {
      backgroundColor: theme.colors.background.secondary,
      color: theme.colors.text.primary,
      padding: theme.spacing.sm,
    };

    return (
      <div className={className} style={containerStyle}>
        <label htmlFor="mode-selector" style={labelStyle}>
          {label}:
        </label>
        <select
          ref={ref}
          id="mode-selector"
          value={selectedMode}
          onChange={(e) => onModeChange(e.target.value)}
          disabled={disabled}
          style={selectStyle}
          onFocus={(e) => {
            if (!disabled) {
              e.target.style.borderColor = theme.colors.accent.primary;
              e.target.style.boxShadow = `0 0 0 2px ${theme.colors.accent.primary}20`;
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = theme.colors.border.primary;
            e.target.style.boxShadow = 'none';
          }}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} style={optionStyle}>
              {option.icon ? `${option.icon} ${option.label}` : option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

ModeSelector.displayName = 'ModeSelector';

export default ModeSelector;