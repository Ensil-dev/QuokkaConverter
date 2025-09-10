'use client';

import React from 'react';
import { theme } from '@/lib/theme';

export interface VideoSettingsProps {
  resolution: string;
  onResolutionChange: (resolution: string) => void;
  fps: number;
  onFpsChange: (fps: number) => void;
  bitrate: string;
  onBitrateChange: (bitrate: string) => void;
  quality: string;
  onQualityChange: (quality: string) => void;
  showBitrate?: boolean;
  showGifNote?: boolean;
  title?: string;
  className?: string;
  disabled?: boolean;
}

export interface AudioSettingsProps {
  sampleRate: string;
  onSampleRateChange: (sampleRate: string) => void;
  channels: string;
  onChannelsChange: (channels: string) => void;
  quality: string;
  onQualityChange: (quality: string) => void;
  title?: string;
  className?: string;
  disabled?: boolean;
}

export interface ImageSettingsProps {
  resolution: string;
  onResolutionChange: (resolution: string) => void;
  quality: string;
  onQualityChange: (quality: string) => void;
  title?: string;
  className?: string;
  disabled?: boolean;
}

const SettingsSection: React.FC<{ title: string; children: React.ReactNode; className?: string; disabled?: boolean }> = ({
  title,
  children,
  className = '',
  disabled = false
}) => {
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

  const titleStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  };

  return (
    <div className={className} style={containerStyle}>
      <h3 style={titleStyle}>{title}</h3>
      {children}
    </div>
  );
};

const OptionRow: React.FC<{ 
  label: string; 
  children: React.ReactNode; 
  note?: string;
}> = ({ label, children, note }) => {
  const rowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
    flexWrap: 'wrap',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    minWidth: '100px',
    flex: '0 0 auto',
  };

  const inputContainerStyle: React.CSSProperties = {
    flex: '1 1 auto',
    minWidth: '150px',
  };

  const noteStyle: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    fontStyle: 'italic',
    marginTop: theme.spacing.xs,
  };

  return (
    <div>
      <div style={rowStyle}>
        <label style={labelStyle}>{label}:</label>
        <div style={inputContainerStyle}>{children}</div>
      </div>
      {note && <div style={noteStyle}>{note}</div>}
    </div>
  );
};

const SelectInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}> = ({ value, onChange, options, disabled = false }) => {
  const selectStyle: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: theme.colors.background.primary,
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

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={selectStyle}
      disabled={disabled}
      onFocus={(e) => {
        if (!disabled) {
          e.target.style.borderColor = theme.colors.accent.primary;
        }
      }}
      onBlur={(e) => {
        e.target.style.borderColor = theme.colors.border.primary;
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const NumberInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}> = ({ value, onChange, min, max, disabled = false }) => {
  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    backgroundColor: theme.colors.background.primary,
    border: `1px solid ${theme.colors.border.primary}`,
    borderRadius: theme.borderRadius.base,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.primary,
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'text',
    opacity: disabled ? 0.6 : 1,
    transition: theme.transitions.fast,
  };

  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      min={min}
      max={max}
      style={inputStyle}
      disabled={disabled}
      onFocus={(e) => {
        if (!disabled) {
          e.target.style.borderColor = theme.colors.accent.primary;
        }
      }}
      onBlur={(e) => {
        e.target.style.borderColor = theme.colors.border.primary;
      }}
    />
  );
};

