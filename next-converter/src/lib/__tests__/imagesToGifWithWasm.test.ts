import path from 'path';
import fs from 'fs/promises';
import { imagesToGifWithWasm } from '../ffmpegWasm';

const redWebp = Buffer.from(
  'UklGRkAAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAIAAAAAAFZQOCAYAAAAMAEAnQEqAQABAAIANCWkAANwAP77/VAA',
  'base64'
);
const redWebp2 = Buffer.from(
  'UklGRkAAAABXRUJQVlA4WAoAAAAQAAAAAQAAAQAAQUxQSAIAAAAAAFZQOCAYAAAAMAEAnQEqAQABAAIANCWkAANwAP77/VAA',
  'base64'
);

function toArrayBuffer(buf: Buffer): ArrayBuffer {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

function countGifFrames(buf: Uint8Array): number {
  let count = 0;
  for (let i = 0; i < buf.length - 2; i++) {
    if (buf[i] === 0x21 && buf[i + 1] === 0xf9 && buf[i + 2] === 0x04) {
      count++;
    }
  }
  return count;
}

function getColorTableSize(buf: Uint8Array): number {
  const packed = buf[10];
  if ((packed & 0x80) === 0) return 0;
  const sizeCode = packed & 0x07;
  return 2 ** (sizeCode + 1);
}

let originalFetch: typeof fetch;

beforeAll(() => {
  const ffmpegPath = path.resolve(__dirname, '../../../public/ffmpeg');
  process.env.NEXT_PUBLIC_FFMPEG_BASE_URL = `file://${ffmpegPath}`;
  originalFetch = global.fetch;
  global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof Request
        ? input.url
        : (input as URL).href;
    if (url.startsWith('file://')) {
      const filePath = url.slice('file://'.length);
      const data = await fs.readFile(filePath);
      return new Response(data);
    }
    return originalFetch(input, init);
  }) as typeof fetch;
});

afterAll(() => {
  global.fetch = originalFetch;
});

test('GIF frame count matches input image count', async () => {
  const inputs = [redWebp, redWebp, redWebp].map((buf) => ({
    buffer: toArrayBuffer(buf),
    ext: 'webp',
  }));
  const result = await imagesToGifWithWasm(inputs, 5);
  expect(countGifFrames(result.data)).toBe(inputs.length);
});

test('GIF palette size reflects quality setting', async () => {
  const inputs = [redWebp, redWebp, redWebp].map((buf) => ({
    buffer: toArrayBuffer(buf),
    ext: 'webp',
  }));
  const result = await imagesToGifWithWasm(inputs, 5, '높음');
  expect(getColorTableSize(result.data)).toBe(128);
});

test('single image to GIF works', async () => {
  const inputs = [redWebp].map((buf) => ({
    buffer: toArrayBuffer(buf),
    ext: 'webp',
  }));
  const result = await imagesToGifWithWasm(inputs, 5);
  expect(countGifFrames(result.data)).toBe(1);
});

test('handles images with different resolutions', async () => {
  const inputs = [redWebp, redWebp2].map((buf) => ({
    buffer: toArrayBuffer(buf),
    ext: 'webp',
  }));
  const result = await imagesToGifWithWasm(inputs, 5);
  expect(result.size).toBeGreaterThan(0);
});
