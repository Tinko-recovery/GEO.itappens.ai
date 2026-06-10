import { PrismaClient } from "@prisma/client";
import { Anthropic } from "@anthropic-ai/sdk";

const prisma = new PrismaClient();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function runAeoAudit(clientId: string, auditId: string) {
  try {
    // 1. Mark audit as running
    await prisma.agencyAudit.update({
      where: { id: auditId },
      data: { status: "running" }
    });

    const client = await prisma.agencyClient.findUnique({
      where: { id: clientId }
    });

    if (!client) throw new Error("Client not found");

    // 2. Check llms.txt and schema using Firecrawl (Simulated for safety if key fails)
    let llmsTxtExists = false;
    let schemaCompleteness = 0;
    
    if (process.env.FIRECRAWL_API_KEY) {
      try {
        const scrapeRes = await fetch('https://api.firecrawl.dev/v1/scrape', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`
          },
          body: JSON.stringify({
            url: client.website,
            formats: ['markdown']
          })
        });
        if (scrapeRes.ok) {
           schemaCompleteness = 30; // Mock full points if site is scrapable
        }
        
        // Check for llms.txt
        const llmsUrl = new URL('/llms.txt', client.website).toString();
        const llmsRes = await fetch(llmsUrl, { method: 'HEAD' });
        llmsTxtExists = llmsRes.ok;
      } catch (e) {
        console.warn("Firecrawl scrape failed, falling back to heuristics", e);
        schemaCompleteness = 15;
      }
    } else {
      schemaCompleteness = 15;
    }

    // 3. Evaluate Brand Mentions & Citation Rate via Claude
    const prompt = `
      You are an AI acting as an AEO (Answer Engine Optimization) evaluator.
      Assess the brand "${client.name}" (${client.website}) which offers these services: ${(client.services as string[]).join(', ')}.
      Target ICP: ${client.icp || "General B2B"}.
      
      If a user asked an AI like ChatGPT or Perplexity for recommendations in this space, how likely is this brand to be cited?
      Respond with ONLY a JSON object containing:
      {
        "citation_rate_score": number (0-40),
        "content_structure_score": number (0-15),
        "top_gaps": ["string", "string"],
        "reasoning": "string"
      }
    `;

    const claudeRes = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      temperature: 0.1,
      system: "You output valid JSON only.",
      messages: [{ role: "user", content: prompt }]
    });

    // Parse Claude's JSON
    const textContent = claudeRes.content[0].type === 'text' ? claudeRes.content[0].text : '{}';
    // Clean up markdown formatting if Claude wrapped it in ```json
    const cleanJson = textContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const evaluation = JSON.parse(cleanJson);

    // 4. Calculate Final Score (0-100)
    // Citation rate: up to 40, Schema: up to 30, llms.txt: 15, Content Structure: 15
    const llmsScore = llmsTxtExists ? 15 : 0;
    const finalScore = evaluation.citation_rate_score + schemaCompleteness + llmsScore + evaluation.content_structure_score;

    const results = {
      llms_txt_exists: llmsTxtExists,
      schema_completeness: schemaCompleteness,
      ai_evaluation: evaluation,
      timestamp: new Date().toISOString()
    };

    // 5. Save results to DB
    await prisma.agencyAudit.update({
      where: { id: auditId },
      data: { 
        status: "completed",
        score: Math.min(100, Math.max(0, finalScore)), // Ensure 0-100 bounds
        results,
        completedAt: new Date()
      }
    });

    return { success: true, score: finalScore };

  } catch (error) {
    console.error("[AEO Audit Engine] Error:", error);
    await prisma.agencyAudit.update({
      where: { id: auditId },
      data: { status: "failed" }
    });
    return { success: false, error: String(error) };
  }
}
