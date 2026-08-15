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
  }
</script>

<div class="badges-nav">
  <div class="badges-nav__inner">
    <a class="badges-nav__link" href="/">回到入口</a>
    <span class="badges-nav__sep" aria-hidden="true">｜</span>
    <a class="badges-nav__link" href="/badges/">羊-集章</a>
  </div>
</div>

<header class="app-header">
  <div class="app-header__inner">
    <div class="brand">
      <span class="brand__mark">
        <SheepLogo size={38} />
      </span>
      <div class="brand__name">羊-集章</div>
    </div>

    {#if user}
      <div class="user-menu">
        <button
          class="user-menu__trigger"
          onclick={toggleMenu}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="帳號選單">
          {#if user.photoURL}
            <img class="avatar" src={user.photoURL} alt="" />
          {:else}
            <span class="avatar avatar--fallback"></span>
          {/if}
        </button>

        {#if menuOpen}
          <div class="user-menu__backdrop" onclick={closeMenu}></div>
          <div class="user-menu__panel" role="menu">
            <div class="user-menu__head">
              {#if user.photoURL}
                <img class="user-menu__avatar" src={user.photoURL} alt="" />
              {:else}
                <span class="user-menu__avatar avatar--fallback"></span>
              {/if}
              <div class="user-menu__who">
                <div class="user-menu__name">{user.displayName ?? '使用者'}</div>
                <div class="user-menu__email">{user.email ?? ''}</div>
              </div>
            </div>
            <a class="user-menu__item" href="/">回到入口</a>
            <button class="user-menu__item" role="menuitem" onclick={onLogout}>登出</button>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <div class="progress">
    <div class="progress__row">
      <span class="progress__label">已集章</span>
      <span class="progress__count">
        {count}<span class="total"> / {total}</span>
      </span>
    </div>
    <div class="progress__bar" role="progressbar" aria-valuenow={count} aria-valuemin="0" aria-valuemax={total}>
      <div class="progress__fill" style="width: {total ? (count / total) * 100 : 0}%;"></div>
    </div>
  </div>
</header>

<style>
  .badges-nav {
    background: var(--sheep-ink, #1c1c1c);
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.75rem;
    letter-spacing: 0.14em;
  }

  .badges-nav__inner {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 20px;
    min-height: 32px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .badges-nav__link {
    color: rgba(255, 255, 255, 0.72);
    text-decoration: none;
    transition: color var(--sheep-t);
  }

  .badges-nav__link:hover {
    color: var(--sheep-white, #fff);
  }

  .badges-nav__sep {
    color: rgba(255, 255, 255, 0.3);
  }

  .app-header {
    position: sticky;
    top: 0;
    z-index: 60;
    background: var(--header-bg, rgba(245, 244, 241, 0.9));
    backdrop-filter: blur(14px);
    border-bottom: 1px solid var(--line, #dcd8cc);
  }

  .app-header__inner {
    max-width: 1180px;
    margin: 0 auto;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-right: auto;
  }

  .brand__mark {
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    line-height: 0;
  }

  .brand__mark svg {
    filter: drop-shadow(0 2px 4px rgba(28, 28, 28, 0.18));
  }

  .brand__name {
    font-family: var(--sheep-serif, 'Noto Serif TC', serif);
    font-size: 19px;
    font-weight: 600;
    letter-spacing: 0.12em;
  }

  .user-menu {
    position: relative;
  }

  .user-menu__trigger {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 4px;
    margin: -4px;
    border-radius: var(--radius);
  }

  .user-menu__trigger:hover .avatar {
    border-color: var(--text-faint);
  }

  .user-menu__backdrop {
    position: fixed;
    inset: 0;
    z-index: 90;
  }

  .user-menu__panel {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 100;
    width: min(240px, calc(100vw - 32px));
    background: var(--surface, #ffffff);
    border: 1px solid var(--line-strong, #b8b3a5);
    border-radius: 8px;
    padding: 6px;
    box-shadow: var(--shadow);
    animation: rise 0.2s var(--ease) both;
  }

  .user-menu__head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-bottom: 1px solid var(--line, #dcd8cc);
    margin-bottom: 6px;
  }

  .user-menu__avatar {
    width: 34px;
    height: 34px;
    border-radius: var(--radius);
    background: var(--surface-2, #f2efe8);
    border: 1px solid var(--line-strong, #b8b3a5);
    object-fit: cover;
  }

  .user-menu__who {
    min-width: 0;
  }

  .user-menu__name {
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-menu__email {
    font-size: 12px;
    color: var(--text-faint);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-menu__item {
    display: block;
    width: 100%;
    text-align: left;
    padding: 9px 12px;
    border-radius: var(--radius);
    font-size: 14px;
    color: var(--text-dim);
    text-decoration: none;
    background: none;
    border: none;
    font-family: inherit;
    cursor: pointer;
  }

  .user-menu__item:hover {
    background: var(--surface-2, #f2efe8);
    color: var(--danger, #c0452a);
  }

  .avatar {
    width: 32px;
    height: 32px;
    border-radius: var(--radius);
    background: var(--surface-2, #f2efe8);
    border: 1px solid var(--line-strong, #b8b3a5);
    object-fit: cover;
    transition: border-color 0.16s;
  }

  .avatar--fallback {
    display: block;
  }

  .progress {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 32px 14px;
  }

  .progress__row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
  }

  .progress__label {
    font-size: 13px;
    color: var(--text-dim);
  }

  .progress__count {
    font-family: var(--font-display);
    font-size: 30px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  .progress__count .total {
    font-size: 15px;
    color: var(--text-faint);
    font-weight: 500;
  }

  .progress__bar {
    height: 3px;
    border-radius: 0;
    background: var(--surface-2, #f2efe8);
    overflow: hidden;
  }

  .progress__fill {
    height: 100%;
    background: var(--text);
    transition: width 0.7s var(--ease);
  }
</style>