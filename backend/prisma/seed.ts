import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const acme = await prisma.tenant.create({
    data: { name: 'Acme Corp', slug: 'acme' }
  });

  const globex = await prisma.tenant.create({
    data: { name: 'Globex Inc', slug: 'globex' }
  });

  const acmeUser = await prisma.user.create({
    data: {
      email: 'john@acme.com',
      password: await bcrypt.hash('password123', 10),
      tenantId: acme.id
    }
  });

  const globexUser = await prisma.user.create({
    data: {
      email: 'jane@globex.com',
      password: await bcrypt.hash('password123', 10),
      tenantId: globex.id
    }
  });

  await prisma.issue.createMany({
    data: [
      { title: 'Fix login bug', status: 'OPEN', priority: 'HIGH', tenantId: acme.id, userId: acmeUser.id },
      { title: 'Update dashboard', status: 'IN_PROGRESS', priority: 'MEDIUM', tenantId: acme.id, userId: acmeUser.id },
      { title: 'Add dark mode', status: 'OPEN', priority: 'LOW', tenantId: acme.id, userId: acmeUser.id },
    ]
  });

  await prisma.issue.createMany({
    data: [
      { title: 'Payment gateway error', status: 'OPEN', priority: 'CRITICAL', tenantId: globex.id, userId: globexUser.id },
      { title: 'Mobile app crash', status: 'IN_PROGRESS', priority: 'HIGH', tenantId: globex.id, userId: globexUser.id },
    ]
  });

  console.log('Seeded successfully!');
  console.log('Acme user: john@acme.com / password123');
  console.log('Globex user: jane@globex.com / password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());