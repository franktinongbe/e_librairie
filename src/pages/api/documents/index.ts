import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { ensureAdmin } from '../../../lib/auth';
import { documentCreateSchema } from '../../../lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { categoryId } = req.query;
      const where: any = {};
      if (categoryId) where.categoryId = Number(categoryId);
      const docs = await prisma.document.findMany({ where });
      return res.status(200).json(docs);
    }

    if (req.method === 'POST') {
      // admin only
      if (!ensureAdmin(req, res)) return;

      try {
        // accept both `isbn` (frontend) and `reference` (db)
        const body: any = req.body || {};
        if (body.isbn && !body.reference) body.reference = body.isbn;
        const data = documentCreateSchema.parse(body);
        const payload: any = { ...data };
        // map reference -> prisma.reference
        if (payload.reference) payload.reference = payload.reference;
        const doc = await prisma.document.create({ data: { ...payload } });
        return res.status(201).json(doc);
      } catch (err: any) {
        return res.status(400).json({ error: err.message || 'Invalid input' });
      }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
