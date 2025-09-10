'use client';

import React from 'react';
import { theme } from '@/lib/theme';

export interface SegmentOption {
  id: string;
  label: string;
  value: any;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<T = any> {
  options: SegmentOption[];
  value?: T;
  onChange?: (value: T, option: SegmentOption) => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ 
    options, 
    value, 
    onChange, 
    size = 'md', 
    fullWidth = false, 
    disabled = false, 
    className = '',
    ...props 
  }, ref) => {
    const activeIndex = options.findIndex(option => option.value === value);

    const sizeStyles = {
      sm: {
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        fontSize: theme.typography.fontSize.xs,
        minHeight: '32px',
      },
      md: {
        padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
        fontSize: theme.typography.fontSize.sm,
        minHeight: '40px',
      },
      lg: {
        padding: `${theme.spacing.md} ${theme.spacing.xl}`,
        fontSize: theme.typography.fontSize.base,
        minHeight: '48px',
      },
    };

    const currentSize = sizeStyles[size];

    const containerStyle: React.CSSProperties = {
      position: 'relative',
      display: 'inline-flex',
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.md,
      padding: '2px',
      fontFamily: theme.typography.fontFamily.primary,
      opacity: disabled ? 0.6 : 1,
      ...(fullWidth && { width: '100%' }),
    };

    const sliderStyle: React.CSSProperties = {
      position: 'absolute',
      top: '2px',
      left: activeIndex >= 0 ? `calc(${(activeIndex / options.length) * 100}% + 2px)` : '2px',
      width: `calc(${100 / options.length}% - 4px)`,
      height: 'calc(100% - 4px)',
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.base,
      transition: theme.transitions.fast,
      boxShadow: theme.shadows.sm,
      border: `1px solid ${theme.colors.border.primary}`,
    };

    const optionStyle: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      flex: 1,
      padding: currentSize.padding,
      fontSize: currentSize.fontSize,
      fontWeight: theme.typography.fontWeight.medium,
      border: 'none',
      background: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: theme.transitions.fast,
      borderRadius: theme.borderRadius.base,
      zIndex: 1,
      minHeight: currentSize.minHeight,
    };

    const getOptionTextColor = (option: SegmentOption, isActive: boolean): string => {
      if (option.disabled || disabled) {
        return theme.colors.text.quaternary;
      }
      return isActive ? theme.colors.text.primary : theme.colors.text.secondary;
    };

    const handleOptionClick = (option: SegmentOption) => {
      if (disabled || option.disabled) return;
      
      if (onChange) {
        onChange(option.value, option);
      }
    };

    return (
      <div
        ref={ref}
        className={className}
        style={containerStyle}
        role="tablist"
        {...props}
      >
        {/* Active Slider */}
        {activeIndex >= 0 && <div style={sliderStyle} />}
        
        {/* Options */}
        {options.map((option, index) => {
          const isActive = option.value === value;
          const isDisabled = option.disabled || disabled;
          
          return (
            <button
              key={option.id}
              role="tab"
              aria-selected={isActive}
              style={{
                ...optionStyle,
                color: getOptionTextColor(option, isActive),
              }}
              onClick={() => handleOptionClick(option)}
              disabled={isDisabled}
              onMouseEnter={(e) => {
                if (!isDisabled && !isActive) {
                  e.currentTarget.style.color = theme.colors.text.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (!isDisabled && !isActive) {
                  e.currentTarget.style.color = theme.colors.text.secondary;
                }
              }}
            >
              {option.icon && (
                <span style={{ fontSize: size === 'sm' ? '12px' : '14px' }}>
                  {option.icon}
                </span>
              )}
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    );
  }
);

SegmentedControl.displayName = 'SegmentedControl';

export default SegmentedControl;