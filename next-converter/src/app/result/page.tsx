'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const url = searchParams.get('url');
  const filename = searchParams.get('filename') || 'converted.file';
  const size = searchParams.get('size');

  if (!url) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>잘못된 접근입니다.</p>
      </div>
    );
  }

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="result">
        <h2>변환 결과</h2>
        {size && <p>파일 크기: {size} MB</p>}
        <button onClick={handleDownload} className="download-btn">파일 다운로드</button>
        <button onClick={() => router.push('/convert')} className="mt-4 px-4 py-2 border rounded">다시 변환하기</button>
      </div>
    </div>
  );
}
