'use client';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';

interface NativeFileInputProps {
  id: string;
  accept?: string;
  multiple?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

export default function NativeFileInput({
  id,
  accept,
  multiple,
  onChange,
  required,
  className
}: NativeFileInputProps) {
  const locale = useLocale();

  useEffect(() => {
    // HTML lang 속성을 설정하여 브라우저가 해당 언어로 표시하도록 유도
    // (완전히 보장되지는 않지만 일부 브라우저에서 효과 있음)
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <input
      id={id}
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={onChange}
      required={required}
      className={className}
      // lang 속성으로 브라우저에게 언어 힌트 제공
      lang={locale}
    />
  );
}