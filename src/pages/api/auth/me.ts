import type { NextApiRequest, NextApiResponse } from 'next';
import { getPayloadFromRequest } from '../../../lib/auth';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const payload = getPayloadFromRequest(req);
    if (!payload) return res.status(401).json({ error: 'Unauthorized' });

    const user = await prisma.user.findUnique({ where: { id: Number(payload.sub) } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
