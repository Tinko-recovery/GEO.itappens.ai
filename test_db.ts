import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Testing Database Connection...');
    const leadsCount = await prisma.lead.count();
    console.log(`✅ Success! Connected to Supabase. Found ${leadsCount} leads in the database.`);
  } catch (error) {
    console.error('❌ Connection Failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
