import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { generateInvoicePdf } from '../../../lib/invoice';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = Number(req.query.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });

    const invoice = await prisma.invoice.findUnique({ where: { id }, include: { sale: { include: { items: { include: { document: true } } } } } });
    if (!invoice) return res.status(404).json({ error: 'invoice not found' });

    const pdf = await generateInvoicePdf(invoice.sale, invoice);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.id}.pdf`);
    return res.send(pdf);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
