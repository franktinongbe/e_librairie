#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

(async () => {
  const prisma = new PrismaClient();
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'changeme';

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log('Admin already exists with id:', existing.id);
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: 'Admin',
        email,
        passwordHash,
        role: 'ADMIN'
      }
    });

    console.log('Created admin user id:', user.id);
    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
