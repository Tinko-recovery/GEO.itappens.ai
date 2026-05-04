import type { AuditReport } from "@/lib/audit/types";

function scoreColor(score: number) {
  if (score >= 70) return "#c9a84c";   // gold — strong
  if (score >= 45) return "#4a6741";   // sage — mid
  return "#9b4a28";                    // sienna — weak
}

function scoreLabel(score: number) {
  if (score >= 80) return "STRONG";
  if (score >= 60) return "FAIR";
  if (score >= 40) return "WEAK";
  return "CRITICAL";
}

function impactChip(impact: string) {
  if (impact === "High")   return `<span class="chip chip-sienna">High Impact</span>`;
  if (impact === "Low")    return `<span class="chip chip-dim">Low Impact</span>`;
  return `<span class="chip chip-gold">Medium Impact</span>`;
}

function severityChip(sev: string) {
  if (sev === "Critical") return `<span class="chip chip-sienna">${sev}</span>`;
  if (sev === "High")     return `<span class="chip chip-sienna-dim">${sev}</span>`;
  return `<span class="chip chip-dim">${sev}</span>`;
}

function priorityChip(p: string) {
  const map: Record<string, string> = { P1: "chip-sienna", P2: "chip-gold", P3: "chip-sage" };
  return `<span class="chip ${map[p] ?? "chip-dim"}">${p}</span>`;
}

