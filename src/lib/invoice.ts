import { Sale, Invoice } from '@prisma/client';
import PDFDocument from 'pdfkit';

export async function generateInvoicePdf(sale: Sale & { items?: any[] }, invoice: Invoice) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks: Buffer[] = [];
  doc.on('data', (c) => chunks.push(c));

  doc.fontSize(20).text('Facture', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Facture #: ${invoice?.id ?? 'N/A'}`);
  const invoiceDate = invoice && invoice.createdAt ? new Date(invoice.createdAt).toISOString() : (sale && (sale as any).createdAt ? new Date((sale as any).createdAt).toISOString() : new Date().toISOString());
  doc.text(`Date: ${invoiceDate}`);
  doc.moveDown();

  if (sale.items && sale.items.length) {
    doc.text('Détails:', { underline: true });
    sale.items.forEach((it) => {
      const title = it.document?.title || `Document ${it.documentId}`;
      const unit = Number(it.unitPrice || 0);
      const qty = Number(it.quantity || 0);
      doc.text(`${title} — ${qty} x ${unit.toFixed(2)} = ${(qty * unit).toFixed(2)}`);
    });
    doc.moveDown();
  }

  const total = Number((sale as any).total || 0);
  doc.text(`Total: ${total.toFixed(2)}`);

  doc.end();

  return new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });
}
