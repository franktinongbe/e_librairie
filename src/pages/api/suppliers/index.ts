import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { ensureAdmin } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const suppliers = await prisma.supplier.findMany();
      return res.status(200).json(suppliers);
    }

    if (req.method === 'POST') {
      if (!ensureAdmin(req, res)) return;
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: 'name required' });
      const s = await prisma.supplier.create({ data: { name } });
      return res.status(201).json(s);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end();
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