export function renderAuditHtml(report: AuditReport) {
  const tickerItems = report.ticker.map((t) => `<span class="tick-item">${t}</span>`).join("");
  const tickerContent = tickerItems + tickerItems;

  const benchmarkCards = report.benchmark
    .map((item) => {
      const c = scoreColor(item.score);
      const circ = (item.score / 100) * 263.9;
      return `
      <article class="score-card">
        <div class="score-ring-wrap">
          <svg width="90" height="90" viewBox="0 0 100 100" style="transform:rotate(-90deg)">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(201,168,76,0.1)" stroke-width="7"/>
            <circle cx="50" cy="50" r="42" fill="none" stroke="${c}" stroke-width="7"
              stroke-dasharray="${circ} 263.9" stroke-linecap="round"/>
          </svg>
          <div class="score-ring-inner">
            <strong class="score-num" style="color:${c}">${item.score}</strong>
            <span class="score-denom">/100</span>
          </div>
        </div>
        <div class="score-meta">
          <p class="score-label">${item.label}</p>
          <p class="score-note">${item.note}</p>
        </div>
      </article>`;
    })
    .join("");

  const chartBars = report.chartSeries
    .map((item) => {
      const c = scoreColor(item.score);
      return `
      <div class="bar-row">
        <div class="bar-name">${item.name}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${item.score}%;background:${c}"></div></div>
        <div class="bar-val" style="color:${c}">${item.score}</div>
      </div>`;
    })
    .join("");

  const quickWins = report.quickWins
    .map((item) => `
      <article class="issue-card issue-win">
        ${impactChip(item.impact)}
        <h3 class="issue-title">${item.title}</h3>
        <p class="issue-body">${item.detail}</p>
      </article>`)
    .join("");

  const blockers = report.blockers
    .map((item) => `
      <article class="issue-card issue-blocker">
        ${severityChip(item.severity)}
        <h3 class="issue-title">${item.title}</h3>
        <p class="issue-body">${item.detail}</p>
      </article>`)
    .join("");

  const serpRows = report.serpHighlights
    .map((item) => `
      <tr>
        <td class="td-kw">${item.keyword}</td>
        <td>${item.winners.join(", ")}</td>
        <td class="td-angle">${item.itappensAngle}</td>
      </tr>`)
    .join("");

  const opRows = report.opportunities
    .map((item) => `
      <tr>
        <td class="td-kw">${item.keyword}</td>
        <td>${item.whyItMatters}</td>
        <td>${priorityChip(item.priority)}</td>
      </tr>`)
    .join("");

  const pageRows = report.topPages
    .map((item) => `
      <tr>
        <td>${item.title}</td>
        <td class="td-url">${item.url}</td>
        <td>${item.wordCount.toLocaleString("en-IN")}</td>
        <td style="color:${scoreColor(item.score)};font-weight:700">${item.score}</td>
      </tr>`)
    .join("");

  const compRows = report.competitorTable
    .map((item) => `
      <tr>
        <td class="td-domain">${item.domain}</td>
        <td>${item.intersections}</td>
        <td>${item.avgPosition ?? "—"}</td>
        <td>${item.etv != null ? `₹${item.etv.toLocaleString("en-IN")}` : "—"}</td>
      </tr>`)
    .join("");

  const roadmap = report.roadmap
    .map((item, i) => {
      const phaseColors = ["#9b4a28", "#c9a84c", "#4a6741"];
      const c = phaseColors[i] ?? "#c9a84c";
      return `
      <article class="roadmap-card">
        <div class="roadmap-index" style="color:${c};border-color:${c}40">${String(i + 1).padStart(2, "0")}</div>
        <div class="roadmap-body">
          <span class="eyebrow" style="color:${c}">${item.window}</span>
          <h3 class="roadmap-phase">${item.phase}</h3>
          <p class="roadmap-goal">${item.goal}</p>
          <ul class="roadmap-list">
            ${item.deliverables.map((d) => `<li>${d}</li>`).join("")}
          </ul>
        </div>
      </article>`;
    })
    .join("");

  const sections = report.reportSections
    .map((sec) => `
      <div class="narr-section">
        <div class="narr-head">
          <p class="eyebrow">Analysis</p>
          <h2 class="narr-title">${sec.title}</h2>
        </div>
        <div class="narr-copy">
          ${sec.body.map((p) => `<p>${p}</p>`).join("")}
        </div>
      </div>`)
    .join("");

  const monoAngles = report.monetizationAngles
    .map((item) => `<li class="mono-item"><span class="mono-bullet">→</span>${item}</li>`)
    .join("");

  const generatedDate = new Date(report.generatedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const overallColor = scoreColor(report.overallScore);
  const overallCirc = (report.overallScore / 100) * 263.9;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${report.hostname} — GEO + SEO Audit — itappens.ai</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap" rel="stylesheet">
  <style>
    :root {
      --ink:      #0d0b08;
      --paper:    #f5f0e8;
      --cream:    #ede7d4;
      --gold:     #c9a84c;
      --gold-dim: rgba(201,168,76,0.14);
      --gold-mid: rgba(201,168,76,0.30);
      --sienna:   #9b4a28;
      --sien-dim: rgba(155,74,40,0.20);
      --sage:     #4a6741;
      --sage-dim: rgba(74,103,65,0.20);
      --dust:     #8c7b6b;
      --rule:     rgba(201,168,76,0.18);
      --card:     rgba(255,252,245,0.03);
      --mono:     'DM Mono', monospace;
      --serif:    'Cormorant Garamond', serif;
      --display:  'Bebas Neue', sans-serif;
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: var(--ink);
      color: var(--paper);
      font-family: var(--serif);
      font-size: 17px;
      line-height: 1.6;
      overflow-x: hidden;
    }
    /* Grain overlay */
    body::before {
      content: '';
      position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none; z-index: 9999; opacity: 0.35;
    }
    /* Progress */
    #pb {
      position: fixed; top: 0; left: 0; height: 2px; width: 0%;
      background: linear-gradient(90deg, var(--sienna), var(--gold));
      z-index: 10000; transition: width 0.1s;
    }
    /* Ticker */
    .ticker-wrap {
      overflow: hidden; white-space: nowrap;
      background: rgba(201,168,76,0.05);
      border-bottom: 1px solid var(--rule);
      padding: 9px 0;
    }
    .ticker-inner {
      display: inline-block;
      animation: ticker 38s linear infinite;
    }
    .tick-item {
      display: inline-block;
      font-family: var(--mono); font-size: 9px;
      letter-spacing: 0.22em; text-transform: uppercase;
      color: var(--gold); padding: 0 36px;
    }
    .tick-item::after { content: '·'; margin-left: 36px; color: rgba(201,168,76,0.3); }
    @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

    /* Nav */
    nav {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 48px;
      background: rgba(13,11,8,0.92); backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--rule);
      position: sticky; top: 0; z-index: 800;
    }
    .nav-brand { font-family: var(--mono); font-size: 10px; letter-spacing: 0.18em; color: var(--gold); text-transform: uppercase; }
    .nav-links { display: flex; gap: 28px; list-style: none; }
    .nav-links a { font-family: var(--mono); font-size: 9px; letter-spacing: 0.14em; color: var(--dust); text-decoration: none; text-transform: uppercase; transition: color 0.2s; }
    .nav-links a:hover { color: var(--gold); }
    .nav-date { font-family: var(--mono); font-size: 9px; color: var(--dust); letter-spacing: 0.1em; }

    /* Hero */
    .hero {
      min-height: 94vh; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      text-align: center; padding: 100px 48px 80px;
      position: relative; overflow: hidden;
    }
    .hero-bg {
      position: absolute; inset: 0;
      background:
        radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,168,76,0.07) 0%, transparent 70%),
        radial-gradient(ellipse 40% 40% at 20% 80%, rgba(155,74,40,0.09) 0%, transparent 60%);
    }
    .hero-bg::before, .hero-bg::after {
      content: ''; position: absolute; left: 50%; transform: translateX(-50%);
      width: 1px; background: linear-gradient(to bottom, transparent, var(--gold), transparent);
    }
    .hero-bg::before { top: 0; height: 120px; }
    .hero-bg::after { bottom: 0; height: 120px; }
    .hero-eyebrow {
      font-family: var(--mono); font-size: 10px; letter-spacing: 0.28em;
      color: var(--gold); text-transform: uppercase; margin-bottom: 20px;
      position: relative;
    }
    .hero-title {
      font-family: var(--display); font-size: clamp(52px, 9vw, 120px);
      line-height: 0.9; letter-spacing: 0.03em; color: var(--paper);
      margin-bottom: 8px; position: relative;
    }
    .hero-title em {
      font-family: var(--serif); font-style: italic; font-size: 0.4em;
      font-weight: 300; color: var(--gold); display: block;
      letter-spacing: 0.12em; line-height: 2.2;
    }
    .hero-sub {
      font-family: var(--serif); font-style: italic; font-size: 18px;
      color: var(--dust); max-width: 560px; margin: 18px auto 44px;
      position: relative;
    }
    /* Score ring */
    .score-ring-hero {
      position: relative; width: 180px; height: 180px;
      margin: 0 auto 20px;
    }
    .score-ring-hero svg { width: 100%; height: 100%; }
    .score-ring-hero-inner {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
    }
    .score-big { font-family: var(--display); font-size: 56px; line-height: 1; letter-spacing: 0.04em; }
    .score-denom-hero { font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; color: var(--dust); }
    .score-grade {
      display: inline-block; font-family: var(--mono); font-size: 10px;
      letter-spacing: 0.2em; text-transform: uppercase;
      padding: 4px 14px; border: 1px solid;
      margin-bottom: 36px;
    }
    /* Stat pills */
    .hero-stats { display: flex; flex-wrap: wrap; justify-content: center; gap: 0; }
    .stat-pill {
      padding: 18px 32px; border: 1px solid var(--rule); border-right: none;
      text-align: center;
    }
    .stat-pill:last-child { border-right: 1px solid var(--rule); }
    .stat-num { font-family: var(--display); font-size: 30px; color: var(--gold); letter-spacing: 0.04em; line-height: 1; }
    .stat-label { font-family: var(--mono); font-size: 8px; letter-spacing: 0.16em; color: var(--dust); text-transform: uppercase; margin-top: 5px; }

    /* Sections */
    .wrap { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
    .section { padding: 80px 0; border-bottom: 1px solid var(--rule); }
    .section:last-of-type { border-bottom: none; }
    .section-label {
      font-family: var(--mono); font-size: 9px; letter-spacing: 0.24em;
      text-transform: uppercase; color: var(--gold);
      margin-bottom: 10px; display: flex; align-items: center; gap: 10px;
    }
    .section-label::after { content: ''; flex: 1; height: 1px; background: rgba(201,168,76,0.2); }
    .section-title {
      font-family: var(--display); font-size: clamp(36px, 5vw, 60px);
      letter-spacing: 0.04em; color: var(--paper); line-height: 1;
      margin-bottom: 8px;
    }
    .section-sub {
      font-family: var(--serif); font-style: italic; font-size: 15px;
      color: var(--dust); margin-bottom: 44px; max-width: 560px; line-height: 1.55;
    }
    .divider { width: 100%; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); }

    /* Score cards */
    .score-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; }
    .score-card {
      display: grid; grid-template-columns: 96px 1fr; gap: 20px; align-items: center;
      background: var(--card); border: 1px solid var(--rule); padding: 24px;
      transition: border-color 0.2s;
    }
    .score-card:hover { border-color: rgba(201,168,76,0.35); }
    .score-ring-wrap { position: relative; }
    .score-ring-inner {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
    }
    .score-num { font-family: var(--display); font-size: 26px; line-height: 1; }
    .score-denom { font-family: var(--mono); font-size: 9px; color: var(--dust); letter-spacing: 0.1em; }
    .score-label { font-family: var(--mono); font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--dust); margin-bottom: 6px; }
    .score-note { font-family: var(--serif); font-size: 14px; color: var(--dust); line-height: 1.55; }

    /* Bar chart */
    .chart-stack { display: grid; gap: 16px; }
    .bar-row { display: grid; grid-template-columns: 140px 1fr 48px; gap: 16px; align-items: center; }
    .bar-name { font-family: var(--mono); font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--dust); }
    .bar-track { height: 3px; background: rgba(255,255,255,0.06); overflow: hidden; }
    .bar-fill { height: 100%; transition: width 0.8s ease; }
    .bar-val { font-family: var(--display); font-size: 20px; text-align: right; letter-spacing: 0.04em; }

    /* Chips */
    .chip {
      display: inline-block; padding: 3px 10px;
      font-family: var(--mono); font-size: 8px; letter-spacing: 0.16em;
      text-transform: uppercase; font-weight: 500; margin-bottom: 12px;
    }
    .chip-gold      { background: var(--gold-dim);  border: 1px solid var(--gold-mid); color: var(--gold); }
    .chip-sage      { background: var(--sage-dim);  border: 1px solid rgba(74,103,65,0.4); color: #8fa980; }
    .chip-sienna    { background: var(--sien-dim);  border: 1px solid rgba(155,74,40,0.4); color: #d4845e; }
    .chip-sienna-dim { background: rgba(155,74,40,0.08); border: 1px solid rgba(155,74,40,0.2); color: #c07060; }
    .chip-dim       { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: var(--dust); }

    /* Issue cards */
    .issue-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 16px; }
    .issue-card { padding: 24px; border: 1px solid var(--rule); background: var(--card); }
    .issue-win { border-color: rgba(74,103,65,0.2); }
    .issue-blocker { border-color: rgba(155,74,40,0.25); border-left: 3px solid var(--sienna); }
    .issue-title { font-family: var(--serif); font-weight: 600; font-size: 19px; color: var(--paper); margin-bottom: 8px; }
    .issue-body { font-family: var(--serif); font-size: 14px; color: var(--dust); line-height: 1.65; }

    /* Tables */
    .table-wrap { border: 1px solid var(--rule); overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: rgba(201,168,76,0.04); }
    th {
      padding: 12px 16px; text-align: left;
      font-family: var(--mono); font-size: 9px; letter-spacing: 0.18em;
      text-transform: uppercase; color: var(--dust);
      border-bottom: 1px solid var(--rule);
    }
    td {
      padding: 14px 16px; font-family: var(--serif); font-size: 15px;
      color: var(--dust); border-bottom: 1px solid rgba(201,168,76,0.06);
      vertical-align: top; line-height: 1.5;
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: rgba(201,168,76,0.02); }
    .td-kw { font-family: var(--serif); font-weight: 600; color: var(--paper); }
    .td-angle { font-style: italic; font-size: 14px; }
    .td-url { font-family: var(--mono); font-size: 10px; color: var(--dust); word-break: break-all; }
    .td-domain { font-family: var(--serif); font-weight: 600; font-size: 18px; color: var(--paper); }

    /* Roadmap */
    .roadmap-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--rule); }
    .roadmap-card { background: var(--ink); padding: 32px 26px; display: grid; grid-template-columns: 64px 1fr; gap: 20px; }
    .roadmap-index {
      width: 52px; height: 52px;
      display: grid; place-items: center;
      font-family: var(--display); font-size: 24px;
      border: 1px solid; letter-spacing: 0.04em;
    }
    .eyebrow { font-family: var(--mono); font-size: 8px; letter-spacing: 0.22em; text-transform: uppercase; display: block; margin-bottom: 6px; }
    .roadmap-phase { font-family: var(--display); font-size: 22px; color: var(--paper); line-height: 1.1; margin-bottom: 10px; }
    .roadmap-goal { font-family: var(--serif); font-style: italic; font-size: 14px; color: var(--dust); line-height: 1.6; margin-bottom: 14px; }
    .roadmap-list { list-style: none; padding: 0; display: grid; gap: 6px; }
    .roadmap-list li {
      font-family: var(--serif); font-size: 14px; color: var(--dust);
      line-height: 1.5; padding-left: 18px; position: relative;
    }
    .roadmap-list li::before { content: "—"; position: absolute; left: 0; color: var(--gold-mid); font-family: var(--mono); }

    /* Narrative */
    .narr-section {
      display: grid; grid-template-columns: 240px 1fr; gap: 32px;
      padding: 28px 0; border-top: 1px solid var(--rule);
    }
    .narr-section:first-child { border-top: none; padding-top: 0; }
    .narr-title { font-family: var(--display); font-size: 26px; color: var(--paper); letter-spacing: 0.04em; }
    .narr-copy { display: grid; gap: 14px; }
    .narr-copy p { font-family: var(--serif); font-size: 15px; color: var(--dust); line-height: 1.8; }

    /* Monetisation */
    .mono-list { list-style: none; padding: 0; display: grid; gap: 14px; }
    .mono-item { display: flex; gap: 14px; font-family: var(--serif); font-size: 16px; color: var(--dust); line-height: 1.7; padding: 14px 0; border-bottom: 1px solid rgba(201,168,76,0.08); }
    .mono-item:last-child { border-bottom: none; }
    .mono-bullet { color: var(--gold); font-family: var(--mono); font-size: 11px; flex-shrink: 0; margin-top: 4px; }

    /* CTA banner */
    .cta-banner {
      background: linear-gradient(135deg, rgba(155,74,40,0.12), rgba(201,168,76,0.08));
      border: 1px solid rgba(201,168,76,0.28);
      padding: 52px 60px; text-align: center;
      position: relative; overflow: hidden;
    }
    .cta-banner::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,168,76,0.04), transparent);
    }
    .cta-eyebrow { font-family: var(--mono); font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--gold); margin-bottom: 14px; position: relative; }
    .cta-title { font-family: var(--display); font-size: clamp(42px, 6vw, 80px); color: var(--paper); line-height: 0.95; margin-bottom: 16px; position: relative; }
    .cta-body { font-family: var(--serif); font-style: italic; font-size: 18px; color: var(--dust); max-width: 480px; margin: 0 auto 32px; line-height: 1.6; position: relative; }
    .cta-btn {
      display: inline-block; font-family: var(--mono); font-size: 11px;
      letter-spacing: 0.22em; text-transform: uppercase;
      padding: 16px 44px; background: var(--gold); color: var(--ink);
      text-decoration: none; transition: background 0.2s;
      position: relative;
    }
    .cta-btn:hover { background: #d4b05a; }
    .cta-note { font-family: var(--mono); font-size: 9px; color: rgba(140,123,107,0.5); margin-top: 16px; letter-spacing: 0.12em; position: relative; }

    /* Footer */
    .report-footer {
      padding: 40px 48px; border-top: 1px solid var(--rule);
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
    }
    .report-footer p { font-family: var(--mono); font-size: 9px; color: var(--dust); letter-spacing: 0.1em; }

    /* Responsive */
    @media (max-width: 900px) {
      nav { padding: 12px 20px; }
      .wrap { padding: 0 20px; }
      .hero { padding: 80px 20px 60px; }
      .score-grid, .issue-grid, .narr-section { grid-template-columns: 1fr; }
      .roadmap-grid { grid-template-columns: 1fr; }
      .roadmap-card { grid-template-columns: 1fr; }
      .bar-row { grid-template-columns: 100px 1fr 38px; }
      .cta-banner { padding: 40px 24px; }
      .report-footer { padding: 32px 20px; flex-direction: column; }
    }
    @media print {
      body::before { display: none; }
      #pb { display: none; }
      .cta-banner { break-inside: avoid; }
    }
  </style>
</head>
<body>
<div id="pb"></div>

<!-- TICKER -->
<div class="ticker-wrap">
  <div class="ticker-inner">${tickerContent}</div>
</div>

<!-- NAV -->
<nav>
  <div class="nav-brand">itappens.ai · Audit Report</div>
  <ul class="nav-links">
    <li><a href="#score">Scores</a></li>
    <li><a href="#wins">Quick Wins</a></li>
    <li><a href="#blockers">Blockers</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#narrative">Analysis</a></li>
  </ul>
  <div class="nav-date">Generated ${generatedDate}</div>
</nav>

<!-- HERO -->
<div class="hero">
  <div class="hero-bg"></div>
  <div class="hero-eyebrow">GEO + SEO Audit Report &nbsp;·&nbsp; itappens.ai</div>
  <div class="hero-title">
    ${report.hostname.split(".")[0].toUpperCase()}
    <em>${report.siteUrl.replace(/https?:\/\//, "")}</em>
  </div>
  <p class="hero-sub">${report.headline}</p>

  <div class="score-ring-hero">
    <svg viewBox="0 0 100 100" style="transform:rotate(-90deg)">
      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(201,168,76,0.1)" stroke-width="6"/>
      <circle cx="50" cy="50" r="42" fill="none" stroke="${overallColor}" stroke-width="6"
        stroke-dasharray="${overallCirc} 263.9" stroke-linecap="round"/>
    </svg>
    <div class="score-ring-hero-inner">
      <span class="score-big" style="color:${overallColor}">${report.overallScore}</span>
      <span class="score-denom-hero">/ 100</span>
    </div>
  </div>

  <div class="score-grade" style="color:${overallColor};border-color:${overallColor}">
    ${scoreLabel(report.overallScore)} · ${report.tierLabel}
  </div>

  <div class="hero-stats">
    <div class="stat-pill"><div class="stat-num">${report.benchmark[0]?.score ?? 0}</div><div class="stat-label">Technical</div></div>
    <div class="stat-pill"><div class="stat-num">${report.benchmark[1]?.score ?? 0}</div><div class="stat-label">On-Page</div></div>
    <div class="stat-pill"><div class="stat-num">${report.benchmark[2]?.score ?? 0}</div><div class="stat-label">GEO / AI</div></div>
    <div class="stat-pill"><div class="stat-num">${report.benchmark[3]?.score ?? 0}</div><div class="stat-label">Authority</div></div>
    <div class="stat-pill"><div class="stat-num">${report.topPages.length}</div><div class="stat-label">Pages Crawled</div></div>
    <div class="stat-pill"><div class="stat-num">${report.competitorTable.length}</div><div class="stat-label">Competitors</div></div>
  </div>
</div>

<!-- SCORE CARDS -->
<div id="score" class="divider"></div>
<div class="wrap">
  <div class="section">
    <div class="section-label">01 — Benchmark</div>
    <div class="section-title">Four-Pillar Scoreboard</div>
    <p class="section-sub">Scores derived from live crawl, DataForSEO intelligence, and GEO entity analysis.</p>
    <div class="score-grid">${benchmarkCards}</div>
  </div>

  <div class="section">
    <div class="section-label">Score Breakdown</div>
    <div class="chart-stack">${chartBars}</div>
    <p style="margin-top:20px;font-family:var(--mono);font-size:9px;color:var(--dust);letter-spacing:0.12em;">
      Scores above 70 indicate readiness for both search and answer-engine extraction. Below 45 requires immediate intervention.
    </p>
  </div>
</div>

<!-- QUICK WINS -->
<div id="wins" class="divider"></div>
<div class="wrap">
  <div class="section">
    <div class="section-label">02 — Fast Wins</div>
    <div class="section-title">Highest-Leverage<br>Fixes to Ship First</div>
    <p class="section-sub">These can move rankings within 14 days of implementation.</p>
    <div class="issue-grid">${quickWins}</div>
  </div>
</div>

<!-- BLOCKERS -->
<div id="blockers" class="divider"></div>
<div class="wrap">
  <div class="section">
    <div class="section-label">03 — Critical Blockers</div>
    <div class="section-title">Issues Suppressing<br>Visibility &amp; Trust</div>
    <p class="section-sub">These are costing you traffic and revenue today.</p>
    <div class="issue-grid">${blockers}</div>
  </div>
</div>

${report.serpHighlights.length ? `
<div class="divider"></div>
<div class="wrap">
  <div class="section">
    <div class="section-label">04 — SERP Intelligence</div>
    <div class="section-title">Keyword Battles<br>&amp; How to Win Them</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Keyword</th><th>Current Winners</th><th>itappens.ai Angle</th></tr></thead>
        <tbody>${serpRows}</tbody>
      </table>
    </div>
  </div>
</div>` : ""}

${report.opportunities.length ? `
<div class="divider"></div>
<div class="wrap">
  <div class="section">
    <div class="section-label">05 — Opportunities</div>
    <div class="section-title">Priority Keyword<br>Targets</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Keyword</th><th>Why It Matters</th><th>Priority</th></tr></thead>
        <tbody>${opRows}</tbody>
      </table>
    </div>
  </div>
</div>` : ""}

${report.topPages.length ? `
<div class="divider"></div>
<div class="wrap">
  <div class="section">
    <div class="section-label">06 — Crawl Output</div>
    <div class="section-title">Top Pages<br>by On-Page Score</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Page</th><th>URL</th><th>Words</th><th>Score</th></tr></thead>
        <tbody>${pageRows}</tbody>
      </table>
    </div>
  </div>
</div>` : ""}

${report.competitorTable.length ? `
<div class="divider"></div>
<div class="wrap">
  <div class="section">
    <div class="section-label">07 — Competitive Landscape</div>
    <div class="section-title">Domains Eating<br>Your Keyword Share</div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Domain</th><th>Keyword Overlaps</th><th>Avg Position</th><th>Est. Traffic Value</th></tr></thead>
        <tbody>${compRows}</tbody>
      </table>
    </div>
  </div>
</div>` : ""}

<!-- ROADMAP -->
<div id="roadmap" class="divider"></div>
<div class="wrap">
  <div class="section">
    <div class="section-label">08 — Implementation Roadmap</div>
    <div class="section-title">30 / 60 / 90-Day<br>Execution Plan</div>
    <p class="section-sub">Sequenced for maximum impact. Week 1 actions alone should move rankings.</p>
    <div class="roadmap-grid">${roadmap}</div>
  </div>
</div>

<!-- NARRATIVE -->
<div id="narrative" class="divider"></div>
<div class="wrap">
  <div class="section">
    <div class="section-label">09 — Strategic Narrative</div>
    <div class="section-title">The Full Picture</div>
    <div style="margin-top:36px;">${sections}</div>
  </div>
</div>

${report.monetizationAngles.length ? `
<div class="divider"></div>
<div class="wrap">
  <div class="section">
    <div class="section-label">10 — Monetisation</div>
    <div class="section-title">How This Converts<br>Into Revenue</div>
    <ul class="mono-list">${monoAngles}</ul>
  </div>
</div>` : ""}

<!-- CTA -->
<div class="cta-banner">
  <div class="cta-eyebrow">Next Step — Implement with itappens.ai</div>
  <div class="cta-title">IMPLEMENT THIS<br>FULL GEO FIX.</div>
  <p class="cta-body">${report.cta.body}</p>
  <a class="cta-btn" href="${report.cta.buttonUrl}" target="_blank" rel="noreferrer">
    ${report.cta.buttonLabel} →
  </a>
  <p class="cta-note">Delivered by itappens.ai · Brands that want citation share, not vanity SEO slides.</p>
</div>

<!-- FOOTER -->
<footer class="report-footer">
  <p>itappens.ai · GEO + SEO Audit Engine · Report v${report.version}</p>
  <p>Generated ${generatedDate} for ${report.siteUrl}</p>
</footer>

<script>
  // Progress bar
  const pb = document.getElementById('pb');
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    pb.style.width = pct + '%';
  });
</script>
</body>
</html>`;
}
