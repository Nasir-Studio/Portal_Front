<script lang="ts">
  import SheepLogo from '../badges/components/SheepLogo.svelte';
  import { currentUser, authReady, logout } from '$ntub/stores/auth';

  const BASE = '/ntub';

  const navItems = [
    { path: `${BASE}/`, label: '首頁', en: 'Home' },
    { path: `${BASE}/brochure`, label: '簡章', en: 'Programs' },
    { path: `${BASE}/credits`, label: '學分勾選', en: 'Credits' },
    { path: `${BASE}/dept`, label: '本系・外系', en: 'Dept' },
  ];

  function isActive(path: string): boolean {
    const p = window.location.pathname;
    if (path === `${BASE}/`) return p === `${BASE}/` || p === BASE;
    return p.startsWith(path);
  }

  function menuActive(href: string): boolean {
    if (href.startsWith('http')) return false;
    const p = window.location.pathname;
    return p.startsWith(href);
  }

  async function doLogout() {
    await logout();
    window.location.href = `${BASE}/`;
  }
</script>

<!-- ===== 黑 topbar：與主站 Nav.astro 相同 ===== -->
<div class="ntub-topbar">
  <div class="ntub-topbar__inner">
    <span class="ntub-topbar__left">羊家入口網</span>
    <span class="ntub-topbar__right">
      <a href="/">首頁</a>
      <span class="ntub-topbar__sep" aria-hidden="true">｜</span>
      <a href="/#news">最新消息</a>
      <span class="ntub-topbar__sep" aria-hidden="true">｜</span>
      <a href="/ntub/" aria-current="page">NTUB 學程</a>
    </span>
  </div>
</div>

<!-- ===== 白 header：SheepLogo + 羊家的入口 ===== -->
<div class="ntub-header-main">
  <a class="ntub-brand" href="/">
    <SheepLogo size={58} />
    <span class="ntub-brand__text">
      <span class="ntub-brand__name">羊家的入口</span>
      <span class="ntub-brand__en">SHEEP PORTAL</span>
    </span>
  </a>
</div>

<!-- ===== menubar：黑 2px 底線 ===== -->
<div class="ntub-menubar-wrap">
  <nav class="ntub-menubar" aria-label="主導覽">
    <a class="ntub-menu-link" href="/">首頁</a>
    <a class="ntub-menu-link" href="https://nsir.uk" target="_blank" rel="noopener noreferrer">羊-短網址</a>
    <a class="ntub-menu-link" href="/cctv/">羊監視你</a>
    <a class="ntub-menu-link" href="/badges/">羊集章</a>
    <a class="ntub-menu-link ntub-menu-link--active" href="/ntub/" aria-current="page">NTUB 學程</a>
    <a class="ntub-menu-link" href="https://1ztests.nsir.uk" target="_blank" rel="noopener noreferrer">羊愛考試</a>
    <a class="ntub-menu-link ntub-menu-cta" href="/reserve/">預約系統</a>
  </nav>
</div>

