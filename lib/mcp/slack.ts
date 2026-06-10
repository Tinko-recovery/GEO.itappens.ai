import { PrismaClient } from "@prisma/client";
import { decrypt } from "../encryption";

const prisma = new PrismaClient();

export class SlackMCP {
  private clientId: string;
  private botToken: string | null = null;
  private channelId: string | null = null;
  private initialized: boolean = false;
  private readonly baseUrl = "https://slack.com/api";

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  async init() {
    if (this.initialized) return;

    const config = await prisma.agencyMcpConfig.findFirst({
      where: {
        clientId: this.clientId,
        serviceName: "slack",
        isActive: true
      }
    });

    if (config?.apiKey) {
      this.botToken = decrypt(config.apiKey);
    } else {
      this.botToken = process.env.SLACK_BOT_TOKEN || null;
    }

    if (config?.config && typeof config.config === 'object' && 'channelId' in config.config) {
      this.channelId = (config.config as any).channelId;
    } else {
      this.channelId = process.env.SLACK_CHANNEL_ID || null;
    }

    this.initialized = true;
  }

  private async fetchAPI(endpoint: string, body: any) {
    await this.init();

    if (!this.botToken || !this.channelId) {
      console.warn(`[Slack MCP] Slack not fully configured for client ${this.clientId}. Message will not be sent.`);
      return { ok: false, error: "Not configured" };
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.botToken}`,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          channel: this.channelId,
          ...body
        }),
      });

      if (response.status === 429) {
        throw new Error("Slack Rate Limit Exceeded (429)");
      }

      const data = await response.json();
      if (!data.ok) {
        throw new Error(`Slack API error: ${data.error}`);
      }

      return data;
    } catch (error) {
      console.error(`[Slack MCP] Error calling ${endpoint}:`, error);
      // Graceful degradation - don't crash the app if Slack is down
      return { ok: false, error: String(error) };
    }
  }

  async sendWeeklyBrief(message: string) {
    return this.fetchAPI("/chat.postMessage", { text: `📊 *Weekly Brief:*\n${message}` });
  }

  async notifyContentReady(title: string, link: string) {
    return this.fetchAPI("/chat.postMessage", { 
      text: `✍️ *New Content Ready for Review!*\n*Title:* ${title}\n*Link:* ${link}` 
    });
  }

  async sendMonthlyReportAlert(clientName: string, reportUrl: string) {
    return this.fetchAPI("/chat.postMessage", { 
      text: `📈 *Monthly Report Generated for ${clientName}*\nView report here: ${reportUrl}` 
    });
  }

  async sendAuditComplete(clientName: string, type: string, score: number) {
    return this.fetchAPI("/chat.postMessage", { 
      text: `✅ *${type.toUpperCase()} Audit Completed for ${clientName}*\nScore: ${score}/100` 
    });
  }
}
