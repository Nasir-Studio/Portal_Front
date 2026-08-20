<script>
  import { logout } from '$lib/firebase'

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

<div class="app-badges-subhead">
  <div class="app-badges-subhead__row">
    <div class="app-badges-info">
      <h1 class="app-badges-title">羊-集章</h1>
      <p class="app-badges-desc">捷運紀念章電子集章冊</p>
    </div>

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
            <button class="app-user__item" role="menuitem" onclick={onLogout}>登出帳號</button>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <div class="app-progress">
    <div class="app-progress__row">
      <span class="app-progress__label">已收集進度</span>
      <span class="app-progress__count">
        <strong>{count}</strong><span class="app-progress__total"> / {total} 章</span>
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
  .app-badges-subhead {
    background: #ffffff;
    border: 1.5px solid #0f172a;
    padding: 1.5rem 1.8rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  }

  .app-badges-subhead__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.2rem;
    flex-wrap: wrap;
  }

  .app-badges-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 0.2rem;
    letter-spacing: 0.04em;
  }

  .app-badges-desc {
    font-size: 0.88rem;
    color: #64748b;
    margin: 0;
    letter-spacing: 0.02em;
  }

  .app-user {
    position: relative;
  }

  .app-user__trigger {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: #f8fafc;
    border: 1.5px solid #cbd5e1;
    padding: 0.4rem 0.8rem;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s ease;
  }

  .app-user__trigger:hover {
    border-color: #0f172a;
    background: #f1f5f9;
  }

  .app-user__avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
  }

  .app-user__avatar--fallback {
    background: #cbd5e1;
  }

  .app-user__name {
    font-size: 0.88rem;
    font-weight: 600;
    color: #0f172a;
  }

  .app-user__backdrop {
    position: fixed;
    inset: 0;
    z-index: 99;
  }

  .app-user__panel {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    width: 240px;
    background: #ffffff;
    border: 1.5px solid #0f172a;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    z-index: 100;
  }

  .app-user__head {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;
  }

  .app-user__head-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }

  .app-user__name--lg {
    font-size: 0.92rem;
    font-weight: 700;
    color: #0f172a;
  }

  .app-user__email {
    font-size: 0.75rem;
    color: #64748b;
    word-break: break-all;
  }

  .app-user__item {
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    padding: 0.75rem 1rem;
    font-size: 0.88rem;
    color: #dc2626;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .app-user__item:hover {
    background: #fee2e2;
  }

  .app-progress {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .app-progress__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.88rem;
  }

  .app-progress__label {
    color: #475569;
    font-weight: 500;
  }

  .app-progress__count strong {
    color: #ff6b00;
    font-size: 1.1rem;
  }

  .app-progress__total {
    color: #94a3b8;
  }

  .app-progress__bar {
    height: 8px;
    background: #e2e8f0;
    overflow: hidden;
  }

  .app-progress__fill {
    height: 100%;
    background: linear-gradient(90deg, #ff6b00, #f59e0b);
    transition: width 0.3s ease;
  }
</style>
