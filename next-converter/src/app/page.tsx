'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { signOut } from 'next-auth/react';

interface SupportedFormats {
  video: { input: string[]; output: string[] };
  audio: { input: string[]; output: string[] };
  image: { input: string[]; output: string[] };
}

interface ConversionResult {
  url: string;
  filename: string;
  size: string;
}

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [supportedFormats, setSupportedFormats] = useState<SupportedFormats | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>('');
  const [availableFormats, setAvailableFormats] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState<string>('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 비디오 설정 옵션들 상태 관리
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [resolution, setResolution] = useState('original');
  const [fps, setFps] = useState(10);
  const [bitrate, setBitrate] = useState('');
  const [videoQuality, setVideoQuality] = useState('보통');
  
  // 오디오 설정 옵션들 상태 관리
  const [sampleRate, setSampleRate] = useState('');
  const [channels, setChannels] = useState('');
  const [audioQuality, setAudioQuality] = useState('보통');
  
  // 이미지 설정 옵션들 상태 관리
  const [imageResolution, setImageResolution] = useState('original');
  const [imageQuality, setImageQuality] = useState('보통');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // 인증 상태 확인
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/auth/signin';
    }
  }, [isAuthenticated, isLoading]);

  // 출력 형식 필터링
  const filterOutputFormats = (inputType: string) => {
    if (!supportedFormats) return;
    
    const filteredFormats: string[] = [];
    
    // 같은 타입 내 변환
    if (inputType === 'video') {
      filteredFormats.push(...supportedFormats.video.output);
    } else if (inputType === 'audio') {
      filteredFormats.push(...supportedFormats.audio.output);
    } else if (inputType === 'image') {
      filteredFormats.push(...supportedFormats.image.output);
    }
    
    // 비디오에서 이미지/오디오 추출 (실제로 지원하는 조합만)
    if (inputType === 'video') {
      // 비디오에서 이미지 추출 (첫 프레임)
      filteredFormats.push('jpg', 'png', 'webp');
      // 비디오에서 오디오 추출
      filteredFormats.push('mp3', 'aac', 'wav');
    }
    
    // 중복 제거 및 정렬
    const uniqueFormats = Array.from(new Set(filteredFormats)).sort();
    setAvailableFormats(uniqueFormats);
  };

  // 출력 형식 초기화
  const populateOutputFormats = (formats: SupportedFormats) => {
    const allFormats = [
      ...formats.video.output,
      ...formats.audio.output,
      ...formats.image.output
    ];
    // 중복 제거
    const uniqueFormats = Array.from(new Set(allFormats));
    setAvailableFormats(uniqueFormats);
  };

  const loadSupportedFormats = useCallback(async () => {
    try {
      const response = await fetch('/api/formats');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const formats = await response.json();
      setSupportedFormats(formats);
      populateOutputFormats(formats);
    } catch (error) {
      console.error('포맷 정보 로드 실패:', error);
      setError('지원하는 포맷 정보를 불러올 수 없습니다. 페이지를 새로고침해주세요.');
    }
  }, []);

  // 지원하는 포맷 정보 로드
  useEffect(() => {
    if (isAuthenticated) {
      loadSupportedFormats();
    }
  }, [loadSupportedFormats, isAuthenticated]);

  // 슬라이더 초기 색상 설정
  useEffect(() => {
    const slider = document.getElementById('playbackSpeed') as HTMLInputElement;
    if (slider) {
      slider.style.setProperty('--slider-color', 'var(--primary-color)');
    }
  }, [outputFormat]);

  // 로딩 중이거나 인증되지 않은 경우 로딩 화면 표시
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 파일 타입 감지
  const detectFileType = (filename: string): string | null => {
    if (!supportedFormats) return null;
    
    const ext = filename.split('.').pop()?.toLowerCase();
    if (!ext) return null;
    
    if (supportedFormats.video.input.includes(ext)) {
      return 'video';
    } else if (supportedFormats.audio.input.includes(ext)) {
      return 'audio';
    } else if (supportedFormats.image.input.includes(ext)) {
      return 'image';
    }
    
    return null;
  };

  // 파일 선택 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 제한 검증 (100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        setError('파일 크기가 너무 큽니다. 100MB 이하의 파일을 선택해주세요.');
        setSelectedFile(null);
        setFileType(null);
        setOutputFormat('');
        return;
      }
      
      setSelectedFile(file);
      const detectedType = detectFileType(file.name);
      
      if (!detectedType) {
        setError('지원하지 않는 파일 형식입니다. 다른 파일을 선택해주세요.');
        setSelectedFile(null);
        setFileType(null);
        setOutputFormat('');
        return;
      }
      
      setFileType(detectedType);
      setError(null);
      
      // 파일 타입에 따라 출력 형식 필터링
      if (detectedType && supportedFormats) {
        filterOutputFormats(detectedType);
      }
    } else {
      setSelectedFile(null);
      setFileType(null);
      setOutputFormat('');
      setError(null);
    }
  };

  // 변환 조합이 지원되는지 확인
  const isConversionSupported = (inputType: string | null, outputFormat: string): boolean => {
    if (!inputType || !outputFormat) return false;
    
    // 같은 타입 내 변환은 항상 지원
    if (inputType === 'video' && ['mp4', 'avi', 'mov', 'mkv', 'webm', 'gif', 'flv', 'wmv', 'm4v', '3gp'].includes(outputFormat)) {
      return true;
    }
    if (inputType === 'audio' && ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'opus'].includes(outputFormat)) {
      return true;
    }
    if (inputType === 'image' && ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff', 'webp'].includes(outputFormat)) {
      return true;
    }
    
    // 비디오에서 이미지/오디오 추출
    if (inputType === 'video' && ['jpg', 'png', 'webp', 'mp3', 'aac', 'wav'].includes(outputFormat)) {
      return true;
    }
    
    return false;
  };

  // 변환 실행
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile || !outputFormat) {
      setError('파일과 출력 형식을 선택해주세요.');
      return;
    }

    setIsConverting(true);
    setConversionProgress('파일 업로드 중...');
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('outputFormat', outputFormat);

      // 옵션 값들 추가 (state 값 사용)
      if (fileType === 'video') {
        if (resolution !== 'original') {
          formData.append('resolution', resolution);
        }
        if (fps !== 10) {
          formData.append('fps', fps.toString());
        }
        if (bitrate) {
          formData.append('bitrate', bitrate);
        }
        if (videoQuality !== '보통') {
          formData.append('quality', videoQuality);
        }
        if (outputFormat === 'gif' && playbackSpeed !== 1.0) {
          formData.append('playbackSpeed', playbackSpeed.toString());
        }
      } else if (fileType === 'audio') {
        if (sampleRate) formData.append('sampleRate', sampleRate);
        if (channels) formData.append('channels', channels);
        if (audioQuality && audioQuality !== '보통') formData.append('quality', audioQuality);
      } else if (fileType === 'image') {
        if (imageResolution && imageResolution !== 'original') formData.append('resolution', imageResolution);
        if (imageQuality && imageQuality !== '보통') formData.append('quality', imageQuality);
      }

      setConversionProgress('변환 처리 중...');

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: '알 수 없는 오류가 발생했습니다.' }));
        throw new Error(errorData.message || '변환 실패');
      }

      setConversionProgress('변환 완료! 파일 다운로드 준비 중...');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      setResult({
        url,
        filename: `converted.${outputFormat}`,
        size: (blob.size / 1024 / 1024).toFixed(2)
      });

    } catch (error: unknown) {
      console.error('변환 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '파일 변환 중 오류가 발생했습니다.';
      setError(errorMessage);
    } finally {
      setIsConverting(false);
      setConversionProgress('');
    }
  };

  // 파일 다운로드
  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = result.url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 재생속도 슬라이더 값 변경 핸들러
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setPlaybackSpeed(value);
    
    const speedDisplayElement = document.querySelector('.speed-display');
    const slider = e.target;
    
    if (speedDisplayElement) {
      speedDisplayElement.textContent = `${value}x`;
    }
    
    // 슬라이더 색상 변경 (시각적 피드백)
    if (value < 0.5) {
      slider.style.setProperty('--slider-color', '#17a2b8'); // 매우 느림 - 청록
    } else if (value < 1.0) {
      slider.style.setProperty('--slider-color', '#28a745'); // 느림 - 초록
    } else if (value > 1.0) {
      slider.style.setProperty('--slider-color', '#dc3545'); // 빠름 - 빨강
    } else {
      slider.style.setProperty('--slider-color', 'var(--primary-color)'); // 원본 - 기본색
    }
  };

  // 비디오 설정 옵션들 핸들러
  const handleResolutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setResolution(e.target.value);
  };

  const handleFpsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFps(parseInt(e.target.value));
  };

  const handleBitrateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBitrate(e.target.value);
  };

  const handleVideoQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVideoQuality(e.target.value);
  };

  // 오디오 옵션 핸들러들
  const handleSampleRateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSampleRate(e.target.value);
  };

  const handleChannelsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChannels(e.target.value);
  };

  const handleAudioQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAudioQuality(e.target.value);
  };

  // 이미지 옵션 핸들러들
  const handleImageResolutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setImageResolution(e.target.value);
  };

  const handleImageQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setImageQuality(e.target.value);
  };

  // 예상 변환 시간 계산 함수
  const getEstimatedTime = (fileSize: number, inputType: string | null, outputFormat: string, playbackSpeed: number, resolution: string, fps: number, videoQuality: string): string => {
    const sizeInMB = fileSize / 1024 / 1024;
    
    // 기본 변환 시간 (초 단위)
    let baseTime = 0;
    
    if (inputType === 'video') {
      if (outputFormat === 'gif') {
        baseTime = sizeInMB * 3; // GIF 변환은 시간이 오래 걸림
        
        // 재생속도에 따른 시간 조정
        if (playbackSpeed !== 1.0) {
          baseTime *= Math.abs(1.0 - playbackSpeed) * 0.5 + 1.0;
        }
      } else {
        baseTime = sizeInMB * 1.5; // 일반 비디오 변환
      }
      
      // 해상도에 따른 시간 조정
      if (resolution !== 'original') {
        const resMultiplier = resolution === '640x360' ? 0.7 : 
                             resolution === '1280x720' ? 1.2 : 
                             resolution === '1920x1080' ? 1.8 : 1.0;
        baseTime *= resMultiplier;
      }
      
      // 프레임레이트에 따른 시간 조정
      if (fps > 10) {
        const fpsMultiplier = fps < 10 ? 0.6 : fps > 10 ? 1.1 : 1.0;
        baseTime *= fpsMultiplier;
      }
      
      // 품질에 따른 시간 조정
      if (videoQuality === '높음') {
        baseTime *= 1.5;
      } else if (videoQuality === '낮음') {
        baseTime *= 0.7;
      }
    } else if (inputType === 'audio') {
      baseTime = sizeInMB * 0.5; // 오디오 변환은 상대적으로 빠름
    } else if (inputType === 'image') {
      baseTime = sizeInMB * 0.3; // 이미지 변환은 가장 빠름
    }
    
    // 최소/최대 시간 제한
    baseTime = Math.max(5, Math.min(baseTime, 300)); // 5초 ~ 5분
    
    if (baseTime < 30) {
      return `${Math.round(baseTime)}초`;
    } else if (baseTime < 60) {
      return `${Math.round(baseTime)}초`;
    } else {
      const minutes = Math.round(baseTime / 60);
      return `${minutes}분`;
    }
  };

  // 예상 파일 크기 계산 함수
  const getEstimatedFileSize = (fileSize: number, inputType: string | null, outputFormat: string, playbackSpeed: number, resolution: string, fps: number, bitrate: string, videoQuality: string): string => {
    const sizeInMB = fileSize / 1024 / 1024;
    
    if (inputType === 'video') {
      let estimatedSize = sizeInMB;
      
      // 비트레이트가 설정된 경우 우선적으로 사용 (GIF 제외)
      if (bitrate && outputFormat !== 'gif') {
        const bitrateValue = parseInt(bitrate.replace('k', ''));
        const estimatedDuration = estimateVideoDuration(sizeInMB, resolution, fps, videoQuality);
        const durationInSeconds = estimatedDuration * 60;
        
        // 비트레이트 기반 크기 계산 (kbps → MB)
        // 비트레이트(kbps) × 길이(초) ÷ 8 ÷ 1024 = MB
        estimatedSize = (bitrateValue * durationInSeconds) / 8 / 1024;
        
        // 재생속도에 따른 크기 조정
        if (playbackSpeed !== 1.0) {
          estimatedSize /= playbackSpeed;
        }
        
        // 해상도에 따른 크기 조정 (비트레이트 기반이므로 미세 조정만)
        if (resolution !== 'original') {
          const resMultiplier = resolution === '640x360' ? 0.8 : 
                               resolution === '1280x720' ? 0.9 : 
                               resolution === '1920x1080' ? 1.1 : 1.0;
          estimatedSize *= resMultiplier;
        }
        
        // 품질에 따른 미세 조정
        if (videoQuality === '높음') {
          estimatedSize *= 1.1;
        } else if (videoQuality === '낮음') {
          estimatedSize *= 0.9;
        }
      } else {
        // 비트레이트가 설정되지 않았거나 GIF인 경우 기존 로직 사용
        const estimatedDuration = estimateVideoDuration(sizeInMB, resolution, fps, videoQuality);
        
        if (outputFormat === 'gif') {
          // GIF는 특별한 계산 (비트레이트 무시)
          const gifSizePerMinute = getGifSizePerMinute(resolution, fps, videoQuality);
          estimatedSize = gifSizePerMinute * estimatedDuration;
          
          // 재생속도에 따른 크기 조정
          if (playbackSpeed !== 1.0) {
            estimatedSize /= playbackSpeed;
          }
        } else if (outputFormat === 'mp4') {
          // MP4는 효율적 압축
          estimatedSize *= 0.4;
        } else if (outputFormat === 'webm') {
          // WebM은 더 효율적
          estimatedSize *= 0.3;
        } else if (outputFormat === 'avi') {
          estimatedSize *= 0.8;
        } else if (outputFormat === 'mov') {
          estimatedSize *= 0.6;
        } else if (outputFormat === 'mkv') {
          estimatedSize *= 0.5;
        }
        
        // 재생속도에 따른 크기 조정 (GIF만 해당)
        if (outputFormat === 'gif' && playbackSpeed !== 1.0) {
          estimatedSize /= playbackSpeed;
        }
        
        // 해상도에 따른 크기 조정
        if (resolution !== 'original') {
          const resMultiplier = resolution === '640x360' ? 0.2 : 
                               resolution === '1280x720' ? 0.4 : 
                               resolution === '1920x1080' ? 0.8 : 1.0;
          estimatedSize *= resMultiplier;
        }
        
        // 프레임레이트에 따른 크기 조정
        if (fps > 10) {
          const fpsMultiplier = fps < 10 ? 0.6 : fps > 10 ? 1.1 : 1.0;
          estimatedSize *= fpsMultiplier;
        }
        
        // 품질에 따른 크기 조정
        if (videoQuality === '높음') {
          estimatedSize *= 1.2;
        } else if (videoQuality === '낮음') {
          estimatedSize *= 0.6;
        }
      }
      
      // 최소/최대 크기 제한
      estimatedSize = Math.max(0.1, Math.min(estimatedSize, sizeInMB * 2));
      
      if (estimatedSize < 1) {
        return `${(estimatedSize * 1024).toFixed(1)} KB`;
      } else if (estimatedSize < 1024) {
        return `${estimatedSize.toFixed(1)} MB`;
      } else {
        return `${(estimatedSize / 1024).toFixed(1)} GB`;
      }
    } else if (inputType === 'audio') {
      // 오디오는 길이에 비례하여 크기 계산
      const estimatedDuration = estimateAudioDuration(sizeInMB, videoQuality);
      let estimatedSize = sizeInMB;
      
      if (outputFormat === 'mp3') {
        // MP3: 약 1MB/분 (128kbps 기준)
        estimatedSize = estimatedDuration * 1.0;
      } else if (outputFormat === 'aac') {
        estimatedSize = estimatedDuration * 1.2;
      } else if (outputFormat === 'wav') {
        // WAV: 약 10MB/분 (무손실)
        estimatedSize = estimatedDuration * 10.0;
      } else if (outputFormat === 'flac') {
        estimatedSize = estimatedDuration * 5.0;
      } else if (outputFormat === 'ogg') {
        estimatedSize = estimatedDuration * 0.8;
      } else if (outputFormat === 'm4a') {
        estimatedSize = estimatedDuration * 1.5;
      }
      
      // 최소/최대 크기 제한
      estimatedSize = Math.max(0.1, Math.min(estimatedSize, sizeInMB * 2));
      
      if (estimatedSize < 1) {
        return `${(estimatedSize * 1024).toFixed(1)} KB`;
      } else if (estimatedSize < 1024) {
        return `${estimatedSize.toFixed(1)} MB`;
      } else {
        return `${(estimatedSize / 1024).toFixed(1)} GB`;
      }
    } else if (inputType === 'image') {
      // 이미지는 길이와 무관하게 크기 조정
      let estimatedSize = sizeInMB;
      
      if (outputFormat === 'webp') {
        // WebP는 매우 효율적인 압축
        if (fileType === 'gif') {
          // GIF에서 WebP로 변환 시 극적인 크기 감소
          estimatedSize *= 0.1; // 90% 크기 감소
        } else {
          // 일반적인 이미지에서 WebP 변환
          estimatedSize *= 0.25;
        }
      } else if (outputFormat === 'png') {
        estimatedSize *= 1.0;
      } else if (outputFormat === 'jpg' || outputFormat === 'jpeg') {
        estimatedSize *= 0.15;
      } else if (outputFormat === 'gif') {
        estimatedSize *= 0.5;
      } else if (outputFormat === 'bmp') {
        estimatedSize *= 1.8;
      } else if (outputFormat === 'tiff') {
        estimatedSize *= 1.2;
      }
      
      // 최소/최대 크기 제한
      estimatedSize = Math.max(0.1, Math.min(estimatedSize, sizeInMB * 2));
      
      if (estimatedSize < 1) {
        return `${(estimatedSize * 1024).toFixed(1)} KB`;
      } else if (estimatedSize < 1024) {
        return `${estimatedSize.toFixed(1)} MB`;
      } else {
        return `${(estimatedSize / 1024).toFixed(1)} GB`;
      }
    }
    
    // 기본값 (지원하지 않는 타입)
    return `${sizeInMB.toFixed(1)} MB`;
  };

  // 영상 길이 추정 함수
  const estimateVideoDuration = (sizeInMB: number, resolution: string, fps: number, quality: string): number => {
    // 기본 비트레이트 추정 (MB/분)
    let baseBitrate = 8; // 기본 8MB/분
    
    // 해상도에 따른 비트레이트 조정
    if (resolution === '640x360') {
      baseBitrate = 3;
    } else if (resolution === '1280x720') {
      baseBitrate = 6;
    } else if (resolution === '1920x1080') {
      baseBitrate = 12;
    }
    
    // 품질에 따른 조정
    if (quality === '높음') {
      baseBitrate *= 1.5;
    } else if (quality === '낮음') {
      baseBitrate *= 0.7;
    }
    
    // FPS에 따른 조정
    if (fps > 10) {
      baseBitrate *= 1.2;
    } else if (fps < 10) {
      baseBitrate *= 0.8;
    }
    
    return sizeInMB / baseBitrate; // 분 단위
  };

  // 오디오 길이 추정 함수
  const estimateAudioDuration = (sizeInMB: number, quality: string): number => {
    // 기본 비트레이트 추정 (MB/분)
    let baseBitrate = 1; // 기본 1MB/분
    
    // 품질에 따른 조정
    if (quality === '높음') {
      baseBitrate = 2;
    } else if (quality === '낮음') {
      baseBitrate = 0.5;
    }
    
    return sizeInMB / baseBitrate; // 분 단위
  };

  // GIF 크기 계산 함수 (분당 MB)
  const getGifSizePerMinute = (resolution: string, fps: number, quality: string): number => {
    let sizePerMinute = 20; // 기본 20MB/분
    
    // 해상도에 따른 조정
    if (resolution === '640x360') {
      sizePerMinute = 8;
    } else if (resolution === '1280x720') {
      sizePerMinute = 25;
    } else if (resolution === '1920x1080') {
      sizePerMinute = 50;
    }
    
    // FPS에 따른 조정
    if (fps > 10) {
      sizePerMinute *= 1.3;
    } else if (fps < 10) {
      sizePerMinute *= 0.7;
    }
    
    // 품질에 따른 조정
    if (quality === '높음') {
      sizePerMinute *= 1.4;
    } else if (quality === '낮음') {
      sizePerMinute *= 0.6;
    }
    
    return sizePerMinute;
  };

  return (
    <div className="container">
      {/* 헤더 영역 */}
      <div className="header">
        <div className="header-content">
          <h1>범용 파일 변환기</h1>
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
            <button 
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
              className="logout-btn"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      <p className="subtitle">비디오, 오디오, 이미지 파일을 다양한 형식으로 변환하세요</p>
      
      <form ref={formRef} onSubmit={handleSubmit} className="converter-form">
        <div className="file-section">
          <label htmlFor="fileInput">파일 업로드:</label>
          <input 
            ref={fileInputRef}
            type="file" 
            id="fileInput" 
            onChange={handleFileChange}
            required 
          />
          <p className="file-limit-note">최대 파일 크기: 100MB (로컬 실행 제한)</p>
          {selectedFile && (
            <div className="file-info">
              <p><strong>파일명:</strong> {selectedFile.name}</p>
              <p><strong>크기:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              <p><strong>타입:</strong> {fileType ? fileType.charAt(0).toUpperCase() + fileType.slice(1) : '지원하지 않는 형식'}</p>
            </div>
          )}
        </div>

        <div className="format-section">
          <label htmlFor="outputFormat">출력 형식:</label>
          <select 
            id="outputFormat" 
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            required
          >
            <option value="">변환할 형식을 선택하세요</option>
            {availableFormats.map((format, index) => (
              <option key={`${format}-${index}`} value={format}>
                {format.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* GIF 변환 시에만 재생속도 옵션을 컨테이너 상단에 표시 */}
        {fileType === 'video' && outputFormat === 'gif' && (
          <div className="speed-control-section">
            <div className="speed-header">
              <label htmlFor="playbackSpeed" className="speed-title">재생속도 조절</label>
              <div className="speed-display">{playbackSpeed}x</div>
            </div>
            <div className="speed-slider-container">
              <div className="speed-labels">
                <span className="speed-indicator slow">
                  <span className="speed-icon">🐌</span>
                  <span className="speed-text">느림</span>
                </span>
                <span className="speed-indicator fast">
                  <span className="speed-icon">⚡</span>
                  <span className="speed-text">빠름</span>
                </span>
              </div>
              <div className="slider-track">
                <input
                  type="range"
                  id="playbackSpeed"
                  min="0.25"
                  max="2.0"
                  step="0.25"
                  value={playbackSpeed}
                  className="speed-slider"
                  onChange={handleSpeedChange}
                />
                <div className="slider-markers">
                  <span className="marker">0.25x</span>
                  <span className="marker">0.5x</span>
                  <span className="marker">0.75x</span>
                  <span className="marker">1.0x</span>
                  <span className="marker">1.25x</span>
                  <span className="marker">1.5x</span>
                  <span className="marker">1.75x</span>
                  <span className="marker">2.0x</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 비디오 옵션 */}
        {fileType === 'video' && (
          <div className="options-section">
            <h3>비디오 설정</h3>
            <div className="option-row">
              <label htmlFor="resolution">해상도:</label>
              <select id="resolution" value={resolution} onChange={handleResolutionChange}>
                <option value="original">원본</option>
                <option value="640x360">640x360</option>
                <option value="1280x720">1280x720</option>
                <option value="1920x1080">1920x1080</option>
              </select>
            </div>
            <div className="option-row">
              <label htmlFor="fps">프레임레이트:</label>
              <input 
                type="number" 
                id="fps" 
                value={fps} 
                onChange={handleFpsChange}
                min="1" 
                max="60" 
              />
            </div>
            {/* GIF 변환 시에는 비트레이트 옵션 숨김 */}
            {outputFormat !== 'gif' && (
              <div className="option-row">
                <label htmlFor="bitrate">비트레이트:</label>
                <select id="bitrate" value={bitrate} onChange={handleBitrateChange}>
                  <option value="">자동</option>
                  <option value="1000k">1000k</option>
                  <option value="2000k">2000k</option>
                  <option value="5000k">5000k</option>
                </select>
              </div>
            )}
            <div className="option-row">
              <label htmlFor="videoQuality">품질:</label>
              <select id="videoQuality" value={videoQuality} onChange={handleVideoQualityChange}>
                <option value="보통">보통</option>
                <option value="낮음">낮음 (파일 크기 작음)</option>
                <option value="높음">높음 (파일 크기 큼)</option>
              </select>
              {outputFormat === 'gif' && (
                <span className="option-note">GIF는 품질 설정으로 크기를 조절합니다</span>
              )}
            </div>
          </div>
        )}

        {/* 오디오 옵션 */}
        {fileType === 'audio' && (
          <div className="options-section">
            <h3>오디오 설정</h3>
            <div className="option-row">
              <label htmlFor="sampleRate">샘플레이트:</label>
              <select id="sampleRate" value={sampleRate} onChange={handleSampleRateChange}>
                <option value="">원본</option>
                <option value="22050">22050 Hz</option>
                <option value="44100">44100 Hz</option>
                <option value="48000">48000 Hz</option>
              </select>
            </div>
            <div className="option-row">
              <label htmlFor="channels">채널:</label>
              <select id="channels" value={channels} onChange={handleChannelsChange}>
                <option value="">원본</option>
                <option value="1">모노</option>
                <option value="2">스테레오</option>
              </select>
            </div>
            <div className="option-row">
              <label htmlFor="audioQuality">품질:</label>
              <select id="audioQuality" value={audioQuality} onChange={handleAudioQualityChange}>
                <option value="보통">보통</option>
                <option value="낮음">낮음 (파일 크기 작음)</option>
                <option value="높음">높음 (파일 크기 큼)</option>
              </select>
            </div>
          </div>
        )}

        {/* 이미지 옵션 */}
        {fileType === 'image' && (
          <div className="options-section">
            <h3>이미지 설정</h3>
            <div className="option-row">
              <label htmlFor="imageResolution">해상도:</label>
              <select id="imageResolution" value={imageResolution} onChange={handleImageResolutionChange}>
                <option value="original">원본</option>
                <option value="800x600">800x600</option>
                <option value="1024x768">1024x768</option>
                <option value="1920x1080">1920x1080</option>
              </select>
            </div>
            <div className="option-row">
              <label htmlFor="imageQuality">품질:</label>
              <select id="imageQuality" value={imageQuality} onChange={handleImageQualityChange}>
                <option value="보통">보통</option>
                <option value="낮음">낮음 (파일 크기 작음)</option>
                <option value="높음">높음 (파일 크기 큼)</option>
              </select>
            </div>
          </div>
        )}

        <button type="submit" disabled={isConverting || !isConversionSupported(fileType, outputFormat)}>
          {isConverting ? '변환 중...' : '변환하기'}
        </button>
        
        {/* 지원하지 않는 변환 조합 안내 - 포맷을 선택했을 때만 표시 */}
        {outputFormat && fileType && !isConversionSupported(fileType, outputFormat) && (
          <div className="warning-message">
            <p>⚠️ 이 변환 조합은 현재 지원되지 않습니다. 다른 출력 형식을 선택해주세요.</p>
          </div>
        )}
      </form>

      {/* 변환 진행 상태 */}
      {isConverting && (
        <div className="conversion-progress">
          <div className="progress-spinner"></div>
          <p>{conversionProgress}</p>
          <p className="progress-note">변환 시간은 파일 크기와 형식에 따라 달라질 수 있습니다.</p>
        </div>
      )}

      {/* 변환 중일 때 결과 영역 미리 확보 */}
      {isConverting && (
        <div className="result-placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">⏳</div>
            <h2>변환 결과 준비 중...</h2>
            <p>변환이 완료되면 여기에 결과가 표시됩니다</p>
            <div className="placeholder-info">
              <div className="placeholder-item">
                <span className="placeholder-label">출력 형식:</span>
                <span className="placeholder-value">{outputFormat.toUpperCase()}</span>
              </div>
              <div className="placeholder-item">
                <span className="placeholder-label">예상 크기:</span>
                <span className="placeholder-value">{getEstimatedFileSize(selectedFile!.size, fileType, outputFormat, playbackSpeed, resolution, fps, bitrate, videoQuality)}</span>
              </div>
              <div className="placeholder-item">
                <span className="placeholder-label">예상 시간:</span>
                <span className="placeholder-value">{getEstimatedTime(selectedFile!.size, fileType, outputFormat, playbackSpeed, resolution, fps, videoQuality)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 파일 업로드 및 출력 형식 선택 완료 시 결과 영역 미리 확보 */}
      {selectedFile && outputFormat && !isConverting && !result && !error && (
        <div className="result-placeholder ready">
          <div className="placeholder-content">
            <div className="placeholder-icon">📁</div>
            <h2>변환 준비 완료</h2>
            <p>변환 버튼을 클릭하면 여기에 결과가 표시됩니다</p>
            <div className="placeholder-info">
              <div className="placeholder-item">
                <span className="placeholder-label">입력 파일:</span>
                <span className="placeholder-value">{selectedFile.name}</span>
              </div>
              <div className="placeholder-item">
                <span className="placeholder-label">출력 형식:</span>
                <span className="placeholder-value">{outputFormat.toUpperCase()}</span>
              </div>
              <div className="placeholder-item">
                <span className="placeholder-label">파일 크기:</span>
                <span className="placeholder-value">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
              <div className="placeholder-item">
                <span className="placeholder-label">예상 크기:</span>
                <span className="placeholder-value">{getEstimatedFileSize(selectedFile.size, fileType, outputFormat, playbackSpeed, resolution, fps, bitrate, videoQuality)}</span>
              </div>
              {fileType === 'video' && outputFormat === 'gif' && (
                <div className="placeholder-item">
                  <span className="placeholder-label">재생속도:</span>
                  <span className="placeholder-value">{playbackSpeed}x</span>
                </div>
              )}
              {fileType === 'video' && resolution !== 'original' && (
                <div className="placeholder-item">
                  <span className="placeholder-label">해상도:</span>
                  <span className="placeholder-value">{resolution}</span>
                </div>
              )}
              {fileType === 'video' && fps !== 10 && (
                <div className="placeholder-item">
                  <span className="placeholder-label">프레임레이트:</span>
                  <span className="placeholder-value">{fps} FPS</span>
                </div>
              )}
              {fileType === 'video' && bitrate && outputFormat !== 'gif' && (
                <div className="placeholder-item">
                  <span className="placeholder-label">비트레이트:</span>
                  <span className="placeholder-value">{bitrate}</span>
                </div>
              )}
              {fileType === 'video' && videoQuality !== '보통' && (
                <div className="placeholder-item">
                  <span className="placeholder-label">품질:</span>
                  <span className="placeholder-value">{videoQuality}</span>
                </div>
              )}
              <div className="placeholder-item">
                <span className="placeholder-label">예상 시간:</span>
                <span className="placeholder-value">{getEstimatedTime(selectedFile.size, fileType, outputFormat, playbackSpeed, resolution, fps, videoQuality)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GIF에서 WebP 변환 시 특별 안내 */}
      {selectedFile && selectedFile.name.toLowerCase().endsWith('.gif') && outputFormat === 'webp' && (
        <div className="info-message">
          <p>💡 <strong>GIF → WebP 변환 팁:</strong> WebP는 GIF보다 훨씬 효율적인 압축을 사용하여 파일 크기가 90% 이상 감소할 수 있습니다!</p>
        </div>
      )}

      {result && (
        <div className="result">
          <h2>변환 결과</h2>
          <div className="resultInfo">
            <p><strong>변환 완료!</strong></p>
            <p>파일 크기: {result.size} MB</p>
            <p>출력 형식: {outputFormat.toUpperCase()}</p>
          </div>
          <button onClick={handleDownload} className="download-btn">
            파일 다운로드
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <h3>오류 발생</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
