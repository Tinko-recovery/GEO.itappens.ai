import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_CALENDLY_URL: z.string().url().default("https://calendly.com/itappens/strategy-call"),
  PAYMENT_PROVIDER: z.enum(["stripe", "razorpay"]).default("stripe"),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default("claude-3-7-sonnet-latest"),
  GEMINI_API_KEY: z.string().default(""),
  OPENAI_API_KEY: z.string().default(""),
  SERPER_API_KEY: z.string().default(""),
  FIRECRAWL_API_KEY: z.string().optional(),
  FIRECRAWL_API_URL: z.string().url().default("https://api.firecrawl.dev"),
  DATAFORSEO_LOGIN: z.string().optional(),
  DATAFORSEO_PASSWORD: z.string().optional(),
  DATAFORSEO_API_URL: z.string().url().default("https://api.dataforseo.com"),
  DATAFORSEO_SERP_ENDPOINT: z.string().default("/v3/serp/google/organic/live/advanced"),
  DATAFORSEO_KEYWORDS_ENDPOINT: z.string().default("/v3/dataforseo_labs/google/keyword_ideas/live"),
  DATAFORSEO_COMPETITORS_ENDPOINT: z.string().default("/v3/dataforseo_labs/google/competitors_domain/live"),
  DATAFORSEO_BACKLINKS_ENDPOINT: z.string().default("/v3/backlinks/summary/live"),
  RESEND_API_KEY: z.string().optional(),
  MAIL_FROM: z.string().email().default("audit@itappens.ai"),
  NOTIFY_TO_EMAIL: z.string().email().default("hello@itappens.ai"),
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  ADMIN_USERNAME: z.string().default("admin"),
  ADMIN_PASSWORD: z.string().default("change-me"),
  CAPTCHA_SECRET: z.string().default("change-me-captcha-secret"),
  WATI_API_KEY: z.string().default(""),
  WATI_PHONE_NUMBER: z.string().default("+919353015844"),
  NOTION_API_KEY: z.string().default(""),
  NOTION_LEADS_DB_ID: z.string().default(""),
  NOTION_CLIENTS_DB_ID: z.string().default(""),
  MAKE_WEBHOOK_URL: z.string().default(""),
  MAKE_WEBHOOK_SECRET: z.string().default(""),
});

export const env = envSchema.parse(process.env);

export function requireEnv(name: keyof typeof env) {
  const value = env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${String(name)}`);
  }
  return value;
}
