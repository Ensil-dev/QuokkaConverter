'use client';

import React, { forwardRef } from 'react';
import { theme } from '@/lib/theme';

export interface CustomFileInputProps {
  id: string;
  accept?: string;
  multiple?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  selectedFiles?: FileList | null;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

const CustomFileInput = forwardRef<HTMLInputElement, CustomFileInputProps>(
  ({ 
    id, 
    accept, 
    multiple, 
    onChange, 
    required, 
    selectedFiles, 
    className = '',
    placeholder = "Choose files",
    disabled = false,
    ...props 
  }, ref) => {
    const getDisplayText = () => {
      if (!selectedFiles || selectedFiles.length === 0) {
        return placeholder;
      }
      
      if (selectedFiles.length === 1) {
        return selectedFiles[0].name;
      }
      
      return `${selectedFiles.length} files selected`;
    };

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.sm,
      fontFamily: theme.typography.fontFamily.primary,
    };

    const labelStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      backgroundColor: theme.colors.background.secondary,
      border: `1px solid ${theme.colors.border.primary}`,
      borderRadius: theme.borderRadius.base,
      color: theme.colors.text.primary,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: theme.transitions.fast,
      opacity: disabled ? 0.6 : 1,
      minHeight: '48px',
    };

    const textStyle: React.CSSProperties = {
      flex: 1,
      color: selectedFiles && selectedFiles.length > 0 
        ? theme.colors.text.primary 
        : theme.colors.text.secondary,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    };

    const arrowStyle: React.CSSProperties = {
      marginLeft: theme.spacing.sm,
      color: theme.colors.text.tertiary,
      transform: 'rotate(0deg)',
      transition: theme.transitions.fast,
    };

    return (
      <div className={className} style={containerStyle}>
        <input
          ref={ref}
          type="file"
          id={id}
          accept={accept}
          multiple={multiple}
          onChange={onChange}
          required={required}
          disabled={disabled}
          style={{ display: 'none' }}
          {...props}
        />
        <label 
          htmlFor={id} 
          style={labelStyle}
          onMouseEnter={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = theme.colors.accent.primary;
              e.currentTarget.style.backgroundColor = theme.colors.background.tertiary;
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = theme.colors.border.primary;
              e.currentTarget.style.backgroundColor = theme.colors.background.secondary;
            }
          }}
        >
          <span style={textStyle}>{getDisplayText()}</span>
          <span style={arrowStyle}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path 
                fillRule="evenodd" 
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </span>
        </label>
        
        {selectedFiles && selectedFiles.length > 0 && (
          <div style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
            padding: `0 ${theme.spacing.sm}`,
          }}>
            {multiple && selectedFiles.length > 1 
              ? `${selectedFiles.length} files selected`
              : `File: ${selectedFiles[0].name} (${(selectedFiles[0].size / 1024 / 1024).toFixed(2)} MB)`
            }
          </div>
        )}
      </div>
    );
  }
);

CustomFileInput.displayName = 'CustomFileInput';

export default CustomFileInput;