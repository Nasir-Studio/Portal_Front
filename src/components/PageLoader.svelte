<script>
  import { onMount } from 'svelte';

  let progress = 0;
  let isDone = false;
  let isHidden = false;

  onMount(() => {
    const startTime = performance.now();
    const duration = 800; // 毫秒，平滑慢慢走

    function updateProgress(now) {
      const elapsed = now - startTime;
      // 使用平滑 ease-out 推進進度
      const t = Math.min(1, elapsed / duration);
      const easeT = 1 - Math.pow(1 - t, 2.5); // easeOut
      progress = Math.min(100, Math.floor(easeT * 100));

      if (t < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        progress = 100;
        setTimeout(() => {
          isDone = true;
          setTimeout(() => {
            isHidden = true;
          }, 380);
        }, 100);
      }
    }

    requestAnimationFrame(updateProgress);
  });
</script>

{#if !isHidden}
  <div class="page-loader" class:is-done={isDone} aria-hidden={isDone}>
    <div class="loader-box">
      <!-- 🐑 純羊 Icon 高清無損，可愛微跳動 (放大尺寸) -->
      <img
        class="loader-sheep"
        src="/sheep-hd.png"
        alt="OviNas"
        width="78"
        height="78"
      />

      <!-- 慢慢前進的精緻進度條 (0-100，適度放大) -->
      <div class="loader-bar-wrap">
        <div class="loader-bar-fill" style="width: {progress}%;"></div>
      </div>

      <!-- 可愛手寫手感數字 (0 - 100%) -->
      <div class="loader-pct">
        <span class="pct-num">{progress}</span><span class="pct-symbol">%</span>
      </div>
    </div>
  </div>
{/if}

<style>
  .page-loader {
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.35s;
    user-select: none;
  }

  .page-loader.is-done {
    opacity: 0;
    transform: scale(1.02);
    pointer-events: none;
    visibility: hidden;
  }

  .loader-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.85rem;
    animation: pop-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes pop-in {
    from {
      opacity: 0;
      transform: scale(0.92);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* 可愛小羊微彈跳 (78px 放大呈現清晰細節) */
  .loader-sheep {
    width: 78px;
    height: 78px;
    object-fit: contain;
    filter: drop-shadow(0 4px 10px rgba(28, 28, 28, 0.1));
    animation: sheep-cute-bounce 0.85s ease-in-out infinite alternate;
  }

  @keyframes sheep-cute-bounce {
    0% {
      transform: translateY(0) scale(1);
    }
    100% {
      transform: translateY(-6px) scale(1.05);
    }
  }

  /* 圓角進度條軌道 (156px 寬度, 8px 高度) */
  .loader-bar-wrap {
    width: 156px;
    height: 8px;
    background: rgba(28, 28, 28, 0.08);
    border-radius: 999px;
    padding: 1.5px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .loader-bar-fill {
    height: 100%;
    background: var(--ink);
    border-radius: 999px;
    transition: width 0.04s linear;
  }

  /* 可愛 Klee One 手寫手感百分比字體 */
  .loader-pct {
    font-family: 'Klee One', 'Iansui', var(--font-serif), cursive, sans-serif;
    font-size: 0.96rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--ink);
    display: flex;
    align-items: baseline;
    justify-content: center;
  }

  .pct-num {
    font-variant-numeric: tabular-nums;
    font-size: 1.05rem;
  }

  .pct-symbol {
    font-size: 0.82rem;
    margin-left: 1.5px;
    color: var(--ink-2);
  }
</style>
