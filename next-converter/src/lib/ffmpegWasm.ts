import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';


export interface WasmConvertOptions {
  resolution?: string;
  fps?: number;
  bitrate?: string;
  quality?: '낮음' | '보통' | '높음';
  playbackSpeed?: number;
}

let ffmpeg: FFmpeg | null = null;

// FFmpeg 초기화
export async function initFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg) return ffmpeg;

  const { FFmpeg } = await import('@ffmpeg/ffmpeg');
  const ffmpegCdn = process.env.NEXT_PUBLIC_FFMPEG_BASE_URL ?? '/ffmpeg';

  // const coreURL = `${ffmpegCdn}/ffmpeg-core.js`;
  // const wasmURL = `${ffmpegCdn}/ffmpeg-core.wasm`;
  // console.log('FFmpeg 요청 대상 JS URL:', coreURL);
  // console.log('FFmpeg 요청 대상 WASM URL:', wasmURL);

  ffmpeg = new FFmpeg();

  try {
    // FFmpeg WebAssembly 로드
    await ffmpeg.load({
      coreURL: await toBlobURL(`${ffmpegCdn}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${ffmpegCdn}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    // console.log('FFmpeg WebAssembly 로드 완료');
    return ffmpeg;
  } catch (error) {
    console.error('FFmpeg WebAssembly 로드 실패:', error);
    throw new Error('FFmpeg 초기화에 실패했습니다.');
  }
}

// 파일 변환 함수
export async function convertFileWithWasm(
  inputBuffer: ArrayBuffer,
  inputFormat: string,
  outputFormat: string,
  options: WasmConvertOptions = {}
): Promise<{ data: Uint8Array; size: number }> {
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
      const presetMap: Record<'낮음' | '보통' | '높음', string> = {
        낮음: 'veryslow',
        보통: 'slow',
        높음: 'medium',
      };
      args.push('-preset', presetMap[options.quality]);
    }

    // 재생속도 설정
    if (options.playbackSpeed && options.playbackSpeed !== 1) {
      args.push('-filter:v', `setpts=${1 / options.playbackSpeed}*PTS`);
    }

    // 출력 파일
    args.push(outputFileName);

    // 변환 실행
    // console.log('FFmpeg 명령어:', args.join(' '));
    await ffmpegInstance.exec(args);

    // 결과 파일 읽기
    const outputData = await ffmpegInstance.readFile(outputFileName) as Uint8Array;

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
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`파일 변환에 실패했습니다: ${message}`);
  }
}

// 여러 이미지를 하나의 GIF로 합치는 함수
export async function imagesToGifWithWasm(
  files: { buffer: ArrayBuffer; ext: string }[],
  fps = 10,
  quality = 75,
  compressionLevel = 6
): Promise<{ data: Uint8Array; size: number }> {
  try {
    const ffmpegInstance = await initFFmpeg();

    for (let i = 0; i < files.length; i++) {
      const { buffer, ext } = files[i];
      const input = `input_${i}.${ext}`;
      const frame = `frame_${String(i).padStart(4, '0')}.webp`;
      await ffmpegInstance.writeFile(input, new Uint8Array(buffer));
      await ffmpegInstance.exec([
        '-y',
        '-i',
        input,
        '-qscale',
        String(quality),
        '-compression_level',
        String(compressionLevel),
        frame,
      ]);
      await ffmpegInstance.deleteFile(input);
    }

    await ffmpegInstance.exec([
      '-r',
      String(fps),
      '-start_number',
      '0',
      '-i',
      'frame_%04d.webp',
      '-loop',
      '0',
      'output.gif',
    ]);

    const outputData = (await ffmpegInstance.readFile('output.gif')) as Uint8Array;

    try {
      for (let i = 0; i < files.length; i++) {
        await ffmpegInstance.deleteFile(`frame_${String(i).padStart(4, '0')}.webp`);
      }
      await ffmpegInstance.deleteFile('output.gif');
    } catch (cleanupError) {
      console.warn('파일 정리 중 오류:', cleanupError);
    }

    return { data: outputData, size: outputData.length };
  } catch (error) {
    console.error('GIF 생성 오류:', error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`GIF 생성에 실패했습니다: ${message}`);
  }
}

// 지원하는 포맷 정의
