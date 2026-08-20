<script>
  import { onMount } from 'svelte';

  let progress = 0;
  let isDone = false;
  let isHidden = false;

  onMount(() => {
    const startTime = performance.now();
    const duration = 1200; // 毫秒 (稍微放慢至1.2秒，讓小羊漫步過程清晰生動)

    function updateProgress(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // 柔和的前進曲線
      const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
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
        }, 120);
      }
    }

    requestAnimationFrame(updateProgress);
  });
</script>

{#if !isHidden}
  <div class="page-loader" class:is-done={isDone} aria-hidden={isDone}>
    <div class="loader-stage">
      <!-- 🐑 小羊漫步軌道 (隨進度條 0% -> 100% 同步行走，無上下浮動) -->
      <div class="sheep-track">
        <div class="sheep-walker" style="left: {progress}%;">
          <img
            class="loader-sheep"
            src="/sheep-hd.png"
            alt="OviNas"
            width="58"
            height="58"
          />
        </div>
      </div>

      <!-- 慢慢前進的精緻進度條 (0-100) -->
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

  /* 舞台容器 (220px 寬度) */
  .loader-stage {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 220px;
    gap: 0.5rem;
    animation: pop-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes pop-in {
    from {
      opacity: 0;
      transform: scale(0.94);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* 🐑 純小羊行走軌道 (無下方文字) */
  .sheep-track {
    position: relative;
    width: 100%;
    height: 44px;
  }

  .sheep-walker {
    position: absolute;
    bottom: 4px;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: left 0.05s linear;
    will-change: left;
  }

  /* 靜止行走的高清純小羊 (無英文字、無上下浮動，純平移) */
  .loader-sheep {
    width: 64px;
    height: 38px;
    object-fit: contain;
    filter: drop-shadow(0 3px 6px rgba(28, 28, 28, 0.1));
    display: block;
  }

  /* 圓角進度條軌道 (220px 寬度, 7px 高度) */
  .loader-bar-wrap {
    width: 100%;
    height: 7px;
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
    transition: width 0.05s linear;
  }

  /* 可愛 Klee One 手寫手感百分比字體 */
  .loader-pct {
    margin-top: 0.35rem;
    font-family: 'Klee One', 'Iansui', var(--font-serif), cursive, sans-serif;
    font-size: 0.98rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--ink);
    display: flex;
    align-items: baseline;
    justify-content: center;
  }

  .pct-num {
    font-variant-numeric: tabular-nums;
    font-size: 1.1rem;
  }

  .pct-symbol {
    font-size: 0.85rem;
    margin-left: 2px;
    color: var(--ink-2);
  }
</style>
