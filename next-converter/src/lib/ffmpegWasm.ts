import type { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import { detectFileType } from './utils/fileFormats';


export interface WasmConvertOptions {
  resolution?: string;
  fps?: number;
  bitrate?: string;
  quality?: '낮음' | '보통' | '높음' | 'low' | 'medium' | 'high';
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
    ffmpeg = null; // 실패 시 인스턴스 리셋
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`FFmpeg 초기화에 실패했습니다: ${message}`);
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

    const outputType = detectFileType(outputFormat);
    // GIF는 영상 처리를 위해 이미지 범주에서 제외
    const isImage = outputType === 'image' && outputFormat !== 'gif';

    // 입력 파일명 생성
    const inputFileName = `input.${inputFormat}`;
    const outputFileName = `output.${outputFormat}`;

    // 입력 파일을 FFmpeg에 로드
    await ffmpegInstance.writeFile(inputFileName, new Uint8Array(inputBuffer));

    // 변환 명령어 생성
    const args = ['-i', inputFileName];

    // 공통 옵션
    if (options.resolution && options.resolution !== 'original') {
      const scale = isImage ? `scale=${options.resolution}` : `scale=${options.resolution}:flags=fast_bilinear`;
      args.push('-vf', scale);
    }

    if (!isImage && options.fps) {
      args.push('-r', String(options.fps));
    }

    if (!isImage && options.bitrate) {
      args.push('-b:v', options.bitrate);
    }

    if (options.quality) {
      if (isImage) {
        if (outputFormat === 'webp') {
          // WebP의 경우 -quality 사용 (0-100)
          const webpQualityMap: Record<string, number> = { 
            낮음: 50, 보통: 75, 높음: 90,
            low: 50, medium: 75, high: 90
          };
          const webpQuality = webpQualityMap[options.quality as string] || 75;
          args.push('-quality', String(webpQuality));
        } else {
          // 다른 이미지 포맷의 경우 -q:v 사용
          const qMap: Record<string, number> = { 
            낮음: 60, 보통: 80, 높음: 95,
            low: 60, medium: 80, high: 95
          };
          const qualityValue = qMap[options.quality as string] || 80;
          args.push('-q:v', String(qualityValue));
        }
        
        // PNG 압축 레벨
        if (outputFormat === 'png') {
          const clMap: Record<string, number> = { 
            낮음: 2, 보통: 4, 높음: 6,
            low: 2, medium: 4, high: 6
          };
          const compressionValue = clMap[options.quality as string] || 4;
          args.push('-compression_level', String(compressionValue));
        }
      } else {
        const qualityMap: Record<string, number> = { 
          '낮음': 28, '보통': 23, '높음': 18,
          'low': 28, 'medium': 23, 'high': 18
        };
        args.push('-crf', String(qualityMap[options.quality as string] || 23));
        const presetMap: Record<string, string> = {
          낮음: 'veryslow',
          보통: 'slow', 
          높음: 'medium',
          low: 'veryslow',
          medium: 'slow',
          high: 'medium'
        };
        const preset = presetMap[options.quality as string];
        if (preset) {
          args.push('-preset', preset);
        }
      }
    }

    if (options.playbackSpeed && options.playbackSpeed !== 1 && outputFormat === 'gif') {
      args.push('-filter:v', `setpts=${1 / options.playbackSpeed}*PTS`);
    }

    // 출력 파일
    args.push(outputFileName);

    // 변환 실행
    console.log('FFmpeg 명령어:', args.join(' '));
    await ffmpegInstance.exec(args);

    // 파일 시스템 확인
    const files = await ffmpegInstance.listDir('/');
    console.log('FFmpeg 파일 시스템:', files);

    // 결과 파일 읽기 시도
    let outputData: Uint8Array;
    try {
      outputData = await ffmpegInstance.readFile(outputFileName) as Uint8Array;
      console.log('readFile 성공:', !!outputData, 'length:', outputData?.length, 'type:', typeof outputData);
    } catch (readError) {
      console.error('readFile 오류:', readError);
      console.log('사용 가능한 파일들:', files);
      throw new Error(`출력 파일을 읽을 수 없습니다: ${readError}`);
    }

    // 출력 데이터 검증
    if (!outputData || outputData.length === 0) {
      throw new Error('변환된 파일 데이터가 비어있습니다.');
    }

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
  quality: '낮음' | '보통' | '높음' | 'low' | 'medium' | 'high' = '보통',
  compressionLevel = 6,
  width?: number,
  height?: number
): Promise<{ data: Uint8Array; size: number }> {
  try {
    const ffmpegInstance = await initFFmpeg();

    const webpQualityMap: Record<string, number> = { 
      낮음: 30, 보통: 75, 높음: 95,
      low: 30, medium: 75, high: 95
    };
    const paletteMap: Record<string, { maxColors: number; dither: string }> = {
      낮음: { maxColors: 32, dither: 'none' },
      보통: { maxColors: 64, dither: 'bayer:bayer_scale=3' },
      높음: { maxColors: 128, dither: '' },
      low: { maxColors: 32, dither: 'none' },
      medium: { maxColors: 64, dither: 'bayer:bayer_scale=3' },
      high: { maxColors: 128, dither: '' }
    };
    const webpQ = webpQualityMap[quality as string] || 75;
    const { maxColors, dither } = paletteMap[quality as string] || paletteMap['보통'];

    if (width == null || height == null) {
      const { buffer, ext } = files[0];
      const blob = new Blob([buffer], { type: `image/${ext}` });
      if (typeof createImageBitmap === 'function') {
        const bmp = await createImageBitmap(blob);
        width = bmp.width;
        height = bmp.height;
        bmp.close?.();
      } else {
        const arr = new Uint8Array(buffer);
        if (
          arr[0] === 0x52 &&
          arr[1] === 0x49 &&
          arr[2] === 0x46 &&
          arr[3] === 0x46
        ) {
          const chunk = String.fromCharCode(...arr.slice(12, 16));
          if (chunk === 'VP8X') {
            width = 1 + (arr[24] | (arr[25] << 8) | (arr[26] << 16));
            height = 1 + (arr[27] | (arr[28] << 8) | (arr[29] << 16));
          } else if (chunk === 'VP8 ') {
            width = arr[26] | (arr[27] << 8);
            height = arr[28] | (arr[29] << 8);
          } else if (chunk === 'VP8L') {
            const bits =
              arr[21] | (arr[22] << 8) | (arr[23] << 16) | (arr[24] << 24);
            width = (bits & 0x3fff) + 1;
            height = ((bits >> 14) & 0x3fff) + 1;
          }
        }
      }
    }

    width = width || 0;
    height = height || 0;

    for (let i = 0; i < files.length; i++) {
      const { buffer, ext } = files[i];
      const input = `input_${i}.${ext}`;
      const frame = `frame_${String(i).padStart(4, '0')}.webp`;
      await ffmpegInstance.writeFile(input, new Uint8Array(buffer));
      await ffmpegInstance.exec([
        '-y',
        '-i',
        input,
        '-vf',
        `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`,
        '-qscale',
        String(webpQ),
        '-compression_level',
        String(compressionLevel),
        frame,
      ]);
      await ffmpegInstance.deleteFile(input);
    }

    await ffmpegInstance.exec([
      '-start_number',
      '0',
      '-i',
      'frame_%04d.webp',
      '-vf',
      `palettegen=max_colors=${maxColors}:reserve_transparent=0:stats_mode=single`,
      'palette.png',
    ]);

    const paletteuse = dither ? `paletteuse=dither=${dither}` : 'paletteuse';

    await ffmpegInstance.exec([
      '-r',
      String(fps),
      '-start_number',
      '0',
      '-i',
      'frame_%04d.webp',
      '-i',
      'palette.png',
      '-filter_complex',
      paletteuse,
      '-loop',
      '0',
      'output.gif',
    ]);

    const outputData = (await ffmpegInstance.readFile('output.gif')) as Uint8Array;

    if (!outputData || outputData.length === 0) {
      throw new Error('GIF 생성 결과가 비어 있습니다.');
    }

    try {
      for (let i = 0; i < files.length; i++) {
        await ffmpegInstance.deleteFile(`frame_${String(i).padStart(4, '0')}.webp`);
      }
      await ffmpegInstance.deleteFile('palette.png');
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

// 비디오를 GIF로 변환하는 함수
export async function videoToGifWithWasm(
  videoBuffer: ArrayBuffer,
  videoFormat: string,
  fps = 10,
  quality: '낮음' | '보통' | '높음' | 'low' | 'medium' | 'high' = '보통',
  width?: number,
  height?: number,
  startTime = 0,
  duration?: number
): Promise<{ data: Uint8Array; size: number }> {
  try {
    const ffmpegInstance = await initFFmpeg();

    const inputFileName = `input.${videoFormat}`;
    const outputFileName = 'output.gif';

    // 입력 파일을 FFmpeg에 로드
    await ffmpegInstance.writeFile(inputFileName, new Uint8Array(videoBuffer));

    // 변환 명령어 생성
    const args = ['-i', inputFileName];

    // 시작 시간 설정
    if (startTime > 0) {
      args.push('-ss', String(startTime));
    }

    // 길이 설정
    if (duration && duration > 0) {
      args.push('-t', String(duration));
    }

    // 품질 설정
    const qualityMap: Record<string, { maxColors: number; dither: string }> = {
      낮음: { maxColors: 32, dither: 'none' },
      보통: { maxColors: 128, dither: 'bayer:bayer_scale=2' },
      높음: { maxColors: 256, dither: 'floyd_steinberg' },
      low: { maxColors: 32, dither: 'none' },
      medium: { maxColors: 128, dither: 'bayer:bayer_scale=2' },
      high: { maxColors: 256, dither: 'floyd_steinberg' }
    };
    
    const { maxColors, dither } = qualityMap[quality as string] || qualityMap['보통'];

    // 필터 설정
    let vfilter = `fps=${fps}`;
    
    if (width && height) {
      vfilter += `,scale=${width}:${height}:flags=lanczos`;
    } else if (width || height) {
      const scaleValue = width ? `${width}:-1` : `-1:${height}`;
      vfilter += `,scale=${scaleValue}:flags=lanczos`;
    }

    // 팔레트 생성 및 적용
    vfilter += `,split[s0][s1];[s0]palettegen=max_colors=${maxColors}[p];[s1][p]paletteuse`;
    
    if (dither !== 'none') {
      vfilter += `=dither=${dither}`;
    }

    args.push('-vf', vfilter);
    args.push('-loop', '0'); // 무한 루프
    args.push(outputFileName);

    // 변환 실행
    await ffmpegInstance.exec(args);

    // 결과 파일 읽기
    const outputData = await ffmpegInstance.readFile(outputFileName) as Uint8Array;

    if (!outputData || outputData.length === 0) {
      throw new Error('GIF 생성 결과가 비어 있습니다.');
    }

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
    console.error('비디오 to GIF 변환 오류:', error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`비디오를 GIF로 변환하는데 실패했습니다: ${message}`);
  }
}

// 지원하는 포맷 정의
