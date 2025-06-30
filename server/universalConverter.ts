import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export interface VideoOptions {
  resolution?: string;
  fps?: number;
  bitrate?: string;
  codec?: string;
  quality?: '낮음' | '보통' | '높음';
}

export interface AudioOptions {
  bitrate?: string;
  sampleRate?: number;
  channels?: number;
  codec?: string;
  quality?: '낮음' | '보통' | '높음';
}

export interface ImageOptions {
  resolution?: string;
  quality?: '낮음' | '보통' | '높음';
  format?: string;
}

export interface ConvertOptions extends VideoOptions, AudioOptions, ImageOptions {
  input: string;
  output?: string;
  format?: string;
}

// 지원하는 포맷 정의
export const SUPPORTED_FORMATS = {
  video: {
    input: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv', 'm4v', '3gp'],
    output: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'gif', 'flv', 'wmv', 'm4v', '3gp']
  },
  audio: {
    input: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'opus'],
    output: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'opus']
  },
  image: {
    input: ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff', 'webp', 'svg'],
    output: ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'tiff', 'webp']
  }
};

// 파일 타입 감지
function detectFileType(filename: string): 'video' | 'audio' | 'image' | null {
  const ext = path.extname(filename).toLowerCase().slice(1);
  
  if (SUPPORTED_FORMATS.video.input.includes(ext) || SUPPORTED_FORMATS.video.output.includes(ext)) {
    return 'video';
  } else if (SUPPORTED_FORMATS.audio.input.includes(ext) || SUPPORTED_FORMATS.audio.output.includes(ext)) {
    return 'audio';
  } else if (SUPPORTED_FORMATS.image.input.includes(ext) || SUPPORTED_FORMATS.image.output.includes(ext)) {
    return 'image';
  }
  
  return null;
}

// FFmpeg 의존성 확인
function checkFFmpeg(): boolean {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch {
    throw new Error('FFmpeg가 설치되어 있지 않습니다.');
  }
}

// 비디오 변환
function convertVideo(inputPath: string, outputPath: string, options: VideoOptions = {}): { output: string; size: number } {
  const {
    resolution,
    fps,
    bitrate,
    codec,
    quality
  } = options;

  const args = ['-i', inputPath];

  // 비디오 코덱 설정
  if (codec) {
    args.push('-c:v', codec);
  }

  // 해상도 설정
  if (resolution && resolution !== 'original') {
    args.push('-vf', `scale=${resolution}`);
  }

  // 프레임레이트 설정
  if (fps) {
    args.push('-r', String(fps));
  }

  // 비트레이트 설정
  if (bitrate) {
    args.push('-b:v', bitrate);
  }

  // 품질 설정 (CRF)
  if (quality && ['낮음', '보통', '높음'].includes(quality)) {
    const crfMap = { '낮음': 28, '보통': 23, '높음': 18 };
    args.push('-crf', String(crfMap[quality]));
  }

  // 오디오 코덱 설정 (비디오 파일의 경우)
  args.push('-c:a', 'aac');

  args.push('-y', outputPath);

  const result = spawnSync('ffmpeg', args, { 
    encoding: 'buffer', 
    maxBuffer: 1024 * 1024 * 100 
  });

  if (result.status !== 0) {
    throw new Error(`FFmpeg 오류: ${result.stderr.toString()}`);
  }

  return {
    output: outputPath,
    size: fs.statSync(outputPath).size
  };
}

// 오디오 변환
function convertAudio(inputPath: string, outputPath: string, options: AudioOptions = {}): { output: string; size: number } {
  const {
    bitrate,
    sampleRate,
    channels,
    codec,
    quality
  } = options;

  const args = ['-i', inputPath];

  // 오디오 코덱 설정
  if (codec) {
    args.push('-c:a', codec);
  }

  // 비트레이트 설정
  if (bitrate) {
    args.push('-b:a', bitrate);
  }

  // 샘플레이트 설정
  if (sampleRate) {
    args.push('-ar', String(sampleRate));
  }

  // 채널 설정
  if (channels) {
    args.push('-ac', String(channels));
  }

  // 품질 설정
  if (quality && ['낮음', '보통', '높음'].includes(quality)) {
    const qualityMap = { '낮음': 5, '보통': 3, '높음': 0 };
    args.push('-q:a', String(qualityMap[quality]));
  }

  args.push('-y', outputPath);

  const result = spawnSync('ffmpeg', args, { 
    encoding: 'buffer', 
    maxBuffer: 1024 * 1024 * 100 
  });

  if (result.status !== 0) {
    throw new Error(`FFmpeg 오류: ${result.stderr.toString()}`);
  }

  return {
    output: outputPath,
    size: fs.statSync(outputPath).size
  };
}

