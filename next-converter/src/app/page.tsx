'use client';

import { useEffect, useState, useRef } from 'react';

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
  const [supportedFormats, setSupportedFormats] = useState<SupportedFormats | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>('');
  const [availableFormats, setAvailableFormats] = useState<string[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState<string>('');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // 지원하는 포맷 정보 로드
  useEffect(() => {
    loadSupportedFormats();
  }, []);

  const loadSupportedFormats = async () => {
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
  };

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
      setSelectedFile(file);
      const detectedType = detectFileType(file.name);
      setFileType(detectedType);
      
      // 파일 타입에 따라 출력 형식 필터링
      if (detectedType && supportedFormats) {
        filterOutputFormats(detectedType);
      }
    } else {
      setSelectedFile(null);
      setFileType(null);
      setOutputFormat('');
    }
  };

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
    
    // 비디오에서 이미지/오디오 추출
    if (inputType === 'video') {
      filteredFormats.push(...supportedFormats.image.output, ...supportedFormats.audio.output);
    }
    
    // 중복 제거 및 정렬
    const uniqueFormats = Array.from(new Set(filteredFormats)).sort();
    setAvailableFormats(uniqueFormats);
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

      // 옵션 값들 추가
      const resolution = (document.getElementById('resolution') as HTMLSelectElement)?.value;
      const fps = (document.getElementById('fps') as HTMLInputElement)?.value;
      const bitrate = (document.getElementById('bitrate') as HTMLSelectElement)?.value;
      const videoQuality = (document.getElementById('videoQuality') as HTMLSelectElement)?.value;
      const sampleRate = (document.getElementById('sampleRate') as HTMLSelectElement)?.value;
      const channels = (document.getElementById('channels') as HTMLSelectElement)?.value;
      const audioQuality = (document.getElementById('audioQuality') as HTMLSelectElement)?.value;
      const imageResolution = (document.getElementById('imageResolution') as HTMLSelectElement)?.value;
      const imageQuality = (document.getElementById('imageQuality') as HTMLSelectElement)?.value;

      if (resolution) formData.append('resolution', resolution);
      if (fps) formData.append('fps', fps);
      if (bitrate) formData.append('bitrate', bitrate);
      if (videoQuality) formData.append('quality', videoQuality);
      if (sampleRate) formData.append('sampleRate', sampleRate);
      if (channels) formData.append('channels', channels);
      if (audioQuality) formData.append('quality', audioQuality);
      if (imageResolution) formData.append('resolution', imageResolution);
      if (imageQuality) formData.append('quality', imageQuality);

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

  return (
    <div className="container" suppressHydrationWarning={true}>
      <h1>범용 파일 변환기</h1>
      <p className="subtitle">비디오, 오디오, 이미지 파일을 다양한 형식으로 변환하세요</p>
      
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="file-section">
          <label htmlFor="fileInput">파일 업로드:</label>
          <input 
            ref={fileInputRef}
            type="file" 
            id="fileInput" 
            onChange={handleFileChange}
            required 
          />
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

        {/* 비디오 옵션 */}
        {fileType === 'video' && (
          <div className="options-section">
            <h3>비디오 설정</h3>
            <div className="option-row">
              <label htmlFor="resolution">해상도:</label>
              <select id="resolution">
                <option value="original">원본</option>
                <option value="640x360">640x360</option>
                <option value="1280x720">1280x720</option>
                <option value="1920x1080">1920x1080</option>
              </select>
            </div>
            <div className="option-row">
              <label htmlFor="fps">프레임레이트(FPS):</label>
              <input type="number" id="fps" min="1" max="60" defaultValue="30" />
            </div>
            <div className="option-row">
              <label htmlFor="bitrate">비트레이트:</label>
              <select id="bitrate">
                <option value="">자동</option>
                <option value="1000k">1000k</option>
                <option value="2000k">2000k</option>
                <option value="5000k">5000k</option>
              </select>
            </div>
            <div className="option-row">
              <label htmlFor="videoQuality">품질:</label>
              <select id="videoQuality">
                <option value="보통">보통</option>
                <option value="낮음">낮음 (파일 크기 작음)</option>
                <option value="높음">높음 (파일 크기 큼)</option>
              </select>
            </div>
          </div>
        )}

        {/* 오디오 옵션 */}
        {fileType === 'audio' && (
          <div className="options-section">
            <h3>오디오 설정</h3>
            <div className="option-row">
              <label htmlFor="sampleRate">샘플레이트:</label>
              <select id="sampleRate">
                <option value="">원본</option>
                <option value="22050">22050 Hz</option>
                <option value="44100">44100 Hz</option>
                <option value="48000">48000 Hz</option>
              </select>
            </div>
            <div className="option-row">
              <label htmlFor="channels">채널:</label>
              <select id="channels">
                <option value="">원본</option>
                <option value="1">모노</option>
                <option value="2">스테레오</option>
              </select>
            </div>
            <div className="option-row">
              <label htmlFor="audioQuality">품질:</label>
              <select id="audioQuality">
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
              <select id="imageResolution">
                <option value="original">원본</option>
                <option value="800x600">800x600</option>
                <option value="1024x768">1024x768</option>
                <option value="1920x1080">1920x1080</option>
              </select>
            </div>
            <div className="option-row">
              <label htmlFor="imageQuality">품질:</label>
              <select id="imageQuality">
                <option value="보통">보통</option>
                <option value="낮음">낮음 (파일 크기 작음)</option>
                <option value="높음">높음 (파일 크기 큼)</option>
              </select>
            </div>
          </div>
        )}

        <button type="submit" disabled={isConverting}>
          {isConverting ? '변환 중...' : '변환하기'}
        </button>
      </form>

      {/* 변환 진행 상태 */}
      {isConverting && (
        <div className="conversion-progress">
          <div className="progress-spinner"></div>
          <p>{conversionProgress}</p>
          <p className="progress-note">변환 시간은 파일 크기와 형식에 따라 달라질 수 있습니다.</p>
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
