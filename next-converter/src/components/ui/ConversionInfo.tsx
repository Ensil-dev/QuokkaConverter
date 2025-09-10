'use client';

import React from 'react';
import { theme } from '@/lib/theme';

export interface ConversionInfoItem {
  label: string;
  value: React.ReactNode;
}

export interface ConversionInfoProps {
  title: string;
  items: ConversionInfoItem[];
  status?: 'ready' | 'converting' | 'completed';
  progress?: number;
  className?: string;
}

const ConversionInfo = React.forwardRef<HTMLDivElement, ConversionInfoProps>(
  ({ 
    title, 
    items, 
    status = 'ready',
    progress = 0,
    className = '',
    ...props 
  }, ref) => {
    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.border.primary}`,
      fontFamily: theme.typography.fontFamily.primary,
    };

    const headerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
    };

    const statusIconStyle: React.CSSProperties = {
      fontSize: theme.typography.fontSize.lg,
    };

    const titleStyle: React.CSSProperties = {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text.primary,
      margin: 0,
    };

    const progressBarStyle: React.CSSProperties = {
      width: '100%',
      height: '6px',
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.full,
      overflow: 'hidden',
      opacity: status === 'converting' ? 1 : 0,
      transition: theme.transitions.base,
    };

    const progressFillStyle: React.CSSProperties = {
      height: '100%',
      backgroundColor: theme.colors.accent.primary,
      borderRadius: theme.borderRadius.full,
      width: `${progress}%`,
      transition: theme.transitions.fast,
    };

    const itemsContainerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.sm,
    };

    const itemStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: `${theme.spacing.sm} 0`,
      borderBottom: `1px solid ${theme.colors.border.secondary}`,
    };

    const lastItemStyle: React.CSSProperties = {
      ...itemStyle,
      borderBottom: 'none',
    };

    const labelStyle: React.CSSProperties = {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.secondary,
    };

    const valueStyle: React.CSSProperties = {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text.primary,
      textAlign: 'right',
    };

    const getStatusIcon = () => {
      switch (status) {
        case 'ready':
          return '⚡';
        case 'converting':
          return '🔄';
        case 'completed':
          return '✅';
        default:
          return '📄';
      }
    };

    const getStatusColor = () => {
      switch (status) {
        case 'ready':
          return theme.colors.warning.primary;
        case 'converting':
          return theme.colors.accent.primary;
        case 'completed':
          return theme.colors.success.primary;
        default:
          return theme.colors.text.primary;
      }
    };

    return (
      <div
        ref={ref}
        className={className}
        style={containerStyle}
        {...props}
      >
        <div style={headerStyle}>
          <span style={{ ...statusIconStyle, color: getStatusColor() }}>
            {getStatusIcon()}
          </span>
          <h3 style={titleStyle}>{title}</h3>
        </div>
        
        {status === 'converting' && (
          <div style={progressBarStyle}>
            <div style={progressFillStyle} />
          </div>
        )}
        
        <div style={itemsContainerStyle}>
          {items.map((item, index) => (
            <div 
              key={index} 
              style={index === items.length - 1 ? lastItemStyle : itemStyle}
            >
              <span style={labelStyle}>{item.label}:</span>
              <span style={valueStyle}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

ConversionInfo.displayName = 'ConversionInfo';

export default ConversionInfo;
