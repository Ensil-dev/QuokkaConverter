'use client';

import React from 'react';
import { theme } from '@/lib/theme';

export interface FormatSelectorProps {
  availableFormats: string[];
  selectedFormat: string;
  onFormatChange: (format: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const FormatSelector = React.forwardRef<HTMLSelectElement, FormatSelectorProps>(
  ({ 
    availableFormats, 
    selectedFormat, 
    onFormatChange, 
    label = "Output Format",
    placeholder = "Select format",
    required = true,
    disabled = false,
    className = '',
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
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      backgroundColor: theme.colors.background.secondary,
      border: `1px solid ${theme.colors.border.primary}`,
      borderRadius: theme.borderRadius.base,
      color: theme.colors.text.primary,
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.primary,
      outline: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      transition: theme.transitions.fast,
    };

    const optionStyle: React.CSSProperties = {
      backgroundColor: theme.colors.background.secondary,
      color: theme.colors.text.primary,
      padding: theme.spacing.sm,
    };

    return (
      <div className={className} style={containerStyle}>
        <label htmlFor="format-selector" style={labelStyle}>
          {label}:
        </label>
        <select
          ref={ref}
          id="format-selector"
          value={selectedFormat}
          onChange={(e) => onFormatChange(e.target.value)}
          required={required}
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
          <option value="" style={optionStyle}>
            {placeholder}
          </option>
          {availableFormats.map((format, index) => (
            <option key={`${format}-${index}`} value={format} style={optionStyle}>
              {format.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

FormatSelector.displayName = 'FormatSelector';

export default FormatSelector;