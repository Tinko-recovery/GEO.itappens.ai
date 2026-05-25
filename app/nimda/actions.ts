"use server";

import { auth0 } from "@/lib/auth0";

export type Lead = {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string | null;
  linkedin_url: string | null;
};

export type SearchParams = {
  person_titles?: string;
  organisation_keywords?: string;
  organisation_localities?: string;
  q_organization_domains?: string;
  page?: number;
};

export async function searchApolloLeads(params: SearchParams): Promise<{ leads: Lead[], error?: string }> {
  // 1. Verify User Session for Security
  const session = await auth0.getSession();
  if (!session || session.user.email !== "sadish.sugumaran@itappens.ai") {
    return { leads: [], error: "Unauthorized. This action is restricted." };
  }

  const apolloKey = process.env.APOLLO_API_KEY;
  if (!apolloKey) {
    return { leads: [], error: "APOLLO_API_KEY is not configured in the environment." };
  }

  try {
    // 2. Prepare Payload
    const payload: Record<string, any> = {
      api_key: apolloKey,
      page: params.page || 1,
    };

    if (params.person_titles) {
      const titles = params.person_titles.split(",").map(t => t.trim()).filter(Boolean);
      if (titles.length > 0) payload.person_titles = titles;
    }
    if (params.organisation_keywords) {
      const keywords = params.organisation_keywords.split(",").map(t => t.trim()).filter(Boolean);
      if (keywords.length > 0) payload.q_organization_keyword_tags = keywords;
    }
    if (params.q_organization_domains) {
      // Apollo expects domains as a newline separated string
      payload.q_organization_domains = params.q_organization_domains.split(",").map(d => d.trim()).join("\n");
    }
    if (params.organisation_localities) {
      const locations = params.organisation_localities.split(",").map(t => t.trim()).filter(Boolean);
      if (locations.length > 0) payload.person_locations = locations;
    }

    // 3. Call Apollo API
    const res = await fetch("https://api.apollo.io/v1/mixed_people/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Apollo API Error:", res.status, errorText);
      return { leads: [], error: `Apollo API returned ${res.status}: ${res.statusText}` };
    }

    const data = await res.json();
    
    // 4. Transform response to our internal format
    const leads: Lead[] = (data.people || []).map((person: any) => ({
      id: person.id,
      name: `${person.first_name || ""} ${person.last_name || ""}`.trim(),
      title: person.title || "Unknown Title",
      company: person.organization?.name || "Unknown Company",
      email: person.email || null,
      linkedin_url: person.linkedin_url || person.contact_url || null,
    }));

    return { leads };
  } catch (error: any) {
    console.error("Failed to search Apollo leads:", error);
    return { leads: [], error: error.message || "An unexpected error occurred during the search." };
  }
}
