<script>
  import { onMount } from 'svelte';
  import { getFirestoreInstance } from '../ntub/lib/firebase/client';
  import { doc, increment, onSnapshot, setDoc } from 'firebase/firestore';

  let count = 0;
  let loaded = false;

  onMount(() => {
    const db = getFirestoreInstance();
    const ref = doc(db, 'visitor_counts', 'total');

    // 同一瀏覽器 session 只計一次（避免重整洗版）
    const key = 'portal_visited';
    const firstVisit = !sessionStorage.getItem(key);
    if (firstVisit) {
      sessionStorage.setItem(key, '1');
      setDoc(ref, { count: increment(1) }, { merge: true }).catch(() => {});
    }

    // 即時同步顯示
    onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        count = snap.data().count ?? 0;
      }
      loaded = true;
    });
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
