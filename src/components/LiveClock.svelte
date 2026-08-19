<script>
  import { onMount } from 'svelte';

  let now = new Date();
  let timeStr = '';
  let dateStr = '';
  let dayStr = '';
  let secDeg = 0;
  let minDeg = 0;
  let hourDeg = 0;

  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  function updateClock() {
    now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ms = now.getMilliseconds();

    timeStr = [
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0'),
    ].join(':');

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    dateStr = `${year}.${month}.${date}`;
    dayStr = days[now.getDay()];

    secDeg = seconds * 6 + (ms / 1000) * 6;
    minDeg = minutes * 6 + seconds * 0.1;
    hourDeg = (hours % 12) * 30 + minutes * 0.5;
  }

  onMount(() => {
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  });
</script>

<div class="clock-card">
  <!-- 時鐘與數位資訊水平排列 -->
  <div class="clock-main">
    <!-- 指針鐘盤 -->
    <div class="dial-wrap">
      <svg class="clock-dial" viewBox="0 0 100 100" width="64" height="64">
        <!-- 外框 -->
        <circle cx="50" cy="50" r="47" class="dial-face" />
        <circle cx="50" cy="50" r="47" class="dial-rim" />

        <!-- 12 小時刻度 -->
        {#each Array(12) as _, i}
          <line
            x1="50"
            y1={i % 3 === 0 ? "8" : "11"}
            x2="50"
            y2={i % 3 === 0 ? "16" : "14"}
            class={i % 3 === 0 ? "tick-major" : "tick-minor"}
            transform="rotate({i * 30} 50 50)"
          />
        {/each}

        <!-- 時針 -->
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="26"
          class="hand hand-hour"
          transform="rotate({hourDeg} 50 50)"
        />

        <!-- 分針 -->
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="17"
          class="hand hand-min"
          transform="rotate({minDeg} 50 50)"
        />

        <!-- 秒針 (金色) -->
        <line
          x1="50"
          y1="58"
          x2="50"
          y2="14"
          class="hand hand-sec"
          transform="rotate({secDeg} 50 50)"
        />

        <!-- 中心鉚釘 -->
        <circle cx="50" cy="50" r="2.5" class="dial-center" />
      </svg>
    </div>

    <!-- 數位時間 -->
    <div class="time-readout">
      <div class="digital-time">{timeStr || '00:00:00'}</div>
      <div class="digital-date">
        <span>{dateStr}</span>
        <span class="date-sep">/</span>
        <span>{dayStr}</span>
      </div>
    </div>
  </div>
</div>

<style>
  .clock-card {
    padding: 0.95rem 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .clock-main {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .dial-wrap {
    flex-shrink: 0;
  }

  .clock-dial {
    display: block;
  }

  .dial-face {
    fill: var(--bg-soft);
  }

  .dial-rim {
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.5;
  }

  .tick-major {
    stroke: var(--ink);
    stroke-width: 2;
    stroke-linecap: round;
  }

  .tick-minor {
    stroke: var(--ink-3);
    stroke-width: 1;
    stroke-linecap: round;
  }

  .hand {
    stroke-linecap: round;
    transform-origin: 50px 50px;
    transition: transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44);
  }

  .hand-hour {
    stroke: var(--ink);
    stroke-width: 2.4;
  }

  .hand-min {
    stroke: var(--ink);
    stroke-width: 1.8;
  }

  .hand-sec {
    stroke: #deb86d;
    stroke-width: 1.2;
  }

  .dial-center {
    fill: #deb86d;
    stroke: var(--ink);
    stroke-width: 1;
  }

  .time-readout {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .digital-time {
    font-family: var(--font-sans);
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: 0.08em;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
  }

  .digital-date {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.76rem;
    color: var(--ink-2);
    letter-spacing: 0.06em;
  }

  .date-sep {
    color: var(--ink-3);
  }

  /* 城市座標欄 */
  .location-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 0.65rem;
    border-top: 1px dashed var(--border);
    font-size: 0.68rem;
    letter-spacing: 0.06em;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    color: var(--ink-2);
    font-weight: 500;
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    animation: radar-pulse 2s infinite;
  }

  @keyframes radar-pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 5px rgba(16, 185, 129, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }

  .coord-tag {
    font-family: monospace;
    color: var(--ink-3);
    font-size: 0.64rem;
  }
</style>
