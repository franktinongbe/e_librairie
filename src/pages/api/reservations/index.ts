import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // listing all reservations is admin-only
      const { ensureAdmin } = await import('../../../lib/auth');
      if (!ensureAdmin(req, res)) return;
      const list = await prisma.reservation.findMany({ orderBy: { createdAt: 'desc' } });
      return res.status(200).json(list);
    }

    if (req.method === 'POST') {
      const { documentId, userEmail, quantity } = req.body;
      if (!documentId || !userEmail || !quantity) return res.status(400).json({ error: 'documentId, userEmail and quantity required' });

      // A simple visitor can reserve without being logged in; admin pages remain protected separately.
      const doc = await prisma.document.findUnique({ where: { id: Number(documentId) } });
      if (!doc) return res.status(404).json({ error: 'document not found' });
      if (doc.stock < Number(quantity)) return res.status(400).json({ error: 'insufficient stock for reservation' });

      // set expiration in 24 hours by default
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const reservation = await prisma.reservation.create({ data: { documentId: Number(documentId), userEmail, quantity: Number(quantity), expiresAt } });
      return res.status(201).json(reservation);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
