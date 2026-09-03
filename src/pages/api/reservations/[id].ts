import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = Number(req.query.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });

    if (req.method === 'GET') {
      const r = await prisma.reservation.findUnique({ where: { id } });
      if (!r) return res.status(404).json({ error: 'not found' });
      return res.status(200).json(r);
    }

    if (req.method === 'PUT') {
      const { status } = req.body;
      if (!status) return res.status(400).json({ error: 'status required' });
      const updated = await prisma.reservation.update({ where: { id }, data: { status } });
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      await prisma.reservation.delete({ where: { id } });
      return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