<!-- ===== NTUB 子導覽 ===== -->
<header class="ntub-site-header">
  <div class="ntub-header-inner">
    <button class="ntub-brand" onclick={() => (window.location.href = `${BASE}/`)} aria-label="回首頁">
      <span class="ntub-brand-mark">學</span>
      <span class="ntub-brand-text">
        <strong>學分學程・學分戰士</strong>
        <small>國立臺北商業大學 NTUB</small>
      </span>
    </button>
    <nav class="ntub-nav" aria-label="主要導覽">
      {#each navItems as item (item.path)}
        <a href={item.path} class="ntub-nav-link" class:active={isActive(item.path)}>
          <span class="ntub-nav-ja">{item.label}</span>
          <span class="ntub-nav-en">{item.en}</span>
        </a>
      {/each}
      {#if $authReady}
        {#if $currentUser}
          <div class="ntub-user-chip" title={$currentUser.email ?? ''}>
            <span class="ntub-user-name">{$currentUser.name}</span>
            <button class="ntub-logout-btn" onclick={doLogout} aria-label="登出">登出</button>
          </div>
        {:else}
          <a href={`${BASE}/login`} class="ntub-nav-link ntub-login-link">
            <span class="ntub-nav-ja">登入</span>
            <span class="ntub-nav-en">Sign in</span>
          </a>
        {/if}
      {/if}
    </nav>
  </div>
</header>

<main class="ntub-content">
  <slot />
</main>

<footer class="ntub-site-footer">
  <p>學分學程學分戰士 · 資料來源：國立臺北商業大學各學程設置要點</p>
  <p class="ntub-footer-sub">僅供修課規劃參考，實際規定以教務處最新公告為準</p>
</footer>

<style>
  /* ===== 與主站 global.css 一致的設計變數 ===== */
  .ntub-topbar,
  .ntub-header-main,
  .ntub-menubar-wrap,
  .ntub-site-header,
  .ntub-site-footer,
  .ntub-content {
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
  .ntub-topbar {
    background: var(--ink);
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.75rem;
    letter-spacing: 0.14em;
    font-family: var(--font-sans);
  }

  .ntub-topbar__inner {
    width: min(1080px, 100% - 2.5rem);
    margin-inline: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 32px;
  }

  .ntub-topbar a {
    color: inherit;
    text-decoration: none;
    transition: color var(--t);
  }

  .ntub-topbar a:hover {
    color: var(--white);
  }

  .ntub-topbar__sep {
    margin: 0 0.5rem;
    color: rgba(255, 255, 255, 0.3);
  }

  /* ===== 白 header ===== */
  .ntub-header-main {
    width: min(1080px, 100% - 2.5rem);
    margin-inline: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 0 1.1rem;
  }

  .ntub-brand {
    display: inline-flex;
    align-items: center;
    gap: 0.9rem;
    color: var(--ink);
    text-decoration: none;
  }

  .ntub-brand svg {
    filter: drop-shadow(0 4px 8px rgba(28, 28, 28, 0.2));
  }

  .ntub-brand__text {
    display: flex;
    flex-direction: column;
    line-height: 1.25;
  }

  .ntub-brand__name {
    font-family: var(--font-serif);
    font-size: 1.55rem;
    font-weight: 600;
    letter-spacing: 0.16em;
  }

  .ntub-brand__en {
    font-size: 0.66rem;
    font-weight: 400;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: var(--ink-3);
  }

  /* ===== menubar ===== */
  .ntub-menubar-wrap {
    border-top: 1px solid var(--border);
    border-bottom: 2px solid var(--ink);
    background: var(--surface);
  }

  .ntub-menubar {
    width: min(1080px, 100% - 2.5rem);
    margin-inline: auto;
    display: flex;
    align-items: center;
    min-height: 48px;
  }

  .ntub-menu-link {
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

  .ntub-menu-link:hover {
    background: var(--bg-soft);
    color: var(--ink);
  }

  .ntub-menu-link--active {
    color: var(--ink);
  }

  .ntub-menu-cta {
    margin-left: auto;
    border-right: none;
    font-weight: 500;
    background: var(--ink);
    color: var(--white);
  }

  .ntub-menu-cta:hover {
    background: #000;
    color: var(--white);
  }

  /* ===== NTUB 子導覽（sticky） ===== */
  .ntub-site-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
  }

  .ntub-header-inner {
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 68px;
  }

  .ntub-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    background: none;
    border: none;
    cursor: pointer;
    font: inherit;
    text-align: left;
  }

  .ntub-brand-mark {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 1.5px solid var(--ink);
    color: var(--ink);
    font-family: var(--serif);
    font-size: 20px;
    line-height: 1;
  }

  .ntub-brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1.35;
  }

  .ntub-brand-text strong {
    font-family: var(--serif);
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  .ntub-brand-text small {
    font-size: 11px;
    color: var(--ink-soft);
    letter-spacing: 0.18em;
  }

  .ntub-nav {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .ntub-user-chip {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 8px;
    padding: 6px 6px 6px 14px;
    border: 1px solid var(--border);
    background: var(--surface);
    font-size: 13px;
    white-space: nowrap;
  }

  .ntub-user-name {
    font-family: var(--serif);
    font-weight: 600;
    color: var(--ink);
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ntub-logout-btn {
    font: inherit;
    font-size: 12px;
    color: var(--ink-soft);
    background: none;
    border: none;
    border-left: 1px solid var(--line);
    padding-left: 10px;
    cursor: pointer;
    transition: color 0.18s;
  }

  .ntub-logout-btn:hover {
    color: var(--ink);
  }

  .ntub-login-link {
    margin-left: 8px;
    border: 1px solid var(--border-strong);
    padding: 4px 18px !important;
  }

  .ntub-login-link:hover {
    background: var(--bg-soft) !important;
  }

  .ntub-nav-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 14px;
    position: relative;
    transition: background 0.2s;
  }

  .ntub-nav-link:hover {
    background: var(--bg-soft);
  }

  .ntub-nav-link.active {
    color: var(--ink);
  }

  .ntub-nav-link.active::after {
    content: '';
    position: absolute;
    left: 14px;
    right: 14px;
    bottom: 2px;
    height: 2px;
    background: var(--ink);
  }

  .ntub-nav-ja {
    font-family: var(--serif);
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.1em;
  }

  .ntub-nav-en {
    font-size: 10px;
    letter-spacing: 0.12em;
    color: var(--ink-soft);
  }

  .ntub-content {
    flex: 1;
    width: 100%;
    max-width: 1080px;
    margin: 0 auto;
    padding: 40px 24px 80px;
  }

  .ntub-site-footer {
    border-top: 1px solid var(--border);
    padding: 24px;
    text-align: center;
    color: var(--ink-2);
    font-size: 12px;
    letter-spacing: 0.06em;
  }

  .ntub-footer-sub {
    margin-top: 4px;
    font-size: 11px;
    color: var(--ink-3);
  }

  @media (max-width: 900px) {
    .ntub-topbar {
      display: none;
    }

    .ntub-menubar {
      display: none;
    }
  }

  @media (max-width: 720px) {
    .ntub-header-inner {
      flex-direction: column;
      align-items: flex-start;
      padding-top: 12px;
      padding-bottom: 8px;
    }
    .ntub-nav {
      width: 100%;
      overflow-x: auto;
      padding-bottom: 4px;
    }
    .ntub-nav-link {
      flex-direction: row;
      gap: 6px;
    }
    .ntub-user-chip {
      margin-left: 4px;
      flex-shrink: 0;
    }
    .ntub-login-link {
      margin-left: 4px;
      flex-shrink: 0;
    }
  }
</style>
