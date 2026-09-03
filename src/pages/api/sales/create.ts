import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { generateInvoicePdf } from '../../../lib/invoice';
import { sendMail } from '../../../lib/mailer';
import { requireRole } from '../../../lib/auth';
import { orderConfirmationTemplate } from '../../../lib/emailTemplates';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

    // Roles allowed to create a sale: VENDEUR, GESTIONNAIRE, ADMIN
    if (!requireRole(req, res, ['VENDEUR', 'GESTIONNAIRE', 'ADMIN'])) return;
    const { items, customerEmail } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'items required' });

    // Fetch documents
    const docIds = items.map((i: any) => Number(i.documentId));
    const docs = await prisma.document.findMany({ where: { id: { in: docIds } } });
    const docsMap = new Map(docs.map((d) => [d.id, d]));

    // Validate stock
    for (const it of items) {
      const doc = docsMap.get(Number(it.documentId));
      if (!doc) return res.status(400).json({ error: `document ${it.documentId} not found` });
      if (doc.stock < Number(it.quantity)) return res.status(400).json({ error: `insufficient stock for document ${doc.id}` });
    }

    // Transaction: create sale, sale items, decrement stock, stock movements, invoice
    const result = await prisma.$transaction(async (tx) => {
      const total = items.reduce((acc: number, it: any) => {
        const p = docsMap.get(Number(it.documentId))!.price || 0;
        return acc + p * Number(it.quantity);
      }, 0);

      const sale = await tx.sale.create({ data: { total, customerEmail: customerEmail || null } });

      for (const it of items) {
        const documentId = Number(it.documentId);
        const quantity = Number(it.quantity);
        const price = docsMap.get(documentId)!.price;

        await tx.saleItem.create({ data: { saleId: sale.id, documentId, quantity, unitPrice: price } });

        await tx.document.update({ where: { id: documentId }, data: { stock: { decrement: quantity } } });

        await tx.stockMovement.create({ data: { documentId, quantity: -quantity, reason: 'SALE' } });
      }

      const invoice = await tx.invoice.create({ data: { saleId: sale.id } });
      return { sale, invoice };
    });

    // Reload sale with items and documents for invoice
    const saleWithItems = await prisma.sale.findUnique({ where: { id: result.sale.id }, include: { items: { include: { document: true } } } });

    // Generate PDF
    const pdfBuffer = await generateInvoicePdf(saleWithItems!, result.invoice);

    // send email if requested
    if (customerEmail) {
      const tpl = orderConfirmationTemplate(result.sale, saleWithItems);
      await sendMail({
        to: customerEmail,
        from: process.env.EMAIL_FROM,
        subject: tpl.subject,
        text: tpl.text,
        html: tpl.html,
        attachments: [{ filename: `invoice-${result.invoice.id}.pdf`, content: pdfBuffer }]
      });

      await prisma.invoice.update({ where: { id: result.invoice.id }, data: { sent: true, sentAt: new Date() } });
    }

    // Check low stock and send alert if below threshold
    try {
      const threshold = Number(process.env.STOCK_THRESHOLD || 5);
      const alertEmail = process.env.ALERT_EMAIL;
      if (alertEmail) {
        for (const it of items) {
          const documentId = Number(it.documentId);
          const doc = await prisma.document.findUnique({ where: { id: documentId } });
          if (doc && doc.stock <= threshold) {
            await sendMail({
              to: alertEmail,
              from: process.env.EMAIL_FROM,
              subject: `Alerte stock faible: ${doc.title}`,
              text: `Le stock du document \"${doc.title}\" (id: ${doc.id}) est bas: ${doc.stock} unités restantes.`
            });
          }
        }
      }
    } catch (alertErr) {
      console.error('Error sending stock alert', alertErr);
    }

    return res.status(201).json({ saleId: result.sale.id, invoiceId: result.invoice.id });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
