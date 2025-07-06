import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'ffmpeg-static';
import { detectFileType } from './utils/fileFormats';

export interface ConvertOptions {
  input: string;
  output?: string;
  format?: string;
  resolution?: string;
  fps?: number;
  bitrate?: string;
  codec?: string;
  quality?: '낮음' | '보통' | '높음';
  sampleRate?: number;
  channels?: number;
  playbackSpeed?: number;
}

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



// FFmpeg 의존성 확인 (서버리스 환경에서는 항상 사용 가능)
function checkFFmpeg(): string {
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
function convertVideo(
  inputPath: string,
  outputPath: string,
  options: Partial<Omit<ConvertOptions, 'input' | 'output'>> = {}
): { output: string; size: number } {
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

  // 출력 파일 확장자에 따라 적절한 비디오 코덱 선택
  const outputExt = path.extname(outputPath).toLowerCase();
  let selectedVideoCodec = codec;
  let selectedAudioCodec = 'aac';

  if (!selectedVideoCodec) {
    switch (outputExt) {
      case '.mp4':
      case '.m4v':
        selectedVideoCodec = 'libx264';
        selectedAudioCodec = 'aac';
        break;
      case '.avi':
        selectedVideoCodec = 'libx264';
        selectedAudioCodec = 'mp3';
        break;
      case '.mkv':
        selectedVideoCodec = 'libx264';
        selectedAudioCodec = 'aac';
        break;
      case '.webm':
        selectedVideoCodec = 'libvpx';
        selectedAudioCodec = 'libopus';
        break;
      case '.flv':
        selectedVideoCodec = 'libx264';
        selectedAudioCodec = 'mp3';
        break;
      case '.wmv':
        selectedVideoCodec = 'wmv2';
        selectedAudioCodec = 'wmav2';
        break;
      case '.mov':
        selectedVideoCodec = 'libx264';
        selectedAudioCodec = 'aac';
        break;
      case '.3gp':
        selectedVideoCodec = 'libx264';
        selectedAudioCodec = 'aac';
        break;
      default:
        selectedVideoCodec = 'libx264';
        selectedAudioCodec = 'aac';
    }
  }

  // 비디오 코덱 설정
  args.push('-c:v', selectedVideoCodec);

  // 빠른 변환을 위한 추가 옵션
  args.push('-threads', '0'); // 모든 CPU 코어 사용
  args.push('-avoid_negative_ts', 'make_zero'); // 타임스탬프 최적화

  // 해상도 설정
  if (resolution && resolution !== 'original') {
    args.push('-vf', `scale=${resolution}:flags=fast_bilinear`); // 빠른 스케일링
  }

  // 프레임레이트 설정
  if (fps) {
    args.push('-r', String(fps));
  }

  // 비트레이트 설정
  if (bitrate) {
    args.push('-b:v', bitrate);
  }

  // 품질 설정 (코덱별로 다르게 적용)
  if (quality && ['낮음', '보통', '높음'].includes(quality)) {
    switch (selectedVideoCodec) {
      case 'libx264':
        const h264QualityMap = { '낮음': 28, '보통': 23, '높음': 18 };
        args.push('-crf', String(h264QualityMap[quality]));
        break;
      case 'libvpx-vp9':
        const vp9QualityMap = { '낮음': 40, '보통': 30, '높음': 20 };
        args.push('-crf', String(vp9QualityMap[quality]));
        break;
      case 'wmv2':
        const wmvQualityMap = { '낮음': 5, '보통': 3, '높음': 1 };
        args.push('-q:v', String(wmvQualityMap[quality]));
        break;
      default:
        args.push('-crf', '23'); // 기본 품질
    }
  } else {
    // 기본 품질 설정
    switch (selectedVideoCodec) {
      case 'libx264':
        args.push('-crf', '23');
        break;
      case 'libvpx-vp9':
        args.push('-crf', '30');
        break;
      default:
        args.push('-crf', '23');
    }
  }

  // 오디오 코덱 설정
  args.push('-c:a', selectedAudioCodec);

  // 최적화 옵션 (코덱별로 다르게 적용)
  switch (selectedVideoCodec) {
    case 'libx264':
      const presetMap: Record<'낮음' | '보통' | '높음', string> = {
        낮음: 'veryslow',
        보통: 'slow',
        높음: 'medium',
      };
      const preset = quality ? presetMap[quality] : 'ultrafast';
      args.push('-preset', preset);
      args.push('-tune', 'fastdecode');
      args.push('-movflags', '+faststart');
      break;
    case 'libvpx-vp9':
      args.push('-deadline', 'realtime');
      args.push('-cpu-used', '4');
      args.push('-row-mt', '1');
      break;
    case 'libvpx':
      args.push('-deadline', 'realtime');
      args.push('-cpu-used', '4');
      break;
  }

  args.push('-y', outputPath);

  // console.log('FFmpeg 명령어:', [ffmpegPath, ...args].join(' '));

  const result = spawnSync(ffmpegPath, args, { 
    encoding: 'buffer', 
    maxBuffer: 1024 * 1024 * 10, // 50MB에서 10MB로 줄임
    timeout: 120000 // 5분에서 2분으로 줄임
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
    
    // 일반적인 오류 패턴 분석
    let userFriendlyError = '변환 중 오류가 발생했습니다.';
    
    if (errorMessage.includes('Could not find tag for codec')) {
      userFriendlyError = '지원하지 않는 코덱 조합입니다. 다른 출력 형식을 시도해주세요.';
    } else if (errorMessage.includes('Invalid argument')) {
      userFriendlyError = '잘못된 변환 설정입니다. 옵션을 확인해주세요.';
    } else if (errorMessage.includes('No such file or directory')) {
      userFriendlyError = '입력 파일을 찾을 수 없습니다.';
    } else if (errorMessage.includes('Permission denied')) {
      userFriendlyError = '파일 접근 권한이 없습니다.';
    } else if (errorMessage.includes('timeout')) {
      userFriendlyError = '변환 시간이 초과되었습니다. 더 작은 파일을 시도해주세요.';
    } else if (errorMessage.includes('Invalid data found')) {
      userFriendlyError = '손상된 파일입니다. 다른 파일을 시도해주세요.';
    }
    
    throw new Error(userFriendlyError);
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
function convertAudio(
  inputPath: string,
  outputPath: string,
  options: Partial<Omit<ConvertOptions, 'input' | 'output'>> = {}
): { output: string; size: number } {
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

  // 출력 파일 확장자에 따라 적절한 코덱 선택
  const outputExt = path.extname(outputPath).toLowerCase();
  let selectedCodec = codec;

  if (!selectedCodec) {
    switch (outputExt) {
      case '.mp3':
        selectedCodec = 'libmp3lame';
        break;
      case '.m4a':
      case '.aac':
        selectedCodec = 'aac';
        break;
      case '.ogg':
        selectedCodec = 'libvorbis';
        break;
      case '.wav':
        selectedCodec = 'pcm_s16le';
        break;
      case '.flac':
        selectedCodec = 'flac';
        break;
      case '.opus':
        selectedCodec = 'libopus';
        break;
      default:
        selectedCodec = 'libmp3lame'; // 기본값
    }
  }

  // 오디오 코덱 설정
  args.push('-c:a', selectedCodec);

  // M4A/AAC 컨테이너에 대한 추가 설정
  if (outputExt === '.m4a' || outputExt === '.aac') {
    // M4A 컨테이너에 맞는 설정
    args.push('-f', 'mp4');
  }

  // 비트레이트 설정 (일부 코덱에서는 무시될 수 있음)
  if (bitrate) {
    args.push('-b:a', bitrate);
  } else {
    // 코덱별 기본 비트레이트 설정
    switch (selectedCodec) {
      case 'aac':
        args.push('-b:a', '128k');
        break;
      case 'libmp3lame':
        args.push('-b:a', '128k');
        break;
      case 'libvorbis':
        args.push('-b:a', '128k');
        break;
      case 'libopus':
        args.push('-b:a', '64k');
        break;
      default:
        args.push('-b:a', '128k');
    }
  }

  // 샘플레이트 설정
  if (sampleRate) {
    args.push('-ar', String(sampleRate));
  }

  // 채널 설정
  if (channels) {
    args.push('-ac', String(channels));
  }

  // 품질 설정 (코덱별로 다르게 적용)
  if (quality && ['낮음', '보통', '높음'].includes(quality)) {
    switch (selectedCodec) {
      case 'libmp3lame':
        const mp3QualityMap = { '낮음': 5, '보통': 3, '높음': 0 };
        args.push('-q:a', String(mp3QualityMap[quality]));
        break;
      case 'libvorbis':
        const vorbisQualityMap = { '낮음': 3, '보통': 5, '높음': 7 };
        args.push('-q:a', String(vorbisQualityMap[quality]));
        break;
      case 'libopus':
        const opusQualityMap = { '낮음': 10, '보통': 20, '높음': 30 };
        args.push('-b:a', `${opusQualityMap[quality]}k`);
        break;
      case 'aac':
        const aacQualityMap = { '낮음': '64k', '보통': '128k', '높음': '256k' };
        args.push('-b:a', aacQualityMap[quality]);
        break;
    }
  }

  // 빠른 변환을 위한 추가 옵션
  args.push('-threads', '0'); // 모든 CPU 코어 사용

  args.push('-y', outputPath);

  // console.log('FFmpeg 명령어:', [ffmpegPath, ...args].join(' '));

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
    
    // 일반적인 오류 패턴 분석
    let userFriendlyError = '변환 중 오류가 발생했습니다.';
    
    if (errorMessage.includes('Could not find tag for codec')) {
      userFriendlyError = '지원하지 않는 코덱 조합입니다. 다른 출력 형식을 시도해주세요.';
    } else if (errorMessage.includes('Invalid argument')) {
      userFriendlyError = '잘못된 변환 설정입니다. 옵션을 확인해주세요.';
    } else if (errorMessage.includes('No such file or directory')) {
      userFriendlyError = '입력 파일을 찾을 수 없습니다.';
    } else if (errorMessage.includes('Permission denied')) {
      userFriendlyError = '파일 접근 권한이 없습니다.';
    } else if (errorMessage.includes('timeout')) {
      userFriendlyError = '변환 시간이 초과되었습니다. 더 작은 파일을 시도해주세요.';
    } else if (errorMessage.includes('Invalid data found')) {
      userFriendlyError = '손상된 파일입니다. 다른 파일을 시도해주세요.';
    }
    
    throw new Error(userFriendlyError);
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
function convertImage(
  inputPath: string,
  outputPath: string,
  options: Partial<Omit<ConvertOptions, 'input' | 'output'>> = {}
): { output: string; size: number } {
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

  // console.log('FFmpeg 명령어:', [ffmpegPath, ...args].join(' '));

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
    
    // 일반적인 오류 패턴 분석
    let userFriendlyError = '변환 중 오류가 발생했습니다.';
    
    if (errorMessage.includes('Could not find tag for codec')) {
      userFriendlyError = '지원하지 않는 코덱 조합입니다. 다른 출력 형식을 시도해주세요.';
    } else if (errorMessage.includes('Invalid argument')) {
      userFriendlyError = '잘못된 변환 설정입니다. 옵션을 확인해주세요.';
    } else if (errorMessage.includes('No such file or directory')) {
      userFriendlyError = '입력 파일을 찾을 수 없습니다.';
    } else if (errorMessage.includes('Permission denied')) {
      userFriendlyError = '파일 접근 권한이 없습니다.';
    } else if (errorMessage.includes('timeout')) {
      userFriendlyError = '변환 시간이 초과되었습니다. 더 작은 파일을 시도해주세요.';
    } else if (errorMessage.includes('Invalid data found')) {
      userFriendlyError = '손상된 파일입니다. 다른 파일을 시도해주세요.';
    }
    
    throw new Error(userFriendlyError);
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
function convertToGif(
  inputPath: string,
  outputPath: string,
  options: Partial<Omit<ConvertOptions, 'input' | 'output'>> = {}
): { output: string; size: number } {
  const {
    resolution,
    fps = 10,
    playbackSpeed = 1.0,
    quality = '보통'
  } = options;

  console.log('GIF 변환 시작:', { inputPath, outputPath, options });

  const ffmpegPath = checkFFmpeg();
  const filters: string[] = [];
  
  // 재생속도 조절 (setpts 필터 사용)
  if (playbackSpeed !== 1.0) {
    filters.push(`setpts=${1/playbackSpeed}*PTS`);
  }
  
  // 해상도 조절
  if (resolution && resolution !== 'original') {
    filters.push(`scale=${resolution}`);
  }
  
  // 품질에 따른 색상 팔레트 조정
  let paletteFilter = '';
  if (quality === '높음') {
    // 높은 품질: 더 많은 색상 사용 (최적화)
    paletteFilter = 'split[s0][s1];[s0]palettegen=max_colors=128:reserve_transparent=0:stats_mode=single[p];[s1][p]paletteuse';
  } else if (quality === '낮음') {
    // 낮은 품질: 적은 색상 사용으로 파일 크기 감소 (최적화)
    paletteFilter = 'split[s0][s1];[s0]palettegen=max_colors=32:reserve_transparent=0:stats_mode=single[p];[s1][p]paletteuse=dither=none';
  } else {
    // 보통 품질: 기본 설정 (최적화)
    paletteFilter = 'split[s0][s1];[s0]palettegen=max_colors=64:reserve_transparent=0:stats_mode=single[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3';
  }
  
  // 필터 체인 구성
  const filterChain = filters.length > 0 ? `${filters.join(',')},${paletteFilter}` : paletteFilter;

  // FFmpeg로 GIF 생성 (최적화된 설정)
  const ffmpegArgs = [
    '-i', inputPath,
    '-r', String(fps),
    '-vf', filterChain,
    '-f', 'gif',
    '-an', // 오디오 제거
    '-loop', '0',
    '-y', outputPath
  ];

  // console.log('FFmpeg 명령어:', [ffmpegPath, ...ffmpegArgs].join(' '));

  const ffmpegResult = spawnSync(ffmpegPath, ffmpegArgs, { 
    encoding: 'buffer', 
    maxBuffer: 1024 * 1024 * 10, // 50MB에서 10MB로 줄임
    timeout: 120000 // 5분에서 2분으로 줄임
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
    
    // 일반적인 오류 패턴 분석
    let userFriendlyError = 'GIF 변환 중 오류가 발생했습니다.';
    
    if (errorMessage.includes('Could not find tag for codec')) {
      userFriendlyError = '지원하지 않는 코덱 조합입니다. 다른 출력 형식을 시도해주세요.';
    } else if (errorMessage.includes('Invalid argument')) {
      userFriendlyError = '잘못된 변환 설정입니다. 옵션을 확인해주세요.';
    } else if (errorMessage.includes('No such file or directory')) {
      userFriendlyError = '입력 파일을 찾을 수 없습니다.';
    } else if (errorMessage.includes('Permission denied')) {
      userFriendlyError = '파일 접근 권한이 없습니다.';
    } else if (errorMessage.includes('timeout')) {
      userFriendlyError = '변환 시간이 초과되었습니다. 더 작은 파일을 시도해주세요.';
    } else if (errorMessage.includes('Invalid data found')) {
      userFriendlyError = '손상된 파일입니다. 다른 파일을 시도해주세요.';
    }
    
    throw new Error(userFriendlyError);
  }

  // 출력 파일이 실제로 생성되었는지 확인
  if (!fs.existsSync(outputPath)) {
    throw new Error('변환된 파일이 생성되지 않았습니다.');
  }

  const stats = fs.statSync(outputPath);
  console.log('GIF 변환 완료:', { size: stats.size, path: outputPath, quality });

  return {
    output: outputPath,
    size: stats.size
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
