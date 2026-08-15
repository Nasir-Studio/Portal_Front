<script>
  import { loginWithGoogle } from '$lib/firebase'
  import { ALL, LINES } from '$lib/stations'
  import SheepLogo from './SheepLogo.svelte'

  let busy = $state(false)
  let err = $state('')

  async function signIn() {
    busy = true
    err = ''
    try {
      await loginWithGoogle()
    } catch (e) {
      const ignore = ['auth/popup-closed-by-user', 'auth/redirect-cancelled-by-user', 'auth/cancelled-popup-request']
      if (!ignore.includes(e?.code)) err = '登入失敗，請稍後再試'
      busy = false
    }
  }
</script>

<div class="login">
  <!-- 黑 topbar：與主站 Nav.astro 相同 -->
  <div class="login__topbar">
    <div class="login__topbar-inner">
      <span class="login__topbar-left">羊家入口網</span>
      <span class="login__topbar-right">
        <a href="/">首頁</a>
        <span class="login__sep" aria-hidden="true">｜</span>
        <a href="#news">最新消息</a>
      </span>
    </div>
  </div>

  <!-- 白 header：SheepLogo + 羊家的入口 -->
  <div class="login__header-main">
    <div class="login__brand">
      <SheepLogo size={58} />
      <span class="login__brand-text">
        <span class="login__brand-name">羊家的入口</span>
        <span class="login__brand-en">SHEEP PORTAL</span>
      </span>
    </div>
  </div>

  <!-- menubar：只留「回入口」 -->
  <div class="login__menubar-wrap">
    <nav class="login__menubar" aria-label="主導覽">
      <a class="login__menu-link login__menu-link--back" href="/">
        <span class="login__menu-back-arrow" aria-hidden="true">←</span>
        回入口
      </a>
    </nav>
  </div>

  <!-- Hero banner：複刻主站 Banner.astro 的設計語言 -->
  <div class="login__hero">
    <div class="login__hero-frame">
      <span class="login__hero-square login__hero-square--l" aria-hidden="true"></span>
      <span class="login__hero-square login__hero-square--r" aria-hidden="true"></span>
      <h1 class="login__hero-title">【雙北捷運】捷運章集戳</h1>
      <p class="login__hero-en">TAIPEI & NEW TAIPEI METRO BADGE</p>
      <p class="login__hero-sub">捷運紀念章收集冊</p>
    </div>
  </div>

  <!-- 兩欄內容：登入 + 收集目標 -->
  <main class="login__main">
    <div class="login__cols">
      <!-- 左欄：登入卡 -->
      <main class="login__col login__col--center">
        <section class="login__module login__card" aria-label="捷運章集戳登入">
          <h2 class="login__module-title">
            <span class="login__card-head">
              <span class="login__cal-square" aria-hidden="true"></span>
              登入
            </span>
          </h2>
          <div class="login__card-body">
            <div class="login__logo">
              <SheepLogo size={52} />
            </div>
            <h2 class="login__title">【雙北捷運】捷運章集戳</h2>
            <p class="login__brand-en-small">TAIPEI & NEW TAIPEI METRO BADGE</p>
            <p class="login__tagline">
              登入後開始收集紀念章，<br />
              記錄屬於你的每一趟旅程。
            </p>

            <button class="login__btn" onclick={signIn} disabled={busy}>
              {#if busy}
                <span class="mono">跳轉至 Google…</span>
              {:else}
                <svg class="g" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.2 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.2 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                  <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.3C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
                  <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6.3 5.3C36.9 40.1 44 35 44 24c0-1.3-.1-2.6-.4-3.9z" />
                </svg>
                <span>使用 Google 登入</span>
              {/if}
            </button>

            {#if err}
              <p class="login__err">{err}</p>
            {/if}
          </div>
        </section>
      </main>

      <!-- 右欄：收集目標 -->
      <aside class="login__col">
        <section class="login__module" aria-label="收集目標">
          <h2 class="login__module-title">
            <span class="login__card-head">
              <span class="login__cal-square" aria-hidden="true"></span>
              收集目標
            </span>
          </h2>
          <div class="login__goal">
            <div class="login__goal-sheep">
              <SheepLogo size={40} />
            </div>
            <div class="login__goal-nums">
              <div class="login__goal-row">
                <span class="login__goal-label">紀念章</span>
                <span class="login__goal-value">{ALL.length}</span>
              </div>
              <div class="login__goal-row">
                <span class="login__goal-label">路線</span>
                <span class="login__goal-value">{LINES.length}</span>
              </div>
            </div>
            <p class="login__goal-note">台北捷運・新北捷運紀念章，等你一一收集。</p>
          </div>
        </section>
      </aside>
    </div>
  </main>
</div>

<style>
  /* ===== 全站共用的羊家設計變數（與主站 global.css 一致） ===== */
  .login {
    --ink: #1c1c1c;
    --ink-2: #4c4b47;
    --ink-3: #8b8983;
    --white: #ffffff;
    --bg: #f5f4f1;
    --bg-soft: #efeeea;
    --surface: #ffffff;
    --surface-2: #efeeea;
    --border: #d8d7d2;
    --border-strong: #b9b8b2;
    --font-serif: 'Noto Serif TC', 'Songti TC', 'STSong', Georgia, 'Times New Roman', serif;
    --font-sans: 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', system-ui, -apple-system, 'Segoe UI', sans-serif;
    --ease: cubic-bezier(0.4, 0, 0.2, 1);
    --t: 200ms var(--ease);

    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    font-family: var(--font-sans);
    color: var(--ink);
  }

  /* ===== 黑 topbar（與 Nav.astro .topbar 相同） ===== */
  .login__topbar {
    background: var(--ink);
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.75rem;
    letter-spacing: 0.14em;
  }

  .login__topbar-inner {
    width: min(1080px, 100% - 2.5rem);
    margin-inline: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 32px;
  }

  .login__topbar a {
    color: inherit;
    text-decoration: none;
    transition: color var(--t);
  }

  .login__topbar a:hover {
    color: var(--white);
  }

  .login__sep {
    margin: 0 0.5rem;
    color: rgba(255, 255, 255, 0.3);
  }

  /* ===== 白 header（與 Nav.astro .header-main/.brand 相同） ===== */
  .login__header-main {
    width: min(1080px, 100% - 2.5rem);
    margin-inline: auto;
    display: flex;
    align-items: center;
    padding: 1.25rem 0 1.1rem;
  }

  .login__brand {
    display: inline-flex;
    align-items: center;
    gap: 0.9rem;
    color: var(--ink);
    text-decoration: none;
  }

  .login__brand svg {
    filter: drop-shadow(0 4px 8px rgba(28, 28, 28, 0.2));
  }

  .login__brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.25;
  }

  .login__brand-name {
    font-family: var(--font-serif);
    font-size: 1.55rem;
    font-weight: 600;
    letter-spacing: 0.16em;
  }

  .login__brand-en {
    font-size: 0.66rem;
    font-weight: 400;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: var(--ink-3);
  }

  /* ===== menubar（與 Nav.astro .menubar 相同） ===== */
  .login__menubar-wrap {
    border-top: 1px solid var(--border);
    border-bottom: 2px solid var(--ink);
    background: var(--surface);
  }

  .login__menubar {
    width: min(1080px, 100% - 2.5rem);
    margin-inline: auto;
    display: flex;
    align-items: center;
    min-height: 48px;
  }

  .login__menu-link--back {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0 1.35rem;
    height: 48px;
    font-size: 0.95rem;
    letter-spacing: 0.12em;
    color: var(--ink);
    border-right: 1px solid var(--border);
    text-decoration: none;
    font-weight: 500;
    transition: background var(--t), color var(--t);
  }

  .login__menu-link--back:hover {
    background: var(--bg-soft);
  }

  .login__menu-back-arrow {
    font-size: 1rem;
    line-height: 1;
  }

  /* ===== Hero banner（複刻主站 Banner.astro） ===== */
  .login__hero {
    width: min(1080px, 100% - 2.5rem);
    margin-inline: auto;
    padding: 1.6rem 0 0.4rem;
  }

  .login__hero-frame {
    position: relative;
    border: 2px solid var(--ink);
    background: var(--bg);
    padding: 2.6rem 1.5rem 2.8rem;
    text-align: center;
    animation: login-in 0.5s var(--ease) both;
  }

  .login__hero-square {
    position: absolute;
    top: 1.5rem;
    width: 12px;
    height: 12px;
    background: var(--ink);
  }

  .login__hero-square--l {
    left: 1.5rem;
  }

  .login__hero-square--r {
    right: 1.5rem;
  }

  .login__hero-title {
    margin: 0;
    font-family: var(--font-serif);
    font-size: clamp(2.6rem, 7vw, 4.2rem);
    font-weight: 700;
    letter-spacing: 0.18em;
    color: var(--ink);
  }

  .login__hero-en {
    margin-top: 0.7rem;
    font-size: clamp(0.7rem, 1.6vw, 1rem);
    letter-spacing: 0.5em;
    text-transform: uppercase;
    color: var(--ink-2);
  }

  .login__hero-sub {
    margin-top: 1.1rem;
    font-size: clamp(0.72rem, 1.4vw, 0.9rem);
    letter-spacing: 0.3em;
    color: var(--ink-3);
  }

  @keyframes login-in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ===== 兩欄內容 ===== */
  .login__main {
    flex: 1;
    padding: 1.4rem 0 3.5rem;
  }

  .login__cols {
    width: min(1080px, 100% - 2.5rem);
    margin-inline: auto;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 300px;
    gap: 1.4rem;
    align-items: start;
  }

  .login__col {
    min-width: 0;
  }

  .login__col--center {
    animation-delay: 0.12s;
  }

  /* module（與主站 .module 相同） */
  .login__module {
    background: var(--surface);
    border: 1px solid var(--border);
    margin-bottom: 1.4rem;
    animation: login-in 0.45s var(--ease) both;
  }

  .login__module-title {
    display: flex;
    align-items: center;
    padding: 0.65rem 1rem;
    margin: 0;
    background: var(--bg-soft);
    border-bottom: 1px solid var(--border);
    font-size: 0.92rem;
    font-weight: 500;
    letter-spacing: 0.18em;
    color: var(--ink);
    font-family: var(--font-sans);
  }

  .login__card-head {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .login__cal-square {
    width: 8px;
    height: 8px;
    background: var(--ink);
    transform: rotate(45deg);
  }

  /* 中欄登入卡 */
  .login__card-body {
    padding: 2.2rem 2rem 2.2rem;
    text-align: center;
  }

  .login__logo {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .login__logo svg {
    filter: drop-shadow(0 3px 6px rgba(28, 28, 28, 0.18));
  }

  .login__title {
    margin: 0;
    font-family: var(--font-serif);
    font-size: 1.7rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    color: var(--ink);
  }

  .login__brand-en-small {
    margin-top: 0.2rem;
    font-size: 0.6rem;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: var(--ink-3);
  }

  .login__tagline {
    margin-top: 1.1rem;
    font-size: 0.82rem;
    line-height: 2;
    color: var(--ink-3);
  }

  .login__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    width: 100%;
    margin-top: 1.6rem;
    padding: 0.8rem 1.7rem;
    font-family: var(--font-sans);
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    border-radius: 0;
    border: 1px solid var(--ink);
    background: var(--ink);
    color: var(--white);
    cursor: pointer;
    user-select: none;
    transition: background var(--t), border-color var(--t);
  }

  .login__btn:hover:not(:disabled) {
    background: #000;
    border-color: #000;
  }

  .login__btn:disabled {
    opacity: 0.55;
    cursor: default;
    pointer-events: none;
  }

  .login__btn .g {
    width: 18px;
    height: 18px;
  }

  .login__err {
    margin-top: 1rem;
    font-size: 0.78rem;
    color: var(--danger, #c0452a);
  }

  /* 右欄收集目標 */
  .login__goal {
    padding: 1.4rem 1rem 1.2rem;
    text-align: center;
  }

  .login__goal-sheep {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .login__goal-sheep svg {
    filter: drop-shadow(0 3px 6px rgba(28, 28, 28, 0.18));
  }

  .login__goal-nums {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .login__goal-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px dashed var(--border);
  }

  .login__goal-row:last-of-type {
    border-bottom: none;
  }

  .login__goal-label {
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    color: var(--ink-2);
  }

  .login__goal-value {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--ink);
  }

  .login__goal-note {
    margin-top: 1rem;
    font-size: 0.72rem;
    line-height: 1.9;
    color: var(--ink-3);
  }

  /* 響應式（與主站一致） */
  @media (max-width: 900px) {
    .login__cols {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .login__col {
      order: 2;
    }

    .login__col--center {
      order: 1;
    }

    .login__hero {
      padding: 0.9rem 0 0.2rem;
    }
  }

  @media (max-width: 480px) {
    .login__topbar-left {
      display: none;
    }

    .login__topbar-inner {
      justify-content: flex-end;
    }

    .login__brand-name {
      font-size: 1.25rem;
    }

    .login__hero-frame {
      padding: 2rem 1rem 2.2rem;
    }
  }
</style>
