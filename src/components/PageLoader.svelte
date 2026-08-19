<script>
  import { onMount } from 'svelte';
  import { t, getCurrentLang } from '../scripts/i18n';

  let progress = 0;
  let isDone = false;
  let isHidden = false;
  let statusText = '載入系統中…';

  onMount(() => {
    statusText = t('loader.loading', getCurrentLang());

    // 0 - 100% 平滑數值躍進
    const startTime = performance.now();
    const duration = 650; // 毫秒

    function updateProgress(now) {
      const elapsed = now - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      progress = pct;

      if (pct < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        progress = 100;
        statusText = t('loader.ready', getCurrentLang());
        setTimeout(() => {
          isDone = true;
          setTimeout(() => {
            isHidden = true;
          }, 450);
        }, 120);
      }
    }

    requestAnimationFrame(updateProgress);
  });
</script>

{#if !isHidden}
  <div class="page-loader" class:is-done={isDone} aria-hidden={isDone}>
    <div class="loader-container">
      <!-- 羊 Icon 品牌核心 -->
      <div class="loader-icon-wrap">
        <img class="loader-sheep-img" src="/favicon.png" alt="OviNas Logo" width="68" height="68" />
        <div class="loader-pulse-ring"></div>
      </div>

      <!-- 品牌名與古典章節 -->
      <h2 class="loader-brand">OviNas</h2>

      <!-- 0 - 100% 數字進度計數 -->
      <div class="loader-counter">
        <span class="counter-num">{progress}</span>
        <span class="counter-unit">%</span>
      </div>

      <!-- 進度條 -->
      <div class="loader-track">
        <div class="loader-bar" style="width: {progress}%;"></div>
      </div>

      <!-- 載入狀態文字 -->
      <p class="loader-status" data-i18n="loader.loading">{statusText}</p>
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
    transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.45s;
    user-select: none;
  }

  .page-loader.is-done {
    opacity: 0;
    transform: scale(1.03);
    pointer-events: none;
    visibility: hidden;
  }

  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 220px;
    animation: loader-fade-in 0.4s ease-out both;
  }

  @keyframes loader-fade-in {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .loader-icon-wrap {
    position: relative;
    width: 76px;
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.8rem;
  }

  .loader-sheep-img {
    width: 64px;
    height: 64px;
    object-fit: contain;
    filter: drop-shadow(0 4px 10px rgba(28, 28, 28, 0.15));
    animation: sheep-breath 1.8s ease-in-out infinite alternate;
  }

  @keyframes sheep-breath {
    0% {
      transform: scale(0.96);
    }
    100% {
      transform: scale(1.04);
    }
  }

  .loader-pulse-ring {
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 1.5px solid rgba(28, 28, 28, 0.2);
    animation: ring-pulse 1.8s ease-out infinite;
  }

  @keyframes ring-pulse {
    0% {
      transform: scale(0.85);
      opacity: 0.8;
    }
    100% {
      transform: scale(1.3);
      opacity: 0;
    }
  }

  .loader-brand {
    font-family: var(--font-serif);
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    color: var(--ink);
    margin: 0 0 0.6rem;
  }

  .loader-counter {
    display: flex;
    align-items: baseline;
    justify-content: center;
    font-family: var(--font-serif);
    color: var(--ink);
    margin-bottom: 0.6rem;
  }

  .counter-num {
    font-size: 2.2rem;
    font-weight: 700;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }

  .counter-unit {
    font-size: 1rem;
    font-weight: 600;
    margin-left: 2px;
    color: var(--ink-3);
  }

  .loader-track {
    width: 100%;
    height: 3px;
    background: rgba(28, 28, 28, 0.1);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 0.75rem;
  }

  .loader-bar {
    height: 100%;
    background: var(--ink);
    border-radius: 2px;
    transition: width 0.05s linear;
  }

  .loader-status {
    font-family: var(--font-sans);
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    color: var(--ink-3);
    margin: 0;
  }
</style>
