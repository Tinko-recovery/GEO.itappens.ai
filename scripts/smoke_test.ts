import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function smokeTest() {
  console.log("🚀 Starting Automation OS Smoke Test...");

  const testPayload = {
    name: "Test User",
    email: "sadish@itappens.ai",
    company: "itappens.ai",
    website: "https://itappens.ai",
    industry: "Digital Marketing Agency",
    targetQueries: [
      "GEO optimization India",
      "generative engine optimization agency",
      "how to rank in ChatGPT"
    ]
  };

  try {
    // 1. POST to the local endpoint
    console.log("📡 Sending test lead to /api/webhooks/audit-submission...");
    const response = await fetch("http://localhost:3000/api/webhooks/audit-submission", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testPayload)
    });

    const result = await response.json();
    console.log("📥 Response status:", response.status);
    console.log("📥 Response body:", JSON.stringify(result, null, 2));

    if (!response.ok || !result.success) {
      console.error("❌ FAILED: API response error");
      process.exit(1);
    }

    // 2. Check Prisma DB
    console.log("🔍 Verifying lead in Prisma database...");
    const lead = await prisma.lead.findFirst({
      where: { email: testPayload.email, company: testPayload.company },
      orderBy: { createdAt: "desc" }
    });

    if (lead) {
      console.log("✅ PASS: Lead found in database with ID:", lead.id);
      console.log("📊 Lead details:", JSON.stringify(lead, null, 2));
    } else {
      console.error("❌ FAIL: Lead not found in database.");
      process.exit(1);
    }

  } catch (error) {
    console.error("❌ FAIL: Unexpected error during smoke test:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

smokeTest();
