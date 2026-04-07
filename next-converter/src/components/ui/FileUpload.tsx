'use client';

import React, { useRef, useState, useCallback } from 'react';
import { theme } from '@/lib/theme';
import Typography from './Typography';
import Button from './Button';

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onFilesSelect: (files: File[]) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  variant?: 'dropzone' | 'button';
  showPreview?: boolean;
}

const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  ({
    accept,
    multiple = false,
    maxSize,
    maxFiles = 10,
    onFilesSelect,
    onError,
    className = '',
    disabled = false,
    children,
    variant = 'dropzone',
    showPreview = true,
    ...props
  }, ref) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFiles = useCallback((files: File[]): File[] => {
      const validFiles: File[] = [];
      
      for (const file of files) {
        // Check file size
        if (maxSize && file.size > maxSize) {
          onError?.(`파일 "${file.name}"이 최대 크기(${formatFileSize(maxSize)})를 초과합니다.`);
          continue;
        }
        
        // Check file count
        if (validFiles.length >= maxFiles) {
          onError?.(`최대 ${maxFiles}개 파일까지만 선택할 수 있습니다.`);
          break;
        }
        
        validFiles.push(file);
      }
      
      return validFiles;
    }, [maxSize, maxFiles, onError]);

    const handleFileSelect = useCallback((files: FileList | null) => {
      if (!files || files.length === 0) return;
      
      const fileArray = Array.from(files);
      const validFiles = validateFiles(fileArray);
      
      if (validFiles.length > 0) {
        setSelectedFiles(prev => multiple ? [...prev, ...validFiles] : validFiles);
        onFilesSelect(validFiles);
      }
    }, [multiple, validateFiles, onFilesSelect]);

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      
      if (disabled) return;
      
      const files = e.dataTransfer.files;
      handleFileSelect(files);
    }, [disabled, handleFileSelect]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileSelect(e.target.files);
    }, [handleFileSelect]);

    const openFileDialog = useCallback(() => {
      if (!disabled) {
        fileInputRef.current?.click();
      }
    }, [disabled]);

    const removeFile = useCallback((index: number) => {
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }, []);

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const dropzoneStyle: React.CSSProperties = {
      border: `2px dashed ${isDragOver ? theme.colors.accent.primary : theme.colors.border.primary}`,
      borderRadius: theme.borderRadius.md,
      backgroundColor: isDragOver 
        ? `${theme.colors.accent.primary}10` 
        : theme.colors.background.secondary,
      padding: theme.spacing['3xl'],
      textAlign: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: theme.transitions.base,
      fontFamily: theme.typography.fontFamily.primary,
      opacity: disabled ? 0.6 : 1,
    };

    const fileListStyle: React.CSSProperties = {
      marginTop: theme.spacing.lg,
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.sm,
    };

    const fileItemStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: theme.spacing.md,
      backgroundColor: theme.colors.background.tertiary,
      borderRadius: theme.borderRadius.base,
      border: `1px solid ${theme.colors.border.primary}`,
    };

    const fileInfoStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      flex: 1,
    };

    const removeButtonStyle: React.CSSProperties = {
      background: 'none',
      border: 'none',
      color: theme.colors.text.tertiary,
      cursor: 'pointer',
      padding: theme.spacing.sm,
      borderRadius: theme.borderRadius.base,
      transition: theme.transitions.fast,
      fontSize: '18px',
    };

    if (variant === 'button') {
      return (
        <div ref={ref} className={className} {...props}>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleInputChange}
            style={{ display: 'none' }}
            disabled={disabled}
          />
          <Button
            variant="primary"
            onClick={openFileDialog}
            disabled={disabled}
          >
            {children || '파일 선택'}
          </Button>
          
          {showPreview && selectedFiles.length > 0 && (
            <div style={fileListStyle}>
              {selectedFiles.map((file, index) => (
                <div key={`${file.name}-${index}`} style={fileItemStyle}>
                  <div style={fileInfoStyle}>
                    <Typography variant="body" color="primary" style={{ margin: 0 }}>
                      {file.name}
                    </Typography>
                    <Typography variant="small" color="tertiary" style={{ margin: 0 }}>
                      {formatFileSize(file.size)}
                    </Typography>
                  </div>
                  <button
                    style={removeButtonStyle}
                    onClick={() => removeFile(index)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors.background.primary;
                      e.currentTarget.style.color = theme.colors.text.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = theme.colors.text.tertiary;
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div ref={ref} className={className} {...props}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          style={{ display: 'none' }}
          disabled={disabled}
        />
        
        <div
          style={dropzoneStyle}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          {children || (
            <div>
              <div style={{ fontSize: '48px', marginBottom: theme.spacing.lg, opacity: 0.6 }}>
                📁
              </div>
              <Typography variant="h4" color="primary" style={{ marginBottom: theme.spacing.md }}>
                파일을 드롭하거나 클릭하여 선택
              </Typography>
              <Typography variant="body" color="secondary">
                {accept && `지원 형식: ${accept}`}
                {maxSize && ` • 최대 크기: ${formatFileSize(maxSize)}`}
                {multiple && ` • 최대 ${maxFiles}개 파일`}
              </Typography>
            </div>
          )}
        </div>

        {showPreview && selectedFiles.length > 0 && (
          <div style={fileListStyle}>
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} style={fileItemStyle}>
                <div style={fileInfoStyle}>
                  <Typography variant="body" color="primary" style={{ margin: 0 }}>
                    {file.name}
                  </Typography>
                  <Typography variant="small" color="tertiary" style={{ margin: 0 }}>
                    {formatFileSize(file.size)}
                  </Typography>
                </div>
                <button
                  style={removeButtonStyle}
                  onClick={() => removeFile(index)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.background.primary;
                    e.currentTarget.style.color = theme.colors.text.secondary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = theme.colors.text.tertiary;
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;