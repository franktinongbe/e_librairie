#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

(async () => {
  const prisma = new PrismaClient();
  try {
    const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'changeme';

    if (!email || !password) {
      console.error('Usage: node scripts/create-admin.js <email> <password>');
      process.exit(1);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      const passwordHash = await bcrypt.hash(password, 10);
      const updated = await prisma.user.update({
        where: { id: existing.id },
        data: {
          passwordHash,
          role: 'ADMIN',
          name: existing.name || 'Admin'
        }
      });
      console.log('Updated admin user id:', updated.id);
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