export const VideoSettings = React.forwardRef<HTMLDivElement, VideoSettingsProps>(
  ({ 
    resolution, 
    onResolutionChange, 
    fps, 
    onFpsChange, 
    bitrate, 
    onBitrateChange, 
    quality, 
    onQualityChange,
    showBitrate = true,
    showGifNote = false,
    title = "Video Settings",
    className = '',
    disabled = false
  }, ref) => {
    const resolutionOptions = [
      { value: 'original', label: 'Original' },
      { value: '640x360', label: '640x360' },
      { value: '1280x720', label: '1280x720' },
      { value: '1920x1080', label: '1920x1080' },
    ];

    const bitrateOptions = [
      { value: '', label: 'Auto' },
      { value: '1000k', label: '1000k' },
      { value: '2000k', label: '2000k' },
      { value: '5000k', label: '5000k' },
    ];

    const qualityOptions = [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ];

    return (
      <SettingsSection ref={ref} title={title} className={className} disabled={disabled}>
        <OptionRow label="Resolution">
          <SelectInput
            value={resolution}
            onChange={onResolutionChange}
            options={resolutionOptions}
            disabled={disabled}
          />
        </OptionRow>
        
        <OptionRow label="Frame Rate">
          <NumberInput
            value={fps}
            onChange={onFpsChange}
            min={1}
            max={60}
            disabled={disabled}
          />
        </OptionRow>
        
        {showBitrate && (
          <OptionRow label="Bitrate">
            <SelectInput
              value={bitrate}
              onChange={onBitrateChange}
              options={bitrateOptions}
              disabled={disabled}
            />
          </OptionRow>
        )}
        
        <OptionRow 
          label="Quality"
          note={showGifNote ? "Higher quality may result in larger file sizes for GIF" : undefined}
        >
          <SelectInput
            value={quality}
            onChange={onQualityChange}
            options={qualityOptions}
            disabled={disabled}
          />
        </OptionRow>
      </SettingsSection>
    );
  }
);

export const AudioSettings = React.forwardRef<HTMLDivElement, AudioSettingsProps>(
  ({ 
    sampleRate, 
    onSampleRateChange, 
    channels, 
    onChannelsChange, 
    quality, 
    onQualityChange,
    title = "Audio Settings",
    className = '',
    disabled = false
  }, ref) => {
    const sampleRateOptions = [
      { value: '', label: 'Original' },
      { value: '22050', label: '22050 Hz' },
      { value: '44100', label: '44100 Hz' },
      { value: '48000', label: '48000 Hz' },
    ];

    const channelsOptions = [
      { value: '', label: 'Original' },
      { value: '1', label: 'Mono' },
      { value: '2', label: 'Stereo' },
    ];

    const qualityOptions = [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
    ];

    return (
      <SettingsSection ref={ref} title={title} className={className} disabled={disabled}>
        <OptionRow label="Sample Rate">
          <SelectInput
            value={sampleRate}
            onChange={onSampleRateChange}
            options={sampleRateOptions}
            disabled={disabled}
          />
        </OptionRow>
        
        <OptionRow label="Channels">
          <SelectInput
            value={channels}
            onChange={onChannelsChange}
            options={channelsOptions}
            disabled={disabled}
          />
        </OptionRow>
        
        <OptionRow label="Quality">
          <SelectInput
            value={quality}
            onChange={onQualityChange}
            options={qualityOptions}
            disabled={disabled}
          />
        </OptionRow>
      </SettingsSection>
    );
  }
);

export const ImageSettings = React.forwardRef<HTMLDivElement, ImageSettingsProps>(
  ({ 
    resolution, 
    onResolutionChange, 
    quality, 
    onQualityChange,
    title = "Image Settings",
    className = '',
    disabled = false
  }, ref) => {
    const resolutionOptions = [
      { value: 'original', label: 'Original' },
      { value: '800x600', label: '800x600' },
      { value: '1024x768', label: '1024x768' },
      { value: '1920x1080', label: '1920x1080' },
      { value: '3840x2160', label: '4K (3840x2160)' },
    ];

    const qualityOptions = [
      { value: 'low', label: 'Low (Small file)' },
      { value: 'medium', label: 'Medium (Balanced)' },
      { value: 'high', label: 'High (Best quality)' },
    ];

    return (
      <SettingsSection ref={ref} title={title} className={className} disabled={disabled}>
        <OptionRow label="Resolution">
          <SelectInput
            value={resolution}
            onChange={onResolutionChange}
            options={resolutionOptions}
            disabled={disabled}
          />
        </OptionRow>
        
        <OptionRow label="Quality">
          <SelectInput
            value={quality}
            onChange={onQualityChange}
            options={qualityOptions}
            disabled={disabled}
          />
        </OptionRow>
      </SettingsSection>
    );
  }
);

VideoSettings.displayName = 'VideoSettings';
AudioSettings.displayName = 'AudioSettings';
ImageSettings.displayName = 'ImageSettings';