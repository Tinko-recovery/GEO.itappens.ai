const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dummyLeads = [
    {
      name: "Rahul Sharma",
      email: "rahul@techinnovators.in",
      company: "TechInnovators India",
      website: "techinnovators.in",
      industry: "Software & SaaS",
      targetQueries: ["best B2B SaaS solutions India", "top enterprise software 2026"],
      source: "organic_search",
      automationStatus: "nurturing",
      geoScore: 42,
      geoReport: { summary: "Poor visibility on ChatGPT for main product queries." },
      enrichedData: { employees: "50-200", revenue: "$5M-$10M" },
      competitors: ["infosys.com", "tcs.com"]
    },
    {
      name: "Priya Patel",
      email: "ppatel@growthmarketing.co",
      company: "GrowthMarketing Co",
      website: "growthmarketing.co",
      industry: "Marketing Agency",
      targetQueries: ["top growth marketing agencies", "SEO experts Bangalore"],
      source: "apollo",
      automationStatus: "scoring",
      geoScore: 68,
      geoReport: { summary: "Strong on Perplexity, missing from Claude 3.5." },
      enrichedData: { employees: "11-50", revenue: "$1M-$5M" },
      competitors: ["NeilPatel.com"]
    },
    {
      name: "Amit Desai",
      email: "amit.d@futurelogistics.com",
      company: "Future Logistics",
      website: "futurelogistics.com",
      industry: "Logistics",
      targetQueries: ["AI supply chain optimization India", "best logistics software"],
      source: "linkedin",
      automationStatus: "converted",
      geoScore: 85,
      geoReport: { summary: "Excellent entity extraction on most models." },
      enrichedData: { employees: "500+", revenue: "$50M+" },
      competitors: ["delhivery.com", "bluedart.com"]
    },
    {
      name: "Neha Gupta",
      email: "neha@finserve.co.in",
      company: "FinServe India",
      website: "finserve.co.in",
      industry: "Fintech",
      targetQueries: ["AI wealth management platforms", "best fintech startups India"],
      source: "manual",
      automationStatus: "pending",
      geoScore: null,
      geoReport: null,
      enrichedData: null,
      competitors: ["zerodha.com", "groww.in"]
    },
    {
      name: "Vikram Singh",
      email: "vsingh@healthtech.io",
      company: "HealthTech Innovations",
      website: "healthtech.io",
      industry: "Healthcare Technology",
      targetQueries: ["telemedicine platforms India", "AI diagnostic tools"],
      source: "organic_search",
      automationStatus: "pending",
      geoScore: 21,
      geoReport: { summary: "Hallucinations present when models are asked about services." },
      enrichedData: { employees: "1-10", revenue: "<$1M" },
      competitors: ["practo.com"]
    }
  ];

  for (const lead of dummyLeads) {
    await prisma.lead.create({
      data: lead
    });
  }
  
  console.log('Successfully seeded 5 dummy leads.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
