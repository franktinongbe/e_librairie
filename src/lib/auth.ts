import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

type UserPayload = {
  sub: string; // user id
  role: string;
  iat?: number;
  exp?: number;
};

const SECRET = process.env.JWT_SECRET || 'dev-secret';

export function signToken(userId: string | number, role: string, opts?: { expiresIn?: string | number }) {
  return jwt.sign({ sub: String(userId), role }, SECRET, { expiresIn: opts?.expiresIn || '7d' });
}

export function verifyToken(token: string): UserPayload {
  return jwt.verify(token, SECRET) as UserPayload;
}

export function getTokenFromHeader(req: NextApiRequest) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  return auth.split(' ')[1];
}

export function getPayloadFromRequest(req: NextApiRequest): UserPayload | null {
  const token = getTokenFromHeader(req);
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch (err) {
    return null;
  }
}

export function requireRole(req: NextApiRequest, res: NextApiResponse, allowed: string | string[]) {
  const payload = getPayloadFromRequest(req);
  if (!payload) {
    res.status(401).json({ error: 'Unauthorized' });
    return null;
  }
  const roles = Array.isArray(allowed) ? allowed : [allowed];
  if (!roles.includes(payload.role)) {
    res.status(403).json({ error: 'Forbidden' });
    return null;
  }
  return payload;
}

export function ensureAdmin(req: NextApiRequest, res: NextApiResponse) {
  return requireRole(req, res, 'ADMIN');
}

export function generateAdminToken(subject: string, opts?: { expiresIn?: string | number }) {
  return signToken(subject, 'ADMIN', opts);
}
