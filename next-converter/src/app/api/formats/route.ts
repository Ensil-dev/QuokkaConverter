import { NextResponse } from 'next/server';
import { SUPPORTED_FORMATS } from '@/lib/utils/fileFormats';

export async function GET() {
  return NextResponse.json(SUPPORTED_FORMATS);
} 