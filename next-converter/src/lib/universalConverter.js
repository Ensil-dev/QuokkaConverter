import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'ffmpeg-static';

// FFmpeg 경로 확인 및 수정
const getFFmpegPath = () => {
  if (!ffmpeg) {
    throw new Error('FFmpeg 경로를 찾을 수 없습니다.');
  }
  
  // ffmpeg-static에서 반환된 경로가 실제 실행 파일인지 확인
  if (fs.existsSync(ffmpeg) && fs.statSync(ffmpeg).isFile()) {
    return ffmpeg;
  }
  
  // 대안 경로들 시도
  const alternativePaths = [
    path.join(process.cwd(), 'node_modules', 'ffmpeg-static', 'ffmpeg'),
    '/usr/local/bin/ffmpeg',
    '/usr/bin/ffmpeg',
    'ffmpeg'
  ];
  
  for (const altPath of alternativePaths) {
    if (fs.existsSync(altPath) && fs.statSync(altPath).isFile()) {
      console.log('FFmpeg 경로 발견:', altPath);
      return altPath;
    }
  }
  
  throw new Error('FFmpeg 실행 파일을 찾을 수 없습니다.');
};

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
function detectFileType(filename) {
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

// FFmpeg 의존성 확인 (서버리스 환경에서는 항상 사용 가능)
function checkFFmpeg() {
  try {
    const ffmpegPath = getFFmpegPath();
    console.log('FFmpeg 경로:', ffmpegPath);
    return ffmpegPath;
  } catch (error) {
    console.error('FFmpeg 확인 오류:', error);
    throw new Error('FFmpeg가 설치되어 있지 않습니다.');
  }
}

// 비디오 변환 (최적화)
function convertVideo(inputPath, outputPath, options = {}) {
  const {
    resolution,
    fps,
    bitrate,
    codec,
    quality
  } = options;

  console.log('비디오 변환 시작:', { inputPath, outputPath, options });

  const ffmpegPath = checkFFmpeg();
  const args = ['-i', inputPath];

  // 비디오 코덱 설정 (기본값: libx264)
  if (codec) {
    args.push('-c:v', codec);
  } else {
    args.push('-c:v', 'libx264');
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

  // 품질 설정 (CRF) - 기본값: 23 (보통 품질)
  if (quality && ['낮음', '보통', '높음'].includes(quality)) {
    const crfMap = { '낮음': 28, '보통': 23, '높음': 18 };
    args.push('-crf', String(crfMap[quality]));
  } else {
    args.push('-crf', '23'); // 기본 품질
  }

  // 오디오 코덱 설정 (비디오 파일의 경우)
  args.push('-c:a', 'aac');

  // 최적화 옵션
  args.push('-preset', 'fast'); // 빠른 인코딩
  args.push('-movflags', '+faststart'); // 웹 최적화

  args.push('-y', outputPath);

  console.log('FFmpeg 명령어:', [ffmpegPath, ...args].join(' '));

  const result = spawnSync(ffmpegPath, args, { 
    encoding: 'buffer', 
    maxBuffer: 1024 * 1024 * 50, // 50MB로 줄임
    timeout: 300000 // 5분 타임아웃
  });

  console.log('FFmpeg 실행 결과:', {
    status: result.status,
    stderr: result.stderr ? result.stderr.toString() : 'null',
    stdout: result.stdout ? result.stdout.length : 'null',
    error: result.error
  });

  if (result.status !== 0) {
    const errorMessage = result.stderr ? result.stderr.toString() : '알 수 없는 FFmpeg 오류';
    console.error('FFmpeg 오류:', errorMessage);
    throw new Error(`FFmpeg 오류: ${errorMessage}`);
  }

  // 출력 파일이 실제로 생성되었는지 확인
  if (!fs.existsSync(outputPath)) {
    throw new Error('변환된 파일이 생성되지 않았습니다.');
  }

  const stats = fs.statSync(outputPath);
  console.log('비디오 변환 완료:', { size: stats.size, path: outputPath });

  return {
    output: outputPath,
    size: stats.size
  };
}

// 오디오 변환 (최적화)
function convertAudio(inputPath, outputPath, options = {}) {
  const {
    bitrate,
    sampleRate,
    channels,
    codec,
    quality
  } = options;

  console.log('오디오 변환 시작:', { inputPath, outputPath, options });

  const ffmpegPath = checkFFmpeg();
  const args = ['-i', inputPath];

  // 오디오 코덱 설정 (기본값: libmp3lame)
  if (codec) {
    args.push('-c:a', codec);
  } else {
    args.push('-c:a', 'libmp3lame');
  }

  // 비트레이트 설정
  if (bitrate) {
    args.push('-b:a', bitrate);
  } else {
    args.push('-b:a', '128k'); // 기본 비트레이트
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

  console.log('FFmpeg 명령어:', [ffmpegPath, ...args].join(' '));

  const result = spawnSync(ffmpegPath, args, { 
    encoding: 'buffer', 
    maxBuffer: 1024 * 1024 * 50, // 50MB로 줄임
    timeout: 300000 // 5분 타임아웃
  });

  console.log('FFmpeg 실행 결과:', {
    status: result.status,
    stderr: result.stderr ? result.stderr.toString() : 'null',
    stdout: result.stdout ? result.stdout.length : 'null',
    error: result.error
  });

  if (result.status !== 0) {
    const errorMessage = result.stderr ? result.stderr.toString() : '알 수 없는 FFmpeg 오류';
    console.error('FFmpeg 오류:', errorMessage);
    throw new Error(`FFmpeg 오류: ${errorMessage}`);
  }

  // 출력 파일이 실제로 생성되었는지 확인
  if (!fs.existsSync(outputPath)) {
    throw new Error('변환된 파일이 생성되지 않았습니다.');
  }

  const stats = fs.statSync(outputPath);
  console.log('오디오 변환 완료:', { size: stats.size, path: outputPath });

  return {
    output: outputPath,
    size: stats.size
  };
}

// 이미지 변환 (최적화)
function convertImage(inputPath, outputPath, options = {}) {
  const {
    resolution,
    quality
  } = options;

  console.log('이미지 변환 시작:', { inputPath, outputPath, options });

  const ffmpegPath = checkFFmpeg();
  const args = ['-i', inputPath];

  // 해상도 설정
  if (resolution && resolution !== 'original') {
    args.push('-vf', `scale=${resolution}`);
  }

  // 품질 설정 (JPEG의 경우)
  if (quality && ['낮음', '보통', '높음'].includes(quality)) {
    const qualityMap = { '낮음': 60, '보통': 80, '높음': 95 };
    args.push('-q:v', String(qualityMap[quality]));
  } else {
    args.push('-q:v', '80'); // 기본 품질
  }

  args.push('-y', outputPath);

  console.log('FFmpeg 명령어:', [ffmpegPath, ...args].join(' '));

  const result = spawnSync(ffmpegPath, args, { 
    encoding: 'buffer', 
    maxBuffer: 1024 * 1024 * 50, // 50MB로 줄임
    timeout: 300000 // 5분 타임아웃
  });

  console.log('FFmpeg 실행 결과:', {
    status: result.status,
    stderr: result.stderr ? result.stderr.toString() : 'null',
    stdout: result.stdout ? result.stdout.length : 'null',
    error: result.error
  });

  if (result.status !== 0) {
    const errorMessage = result.stderr ? result.stderr.toString() : '알 수 없는 FFmpeg 오류';
    console.error('FFmpeg 오류:', errorMessage);
    throw new Error(`FFmpeg 오류: ${errorMessage}`);
  }

  // 출력 파일이 실제로 생성되었는지 확인
  if (!fs.existsSync(outputPath)) {
    throw new Error('변환된 파일이 생성되지 않았습니다.');
  }

  const stats = fs.statSync(outputPath);
  console.log('이미지 변환 완료:', { size: stats.size, path: outputPath });

  return {
    output: outputPath,
    size: stats.size
  };
}

// GIF 특별 처리 (최적화)
function convertToGif(inputPath, outputPath, options = {}) {
  const {
    resolution,
    fps = 10
  } = options;

  console.log('GIF 변환 시작:', { inputPath, outputPath, options });

  const ffmpegPath = checkFFmpeg();
  let filters = '';
  if (resolution && resolution !== 'original') {
    filters = `scale=${resolution}`;
  }

  // FFmpeg로 GIF 생성 (최적화된 설정)
  const ffmpegArgs = [
    '-i', inputPath,
    '-r', String(fps),
    ...(filters ? ['-vf', filters] : []),
    '-f', 'gif',
    '-an', // 오디오 제거
    '-loop', '0',
    '-y', outputPath
  ];

  console.log('FFmpeg 명령어:', [ffmpegPath, ...ffmpegArgs].join(' '));

  const ffmpegResult = spawnSync(ffmpegPath, ffmpegArgs, { 
    encoding: 'buffer', 
    maxBuffer: 1024 * 1024 * 50, // 50MB로 줄임
    timeout: 300000 // 5분 타임아웃
  });

  console.log('FFmpeg 실행 결과:', {
    status: ffmpegResult.status,
    stderr: ffmpegResult.stderr ? ffmpegResult.stderr.toString() : 'null',
    stdout: ffmpegResult.stdout ? ffmpegResult.stdout.length : 'null',
    error: ffmpegResult.error
  });

  if (ffmpegResult.status !== 0) {
    const errorMessage = ffmpegResult.stderr ? ffmpegResult.stderr.toString() : '알 수 없는 FFmpeg 오류';
    console.error('FFmpeg 오류:', errorMessage);
    throw new Error(`FFmpeg 오류: ${errorMessage}`);
  }

  // 출력 파일이 실제로 생성되었는지 확인
  if (!fs.existsSync(outputPath)) {
    throw new Error('변환된 파일이 생성되지 않았습니다.');
  }

  const stats = fs.statSync(outputPath);
  console.log('GIF 변환 완료:', { size: stats.size, path: outputPath });

  return {
    output: outputPath,
    size: stats.size
  };
}

// 메인 변환 함수
export async function convertFile(options) {
  const {
    input,
    output,
    format,
    ...otherOptions
  } = options;

  console.log('변환 시작:', options);

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

  // 파일 타입 감지
  const inputType = detectFileType(input);
  const outputType = detectFileType(outputPath);

  if (!inputType || !outputType) {
    throw new Error('지원하지 않는 파일 형식입니다.');
  }

  console.log('파일 타입:', { inputType, outputType });

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
export function isConversionSupported(inputFormat, outputFormat) {
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