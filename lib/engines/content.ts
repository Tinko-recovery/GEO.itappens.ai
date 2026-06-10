import { PrismaClient } from "@prisma/client";
import { Anthropic } from "@anthropic-ai/sdk";

const prisma = new PrismaClient();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function executeStrategyContent(strategyId: string) {
  try {
    const strategy = await prisma.agencyStrategy.findUnique({
      where: { id: strategyId },
      include: { client: true }
    });

    if (!strategy) throw new Error("Strategy not found");
    if (!strategy.client) throw new Error("Client not found for strategy");

    // The rich metadata is stored in the roadmap JSON field
    const roadmap = strategy.roadmap as {
      title?: string;
      description?: string;
      category?: string;
    } | null;

    const title = roadmap?.title ?? "Content Fix";
    const description = roadmap?.description ?? "";
    const category = roadmap?.category ?? "technical_fix";

    await prisma.agencyStrategy.update({
      where: { id: strategyId },
      data: { status: "in_progress" }
    });

    let systemPrompt = "";
    let userPrompt = "";

    if (category === "content_creation") {
      systemPrompt = "You are an elite SEO/AEO copywriter. Write highly optimized, authoritative, and structured content ready to be published on a B2B website.";
      userPrompt = `
        Client: ${strategy.client.name}
        Website: ${strategy.client.website}
        Target Audience: ${strategy.client.icp}
        
        Task: Execute the following content strategy: "${title}"
        Strategy details: ${description}
        
        Write the full content piece. Use markdown formatting. Include a catchy H1, structured H2s/H3s, and a compelling call to action.
      `;
    } else if (category === "schema_markup") {
      systemPrompt = "You are a technical SEO expert. Generate ONLY valid JSON-LD schema markup. Do not include any markdown backticks or conversational text. Output pure JSON.";
      userPrompt = `
        Client: ${strategy.client.name}
        Website: ${strategy.client.website}
        
        Task: Generate schema markup to execute this strategy: "${title}"
        Strategy details: ${description}
        
        Generate the exact JSON-LD script block contents that the client needs to inject into their site.
      `;
    } else {
      systemPrompt = "You are a Technical SEO Consultant. Write a step-by-step implementation guide for developers.";
      userPrompt = `
        Client: ${strategy.client.name}
        Task: Provide specific developer instructions to fix: "${title}"
        Details: ${description}
        
        Write a clear, concise ticket/guide for a web developer to implement this fix.
      `;
    }

    const claudeRes = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2500,
      temperature: 0.4,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    });

    const generatedContent = claudeRes.content[0].type === 'text' ? claudeRes.content[0].text : '';

    // Save the fix to the Content Queue using the correct schema fields
    await prisma.agencyContentItem.create({
      data: {
        clientId: strategy.client.id,
        strategyId: strategy.id,
        title: `Deliverable: ${title}`,
        type: category,
        draftMarkdown: generatedContent, // correct field name from Prisma schema
        status: "draft"
      }
    });

    await prisma.agencyStrategy.update({
      where: { id: strategyId },
      data: { status: "completed" }
    });

    return { success: true };

  } catch (error) {
    console.error("[Content Engine] Error:", error);
    await prisma.agencyStrategy.update({
      where: { id: strategyId },
      data: { status: "failed" }
    });
    return { success: false, error: String(error) };
  }
}
