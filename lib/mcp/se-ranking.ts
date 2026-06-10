import { PrismaClient } from "@prisma/client";
import { decrypt } from "../encryption";

const prisma = new PrismaClient();

export class SERankingMCP {
  private clientId: string;
  private apiKey: string | null = null;
  private initialized: boolean = false;
  private readonly baseUrl = "https://api4.seranking.com";

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  /**
   * Initializes the MCP by fetching the encrypted API key from the database
   */
  async init() {
    if (this.initialized) return;

    const config = await prisma.agencyMcpConfig.findFirst({
      where: {
        clientId: this.clientId,
        serviceName: "se_ranking",
        isActive: true
      }
    });

    if (config?.apiKey) {
      this.apiKey = decrypt(config.apiKey);
    } else {
      // Fallback to global SE Ranking API key if client specific one isn't set
      this.apiKey = process.env.SE_RANKING_API_KEY || null;
    }

    if (!this.apiKey) {
      throw new Error(`SE Ranking API key not found for client ${this.clientId}`);
    }

    this.initialized = true;
  }

  private async fetchAPI(endpoint: string, options: RequestInit = {}) {
    await this.init();

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Token ${this.apiKey}`,
      ...options.headers,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 429) {
        throw new Error("SE Ranking Rate Limit Exceeded (429)");
      }

      if (!response.ok) {
        throw new Error(`SE Ranking API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[SE Ranking MCP] Error calling ${endpoint}:`, error);
      throw error;
    }
  }

  // MCP Methods defined by requirements

  async getAIVisibility(domain: string, keywords: string[]) {
    // This is a placeholder for the actual AI Visibility API endpoint which SERanking provides
    // In production, this would call the specific endpoint for AI Overview / ChatGPT visibility
    try {
      // Mocking the structure based on typical SE Ranking responses
      return {
        overallCitationRate: Math.floor(Math.random() * 100),
        chatgptMentions: Math.floor(Math.random() * 10),
        perplexityMentions: Math.floor(Math.random() * 10),
        googleAIOverviews: Math.floor(Math.random() * 10)
      };
    } catch (error) {
      console.error("[SE Ranking MCP] getAIVisibility failed", error);
      throw error;
    }
  }

  async getRankings(siteId: string) {
    return this.fetchAPI(`/projects/${siteId}/keywords`);
  }

  async getKeywordGaps(domain: string, competitors: string[]) {
    // Note: This often requires multiple API calls in SE Ranking (Competitor Research API)
    return { mockGap: true, domain, competitors };
  }

  async getTechnicalIssues(siteId: string) {
    return this.fetchAPI(`/projects/${siteId}/audit`);
  }

  async getCompetitorData(siteId: string) {
    return this.fetchAPI(`/projects/${siteId}/competitors`);
  }
}
