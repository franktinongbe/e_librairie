import { createRequest, createResponse } from 'node-mocks-http';
import handler from '../src/pages/api/reservations/index';
import prisma from '../src/lib/prisma';

jest.mock('../src/lib/prisma', () => ({
  reservation: {
    findMany: jest.fn()
  },
  document: {
    findUnique: jest.fn()
  },
  reservation: {
    findMany: jest.fn(),
    create: jest.fn()
  }
}));

describe('GET /api/reservations', () => {
  it('returns list of reservations', async () => {
    (prisma.reservation.findMany as jest.Mock).mockResolvedValue([{ id: 1, userEmail: 'a@b', quantity: 1 }]);

    const req = createRequest({ method: 'GET' });
    const res = createResponse();

    await handler(req as any, res as any);

    expect(res.statusCode).toBe(200);
    const data = res._getJSONData();
    expect(Array.isArray(data)).toBe(true);
  });
});
