import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { ensureAdmin } from '../../../lib/auth';
import { categorySchema } from '../../../lib/validators';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const categories = await prisma.category.findMany({ include: { documents: true } });
      return res.status(200).json(categories);
    }

    if (req.method === 'POST') {
      // admin only
      if (!ensureAdmin(req, res)) return;

      try {
        const { name } = categorySchema.parse(req.body);
        const category = await prisma.category.create({ data: { name } });
        return res.status(201).json(category);
      } catch (err: any) {
        return res.status(400).json({ error: err.message || 'Invalid input' });
      }
    }

    if (req.method === 'PUT') {
      if (!ensureAdmin(req, res)) return;
      try {
        const { id, name } = req.body as any;
        if (!id) return res.status(400).json({ error: 'Missing id' });
        const category = await prisma.category.update({ where: { id: Number(id) }, data: { name } });
        return res.status(200).json(category);
      } catch (err: any) { return res.status(400).json({ error: err.message || 'Invalid input' }); }
    }

    if (req.method === 'DELETE') {
      if (!ensureAdmin(req, res)) return;
      try {
        const { id } = req.body as any;
        if (!id) return res.status(400).json({ error: 'Missing id' });
        await prisma.category.delete({ where: { id: Number(id) } });
        return res.status(200).json({ ok: true });
      } catch (err: any) { return res.status(400).json({ error: err.message || 'Invalid input' }); }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
