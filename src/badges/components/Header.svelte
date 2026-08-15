<script>
  import { logout } from '$lib/firebase'
  import SheepLogo from './SheepLogo.svelte'

  let { user, count, total } = $props()
  let menuOpen = $state(false)

  function toggleMenu() {
    menuOpen = !menuOpen
  }

  function closeMenu() {
    menuOpen = false
  }

  async function onLogout() {
    closeMenu()
    await logout()
    window.location.href = '/'
  }
</script>

<!-- 黑 topbar：與主站 Nav.astro 相同 -->
<div class="app-topbar">
  <div class="app-topbar__inner">
    <span class="app-topbar__left">OviNas</span>
    <span class="app-topbar__right">
      <a href="/">首頁</a>
      <span class="app-topbar__sep" aria-hidden="true">｜</span>
      <a href="#news">最新消息</a>
    </span>
  </div>
</div>

<!-- 白 header：SheepLogo + OviNas -->
<div class="app-header-main">
  <a class="app-brand" href="/">
    <SheepLogo size={58} />
    <span class="app-brand__text">
      <span class="app-brand__name">OviNas</span>
      <span class="app-brand__en">SHEEP PORTAL</span>
    </span>
  </a>

  {#if user}
    <div class="app-user">
      <button
        class="app-user__trigger"
        onclick={toggleMenu}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-label="帳號選單">
        {#if user.photoURL}
          <img class="app-user__avatar" src={user.photoURL} alt="" />
        {:else}
          <span class="app-user__avatar app-user__avatar--fallback"></span>
        {/if}
        <span class="app-user__name">{user.displayName ?? '使用者'}</span>
      </button>

      {#if menuOpen}
        <div class="app-user__backdrop" onclick={closeMenu}></div>
        <div class="app-user__panel" role="menu">
          <div class="app-user__head">
            {#if user.photoURL}
              <img class="app-user__head-avatar" src={user.photoURL} alt="" />
            {:else}
              <span class="app-user__head-avatar app-user__avatar--fallback"></span>
            {/if}
            <div class="app-user__who">
              <div class="app-user__name--lg">{user.displayName ?? '使用者'}</div>
              <div class="app-user__email">{user.email ?? ''}</div>
            </div>
          </div>
          <a class="app-user__item" href="/">回到入口</a>
          <button class="app-user__item" role="menuitem" onclick={onLogout}>登出</button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<!-- menubar：黑 2px 底線 -->
<div class="app-menubar-wrap">
  <nav class="app-menubar" aria-label="主導覽">
    <a class="app-menu-link" href="/">首頁</a>
    <a class="app-menu-link" href="https://nsir.uk" target="_blank" rel="noopener noreferrer">羊-短網址</a>
    <a class="app-menu-link" href="/cctv/">羊監視你</a>
    <a class="app-menu-link" href="https://1ztests.nsir.uk" target="_blank" rel="noopener noreferrer">羊愛考試</a>
    <a class="app-menu-link app-menu-cta" href="/reserve/">預約系統</a>
  </nav>

  <!-- 集章進度列 -->
  <div class="app-progress">
    <div class="app-progress__row">
      <span class="app-progress__label">已集章</span>
      <span class="app-progress__count">
        {count}<span class="app-progress__total"> / {total}</span>
      </span>
    </div>
    <div
      class="app-progress__bar"
      role="progressbar"
      aria-valuenow={count}
      aria-valuemin="0"
      aria-valuemax={total}>
      <div class="app-progress__fill" style="width: {total ? (count / total) * 100 : 0}%;"></div>
    </div>
  </div>
</div>

<style>
  /* ===== 與主站 global.css 一致的設計變數 ===== */
  .app-topbar,
  .app-header-main,
  .app-menubar-wrap,
  .app-user {
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
  }

  /* ===== 黑 topbar ===== */
  .app-topbar {
    background: var(--ink);
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    font-family: var(--font-sans);
  }

  .app-topbar__inner {
    width: min(1080px, 100% - 2.5rem);
    margin-inline: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 32px;
  }

  .app-topbar a {
    color: inherit;
    text-decoration: none;
    transition: color var(--t);
  }

  .app-topbar a:hover {
    color: var(--white);
  }

  .app-topbar__sep {
    margin: 0 0.5rem;
    color: rgba(255, 255, 255, 0.3);
  }

  /* ===== 白 header ===== */
  .app-header-main {
    width: min(1080px, 100% - 2.5rem);
    margin-inline: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 0 1.1rem;
  }

  .app-brand {
    display: inline-flex;
    align-items: center;
    gap: 0.9rem;
    color: var(--ink);
    text-decoration: none;
  }

  .app-brand svg {
    filter: drop-shadow(0 4px 8px rgba(28, 28, 28, 0.2));
  }

  .app-brand__text {
    display: flex;
    flex-direction: column;
    line-height: 1.25;
  }

  .app-brand__name {
    font-family: var(--font-serif);
    font-size: 1.55rem;
    font-weight: 600;
    letter-spacing: 0.16em;
  }

  .app-brand__en {
    font-size: 0.66rem;
    font-weight: 400;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: var(--ink-3);
  }

  /* ===== user menu（主站 topbar-user 風） ===== */
  .app-user {
    position: relative;
    font-family: var(--font-sans);
  }

  .app-user__trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--border);
    background: var(--surface);
    cursor: pointer;
    color: var(--ink);
    font-family: var(--font-sans);
    font-size: 0.85rem;
    letter-spacing: 0.04em;
    transition: border-color var(--t), background var(--t);
  }

  .app-user__trigger:hover {
    border-color: var(--border-strong);
    background: var(--bg-soft);
  }

  .app-user__avatar {
    width: 26px;
    height: 26px;
    border-radius: 0;
    object-fit: cover;
    background: var(--surface-2);
    border: 1px solid var(--border-strong);
  }

  .app-user__avatar--fallback {
    display: block;
  }

  .app-user__backdrop {
    position: fixed;
    inset: 0;
    z-index: 90;
  }

  .app-user__panel {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 100;
    width: min(240px, calc(100vw - 32px));
    background: var(--surface);
    border: 1px solid var(--border-strong);
    border-radius: 0;
    padding: 6px 0;
    box-shadow: 0 12px 28px -14px rgba(28, 28, 28, 0.25);
  }

  .app-user__head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 6px;
  }

  .app-user__head-avatar {
    width: 34px;
    height: 34px;
    border-radius: 0;
    object-fit: cover;
    background: var(--surface-2);
    border: 1px solid var(--border-strong);
  }

  .app-user__who {
    min-width: 0;
  }

  .app-user__name--lg {
    font-size: 0.88rem;
    font-weight: 500;
    letter-spacing: 0.03em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .app-user__email {
    font-size: 0.72rem;
    color: var(--ink-3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .app-user__item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.55rem 14px;
    font-size: 0.85rem;
    color: var(--ink-2);
    text-decoration: none;
    background: none;
    border: none;
    font-family: var(--font-sans);
    cursor: pointer;
    letter-spacing: 0.05em;
  }

  .app-user__item:hover {
    background: var(--bg-soft);
    color: var(--ink);
  }

  /* ===== menubar ===== */
  .app-menubar-wrap {
    border-top: 1px solid var(--border);
    border-bottom: 2px solid var(--ink);
    background: var(--surface);
  }

  .app-menubar {
    width: min(1080px, 100% - 2.5rem);
    margin-inline: auto;
    display: flex;
    align-items: center;
    min-height: 48px;
  }

  .app-menu-link {
    display: inline-flex;
    align-items: center;
    padding: 0 1.35rem;
    height: 48px;
    font-size: 0.95rem;
    letter-spacing: 0.12em;
    color: var(--ink-2);
    border-right: 1px solid var(--border);
    text-decoration: none;
    transition: background var(--t), color var(--t);
  }

  .app-menu-link:hover {
    background: var(--bg-soft);
    color: var(--ink);
  }

  .app-menu-link--active {
    color: var(--ink);
  }

  .app-menu-cta {
    margin-left: auto;
    border-right: none;
    font-weight: 500;
    background: var(--ink);
    color: var(--white);
  }

  .app-menu-cta:hover {
    background: #000;
    color: var(--white);
  }

  /* ===== 集章進度列 ===== */
  .app-progress {
    width: min(1080px, 100% - 2.5rem);
    margin-inline: auto;
    padding: 0.9rem 0 1.1rem;
  }

  .app-progress__row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
  }

  .app-progress__label {
    font-size: 0.78rem;
    letter-spacing: 0.14em;
    color: var(--ink-2);
  }

  .app-progress__count {
    font-family: var(--font-serif);
    font-size: 1.7rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1;
    color: var(--ink);
  }

  .app-progress__total {
    font-size: 0.85rem;
    color: var(--ink-3);
    font-weight: 500;
  }

  .app-progress__bar {
    height: 3px;
    background: var(--bg-soft);
    overflow: hidden;
  }

  .app-progress__fill {
    height: 100%;
    background: var(--ink);
    transition: width 0.7s var(--ease);
  }

  @media (max-width: 900px) {
    /* 手機：隱藏 topbar 連結列 */
    .app-topbar {
      display: none;
    }

    /* 手機：隱藏 menubar 連結列（保留集章進度列） */
    .app-menubar {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .app-brand__name {
      font-size: 1.25rem;
    }

    .app-user__name {
      display: none;
    }
  }
</style>