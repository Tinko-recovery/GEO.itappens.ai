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
      include: {
        client: true
      }
    });

    if (!strategy) throw new Error("Strategy not found");
    if (!strategy.client) throw new Error("Client not found for strategy");

    // Mark strategy as in_progress
    await prisma.agencyStrategy.update({
      where: { id: strategyId },
      data: { status: "in_progress" }
    });

    let systemPrompt = "";
    let userPrompt = "";

    if (strategy.category === "content_creation") {
      systemPrompt = "You are an elite SEO/AEO copywriter. Write highly optimized, authoritative, and structured content ready to be published on a B2B website.";
      userPrompt = `
        Client: ${strategy.client.name}
        Website: ${strategy.client.website}
        Target Audience: ${strategy.client.icp}
        
        Task: We need to execute the following content strategy: "${strategy.title}"
        Strategy details: ${strategy.description}
        
        Write the full content piece. Use markdown formatting. Include a catchy H1, structured H2s/H3s, and a compelling call to action.
      `;
    } else if (strategy.category === "schema_markup") {
      systemPrompt = "You are a technical SEO expert. Generate ONLY valid JSON-LD schema markup. Do not include any markdown backticks or conversational text. Output pure JSON.";
      userPrompt = `
        Client: ${strategy.client.name}
        Website: ${strategy.client.website}
        
        Task: We need to generate schema markup to execute this strategy: "${strategy.title}"
        Strategy details: ${strategy.description}
        
        Generate the exact JSON-LD script block contents that the client needs to inject into their site.
      `;
    } else {
      systemPrompt = "You are a Technical SEO Consultant. Write a step-by-step implementation guide for developers.";
      userPrompt = `
        Client: ${strategy.client.name}
        Task: Provide specific developer instructions to fix: "${strategy.title}"
        Details: ${strategy.description}
        
        Write a clear, concise ticket/guide for a web developer to implement this fix.
      `;
    }

    // Generate the "Fix" via Claude
    const claudeRes = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 2500,
      temperature: 0.4,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    });

    const generatedContent = claudeRes.content[0].type === 'text' ? claudeRes.content[0].text : '';

    // Save the Fix to the Content Queue
    await prisma.agencyContentItem.create({
      data: {
        clientId: strategy.client.id,
        strategyId: strategy.id,
        title: `Deliverable: ${strategy.title}`,
        type: strategy.category,
        content: generatedContent,
        status: "draft" // Ready for human review in the Content Queue
      }
    });

    // Mark Strategy as completed
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
