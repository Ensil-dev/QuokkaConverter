import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { convertFileWithWasm, SUPPORTED_FORMATS } from '@/lib/ffmpegWasm';

// 비용 제어를 위한 제한 설정 (Vercel 배포용)
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB (Vercel 제한)
const MAX_CONVERSION_TIME = 8000; // 8초 (Vercel Hobby 플랜 제한)

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
    // 인증 확인
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: '인증이 필요합니다. 로그인해주세요.' },
        { status: 401 }
      );
    }

    // 허용된 사용자 확인
    const allowedEmails = process.env.ALLOWED_EMAILS?.split(",").map(email => email.trim()) || [];
    if (allowedEmails.length > 0 && session.user?.email && !allowedEmails.includes(session.user.email)) {
      console.log(`접근 거부: ${session.user.email}`);
      return NextResponse.json(
        { error: '접근 권한이 없습니다.' },
        { status: 403 }
      );
    }

    console.log(`변환 요청: ${session.user?.email}`);

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
    const inputExt = file.name.split('.').pop()?.toLowerCase() || '';
    
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

    console.log(`변환 시작: ${file.name} -> ${targetFormat}`);

    // 파일을 ArrayBuffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

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
    const conversionPromise = convertFileWithWasm(
      buffer,
      inputExt,
      targetFormat,
      convertOptions
    );

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('변환 시간이 초과되었습니다.')), MAX_CONVERSION_TIME);
    });

    // 파일 변환 실행 (타임아웃 적용)
    const result = await Promise.race([conversionPromise, timeoutPromise]) as { data: Uint8Array; size: number };

    console.log(`변환 완료: ${result.size} bytes`);

    // 사용량 로깅
    logUsage(file.size);

    // 변환된 파일 반환
    return new NextResponse(result.data, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="converted.${targetFormat}"`,
        'Content-Length': result.size.toString(),
      },
    });

  } catch (error) {
    console.error('변환 오류:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('시간이 초과')) {
        return NextResponse.json(
          { error: '변환 시간이 초과되었습니다. 더 작은 파일로 시도해주세요.' },
          { status: 408 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: '알 수 없는 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 