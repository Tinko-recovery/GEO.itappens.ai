"use server";

import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

import { runAeoAudit } from "@/lib/engines/aeo-audit";
import { runSeoAudit } from "@/lib/engines/seo-audit";

export async function createClient(formData: FormData) {
  const name = formData.get("name") as string;
  const website = formData.get("website") as string;
  const icp = formData.get("icp") as string;
  const competitorsString = formData.get("competitors") as string;
  const targetMarkets = formData.getAll("targetMarkets") as string[];
  const servicesString = formData.get("services") as string;
  const goals = formData.get("goals") as string;

  const competitors = competitorsString ? competitorsString.split(",").map(s => s.trim()).filter(Boolean) : [];
  const services = servicesString ? servicesString.split(",").map(s => s.trim()).filter(Boolean) : [];

  const newClient = await prisma.agencyClient.create({
    data: { name, website, icp, competitors, targetMarkets, services, goals, status: "active" }
  });

  const aeoAudit = await prisma.agencyAudit.create({
    data: { clientId: newClient.id, type: "aeo", status: "running" } // Set to running immediately
  });

  const seoAudit = await prisma.agencyAudit.create({
    data: { clientId: newClient.id, type: "seo", status: "running" }
  });

  // Run audits in parallel before redirecting so they don't get killed by Vercel serverless timeouts
  // For long running tasks in the future, we will use Step 13 (Vercel Cron Job / Queue)
  await Promise.all([
    runAeoAudit(newClient.id, aeoAudit.id).catch(console.error),
    runSeoAudit(newClient.id, seoAudit.id).catch(console.error)
  ]);

  redirect(`/admin/clients/${newClient.id}`);
}
