import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { ensureAdmin } from '../../../lib/auth';
import { documentUpdateSchema } from '../../../lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const id = Number(req.query.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'invalid id' });

    if (req.method === 'GET') {
      const doc = await prisma.document.findUnique({ where: { id } });
      if (!doc) return res.status(404).json({ error: 'not found' });
      return res.status(200).json(doc);
    }

    if (req.method === 'PUT') {
      // admin only
      if (!ensureAdmin(req, res)) return;

      try {
        const body: any = req.body || {};
        if (body.isbn && !body.reference) body.reference = body.isbn;
        const data = documentUpdateSchema.parse(body);
        const updated = await prisma.document.update({ where: { id }, data: { ...data } });
        return res.status(200).json(updated);
      } catch (err: any) {
        return res.status(400).json({ error: err.message || 'Invalid input' });
      }
    }

    if (req.method === 'DELETE') {
      // admin only
      if (!ensureAdmin(req, res)) return;

      await prisma.document.delete({ where: { id } });
      return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
