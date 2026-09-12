import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getPayloadFromRequest, ensureAdmin } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = Number(req.query.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });

    if (req.method === 'GET') {
      const r = await prisma.reservation.findUnique({ where: { id } });
      if (!r) return res.status(404).json({ error: 'not found' });

      const payload = getPayloadFromRequest(req);
      // allow admin
      if (payload && payload.role === 'ADMIN') return res.status(200).json(r);
      // allow public owner lookup only when email query matches reservation email
      const qEmail = String(req.query.email || '').trim();
      if (qEmail && qEmail === r.userEmail) return res.status(200).json(r);

      return res.status(403).json({ error: 'Forbidden' });
    }

    if (req.method === 'PUT') {
      // admin only
      if (!ensureAdmin(req, res)) return;
      // Reservation model currently has no updatable 'status' field.
      return res.status(400).json({ error: 'No updatable fields for reservation' });
    }

    if (req.method === 'DELETE') {
      // admin only
      if (!ensureAdmin(req, res)) return;
      await prisma.reservation.delete({ where: { id } });
      return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
