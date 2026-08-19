<script>
  import quotes from '../data/quotes';

  const today = new Date();
  const seed =
    today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const quote = quotes[seed % quotes.length];
</script>

<div class="quote">
  <p class="quote-text">「{quote.text}」</p>
  <p class="quote-author">— {quote.author}</p>
</div>

<style>
  .quote {
    padding: 1.1rem 1rem;
  }

  .quote-text {
    font-family: var(--font-serif);
    font-size: 0.92rem;
    line-height: 1.9;
    letter-spacing: 0.06em;
    color: var(--ink);
    margin: 0 0 0.55rem 0;
  }

  .quote-author {
    font-size: 0.74rem;
    letter-spacing: 0.1em;
    color: var(--ink-3);
    margin: 0;
    text-align: right;
  }
</style>
