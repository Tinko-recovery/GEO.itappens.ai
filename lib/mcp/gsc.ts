import { PrismaClient } from "@prisma/client";
import { decrypt } from "../encryption";

const prisma = new PrismaClient();

export class GoogleSearchConsoleMCP {
  private clientId: string;
  private accessToken: string | null = null;
  private initialized: boolean = false;
  private readonly baseUrl = "https://searchconsole.googleapis.com/webmasters/v3";

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  async init() {
    if (this.initialized) return;

    const config = await prisma.agencyMcpConfig.findFirst({
      where: {
        clientId: this.clientId,
        serviceName: "gsc",
        isActive: true
      }
    });

    if (config?.apiKey) {
      // In a real OAuth scenario, this would be the refresh token, and you'd swap it for an access token
      this.accessToken = decrypt(config.apiKey);
    }

    if (!this.accessToken) {
      console.warn(`[GSC MCP] No Google Search Console token found for client ${this.clientId}. Operations will fail.`);
    }

    this.initialized = true;
  }

  private async fetchAPI(endpoint: string, options: RequestInit = {}) {
    await this.init();

    if (!this.accessToken) {
      throw new Error("GSC not configured for this client");
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.accessToken}`,
      ...options.headers,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 429) {
        throw new Error("GSC Rate Limit Exceeded (429)");
      }

      if (!response.ok) {
        throw new Error(`GSC API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[GSC MCP] Error calling ${endpoint}:`, error);
      throw error;
    }
  }

  async getImpressions(siteUrl: string, startDate: string, endDate: string) {
    return this.fetchAPI(`/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
      method: "POST",
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["query"]
      })
    });
  }

  async getCTR(siteUrl: string, startDate: string, endDate: string) {
    // Similar to getImpressions, parsed for CTR
    return { mockCtr: 0.05 };
  }

  async getPositions(siteUrl: string) {
    return { mockPositions: true };
  }

  async getTopPages(siteUrl: string, startDate: string, endDate: string) {
    return this.fetchAPI(`/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
      method: "POST",
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["page"]
      })
    });
  }
}
