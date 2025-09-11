'use client';

import React from 'react';
import { theme } from '@/lib/theme';
import { Button } from './Button';

export interface ConversionResultProps {
  title?: string;
  filename: string;
  fileSize: string;
  format: string;
  previewUrl?: string;
  previewType?: 'image' | 'video' | 'audio' | 'gif';
  onDownload: () => void;
  onReset?: () => void;
  downloadLabel?: string;
  resetLabel?: string;
  showPreview?: boolean;
  className?: string;
}

const ConversionResult = React.forwardRef<HTMLDivElement, ConversionResultProps>(
  ({ 
    title = "Conversion Result",
    filename,
    fileSize,
    format,
    previewUrl,
    previewType = 'image',
    onDownload,
    onReset,
    downloadLabel = "Download File",
    resetLabel = "Convert Another",
    showPreview = true,
    className = '',
    ...props 
  }, ref) => {
    const containerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.lg,
      padding: theme.spacing.xl,
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

    const titleStyle: React.CSSProperties = {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.text.primary,
      margin: 0,
    };

    const successIconStyle: React.CSSProperties = {
      fontSize: theme.typography.fontSize.xl,
      color: theme.colors.success.primary,
    };

    const previewContainerStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.base,
      border: `1px solid ${theme.colors.border.secondary}`,
      minHeight: '200px',
      overflow: 'hidden',
    };

    const previewImageStyle: React.CSSProperties = {
      maxWidth: '100%',
      maxHeight: '300px',
      borderRadius: theme.borderRadius.base,
      objectFit: 'contain',
    };

    const infoContainerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.sm,
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.base,
    };

    const infoRowStyle: React.CSSProperties = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    };

    const infoLabelStyle: React.CSSProperties = {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      color: theme.colors.text.secondary,
    };

    const infoValueStyle: React.CSSProperties = {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      color: theme.colors.text.primary,
    };

    const actionsStyle: React.CSSProperties = {
      display: 'flex',
      gap: theme.spacing.md,
      flexWrap: 'wrap',
    };

    const renderPreview = () => {
      if (!showPreview || !previewUrl) return null;

      switch (previewType) {
        case 'image':
        case 'gif':
          return (
            <div style={previewContainerStyle}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Converted file preview"
                style={previewImageStyle}
                loading="lazy"
              />
            </div>
          );
        case 'video':
          return (
            <div style={previewContainerStyle}>
              <video
                src={previewUrl}
                controls
                style={previewImageStyle}
                preload="metadata"
              />
            </div>
          );
        case 'audio':
          return (
            <div style={previewContainerStyle}>
              <audio
                src={previewUrl}
                controls
                style={{ width: '100%', maxWidth: '400px' }}
                preload="metadata"
              />
            </div>
          );
        default:
          return (
            <div style={previewContainerStyle}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: theme.spacing.sm,
                color: theme.colors.text.tertiary
              }}>
                <span style={{ fontSize: '48px' }}>📄</span>
                <span>File ready for download</span>
              </div>
            </div>
          );
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
          <span style={successIconStyle}>✅</span>
          <h2 style={titleStyle}>{title}</h2>
        </div>
        
        {renderPreview()}
        
        <div style={infoContainerStyle}>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Filename</span>
            <span style={infoValueStyle}>{filename}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>File Size</span>
            <span style={infoValueStyle}>{fileSize} MB</span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Format</span>
            <span style={infoValueStyle}>{format.toUpperCase()}</span>
          </div>
        </div>
        
        <div style={actionsStyle}>
          <Button
            variant="default"
            size="lg"
            onClick={onDownload}
            style={{ flex: '1 1 auto', minWidth: '150px' }}
          >
            📥 {downloadLabel}
          </Button>
          {onReset && (
            <Button
              variant="ghost"
              size="lg"
              onClick={onReset}
              style={{ flex: '1 1 auto', minWidth: '150px' }}
            >
              🔄 {resetLabel}
            </Button>
          )}
        </div>
      </div>
    );
  }
);

ConversionResult.displayName = 'ConversionResult';

export default ConversionResult;
