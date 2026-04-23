import { env } from "@/lib/env";

export type SerperResult = {
  title: string;
  link: string;
  snippet: string;
  position: number;
};

export async function searchSerper(query: string): Promise<SerperResult[]> {
  const apiKey = env.SERPER_API_KEY;
  if (!apiKey) {
    console.warn("SERPER_API_KEY not set, returning empty search results.");
    return [];
  }

  try {
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query, gl: "in" }),
    });

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.statusText}`);
    }

    const data = await response.json();
    return (data.organic || []).map((item: any) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      position: item.position,
    }));
  } catch (error) {
    console.error("Serper search failed:", error);
    return [];
  }
}
