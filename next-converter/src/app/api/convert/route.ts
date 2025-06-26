import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { convertFile, SUPPORTED_FORMATS } from '@/lib/universalConverter';

// 비용 제어를 위한 제한 설정
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_CONVERSION_TIME = 25000; // 25초 (Vercel 제한 고려)

// 사용량 모니터링
let dailyUsage = {
  conversions: 0,
  totalSize: 0,
  lastReset: new Date().toDateString()
};

function resetDailyUsage() {
  const today = new Date().toDateString();
  if (dailyUsage.lastReset !== today) {
    dailyUsage = {
      conversions: 0,
      totalSize: 0,
      lastReset: today
    };
  }
}

function logUsage(fileSize: number) {
  resetDailyUsage();
  dailyUsage.conversions++;
  dailyUsage.totalSize += fileSize;
  
  console.log(`📊 사용량 통계: ${dailyUsage.conversions}회 변환, ${(dailyUsage.totalSize / (1024 * 1024)).toFixed(2)}MB 처리`);
}

// 파일 변환 API
export async function POST(request: NextRequest) {
  try {
    // FormData 파싱
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '파일이 업로드되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `파일 크기가 너무 큽니다. 최대 ${MAX_FILE_SIZE / (1024 * 1024)}MB까지 지원됩니다.` },
        { status: 400 }
      );
    }

    // 변환 옵션 추출
    const outputFormat = formData.get('outputFormat') as string;
    const resolution = formData.get('resolution') as string;
    const fps = formData.get('fps') as string;
    const bitrate = formData.get('bitrate') as string;
    const quality = formData.get('quality') as string;
    const sampleRate = formData.get('sampleRate') as string;
    const channels = formData.get('channels') as string;
    const codec = formData.get('codec') as string;
    const playbackSpeed = formData.get('playbackSpeed') as string;

    // 입력 파일 정보
    const inputExt = path.extname(file.name).slice(1).toLowerCase();
    
    // 출력 형식이 지정되지 않은 경우 기본값 설정
    let targetFormat = outputFormat;
    if (!targetFormat) {
      if (SUPPORTED_FORMATS.video.input.includes(inputExt)) {
        targetFormat = 'mp4';
      } else if (SUPPORTED_FORMATS.audio.input.includes(inputExt)) {
        targetFormat = 'mp3';
      } else if (SUPPORTED_FORMATS.image.input.includes(inputExt)) {
        targetFormat = 'jpg';
      }
    }

    // 임시 파일 경로 설정 (서버리스 환경)
    const timestamp = Date.now();
    const inputPath = `/tmp/${timestamp}-input-${file.name}`;
    const outputFilename = `converted.${targetFormat}`;
    const outputPath = `/tmp/${timestamp}-output-${outputFilename}`;

    console.log(`변환 시작: ${file.name} -> ${targetFormat}`);

    // 업로드된 파일을 임시 경로에 저장
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(inputPath, buffer);

    console.log(`입력 파일 저장 완료: ${inputPath}`);

    // 변환 옵션 구성
    const convertOptions: {
      resolution?: string;
      fps?: number;
      bitrate?: string;
      quality?: string;
      sampleRate?: number;
      channels?: number;
      codec?: string;
      playbackSpeed?: number;
    } = {};
    
    if (resolution && resolution !== 'original') {
      convertOptions.resolution = resolution;
    }
    
    if (fps) {
      convertOptions.fps = Number(fps);
    }
    
    if (bitrate) {
      convertOptions.bitrate = bitrate;
    }
    
    if (quality && ['낮음', '보통', '높음'].includes(quality)) {
      convertOptions.quality = quality;
    }
    
    if (sampleRate) {
      convertOptions.sampleRate = Number(sampleRate);
    }
    
    if (channels) {
      convertOptions.channels = Number(channels);
    }
    
    if (codec) {
      convertOptions.codec = codec;
    }
    
    if (playbackSpeed) {
      convertOptions.playbackSpeed = Number(playbackSpeed);
    }

    console.log('변환 옵션:', convertOptions);

    // 타임아웃 설정으로 비용 제어
    const conversionPromise = convertFile({
      input: inputPath,
      output: outputPath,
      format: targetFormat,
      ...convertOptions
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('변환 시간이 초과되었습니다.')), MAX_CONVERSION_TIME);
    });

    // 파일 변환 실행 (타임아웃 적용)
    const result = await Promise.race([conversionPromise, timeoutPromise]) as { size: number };

    console.log(`변환 완료: ${result.size} bytes`);

    // 사용량 로깅
    logUsage(file.size);

    // 변환된 파일 읽기
    const outputBuffer = await fs.readFile(outputPath);

    // 임시 파일 정리
    try {
      await fs.unlink(inputPath);
      await fs.unlink(outputPath);
      console.log('임시 파일 정리 완료');
    } catch (cleanupError) {
      console.error('파일 정리 중 오류:', cleanupError);
    }

    // 변환된 파일 반환
    return new NextResponse(outputBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${outputFilename}"`,
        'Content-Length': result.size.toString(),
      },
    });

  } catch (error) {
    console.error('변환 오류:', error);
    
    // 타임아웃 오류 처리
    if (error instanceof Error && error.message.includes('변환 시간이 초과')) {
      return NextResponse.json(
        { 
          error: '변환 시간 초과', 
          message: '파일이 너무 크거나 복잡합니다. 더 작은 파일을 시도해주세요.'
        },
        { status: 408 }
      );
    }
    
    // 코덱 오류 처리
    if (error instanceof Error && error.message.includes('지원하지 않는 코덱 조합')) {
      return NextResponse.json(
        { 
          error: '지원하지 않는 변환', 
          message: '선택한 입력/출력 형식 조합을 지원하지 않습니다. 다른 형식을 시도해주세요.'
        },
        { status: 400 }
      );
    }
    
    // 파일 손상 오류 처리
    if (error instanceof Error && error.message.includes('손상된 파일')) {
      return NextResponse.json(
        { 
          error: '파일 손상', 
          message: '입력 파일이 손상되었습니다. 다른 파일을 시도해주세요.'
        },
        { status: 400 }
      );
    }
    
    // 일반적인 변환 오류
    return NextResponse.json(
      { 
        error: '변환 실패', 
        message: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      },
      { status: 500 }
    );
  }
} 