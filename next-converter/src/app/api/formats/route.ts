import { NextResponse } from 'next/server';
import { SUPPORTED_FORMATS } from '@/lib/universalConverter';

export async function GET() {
  return NextResponse.json(SUPPORTED_FORMATS);
} 