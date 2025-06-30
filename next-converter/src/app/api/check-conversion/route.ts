import { NextRequest, NextResponse } from 'next/server';
import { isConversionSupported } from '@/lib/utils/fileFormats';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inputFormat, outputFormat } = body;
    const isSupported = isConversionSupported(inputFormat, outputFormat);
    return NextResponse.json({ supported: isSupported });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '알 수 없는 오류' },
      { status: 400 }
    );
  }
} 