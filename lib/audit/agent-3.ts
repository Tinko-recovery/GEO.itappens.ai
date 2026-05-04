import { env } from "@/lib/env";

export type ContentGapInput = {
  clientIndustry: string;
  targetQueries: string[];
  existingPages: string[]; // List of URLs or Titles
};

export async function runContentGapAnalysis(input: ContentGapInput) {
  const apiKey = env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not set");
  }

  const prompt = `
You are a GEO content strategist for itappens.ai.
Your job is to identify content gaps — questions that AI tools
are answering in a client's category that the client's website
doesn't address.

Client Industry: ${input.clientIndustry}
Target Queries: ${input.targetQueries.join(", ")}
Existing Content:
${input.existingPages.join("\n")}

Identify the top 5 content gaps and output ONLY valid JSON.

{
  "client_industry": "${input.clientIndustry}",
  "month": "${new Date().toLocaleString('default', { month: 'long' })}",
  "content_gaps": [
    {
      "gap_title": "",
      "target_query": "",
      "why_it_matters": "",
      "recommended_title": "",
      "word_count": 0,
      "key_sections": [""],
      "ai_citation_potential": "High",
      "priority_rank": 1
    }
  ]
}
`;

  return {
    prompt,
    model: "claude-3-5-sonnet-latest",
    description: "Monthly content gap analysis for GEO optimization."
  };
}
