'use client';

export default function usePdfEstimates() {
  const getEstimatedFileSize = (files: FileList | null, operation: string): string => {
    if (!files || files.length === 0) return '알 수 없음';
    let total = 0;
    if (operation === 'split') {
      total = files[0].size / 2;
    } else {
      for (let i = 0; i < files.length; i += 1) {
        total += files[i].size;
      }
      total *= 1.1; // overhead
    }
    const mb = total / (1024 * 1024);
    return mb < 1 ? `${(mb * 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  const getEstimatedTime = (files: FileList | null): string => {
    if (!files || files.length === 0) return '알 수 없음';
    const seconds = files.length * 2 + 3;
    return seconds < 60 ? `${seconds}초` : `${Math.ceil(seconds / 60)}분`;
  };

  return { getEstimatedFileSize, getEstimatedTime };
}
