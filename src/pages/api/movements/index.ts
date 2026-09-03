import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { ensureAdmin } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const moves = await prisma.movement.findMany({ orderBy: { movementDate: 'desc' } });
      return res.status(200).json(moves);
    }

    if (req.method === 'POST') {
      if (!ensureAdmin(req, res)) return;
      const { articleId, type, quantity } = req.body;
      if (!articleId || !type || !quantity) return res.status(400).json({ error: 'articleId,type,quantity required' });
      const m = await prisma.movement.create({ data: { articleId: Number(articleId), type, quantity: Number(quantity) } });
      return res.status(201).json(m);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end();
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
