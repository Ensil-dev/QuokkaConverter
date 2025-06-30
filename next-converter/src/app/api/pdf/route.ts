import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { imagesToPdf, mergePdfs, splitPdf } from '@/lib/pdfUtils';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  const formData = await request.formData();
  const operation = formData.get('operation') as string;

  try {
    if (operation === 'images') {
      const files = formData.getAll('files') as File[];
      if (!files.length) {
        return NextResponse.json({ error: '파일을 업로드하세요.' }, { status: 400 });
      }
      const buffers = await Promise.all(files.map(async (f) => new Uint8Array(await f.arrayBuffer())));
      const pdf = await imagesToPdf(buffers);
      return new NextResponse(pdf, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="converted.pdf"'
        }
      });
    }

    if (operation === 'merge') {
      const files = formData.getAll('files') as File[];
      if (files.length < 2) {
        return NextResponse.json({ error: '두 개 이상의 PDF를 업로드하세요.' }, { status: 400 });
      }
      const buffers = await Promise.all(files.map(async (f) => new Uint8Array(await f.arrayBuffer())));
      const merged = await mergePdfs(buffers);
      return new NextResponse(merged, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="merged.pdf"'
        }
      });
    }

    if (operation === 'split') {
      const file = formData.get('file') as File;
      const page = Number(formData.get('page') || '1');
      if (!file) {
        return NextResponse.json({ error: 'PDF 파일을 업로드하세요.' }, { status: 400 });
      }
      const buffer = new Uint8Array(await file.arrayBuffer());
      const result = await splitPdf(buffer, page);
      return new NextResponse(result, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="page-${page}.pdf"`
        }
      });
    }

    return NextResponse.json({ error: '잘못된 작업입니다.' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : '처리 중 오류 발생';
    if (message === '지원하지 않는 이미지 형식입니다. (JPG, PNG만 가능)') {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
