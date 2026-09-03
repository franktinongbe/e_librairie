import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getPayloadFromRequest } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') return res.status(405).end();

    const payload = getPayloadFromRequest(req);
    if (!payload) return res.status(401).json({ error: 'Unauthorized' });

    // Admin can list all sales
    if (payload.role === 'ADMIN') {
      const list = await prisma.sale.findMany({ orderBy: { createdAt: 'desc' }, include: { items: { include: { document: true } } } });
      return res.status(200).json(list);
    }

    // Non-admin: return sales belonging to the logged-in user's email
    const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const list = await prisma.sale.findMany({ where: { customerEmail: user.email }, orderBy: { createdAt: 'desc' }, include: { items: { include: { document: true } } } });
    return res.status(200).json(list);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
