'use client';
import { signIn } from 'next-auth/react';

export function loginWithGoogle() {
  signIn('google', { callbackUrl: '/convert' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function makeFilename(original: string, ext: string): string {
  const base = original
    .split(/[/\\]/)
    .pop()
    ?.replace(/\.[^.]+$/, '') || 'result';
  const cleanExt = ext.startsWith('.') ? ext : `.${ext}`;
  return `${base}${cleanExt}`;
}
