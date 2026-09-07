import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { generateInvoicePdf } from '../../../lib/invoice';
import { sendMail } from '../../../lib/mailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = Number(req.query.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { sale: { include: { items: { include: { document: true } } } } }
    });
    if (!invoice) return res.status(404).json({ error: 'invoice not found' });

    if (req.method === 'POST') {
      const sale = invoice.sale;
      if (!sale?.customerEmail) {
        return res.status(400).json({ error: 'Aucun email client pour cette facture' });
      }

      const pdf = await generateInvoicePdf(sale as any, invoice);
      await sendMail({
        to: sale.customerEmail,
        from: process.env.EMAIL_FROM,
        subject: `Facture #${invoice.id}`,
        text: `Bonjour ${sale.customerName || 'client'},\n\nVous trouverez ci-joint votre facture #${invoice.id}.\nMerci pour votre commande.`,
        html: `<p>Bonjour ${sale.customerName || 'client'},</p><p>Vous trouverez ci-joint votre facture #${invoice.id}.</p><p>Merci pour votre commande.</p>`,
        attachments: [{ filename: `facture-${invoice.id}.pdf`, content: pdf }]
      });

      await prisma.invoice.update({ where: { id }, data: { sent: true, sentAt: new Date() } });
      return res.status(200).json({ success: true, invoiceId: invoice.id });
    }

    if (req.method !== 'GET') return res.status(405).end('Method Not Allowed');

    const pdf = await generateInvoicePdf(invoice.sale, invoice);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.id}.pdf`);
    return res.send(pdf);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
