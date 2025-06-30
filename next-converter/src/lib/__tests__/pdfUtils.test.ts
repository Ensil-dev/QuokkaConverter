import { PDFDocument } from 'pdf-lib';
import { imagesToPdf, mergePdfs, splitPdf } from '../pdfUtils';

const redDot = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=',
  'base64'
);

const gifDot = Buffer.from(
  'R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=',
  'base64'
);

describe('pdf utils', () => {
  test('imagesToPdf creates pdf with same page count as images', async () => {
    const result = await imagesToPdf([redDot]);
    const doc = await PDFDocument.load(result);
    expect(doc.getPageCount()).toBe(1);
  });

  test('imagesToPdf throws error for unsupported format', async () => {
    await expect(imagesToPdf([gifDot])).rejects.toThrow(
      '지원하지 않는 이미지 형식입니다. (JPG, PNG만 가능)'
    );
  });

  test('mergePdfs merges pages', async () => {
    const doc1 = await PDFDocument.create();
    doc1.addPage();
    const doc2 = await PDFDocument.create();
    doc2.addPage();
    const buf1 = await doc1.save();
    const buf2 = await doc2.save();
    const merged = await mergePdfs([new Uint8Array(buf1), new Uint8Array(buf2)]);
    const finalDoc = await PDFDocument.load(merged);
    expect(finalDoc.getPageCount()).toBe(2);
  });

  test('splitPdf extracts page', async () => {
    const doc = await PDFDocument.create();
    doc.addPage();
    doc.addPage();
    const buf = await doc.save();
    const page1 = await splitPdf(new Uint8Array(buf), 2);
    const result = await PDFDocument.load(page1);
    expect(result.getPageCount()).toBe(1);
  });
});
