# Semantic HTML Before and After

## Before
```html
<div class="page">
  <div class="hero-title">GEO Agency India 2026</div>
  <div class="copy">We do GEO.</div>
  <div class="faq-item">
    <div class="question">What is GEO?</div>
    <div class="answer">...</div>
  </div>
</div>
```

Problems:
- no landmark elements
- no heading hierarchy
- no article or section boundaries
- FAQ content is not clearly grouped
- metrics and lists are hidden inside generic divs

## After
```html
<main>
  <article>
    <header>
      <p class="overline">GEO agency India 2026</p>
      <h1>GEO agency India 2026</h1>
      <p>The direct answer to the query.</p>
    </header>

    <section>
      <h2>What buyers mean by this query</h2>
      <p>...</p>
    </section>

    <section>
      <h2>What a real GEO agency should ship</h2>
      <ol>
        <li>Technical Signals</li>
        <li>Answer clusters</li>
        <li>Weekly tracking</li>
      </ol>
    </section>

    <section>
      <h2>FAQ</h2>
      <dl>
        <dt>What is GEO?</dt>
        <dd>...</dd>
      </dl>
    </section>
  </article>
</main>
```

## Rules applied
- One visible h1 per page.
- Use header, main, section, article, and aside based on page role.
- Use ol, ul, dl, and p for real structure instead of decorative div stacks.
- Match JSON-LD types only to visible page content.
- Keep direct-answer summaries near the top for extraction.
