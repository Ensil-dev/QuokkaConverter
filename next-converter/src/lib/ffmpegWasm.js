import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

let ffmpeg = null;

// FFmpeg 초기화
export async function initFFmpeg() {
  if (ffmpeg) return ffmpeg;

  const base = process.env.NEXT_PUBLIC_FFMPEG_BASE_URL ?? '/ffmpeg';

  // const coreURL = `${base}/ffmpeg-core.js`;
  // const wasmURL = `${base}/ffmpeg-core.wasm`;
  // console.log('FFmpeg 요청 대상 JS URL:', coreURL);
  // console.log('FFmpeg 요청 대상 WASM URL:', wasmURL);

  ffmpeg = new FFmpeg();

  try {
    // FFmpeg WebAssembly 로드
    await ffmpeg.load({
      coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    console.log('FFmpeg WebAssembly 로드 완료');
    return ffmpeg;
  } catch (error) {
    console.error('FFmpeg WebAssembly 로드 실패:', error);
    throw new Error('FFmpeg 초기화에 실패했습니다.');
  }
}

// 파일 변환 함수
export async function convertFileWithWasm(inputBuffer, inputFormat, outputFormat, options = {}) {
  try {
    const ffmpegInstance = await initFFmpeg();

    // 입력 파일명 생성
    const inputFileName = `input.${inputFormat}`;
    const outputFileName = `output.${outputFormat}`;

    // 입력 파일을 FFmpeg에 로드
    await ffmpegInstance.writeFile(inputFileName, new Uint8Array(inputBuffer));

    // 변환 명령어 생성
    const args = ['-i', inputFileName];

    // 비디오 옵션 처리
    if (options.resolution && options.resolution !== 'original') {
      args.push('-vf', `scale=${options.resolution}:flags=fast_bilinear`);
    }

    if (options.fps) {
      args.push('-r', String(options.fps));
    }

    if (options.bitrate) {
      args.push('-b:v', options.bitrate);
    }

    // 품질 설정
    if (options.quality) {
      const qualityMap = { '낮음': 28, '보통': 23, '높음': 18 };
      args.push('-crf', String(qualityMap[options.quality] || 23));
    }

    // 재생속도 설정
    if (options.playbackSpeed && options.playbackSpeed !== 1) {
      args.push('-filter:v', `setpts=${1 / options.playbackSpeed}*PTS`);
    }

    // 출력 파일
    args.push(outputFileName);

    // 변환 실행
    console.log('FFmpeg 명령어:', args.join(' '));
    await ffmpegInstance.exec(args);

    // 결과 파일 읽기
    const outputData = await ffmpegInstance.readFile(outputFileName);

    // 임시 파일 정리
    try {
      await ffmpegInstance.deleteFile(inputFileName);
      await ffmpegInstance.deleteFile(outputFileName);
    } catch (cleanupError) {
      console.warn('파일 정리 중 오류:', cleanupError);
    }

    return {
      data: outputData,
      size: outputData.length
    };

  } catch (error) {
    console.error('FFmpeg WebAssembly 변환 오류:', error);
    throw new Error(`파일 변환에 실패했습니다: ${error.message}`);
  }
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

// 변환 지원 여부 확인
export function isConversionSupported(inputFormat, outputFormat) {
  const inputExt = inputFormat.toLowerCase();
  const outputExt = outputFormat.toLowerCase();

  // 비디오 변환
  if (SUPPORTED_FORMATS.video.input.includes(inputExt) &&
    SUPPORTED_FORMATS.video.output.includes(outputExt)) {
    return true;
  }

  // 오디오 변환
  if (SUPPORTED_FORMATS.audio.input.includes(inputExt) &&
    SUPPORTED_FORMATS.audio.output.includes(outputExt)) {
    return true;
  }

  // 이미지 변환
  if (SUPPORTED_FORMATS.image.input.includes(inputExt) &&
    SUPPORTED_FORMATS.image.output.includes(outputExt)) {
    return true;
  }

  return false;
} 