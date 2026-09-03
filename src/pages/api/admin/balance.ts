import type { NextApiRequest, NextApiResponse } from 'next';
import { ensureAdmin } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const payload = ensureAdmin(req, res);
  if (!payload) return;

  try {
    const result = await prisma.sale.aggregate({
      _sum: { total: true },
    });
    const total = result._sum.total ?? 0;
    res.status(200).json({ balance: Number(total) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to compute balance' });
  }
}
