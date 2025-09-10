'use client';

import React from 'react';
import { theme } from '@/lib/theme';
import Typography from './Typography';
import Button from './Button';

export interface HeroAction {
  id: string;
  label: string;
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  href?: string;
}

export interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: HeroAction[];
  backgroundImage?: string;
  backgroundVideo?: string;
  overlay?: boolean;
  overlayOpacity?: number;
  centerContent?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children?: React.ReactNode;
}

const Hero = React.forwardRef<HTMLElement, HeroProps>(
  ({
    title,
    subtitle,
    description,
    actions = [],
    backgroundImage,
    backgroundVideo,
    overlay = true,
    overlayOpacity = 0.6,
    centerContent = true,
    size = 'lg',
    className = '',
    children,
    ...props
  }, ref) => {
    const sizeStyles = {
      sm: {
        minHeight: '400px',
        padding: `${theme.spacing['4xl']} ${theme.spacing.xl}`,
      },
      md: {
        minHeight: '500px',
        padding: `${theme.spacing['5xl']} ${theme.spacing.xl}`,
      },
      lg: {
        minHeight: '600px',
        padding: `${theme.spacing['6xl']} ${theme.spacing.xl}`,
      },
      xl: {
        minHeight: '100vh',
        padding: `${theme.spacing['6xl']} ${theme.spacing.xl}`,
      }
    };

    const heroStyle: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: centerContent ? 'center' : 'flex-start',
      justifyContent: 'center',
      backgroundColor: theme.colors.background.primary,
      fontFamily: theme.typography.fontFamily.primary,
      overflow: 'hidden',
      ...sizeStyles[size],
    };

    const backgroundStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -2,
    };

    const overlayStyle: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: `rgba(8, 9, 10, ${overlayOpacity})`,
      zIndex: -1,
    };

    const containerStyle: React.CSSProperties = {
      maxWidth: theme.layout.maxWidth,
      width: '100%',
      textAlign: centerContent ? 'center' : 'left',
      zIndex: 1,
    };

    const titleStyle: React.CSSProperties = {
      background: `linear-gradient(135deg, ${theme.colors.text.primary}, ${theme.colors.text.secondary})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: theme.spacing.lg,
    };

    const subtitleStyle: React.CSSProperties = {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.accent.primary,
      marginBottom: theme.spacing.md,
      textTransform: 'uppercase' as const,
      letterSpacing: '2px',
    };

    const descriptionStyle: React.CSSProperties = {
      fontSize: theme.typography.fontSize.lg,
      lineHeight: theme.typography.lineHeight.relaxed,
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing['2xl'],
      maxWidth: '600px',
      margin: centerContent ? `0 auto ${theme.spacing['2xl']}` : `0 0 ${theme.spacing['2xl']}`,
    };

    const actionsStyle: React.CSSProperties = {
      display: 'flex',
      gap: theme.spacing.lg,
      flexWrap: 'wrap' as const,
      justifyContent: centerContent ? 'center' : 'flex-start',
    };

    const handleActionClick = (action: HeroAction) => {
      if (action.onClick) {
        action.onClick();
      } else if (action.href) {
        window.location.href = action.href;
      }
    };

    return (
      <section
        ref={ref}
        className={className}
        style={heroStyle}
        {...props}
      >
        {/* Background */}
        {(backgroundImage || backgroundVideo) && (
          <div style={backgroundStyle}>
            {backgroundVideo ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              >
                <source src={backgroundVideo} type="video/mp4" />
              </video>
            ) : backgroundImage ? (
              <img
                src={backgroundImage}
                alt="Hero background"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : null}
          </div>
        )}

        {/* Overlay */}
        {overlay && (backgroundImage || backgroundVideo) && (
          <div style={overlayStyle} />
        )}

        {/* Content */}
        <div style={containerStyle}>
          {subtitle && (
            <div style={subtitleStyle}>
              {subtitle}
            </div>
          )}
          
          <Typography 
            variant={size === 'xl' ? 'h1' : size === 'lg' ? 'h1' : 'h2'} 
            style={titleStyle}
            as="h1"
          >
            {title}
          </Typography>

          {description && (
            <div style={descriptionStyle}>
              {description}
            </div>
          )}

          {actions.length > 0 && (
            <div style={actionsStyle}>
              {actions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant || 'primary'}
                  size={action.size || 'lg'}
                  onClick={() => handleActionClick(action)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {children && (
            <div style={{ marginTop: theme.spacing['2xl'] }}>
              {children}
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            width: '200px',
            height: '200px',
            background: `radial-gradient(circle, ${theme.colors.accent.primary}20, transparent)`,
            borderRadius: '50%',
            filter: 'blur(60px)',
            zIndex: -1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '10%',
            width: '150px',
            height: '150px',
            background: `radial-gradient(circle, ${theme.colors.accent.hover}15, transparent)`,
            borderRadius: '50%',
            filter: 'blur(40px)',
            zIndex: -1,
          }}
        />
      </section>
    );
  }
);

Hero.displayName = 'Hero';

export default Hero;