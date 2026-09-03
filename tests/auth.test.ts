import { createMocks } from 'node-mocks-http';
import registerHandler from '../src/pages/api/auth/register';
import loginHandler from '../src/pages/api/auth/login';
import meHandler from '../src/pages/api/auth/me';
import prisma from '../src/lib/prisma';
import jwt from 'jsonwebtoken';

jest.mock('../src/lib/prisma');

describe('Auth API', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('register creates user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: 1, name: 'Test', email: 't@t', role: 'VENDEUR' });

    const { req, res } = createMocks({ method: 'POST', body: { name: 'Test', email: 't@t', password: 'p' } });
    await registerHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(201);
  });

  test('login returns token', async () => {
    const hashed = require('bcryptjs').hashSync('p', 10);
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: 't@t', passwordHash: hashed, name: 'Test', role: 'VENDEUR' });

    const { req, res } = createMocks({ method: 'POST', body: { email: 't@t', password: 'p' } });
    await loginHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.token).toBeDefined();
  });

  test('me returns user when authorized', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, email: 't@t', name: 'Test', role: 'VENDEUR' });
    const token = jwt.sign({ sub: '1', role: 'VENDEUR' }, process.env.JWT_SECRET || 'dev-secret');
    const { req, res } = createMocks({ method: 'GET', headers: { authorization: `Bearer ${token}` } });
    await meHandler(req as any, res as any);
    expect(res._getStatusCode()).toBe(200);
  });
});
