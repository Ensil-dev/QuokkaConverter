'use client';

import React from 'react';
import { theme } from '@/lib/theme';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  image?: string;
  imageAlt?: string;
  imageHeight?: string;
  imagePosition?: 'top' | 'bottom' | 'left' | 'right';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    children, 
    className = '', 
    glass = false, 
    padding = 'md', 
    image,
    imageAlt = 'Card image',
    imageHeight = '200px',
    imagePosition = 'top',
    ...props 
  }, ref) => {
    const paddingStyles = {
      none: '0',
      sm: theme.spacing.sm,
      md: theme.spacing.xl,
      lg: theme.spacing['2xl'],
      xl: theme.spacing['3xl'],
    };

    const baseStyles = {
      borderRadius: theme.borderRadius.md,
      boxShadow: theme.shadows.base,
      fontFamily: theme.typography.fontFamily.primary,
      overflow: 'hidden' as const,
    };

    const cardStyles = glass 
      ? {
          ...baseStyles,
          ...theme.effects.glassEffect,
        }
      : {
          ...baseStyles,
          backgroundColor: theme.colors.background.secondary,
          border: `1px solid ${theme.colors.border.primary}`,
        };

    const contentStyles = {
      padding: paddingStyles[padding],
    };

    const imageStyles = {
      width: '100%',
      height: imageHeight,
      objectFit: 'cover' as const,
      display: 'block',
    };

    const flexStyles = {
      display: 'flex',
      height: '100%',
    };

    const renderImage = () => {
      if (!image) return null;
      return (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={imageAlt}
            style={imageStyles}
          />
        </>
      );
    };

    const renderContent = () => (
      <div style={contentStyles}>
        {children}
      </div>
    );

    // Handle different image positions
    if (image) {
      switch (imagePosition) {
        case 'top':
          return (
            <div ref={ref} className={className} style={cardStyles} {...props}>
              {renderImage()}
              {renderContent()}
            </div>
          );
        case 'bottom':
          return (
            <div ref={ref} className={className} style={cardStyles} {...props}>
              {renderContent()}
              {renderImage()}
            </div>
          );
        case 'left':
          return (
            <div ref={ref} className={className} style={{...cardStyles, ...flexStyles}} {...props}>
              <div style={{...imageStyles, height: 'auto', minHeight: '100%', width: imageHeight}}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={imageAlt} style={{...imageStyles, height: '100%'}} />
              </div>
              {renderContent()}
            </div>
          );
        case 'right':
          return (
            <div ref={ref} className={className} style={{...cardStyles, ...flexStyles}} {...props}>
              {renderContent()}
              <div style={{...imageStyles, height: 'auto', minHeight: '100%', width: imageHeight}}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={imageAlt} style={{...imageStyles, height: '100%'}} />
              </div>
            </div>
          );
        default:
          return (
            <div ref={ref} className={className} style={cardStyles} {...props}>
              {renderImage()}
              {renderContent()}
            </div>
          );
      }
    }

    return (
      <div
        ref={ref}
        className={className}
        style={{...cardStyles, ...contentStyles}}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
