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

  return (
    <div className="max-w-md">
      <label htmlFor="max-upload" className="block pb-[12px] font-medium">
        최대 업로드 크기 (MB)
      </label>
      <div className="flex">
        <input
          id="max-upload"
          type="number"
          min={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex w-1/3 rounded border px-3 py-2"
        />
        <button type="button" onClick={save} className="w-[50px] rounded bg-blue ml-[12px] px-4 py-4 text-white">
          저장
        </button>
      </div>
      <p className="pt-[12px] text-sm text-gray-500">현재 설정: {maxUploadSize}MB</p>
    </div>
  );
}
