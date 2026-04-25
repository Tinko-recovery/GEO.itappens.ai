const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing DB connection...');
    await prisma.$connect();
    console.log('DB Connection successful!');
    const count = await prisma.lead.count();
    console.log('Lead count:', count);
  } catch (e) {
    console.error('DB Connection FAILED:');
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
