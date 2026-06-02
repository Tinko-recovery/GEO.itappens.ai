# UI Context

## Aesthetic & Vibe
The design language for the **itappens AEO** dashboard and marketing pages should feel **Premium, Dark Mode, and Glassmorphic**. 
It should look like a cutting-edge AI product—vibrant, high-contrast, and deeply professional (think Vercel or Linear, but with rich indigo/violet accents).

## Color Tokens (Tailwind)

| Semantic Name | Purpose | Tailwind Class Example |
|---------------|---------|------------------------|
| Background | App root background (Deep dark) | `bg-slate-950` |
| Surface | Card/Panel backgrounds | `bg-slate-900/50` or `bg-slate-900` |
| Surface Border| Subtle dividers and borders | `border-slate-800` |
| Primary | Main brand accent (Indigo/Violet) | `bg-indigo-600`, `text-indigo-400` |
| Primary Hover | Interactive states | `hover:bg-indigo-500` |
| Text Primary | Headings, main text | `text-slate-50` |
| Text Muted | Subtitles, secondary info | `text-slate-400` |
| Success | Green accents (Published state) | `text-emerald-400`, `bg-emerald-500/10` |
| Warning/Paused| Amber accents (Paused state) | `text-amber-400`, `bg-amber-500/10` |

## Glassmorphism
- Use `backdrop-blur-md bg-slate-900/40 border border-slate-800` for floating navigation bars, tooltips, and modal surfaces.

## Typography
- **Headings:** Sans-serif, tight tracking (`tracking-tight`), heavy weight (`font-bold` or `font-extrabold`).
- **Body:** Clean sans-serif, relaxed line-height (`leading-relaxed`).

## Layout Patterns
- **Dashboard:** Side navigation (`w-64`) on desktop, collapsible on mobile. Main content area centered with a max-width (e.g., `max-w-6xl`) for readability.
- **Forms:** Labels should be muted and small (`text-sm text-slate-400`), inputs should have dark backgrounds (`bg-slate-950 border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500`).
- **Buttons:** Rounded edges (`rounded-md` or `rounded-lg`), smooth transitions (`transition-all duration-200`).
