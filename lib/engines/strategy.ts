import { PrismaClient } from "@prisma/client";
import { Anthropic } from "@anthropic-ai/sdk";

const prisma = new PrismaClient();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function generateStrategy(clientId: string) {
  try {
    const client = await prisma.agencyClient.findUnique({
      where: { id: clientId },
      include: {
        audits: {
          orderBy: { createdAt: 'desc' },
          take: 2
        }
      }
    });

    if (!client) throw new Error("Client not found");

    const aeoAudit = client.audits.find(a => a.type === "aeo" && a.status === "completed");
    const seoAudit = client.audits.find(a => a.type === "seo" && a.status === "completed");

    if (!aeoAudit || !seoAudit) {
      console.warn("Cannot generate strategy: Missing completed audits for client", clientId);
      return { success: false, error: "Missing completed audits" };
    }

    const prompt = `
      You are an elite SEO and AEO (Answer Engine Optimization) strategist.
      Analyze the following audit data for our client: "${client.name}" (${client.website}).
      Client ICP: ${client.icp}
      Target Markets: ${(client.targetMarkets as string[])?.join(', ')}
      Services: ${(client.services as string[])?.join(', ')}

      AEO Audit Results:
      ${JSON.stringify(aeoAudit.results)}

      SEO Audit Results:
      ${JSON.stringify(seoAudit.results)}

      Task: Generate exactly 3 high-impact strategies to fix their gaps. 
      Each strategy MUST fall into one of these categories: 'content_creation', 'technical_fix', or 'schema_markup'.
      
      Output ONLY a JSON array of objects with this exact structure:
      [
        {
          "title": "string (Actionable title)",
          "description": "string (Why are we doing this?)",
          "category": "content_creation" | "technical_fix" | "schema_markup",
          "priority": "high" | "medium" | "low",
          "estimatedImpact": number (1-10)
        }
      ]
    `;

    const claudeRes = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1500,
      temperature: 0.2,
      system: "You output valid JSON arrays only.",
      messages: [{ role: "user", content: prompt }]
    });

    const textContent = claudeRes.content[0].type === 'text' ? claudeRes.content[0].text : '[]';
    const cleanJson = textContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const strategiesData = JSON.parse(cleanJson);

    // Save strategies to DB — store the rich metadata in the `roadmap` JSON field
    const savedStrategies = [];
    for (const s of strategiesData) {
      const saved = await prisma.agencyStrategy.create({
        data: {
          clientId: client.id,
          status: "pending",
          roadmap: s, // store full strategy object { title, description, category, priority, estimatedImpact }
        }
      });
      savedStrategies.push(saved);
    }

    return { success: true, strategies: savedStrategies };

  } catch (error) {
    console.error("[Strategy Engine] Error:", error);
    return { success: false, error: String(error) };
  }
}
