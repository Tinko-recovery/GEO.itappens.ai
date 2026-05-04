export const AI_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "Claude-Web",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "OAI-SearchBot",
];

export function isAiAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return AI_AGENTS.some((agent) => userAgent.toLowerCase().includes(agent.toLowerCase()));
}
