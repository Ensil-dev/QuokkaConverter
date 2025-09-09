'use client';

import { useAtom } from 'jotai';
import { useState } from 'react';
import { maxUploadSizeAtom } from '@/lib/atoms';

export default function MaxUploadSizeSetting() {
  const [maxUploadSize, setMaxUploadSize] = useAtom(maxUploadSizeAtom);
  const [value, setValue] = useState(maxUploadSize.toString());

  const save = () => {
    const num = parseInt(value, 10);
    if (!Number.isNaN(num) && num > 0) {
      setMaxUploadSize(num);
    }
  };

  const formatSize = (sizeInMB: number) => {
    if (sizeInMB >= 1000) {
      return `${(sizeInMB / 1000).toFixed(1)}GB`;
    }
    return `${sizeInMB}MB`;
  };

  return (
    <div>
      <h3 className='pb-[8px]'>파일 업로드 제한 설정</h3>
      <p className='pb-[8px]'>최대 업로드 파일 크기: {formatSize(maxUploadSize)}</p>
      <div className='flex'>
        <input
          type="number"
          min={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          className='bg-red-600 text-white border-none p-[8px] rounded-[12px] ml-[8px] w-[50px] text-sm font-medium cursor-pointer transition-all duration-300 hover:bg-red-700 hover:-translate-y-px'
          onClick={save}
        >
          저장
        </button>
      </div>
    </div>
  );
}
