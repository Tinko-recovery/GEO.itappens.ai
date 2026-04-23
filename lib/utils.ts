import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeSiteUrl(input: string) {
  const raw = input.trim();
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const url = new URL(withProtocol);
  url.hash = "";
  if (url.pathname.endsWith("/") && url.pathname !== "/") {
    url.pathname = url.pathname.slice(0, -1);
  }
  return url.toString();
}

export function getHostname(input: string) {
  return new URL(normalizeSiteUrl(input)).hostname.replace(/^www\./, "");
}

export function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function formatInr(valueInPaise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(valueInPaise / 100);
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function buildAbsoluteUrl(pathname = "/") {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return new URL(pathname, base).toString();
}

export function compact<T>(values: Array<T | null | undefined | false>) {
  return values.filter(Boolean) as T[];
}

export function sha256(input: string) {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(input)).then((buffer) =>
    Array.from(new Uint8Array(buffer))
      .map((value) => value.toString(16).padStart(2, "0"))
      .join(""),
  );
}
