import { createClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy"
);

const anthropic = new Anthropic({ 
  apiKey: process.env.ANTHROPIC_API_KEY || "dummy" 
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { domain, email, company_name, user_name, phone, user_role, vertical } = body;

    // Validation
    if (!domain || !email) {
      return Response.json(
        { error: "Domain and email required" },
        { status: 400 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'dummy') {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY in environment");
      return Response.json(
        { error: "Server Configuration Error: Missing Database Key" },
        { status: 500 }
      );
    }

    // Clean domain
    const cleanDomain = domain
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "");

    // Store submission in Supabase
    const { data: submission, error: submitError } = await supabase
      .from("audit_submissions")
      .insert({
        email,
        domain: cleanDomain,
        company_name,
        user_name,
        phone,
        user_role,
        vertical: vertical || "Other",
        lead_score: calculateLeadScore({ domain: cleanDomain, ...body }),
        audit_status: "pending"
      })
      .select()
      .single();

    if (submitError) {
      console.error("Supabase error:", submitError);
      return Response.json(
        { error: "Failed to save submission" },
        { status: 500 }
      );
    }

    // Generate audit via Claude (fire and forget)
    generateAndSendAudit(submission.id, cleanDomain, email, company_name).catch(
      (err) => console.error("Audit generation failed:", err)
    );

    // Return immediately
    return Response.json({
      submission_id: submission.id,
      status: "processing",
      message: "Audit generating. You'll receive email in 5 minutes.",
      lead_score: submission.lead_score
    });
  } catch (error) {
    console.error("API error:", error);
    return Response.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}

// Background function: Generate audit and send email
async function generateAndSendAudit(
  submissionId: string,
  domain: string,
  email: string,
  company_name: string
) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    // Simple data collection
    const basicMetrics = {
      domain,
      company_name,
      has_blog: Math.random() > 0.5,
      estimated_traffic: Math.floor(Math.random() * 100000),
      domain_age: Math.floor(Math.random() * 15) + 1
    };

    // Generate Tier 1 audit with Claude
    const auditPrompt = `
You are an expert AEO auditor. Generate a brief Tier 1 audit for ${domain}.

Return ONLY valid JSON with this exact structure:
{
  "overall_score": <0-100>,
  "technical_score": <0-100>,
  "on_page_score": <0-100>,
  "content_score": <0-100>,
  "aeo_score": <0-100>,
  "top_finding_1": "<CRITICAL issue>",
  "top_finding_2": "<HIGH issue>",
  "top_finding_3": "<HIGH issue>",
  "action_1": "<Specific fix>",
  "action_2": "<Specific fix>",
  "action_3": "<Specific fix>"
}

Focus on:
1. Missing schema markup (likely issue for most sites)
2. Thin content (if blog exists, likely dormant)
3. Zero FAQ pages
4. Page speed issues (likely LCP > 2.5s)
5. No AEO optimization

Be specific to ${domain}. Don't be generic.
`;

    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages: [{ role: "user", content: auditPrompt }]
    });

    const auditText =
      message.content[0].type === "text" ? message.content[0].text : "{}";
    const audit = JSON.parse(auditText);

    // Save report
    await supabase.from("audit_reports").insert({
      submission_id: submissionId,
      tier: "TIER_1",
      report_json: audit,
      overall_score: audit.overall_score,
      technical_score: audit.technical_score,
      on_page_score: audit.on_page_score,
      content_score: audit.content_score,
      aeo_score: audit.aeo_score,
      status: "generated"
    });

    // Send email with audit
    const emailHtml = `
<h2>Your AEO Audit: ${domain}</h2>

<p>Hi ${company_name || 'there'},</p>

<p>Your audit is ready!</p>

<h3>📊 Scores</h3>
<ul>
  <li>Overall: ${audit.overall_score}/100</li>
  <li>Technical SEO: ${audit.technical_score}/100</li>
  <li>On-Page: ${audit.on_page_score}/100</li>
  <li>Content: ${audit.content_score}/100</li>
  <li>AEO Visibility: ${audit.aeo_score}/100</li>
</ul>

<h3>🔴 Top Issues</h3>
<ol>
  <li>${audit.top_finding_1}</li>
  <li>${audit.top_finding_2}</li>
  <li>${audit.top_finding_3}</li>
</ol>

<h3>✅ Action Plan</h3>
<ol>
  <li>${audit.action_1}</li>
  <li>${audit.action_2}</li>
  <li>${audit.action_3}</li>
</ol>

<p><a href="https://itappens.ai/strategy-call">📞 Book 30-min strategy call</a></p>

<p>Best,<br>Sadish<br>itappens.ai</p>
    `;

    await resend.emails.send({
      from: "audit@itappens.ai",
      to: email,
      subject: `Your Free AEO Audit: ${domain}`,
      html: emailHtml
    });

    // Update submission
    await supabase
      .from("audit_submissions")
      .update({
        audit_status: "tier1_sent",
        tier1_sent_at: new Date()
      })
      .eq("id", submissionId);

    console.log(`Audit sent to ${email}`);
  } catch (error) {
    console.error("Audit generation error:", error);
  }
}

function calculateLeadScore(data: any): number {
  let score = 0;
  
  const verticalScores: Record<string, number> = {
    "B2B SaaS": 30,
    "Healthcare": 25,
    "FinTech": 28,
    "E-commerce": 15,
    "Professional Services": 20
  };
  
  score += verticalScores[data.vertical] || 10;
  score += data.company_name ? 5 : 0;
  score += data.user_role ? 5 : 0;
  score += data.phone ? 5 : 0;
  
  return Math.min(score, 100);
}
