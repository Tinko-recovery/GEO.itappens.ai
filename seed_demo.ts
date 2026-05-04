import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.audit.create({
    data: {
      siteUrl: "https://competitor.com",
      normalizedDomain: "competitor.com",
      email: "demo@linkedin.com",
      companyName: "Competitor Inc.",
      shareToken: "demo-token-123",
      plan: "GROWTH",
      status: "AWAITING_PAYMENT",
      amount: 49900
    }
  });
  console.log("Mock lead created!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