// 이미지 변환
function convertImage(inputPath: string, outputPath: string, options: ImageOptions = {}): { output: string; size: number } {
  const {
    resolution,
    quality,
    format
  } = options;

  const args = ['-i', inputPath];

  // 해상도 설정
  if (resolution && resolution !== 'original') {
    args.push('-vf', `scale=${resolution}`);
  }

  // 품질 설정 (JPEG의 경우)
  if (quality && ['낮음', '보통', '높음'].includes(quality)) {
    const qualityMap = { '낮음': 60, '보통': 80, '높음': 95 };
    args.push('-q:v', String(qualityMap[quality]));
  }

  args.push('-y', outputPath);

  const result = spawnSync('ffmpeg', args, { 
    encoding: 'buffer', 
    maxBuffer: 1024 * 1024 * 100 
  });

  if (result.status !== 0) {
    throw new Error(`FFmpeg 오류: ${result.stderr.toString()}`);
  }

  return {
    output: outputPath,
    size: fs.statSync(outputPath).size
  };
}

// GIF 특별 처리 (최적화)
function convertToGif(inputPath: string, outputPath: string, options: { resolution?: string; fps?: number; optimize?: number } = {}): { output: string; size: number } {
  const {
    resolution,
    fps = 10,
    optimize = 2
  } = options;

  let filters = '';
  if (resolution && resolution !== 'original') {
    filters = `scale=${resolution}`;
  }

  // FFmpeg로 GIF 생성
  const ffmpegArgs = [
    '-i', inputPath,
    '-r', String(fps),
    ...(filters ? ['-vf', filters] : []),
    '-f', 'gif', '-an', '-loop', '0', '-'
  ];

  const ffmpeg = spawnSync('ffmpeg', ffmpegArgs, { 
    encoding: 'buffer', 
    maxBuffer: 1024 * 1024 * 100 
  });

  if (ffmpeg.status !== 0) {
    throw new Error(`FFmpeg 오류: ${ffmpeg.stderr.toString()}`);
  }

  // gifsicle로 최적화 (있는 경우)
  try {
    const gifsicle = spawnSync('gifsicle', [
      `--optimize=${optimize}`
    ], { 
      input: ffmpeg.stdout, 
      encoding: 'buffer', 
      maxBuffer: 1024 * 1024 * 100 
    });

    if (gifsicle.status === 0) {
      fs.writeFileSync(outputPath, gifsicle.stdout);
    } else {
      // gifsicle이 없으면 FFmpeg 결과를 직접 저장
      fs.writeFileSync(outputPath, ffmpeg.stdout);
    }
  } catch {
    // gifsicle이 없으면 FFmpeg 결과를 직접 저장
    fs.writeFileSync(outputPath, ffmpeg.stdout);
  }

  return {
    output: outputPath,
    size: fs.statSync(outputPath).size
  };
}

// 메인 변환 함수
export async function convertFile(options: ConvertOptions): Promise<{ output: string; size: number }> {
  const {
    input,
    output,
    format,
    ...otherOptions
  } = options;

  // 입력 검증
  if (!input) throw new Error('입력 파일이 지정되지 않았습니다.');
  if (!fs.existsSync(input)) throw new Error(`입력 파일을 찾을 수 없습니다: ${input}`);
  
  // 출력 파일명 생성
  let outputPath = output;
  if (!outputPath) {
    const base = input.replace(/\.[^.]+$/, '');
    const ext = format || path.extname(input).slice(1);
    outputPath = `${base}.${ext}`;
  }

  // FFmpeg 확인
  checkFFmpeg();

  // 파일 타입 감지
  const inputType = detectFileType(input);
  const outputType = detectFileType(outputPath);

  if (!inputType || !outputType) {
    throw new Error('지원하지 않는 파일 형식입니다.');
  }

  // GIF 변환 특별 처리
  if (path.extname(outputPath).toLowerCase() === '.gif') {
    return convertToGif(input, outputPath, otherOptions);
  }

  // 타입별 변환
  switch (outputType) {
    case 'video':
      return convertVideo(input, outputPath, otherOptions);
    case 'audio':
      return convertAudio(input, outputPath, otherOptions);
    case 'image':
      return convertImage(input, outputPath, otherOptions);
    default:
      throw new Error('지원하지 않는 출력 형식입니다.');
  }
}

// 지원하는 변환 조합 확인
export function isConversionSupported(inputFormat: string, outputFormat: string): boolean {
  const inputType = detectFileType(`file.${inputFormat}`);
  const outputType = detectFileType(`file.${outputFormat}`);
  
  if (!inputType || !outputType) return false;
  
  // 같은 타입 내에서의 변환은 항상 지원
  if (inputType === outputType) return true;
  
  // 특별한 경우들
  if (inputType === 'video' && outputType === 'image') return true; // 비디오에서 이미지 추출
  if (inputType === 'video' && outputType === 'audio') return true; // 비디오에서 오디오 추출
  
  return false;
} 