'use client';

import React, { useEffect } from 'react';
import { theme } from '@/lib/theme';

export interface PlaybackSpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  min?: number;
  max?: number;
  step?: number;
  title?: string;
  slowLabel?: string;
  fastLabel?: string;
  className?: string;
  disabled?: boolean;
}

const PlaybackSpeedControl = React.forwardRef<HTMLInputElement, PlaybackSpeedControlProps>(
  ({ 
    speed, 
    onSpeedChange, 
    min = 0.25,
    max = 2.0,
    step = 0.25,
    title = "Playback Speed Control",
    slowLabel = "Slow",
    fastLabel = "Fast",
    className = '',
    disabled = false,
    ...props 
  }, ref) => {
    const markers = [];
    for (let i = min; i <= max; i += step) {
      markers.push(i);
    }

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: theme.borderRadius.lg,
      border: `1px solid ${theme.colors.border.primary}`,
      fontFamily: theme.typography.fontFamily.primary,
      opacity: disabled ? 0.6 : 1,
    };

    const headerStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    };

    const titleStyle: React.CSSProperties = {
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.primary,
    };

    const speedDisplayStyle: React.CSSProperties = {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.accent.primary,
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.base,
    };

    const sliderContainerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.sm,
    };

    const labelsStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    };

    const indicatorStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.secondary,
    };

    const sliderTrackStyle: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.sm,
    };

    const sliderStyle: React.CSSProperties = {
      width: '100%',
      height: '6px',
      background: `linear-gradient(to right, 
        ${theme.colors.success.primary} 0%, 
        ${theme.colors.accent.primary} 50%, 
        ${theme.colors.error.primary} 100%)`,
      borderRadius: theme.borderRadius.full,
      outline: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
    };

    const markersStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.tertiary,
    };

    const markerStyle: React.CSSProperties = {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.text.tertiary,
    };

    const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newSpeed = parseFloat(e.target.value);
      onSpeedChange(newSpeed);

      // Update slider color based on speed
      const slider = e.target;
      const color = newSpeed < 1 
        ? theme.colors.success.primary 
        : newSpeed > 1 
        ? theme.colors.error.primary 
        : theme.colors.accent.primary;
      
      slider.style.setProperty('--slider-color', color);
    };

    useEffect(() => {
      const slider = document.querySelector('.speed-slider') as HTMLInputElement;
      if (slider) {
        const color = speed < 1 
          ? theme.colors.success.primary 
          : speed > 1 
          ? theme.colors.error.primary 
          : theme.colors.accent.primary;
        
        slider.style.setProperty('--slider-color', color);
      }
    }, [speed]);

    return (
      <div className={className} style={containerStyle}>
        <div style={headerStyle}>
          <label htmlFor="playback-speed" style={titleStyle}>
            {title}
          </label>
          <div style={speedDisplayStyle}>{speed}x</div>
        </div>
        
        <div style={sliderContainerStyle}>
          <div style={labelsStyle}>
            <span style={indicatorStyle}>
              <span>🐌</span>
              <span>{slowLabel}</span>
            </span>
            <span style={indicatorStyle}>
              <span>⚡</span>
              <span>{fastLabel}</span>
            </span>
          </div>
          
          <div style={sliderTrackStyle}>
            <input
              ref={ref}
              type="range"
              id="playback-speed"
              className="speed-slider"
              min={min}
              max={max}
              step={step}
              value={speed}
              style={sliderStyle}
              onChange={handleSpeedChange}
              disabled={disabled}
              {...props}
            />
            
            <div style={markersStyle}>
              {markers.map((marker, index) => (
                <span key={index} style={markerStyle}>
                  {marker}x
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PlaybackSpeedControl.displayName = 'PlaybackSpeedControl';

export default PlaybackSpeedControl;