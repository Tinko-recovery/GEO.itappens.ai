import { env } from "@/lib/env";
import { searchSerper } from "@/lib/audit/serper";

export type CitationMonitorInput = {
  clientName: string;
  targetQueries: string[];
  competitiorNames: string[];
  previousWeekData?: any;
};

export async function runCitationMonitor(input: CitationMonitorInput) {
  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not set");
  }

  // 1. Fetch live search data for grounding
  const searchResultsPromises = input.targetQueries.map(query => 
    searchSerper(`${query} cited by AI`)
  );
  const groundingData = await Promise.all(searchResultsPromises);

  // 2. Prepare the prompt for Gemini
  const prompt = `
You are a GEO citation monitor for itappens.ai clients.
Your job is to check whether a brand is being cited or mentioned
in AI-powered search responses for their target queries.

Client: ${input.clientName}
Target Queries: ${input.targetQueries.join(", ")}
Competitors: ${input.competitiorNames.join(", ")}

Grounding Search Data:
${JSON.stringify(groundingData, null, 2)}

For each query, determine:
1. Is the client brand cited in AI search results? (Yes/No)
2. Which competitors are cited instead?
3. What is the context of citation if found?

Output ONLY valid JSON. No explanation outside the JSON.

{
  "client": "${input.clientName}",
  "week": "${new Date().toISOString()}",
  "citations": [
    {
      "query": "",
      "client_cited": true,
      "citation_context": "",
      "competitors_cited": [""]
    }
  ],
  "delta_vs_last_week": "Up / Flat / Down",
  "alert_required": false,
  "alert_reason": ""
}
`;

  // 3. Call Gemini (simulated here since we are designing the blueprint)
  // In a real implementation, we would use the Google AI SDK.
  return {
    prompt,
    model: "gemini-1.5-flash",
    description: "Citation monitoring logic grounding in Serper.dev results."
  };
}
