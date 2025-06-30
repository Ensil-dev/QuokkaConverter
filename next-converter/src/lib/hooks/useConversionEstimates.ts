'use client';

export function estimateVideoDuration(
  sizeInMB: number,
  resolution: string,
  fps: number,
  quality: string,
): number {
  let bitrate = 2000;
  if (resolution === '640x360') bitrate = 800;
  else if (resolution === '1280x720') bitrate = 1500;
  else if (resolution === '1920x1080') bitrate = 3000;

  if (quality === '낮음') bitrate *= 0.7;
  else if (quality === '높음') bitrate *= 1.3;

  return (sizeInMB * 8 * 1024) / bitrate;
}

export function estimateAudioDuration(sizeInMB: number, quality: string): number {
  let bitrate = 128;
  if (quality === '낮음') bitrate = 64;
  else if (quality === '높음') bitrate = 320;
  return (sizeInMB * 8 * 1024) / bitrate;
}

export function getGifSizePerMinute(
  resolution: string,
  fps: number,
  quality: string,
): number {
  let sizePerMinute = 10;
  if (resolution === '640x360') sizePerMinute = 5;
  else if (resolution === '1280x720') sizePerMinute = 15;
  else if (resolution === '1920x1080') sizePerMinute = 30;

  if (fps > 15) sizePerMinute *= 1.5;
  if (fps > 20) sizePerMinute *= 1.3;

  if (quality === '낮음') sizePerMinute *= 0.5;
  else if (quality === '높음') sizePerMinute *= 1.5;

  return sizePerMinute;
}

export function getEstimatedTime(
  fileSize: number,
  inputType: string | null,
  outputFormat: string,
  playbackSpeed: number,
  resolution: string,
  fps: number,
  videoQuality: string,
  audioQuality: string,
): string {
  const sizeInMB = fileSize / (1024 * 1024);
  let estimatedSeconds = 0;

  if (inputType === 'video') {
    const baseTime = estimateVideoDuration(sizeInMB, resolution, fps, videoQuality);
    estimatedSeconds = baseTime / playbackSpeed;
  } else if (inputType === 'audio') {
    estimatedSeconds = estimateAudioDuration(sizeInMB, audioQuality);
  } else if (inputType === 'image') {
    estimatedSeconds = 5;
  }

  return estimatedSeconds < 60
    ? `${Math.ceil(estimatedSeconds)}초`
    : `${Math.ceil(estimatedSeconds / 60)}분`;
}

export function getEstimatedFileSize(
  fileSize: number,
  inputType: string | null,
  outputFormat: string,
  playbackSpeed: number,
  resolution: string,
  fps: number,
  bitrate: string,
  videoQuality: string,
  audioQuality: string,
  imageQuality: string,
): string {
  const sizeInMB = fileSize / (1024 * 1024);
  let estimatedSize = sizeInMB;

  if (inputType === 'video') {
    if (outputFormat === 'gif') {
      const sizePerMinute = getGifSizePerMinute(resolution, fps, videoQuality);
      const duration = estimateVideoDuration(sizeInMB, resolution, fps, videoQuality) / 60;
      estimatedSize = sizePerMinute * duration;
    } else {
      let qualityFactor = 1;
      if (videoQuality === '낮음') qualityFactor = 0.6;
      else if (videoQuality === '높음') qualityFactor = 1.4;

      let resolutionFactor = 1;
      if (resolution === '640x360') resolutionFactor = 0.5;
      else if (resolution === '1280x720') resolutionFactor = 0.8;
      else if (resolution === '1920x1080') resolutionFactor = 1.2;

      estimatedSize = sizeInMB * qualityFactor * resolutionFactor;
    }
  } else if (inputType === 'audio') {
    if (audioQuality === '낮음') estimatedSize *= 0.5;
    else if (audioQuality === '높음') estimatedSize *= 1.5;
  } else if (inputType === 'image') {
    if (imageQuality === '낮음') estimatedSize *= 0.3;
    else if (imageQuality === '높음') estimatedSize *= 1.5;
  }

  if (outputFormat === 'webp') {
    estimatedSize *= 0.3;
  }

  return estimatedSize < 1
    ? `${(estimatedSize * 1024).toFixed(1)} KB`
    : `${estimatedSize.toFixed(1)} MB`;
}

export default function useConversionEstimates() {
  return { getEstimatedTime, getEstimatedFileSize };
}

