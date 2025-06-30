import { SUPPORTED_FORMATS } from './fileFormats';

export function getAvailableOutputFormats(inputType: string): string[] {
  const formats = new Set<string>();
  if (inputType === 'video') {
    SUPPORTED_FORMATS.video.output.forEach((f) => formats.add(f));
    ['jpg', 'png', 'webp', 'mp3', 'aac', 'wav'].forEach((f) => formats.add(f));
  } else if (inputType === 'audio') {
    SUPPORTED_FORMATS.audio.output.forEach((f) => formats.add(f));
  } else if (inputType === 'image') {
    SUPPORTED_FORMATS.image.output.forEach((f) => formats.add(f));
  }
  return Array.from(formats).sort();
}
