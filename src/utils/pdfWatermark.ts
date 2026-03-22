import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";

const PDF_MIME = "application/pdf";

export const addDiagonalWatermarkToPdf = async (
  file: File,
  watermarkText: string = "WEBUILDGAME"
): Promise<File> => {
  if (file.type !== PDF_MIME) {
    throw new Error("Only PDF files are supported for watermarking");
  }

  const fileBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: false });
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const fontSize = Math.max(24, Math.floor(Math.min(width, height) * 0.08));
    const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);

    page.drawText(watermarkText, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(1, 0.67, 0),
      opacity: 0.12,
      rotate: degrees(-35),
    });
  });

  const watermarkedBytes = await pdfDoc.save();
  const outputBytes = new Uint8Array(watermarkedBytes.byteLength);
  outputBytes.set(watermarkedBytes);

  return new File([outputBytes], file.name, {
    type: PDF_MIME,
    lastModified: Date.now(),
  });
};
