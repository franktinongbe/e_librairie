const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const expired = await prisma.reservation.findMany({ where: { status: 'PENDING', expiresAt: { lt: now } } });
  if (!expired.length) {
    console.log('No expired reservations found');
    return;
  }

  for (const r of expired) {
    try {
      // restore stock
      await prisma.document.update({ where: { id: r.documentId }, data: { stock: { increment: r.quantity } } });

      // log stock movement
      await prisma.stockMovement.create({ data: { documentId: r.documentId, quantity: r.quantity, reason: 'RESERVATION_EXPIRED' } });

      // cancel reservation
      await prisma.reservation.update({ where: { id: r.id }, data: { status: 'CANCELLED' } });

      console.log(`Cancelled reservation ${r.id} and restored ${r.quantity} units for document ${r.documentId}`);
    } catch (e) {
      console.error(`Failed processing reservation ${r.id}:`, e);
    }
  }

  console.log(`Processed ${expired.length} expired reservation(s)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
