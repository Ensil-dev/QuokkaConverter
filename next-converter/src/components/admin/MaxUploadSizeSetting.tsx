'use client';

import { useAtom } from 'jotai';
import { useState } from 'react';
import { maxUploadSizeAtom } from '@/lib/atoms';
import { useTranslations } from 'next-intl';

export default function MaxUploadSizeSetting() {
  const t = useTranslations('Admin');
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
        {t('maxUploadSize')}
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
          {t('save')}
        </button>
      </div>
      <p className="pt-[12px] text-sm text-gray-500">
        {t('currentSetting', { size: maxUploadSize })}
      </p>
    </div>
  );
}
