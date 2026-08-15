<script>
  import { onMount } from 'svelte';

  let count = 0;

  onMount(() => {
    // 純本機計數：不依賴任何資料庫/外部服務
    // localStorage 記錄本機總訪問數，sessionStorage 防止同一次訪問重複累加
    const totalKey = 'portal_visit_count';
    const seenKey = 'portal_visit_seen';

    let total = parseInt(localStorage.getItem(totalKey) || '0', 10);
    if (Number.isNaN(total) || total < 0) total = 0;

    if (!sessionStorage.getItem(seenKey)) {
      sessionStorage.setItem(seenKey, '1');
      total += 1;
      localStorage.setItem(totalKey, String(total));
    }

    count = total;
  });
</script>

<div class="vcount">
  <div class="vcount-label" aria-hidden="true">VISITOR COUNTER</div>
  <div class="vcount-digits" role="status" aria-label="訪客人數">
    {#each String(count).padStart(6, '0') as digit, i (i)}
      <span class="vcount-digit">{digit}</span>
    {/each}
  </div>
</div>

<style>
  .vcount {
    padding: 1rem 0.75rem;
    text-align: center;
  }

  .vcount-label {
    font-size: 0.68rem;
    letter-spacing: 0.2em;
    color: var(--ink-3);
    margin-bottom: 0.6rem;
  }

  .vcount-digits {
    display: flex;
    justify-content: center;
    gap: 2px;
    font-family: 'Courier New', monospace;
  }

  .vcount-digit {
    min-width: 1.4em;
    padding: 0.35rem 0.15rem;
    background: var(--ink);
    color: #e8e6e0;
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-shadow: 0 0 6px rgba(232, 230, 224, 0.35);
  }
</style>
