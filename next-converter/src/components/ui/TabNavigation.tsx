'use client';

import React from 'react';
import { theme } from '@/lib/theme';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabNavigationProps {
  items: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  fullWidth?: boolean;
}

const TabNavigation = React.forwardRef<HTMLDivElement, TabNavigationProps>(
  ({ 
    items, 
    activeTab, 
    onTabChange, 
    variant = 'default', 
    size = 'md', 
    className = '', 
    fullWidth = false,
    ...props 
  }, ref) => {
    const sizeStyles = {
      sm: {
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        fontSize: theme.typography.fontSize.xs,
        gap: theme.spacing.sm,
      },
      md: {
        padding: `${theme.spacing.md} ${theme.spacing.lg}`,
        fontSize: theme.typography.fontSize.sm,
        gap: theme.spacing.md,
      },
      lg: {
        padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
        fontSize: theme.typography.fontSize.base,
        gap: theme.spacing.lg,
      },
    };

    const currentSize = sizeStyles[size];

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      fontFamily: theme.typography.fontFamily.primary,
      ...(variant === 'bottom' && {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: theme.colors.background.glass,
        backdropFilter: theme.effects.backdropBlur,
        borderTop: `1px solid ${theme.colors.border.primary}`,
        zIndex: 50,
      }),
      ...(fullWidth && { width: '100%' }),
    };

    const getTabStyle = (item: TabItem, isActive: boolean): React.CSSProperties => {
      const baseStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: currentSize.gap,
        padding: currentSize.padding,
        fontSize: currentSize.fontSize,
        fontWeight: theme.typography.fontWeight.medium,
        cursor: item.disabled ? 'not-allowed' : 'pointer',
        transition: theme.transitions.fast,
        textDecoration: 'none',
        border: 'none',
        background: 'none',
        opacity: item.disabled ? 0.5 : 1,
        ...(fullWidth && { flex: 1, justifyContent: 'center' }),
      };

      switch (variant) {
        case 'pills':
          return {
            ...baseStyle,
            borderRadius: theme.borderRadius.full,
            backgroundColor: isActive 
              ? theme.colors.accent.primary 
              : 'transparent',
            color: isActive 
              ? 'white' 
              : theme.colors.text.secondary,
          };
        
        case 'underline':
          return {
            ...baseStyle,
            borderBottom: `2px solid ${isActive ? theme.colors.accent.primary : 'transparent'}`,
            color: isActive 
              ? theme.colors.text.primary 
              : theme.colors.text.secondary,
          };
        
        case 'bottom':
          return {
            ...baseStyle,
            flexDirection: 'column',
            gap: theme.spacing.xs,
            minHeight: '64px',
            color: isActive 
              ? theme.colors.accent.primary 
              : theme.colors.text.tertiary,
            backgroundColor: isActive 
              ? 'rgba(94, 106, 210, 0.1)' 
              : 'transparent',
          };
        
        default:
          return {
            ...baseStyle,
            backgroundColor: isActive 
              ? theme.colors.background.tertiary 
              : 'transparent',
            color: isActive 
              ? theme.colors.text.primary 
              : theme.colors.text.secondary,
            borderRadius: theme.borderRadius.base,
          };
      }
    };

    const getHoverStyle = (item: TabItem, isActive: boolean) => {
      if (item.disabled || isActive) return {};
      
      switch (variant) {
        case 'pills':
          return {
            backgroundColor: theme.colors.background.tertiary,
            color: theme.colors.text.primary,
          };
        case 'underline':
          return {
            color: theme.colors.text.primary,
          };
        case 'bottom':
          return {
            color: theme.colors.text.secondary,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          };
        default:
          return {
            backgroundColor: theme.colors.background.secondary,
            color: theme.colors.text.primary,
          };
      }
    };

    const handleTabClick = (item: TabItem) => {
      if (item.disabled) return;
      
      if (item.onClick) {
        item.onClick();
      } else if (item.href) {
        window.location.href = item.href;
      }
      
      if (onTabChange) {
        onTabChange(item.id);
      }
    };

    const badgeStyle: React.CSSProperties = {
      backgroundColor: theme.colors.accent.primary,
      color: 'white',
      fontSize: '10px',
      fontWeight: theme.typography.fontWeight.bold,
      padding: '2px 6px',
      borderRadius: theme.borderRadius.full,
      minWidth: '18px',
      height: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };

    return (
      <div
        ref={ref}
        className={className}
        style={containerStyle}
        role="tablist"
        {...props}
      >
        {items.map((item) => {
          const isActive = activeTab === item.id;
          const tabStyle = getTabStyle(item, isActive);
          const hoverStyle = getHoverStyle(item, isActive);

          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={isActive}
              style={tabStyle}
              onClick={() => handleTabClick(item)}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, hoverStyle);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, tabStyle);
              }}
              disabled={item.disabled}
            >
              {item.icon && (
                <span style={{ fontSize: size === 'sm' ? '14px' : '16px' }}>
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
              {item.badge && (
                <span style={badgeStyle}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }
);

TabNavigation.displayName = 'TabNavigation';

export default TabNavigation;