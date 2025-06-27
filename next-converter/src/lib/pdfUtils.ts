import { PDFDocument } from 'pdf-lib';

export async function imagesToPdf(images: Uint8Array[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  for (const img of images) {
    let embedded;
    try {
      embedded = await pdfDoc.embedJpg(img);
    } catch {
      embedded = await pdfDoc.embedPng(img);
    }
    const { width, height } = embedded.scale(1);
    const page = pdfDoc.addPage([width, height]);
    page.drawImage(embedded, { x: 0, y: 0, width, height });
  }
  const bytes = await pdfDoc.save();
  return new Uint8Array(bytes);
}

export async function mergePdfs(pdfs: Uint8Array[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();
  for (const pdfBytes of pdfs) {
    const pdf = await PDFDocument.load(pdfBytes);
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((p: any) => merged.addPage(p));
  }
  const bytes = await merged.save();
  return new Uint8Array(bytes);
}

export async function splitPdf(pdf: Uint8Array, page: number): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdf);
  const total = doc.getPageCount();
  if (page < 1 || page > total) throw new Error('잘못된 페이지 번호');
  const newDoc = await PDFDocument.create();
  const [copied] = await newDoc.copyPages(doc, [page - 1]);
  newDoc.addPage(copied);
  const bytes = await newDoc.save();
  return new Uint8Array(bytes);
}
