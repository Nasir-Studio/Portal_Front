<script>
  import { loginWithGoogle } from '$lib/firebase'
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
  <div class="login__topbar">
    <div class="login__topbar-inner">
      <span>羊家入口網</span>
      <a class="login__back" href="/">回到入口</a>
    </div>
  </div>

  <div class="login__card">
    <div class="login__brand">
      <SheepLogo size={64} />
      <div class="login__brand-text">
        <h1 class="login__title">羊-集章</h1>
        <p class="login__brand-en">SHEEP BADGE</p>
      </div>
    </div>
    <p class="login__tag">捷運紀念章收集冊</p>

    <p class="login__tagline">
      歡迎回來。<br />
      收集紀念章，記錄屬於你的每一趟旅程。
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
</div>

<style>
  .login {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    background: var(--bg);
  }

  .login__topbar {
    background: var(--sheep-ink);
    color: rgba(255, 255, 255, 0.72);
    font-size: 0.75rem;
    letter-spacing: 0.14em;
  }

  .login__topbar-inner {
    max-width: 1080px;
    margin-inline: auto;
    width: min(1080px, 100% - 2.5rem);
    min-height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .login__back {
    color: rgba(255, 255, 255, 0.72);
    text-decoration: none;
    transition: color var(--sheep-t);
  }

  .login__back:hover {
    color: var(--sheep-white);
  }

  .login__card {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: min(420px, 100% - 2.5rem);
    margin-inline: auto;
    padding: 3rem 2rem;
    text-align: center;
    animation: rise 0.5s var(--ease) both;
  }

  .login__brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: var(--sheep-ink);
  }

  .login__brand svg {
    filter: drop-shadow(0 4px 8px rgba(28, 28, 28, 0.2));
  }

  .login__brand-text {
    display: flex;
    flex-direction: column;
    text-align: left;
    line-height: 1.25;
  }

  .login__title {
    font-family: var(--sheep-serif);
    font-size: 2rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    color: var(--sheep-ink);
    margin: 0;
  }

  .login__brand-en {
    font-size: 0.6rem;
    font-weight: 400;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: var(--sheep-ink-3);
    margin-top: 0.2rem;
  }

  .login__tag {
    margin-top: 1.2rem;
    color: var(--sheep-ink-2);
    font-size: 0.85rem;
    letter-spacing: 0.1em;
  }

  .login__tagline {
    margin-top: 1.2rem;
    font-size: 0.82rem;
    line-height: 2;
    color: var(--sheep-ink-3);
  }

  .login__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    width: 100%;
    margin-top: 2rem;
    padding: 0.85rem 1.7rem;
    font-family: var(--sheep-sans);
    font-size: 0.95rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    border-radius: 0;
    border: 1px solid var(--sheep-ink);
    background: var(--sheep-ink);
    color: var(--sheep-white);
    cursor: pointer;
    user-select: none;
    transition: background var(--sheep-t), color var(--sheep-t), border-color var(--sheep-t);
  }

  .login__btn:active {
    transform: translateY(1px);
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
</style>