import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { getPayloadFromRequest } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password are required' });

    // Only an authenticated ADMIN can create users. Public registration is disabled.
    const payload = getPayloadFromRequest(req);
    if (!payload || payload.role !== 'ADMIN') return res.status(403).json({ error: 'Only ADMIN can create users' });
    // Admin may specify the role when creating a user; default to VENDEUR if not provided.
    const createRole = role || 'VENDEUR';

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const u = await prisma.user.create({ data: { name, email, passwordHash: hash, role: createRole as any } });
    return res.status(201).json({ id: u.id, email: u.email, name: u.name, role: u.role });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
