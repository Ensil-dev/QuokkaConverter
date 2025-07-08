export const SUPPORTED_FORMATS = {
  video: {
    input: ['mp4', 'avi', 'mov', 'mkv', 'webm'],
    output: ['mp4', 'avi', 'mov', 'mkv', 'webm', 'gif'],
  },
  audio: {
    input: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'],
    output: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'],
  },
  image: {
    input: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    output: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  },
};

export type FileCategory = 'video' | 'audio' | 'image' | null;

export function detectFileType(nameOrExt: string): FileCategory {
  const ext = nameOrExt.includes('.')
    ? nameOrExt.split('.').pop()?.toLowerCase()
    : nameOrExt.toLowerCase();
  if (!ext) return null;
  if (SUPPORTED_FORMATS.video.input.includes(ext) || SUPPORTED_FORMATS.video.output.includes(ext))
    return 'video';
  if (SUPPORTED_FORMATS.audio.input.includes(ext) || SUPPORTED_FORMATS.audio.output.includes(ext))
    return 'audio';
  if (SUPPORTED_FORMATS.image.input.includes(ext) || SUPPORTED_FORMATS.image.output.includes(ext))
    return 'image';
  return null;
}

export function isConversionSupported(input: string, output: string): boolean {
  const inputType = detectFileType(input);
  const outputType = detectFileType(output);
  if (!inputType || !outputType) return false;
  if (inputType === outputType) return true;
  return inputType === 'video' && (outputType === 'audio' || outputType === 'image');
}
