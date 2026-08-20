<script lang="ts">
  import { currentUser, authReady, logout } from '$ntub/stores/auth';

  const BASE = '/ntub';

  const navItems = [
    { path: `${BASE}/`, label: '簡章', en: 'Programs' },
    { path: `${BASE}/credits`, label: '學分勾選', en: 'Credits' },
  ];

  function isActive(path: string): boolean {
    const p = typeof window !== 'undefined' ? window.location.pathname : '';
    if (path === `${BASE}/`) return p === `${BASE}/` || p === BASE;
    return p.startsWith(path);
  }

  async function doLogout() {
    await logout();
    window.location.href = `${BASE}/`;
  }
</script>

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

<style>
  .ntub-site-header {
    background: #ffffff;
    border: 1.5px solid #0f172a;
    padding: 0.8rem 1.4rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  }

  .ntub-header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .ntub-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
  }

  .ntub-brand-mark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    background: #0f172a;
    color: #ffffff;
    font-weight: 700;
    font-size: 1.15rem;
  }

  .ntub-brand-text strong {
    display: block;
    font-size: 1.05rem;
    color: #0f172a;
    font-weight: 700;
  }

  .ntub-brand-text small {
    display: block;
    font-size: 0.75rem;
    color: #64748b;
    letter-spacing: 0.04em;
  }

  .ntub-nav {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    flex-wrap: wrap;
  }

  .ntub-nav-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.4rem 0.9rem;
    text-decoration: none;
    border: 1.5px solid transparent;
    transition: all 0.15s ease;
  }

  .ntub-nav-link .ntub-nav-ja {
    font-size: 0.92rem;
    font-weight: 600;
    color: #475569;
  }

  .ntub-nav-link .ntub-nav-en {
    font-size: 0.68rem;
    color: #94a3b8;
    text-transform: uppercase;
  }

  .ntub-nav-link:hover,
  .ntub-nav-link.active {
    border-color: #0f172a;
    background: #f8fafc;
  }

  .ntub-nav-link.active .ntub-nav-ja {
    color: #ff6b00;
    font-weight: 700;
  }

  .ntub-login-link {
    border-color: #cbd5e1;
    background: #f1f5f9;
  }

  .ntub-user-chip {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: #f8fafc;
    border: 1.5px solid #cbd5e1;
    padding: 0.4rem 0.8rem;
  }

  .ntub-user-name {
    font-size: 0.88rem;
    font-weight: 600;
    color: #0f172a;
  }

  .ntub-logout-btn {
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fca5a5;
    padding: 0.2rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .ntub-logout-btn:hover {
    background: #dc2626;
    color: #ffffff;
  }

  .ntub-content {
    min-height: 50vh;
  }
</style>
