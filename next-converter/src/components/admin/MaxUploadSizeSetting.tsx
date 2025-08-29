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
    <div className="max-w-md space-y-2">
      <label htmlFor="max-upload" className="block font-medium">
        최대 업로드 크기 (MB)
      </label>
      <div className="flex items-center gap-2">
        <input
          id="max-upload"
          type="number"
          min={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 rounded border px-3 py-2"
        />
        <button
          type="button"
          onClick={save}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          저장
        </button>
      </div>
      <p className="text-sm text-gray-500">현재 설정: {maxUploadSize}MB</p>
    </div>
  );
}
