"use server";

import { auth0 } from "@/lib/auth0";

export type Lead = {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string | null;
  phone: string | null;
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
      page: params.page || 1,
      contact_email_status: ["verified"]
    };

    if (params.person_titles) {
      const titles = params.person_titles.split(",").map(t => t.trim()).filter(Boolean);
      if (titles.length > 0) payload.person_titles = titles;
    }
    if (params.organisation_keywords) {
      payload.q_keywords = params.organisation_keywords.replace(/,/g, " ").trim();
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
    const res = await fetch("https://api.apollo.io/v1/mixed_people/api_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "X-Api-Key": apolloKey
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Apollo API Error:", res.status, errorText);
      
      let errorDetails = errorText;
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.error) errorDetails = parsed.error;
      } catch (e) {}
      
      return { leads: [], error: `Apollo API returned ${res.status}: ${errorDetails}` };
    }

    const data = await res.json();
    
    // 4. Transform response to our internal format
    const leads: Lead[] = (data.people || []).map((person: any) => ({
      id: person.id,
      name: `${person.first_name || ""} ${person.last_name || ""}`.trim(),
      title: person.title || "Unknown Title",
      company: person.organization?.name || "Unknown Company",
      email: person.email || null,
      phone: person.phone_number || person.sanitized_phone || null,
      linkedin_url: person.linkedin_url || person.contact_url || null,
    }));

    return { leads };
  } catch (error: any) {
    console.error("Failed to search Apollo leads:", error);
    return { leads: [], error: error.message || "An unexpected error occurred during the search." };
  }
}

export async function unlockApolloLead(id: string): Promise<{ lead: Lead | null, error?: string }> {
  // 1. Verify User Session for Security
  const session = await auth0.getSession();
  if (!session || session.user.email !== "sadish.sugumaran@itappens.ai") {
    return { lead: null, error: "Unauthorized. This action is restricted." };
  }

  const apolloKey = process.env.APOLLO_API_KEY;
  if (!apolloKey) {
    return { lead: null, error: "APOLLO_API_KEY is not configured in the environment." };
  }

  try {
    const payload = {
      id: id,
      reveal_personal_emails: true
    };

    const res = await fetch("https://api.apollo.io/v1/people/match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "X-Api-Key": apolloKey
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorDetails = errorText;
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.error) errorDetails = parsed.error;
      } catch (e) {}
      return { lead: null, error: `Unlock Failed (${res.status}): ${errorDetails}` };
    }

    const data = await res.json();
    const person = data.person;

    if (!person) {
      return { lead: null, error: "Lead not found during unlock." };
    }

    const lead: Lead = {
      id: person.id,
      name: `${person.first_name || ""} ${person.last_name || ""}`.trim(),
      title: person.title || "Unknown Title",
      company: person.organization?.name || "Unknown Company",
      email: person.email || null,
      phone: person.phone_number || person.sanitized_phone || null,
      linkedin_url: person.linkedin_url || person.contact_url || null,
    };

    return { lead };
  } catch (error: any) {
    console.error("Failed to unlock Apollo lead:", error);
    return { lead: null, error: error.message || "An unexpected error occurred during the unlock." };
  }
}
