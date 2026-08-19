<script>
  import { onMount } from 'svelte';
  import { t, getCurrentLang } from '../scripts/i18n';

  let isOpen = false;
  let currentLang = 'zh-TW';

  // 聯絡表單狀態 (Google Form)
  let name = '';
  let email = '';
  let message = '';
  let formStatus = 'idle'; // 'idle' | 'submitting' | 'success' | 'error'

  const FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSeeWapjagLqPsg7i2y_TYhNq2xKW-nNFj6JywiqiDZ8Hkiheg/formResponse';

  onMount(() => {
    currentLang = getCurrentLang();
    const onLangChange = (e) => {
      currentLang = e.detail;
    };
    window.addEventListener('langchange', onLangChange);
    return () => {
      window.removeEventListener('langchange', onLangChange);
    };
  });

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    formStatus = 'submitting';

    try {
      const formData = new FormData();
      formData.append('entry.57084769', name.trim());
      formData.append('entry.135399445', email.trim());
      formData.append('entry.1753446536', message.trim());

      await fetch(FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });

      formStatus = 'success';
      name = '';
      email = '';
      message = '';

      setTimeout(() => {
        formStatus = 'idle';
      }, 4000);
    } catch (err) {
      console.error('聯絡表單發送失敗:', err);
      formStatus = 'error';
      setTimeout(() => {
        formStatus = 'idle';
      }, 4000);
    }
  }
</script>

<div class="contact-widget-root">
  <!-- ✉️ 懸浮小巧圖示按鈕 -->
  {#if !isOpen}
    <button
      class="contact-launcher"
      type="button"
      on:click={() => (isOpen = true)}
      aria-label={t('contact.title', currentLang)}
    >
      <span class="launcher-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
      </span>
    </button>
  {/if}

  <!-- ✉️ 迷你浮動聯絡表單視窗 (無Tab、小巧精緻、毛玻璃) -->
  {#if isOpen}
    <div class="contact-window" role="dialog" aria-label="聯絡我們視窗">
      <!-- 標題列 -->
      <div class="contact-header">
        <div class="contact-header-info">
          <div class="header-avatar">
            <img src="/favicon.png" alt="OviNas" width="18" height="18" />
          </div>
          <div class="header-title">{t('contact.title', currentLang)}</div>
        </div>
        <button
          class="contact-close-btn"
          type="button"
          on:click={() => (isOpen = false)}
          aria-label="關閉視窗"
        >
          ✕
        </button>
      </div>

      <!-- 表單內容 -->
      <div class="contact-body">
        {#if formStatus === 'success'}
          <div class="contact-feedback is-success">
            <div class="success-icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </div>
            <p class="feedback-title">{t('contact.success_title', currentLang)}</p>
            <p class="feedback-desc">{t('contact.success_desc', currentLang)}</p>
          </div>
        {:else if formStatus === 'error'}
          <div class="contact-feedback is-error">
            <p class="feedback-title">{t('contact.error_title', currentLang)}</p>
            <p class="feedback-desc">{t('contact.error_desc', currentLang)}</p>
          </div>
        {:else}
          <form class="contact-form" on:submit={handleFormSubmit}>
            <div class="field-group">
              <label for="floating-contact-name">{t('contact.name', currentLang)}</label>
              <input
                id="floating-contact-name"
                type="text"
                bind:value={name}
                name="entry.57084769"
                placeholder={t('contact.name_ph', currentLang)}
                required
                disabled={formStatus === 'submitting'}
              />
            </div>

            <div class="field-group">
              <label for="floating-contact-email">{t('contact.email', currentLang)}</label>
              <input
                id="floating-contact-email"
                type="email"
                bind:value={email}
                name="entry.135399445"
                placeholder={t('contact.email_ph', currentLang)}
                required
                disabled={formStatus === 'submitting'}
              />
            </div>

            <div class="field-group">
              <label for="floating-contact-message">{t('contact.message', currentLang)}</label>
              <textarea
                id="floating-contact-message"
                bind:value={message}
                name="entry.1753446536"
                placeholder={t('contact.message_ph', currentLang)}
                rows="3"
                required
                disabled={formStatus === 'submitting'}
              ></textarea>
            </div>

            <button
              type="submit"
              class="contact-submit-btn"
              disabled={formStatus === 'submitting'}
            >
              {formStatus === 'submitting'
                ? t('contact.submitting', currentLang)
                : t('contact.submit', currentLang)}
            </button>
          </form>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .contact-widget-root {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
  }

  /* 懸浮純圖示按鈕 (半透明毛玻璃與彈動動態) */
  .contact-launcher {
    appearance: none;
    background: rgba(28, 28, 28, 0.92);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: var(--white);
    border: 1.5px solid var(--ink);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 3px 4px 12px rgba(28, 28, 28, 0.2), 2px 2px 0px rgba(28, 28, 28, 0.15);
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s, box-shadow 0.2s;
  }

  .contact-launcher:hover {
    transform: translateY(-3px) scale(1.06);
    background: #000000;
    box-shadow: 4px 6px 16px rgba(28, 28, 28, 0.28);
  }

  .contact-launcher:active {
    transform: translateY(0) scale(0.96);
  }

  .launcher-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
  }

  .contact-launcher:hover .launcher-icon {
    transform: scale(1.1);
  }

  /* 細長半透明毛玻璃聯絡視窗 (Translucent Glassmorphism & Spring Popup) */
  .contact-window {
    width: 238px;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(14px) saturate(180%);
    -webkit-backdrop-filter: blur(14px) saturate(180%);
    border: 1.5px solid var(--ink);
    border-radius: 12px;
    box-shadow: 4px 6px 18px rgba(28, 28, 28, 0.14), 3px 3px 0px rgba(28, 28, 28, 0.16);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: contact-popup 0.32s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes contact-popup {
    0% {
      opacity: 0;
      transform: translateY(18px) scale(0.92);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* 標題列 (宋體 & 柔和黑色毛玻璃) */
  .contact-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.55rem 0.8rem;
    background: rgba(28, 28, 28, 0.94);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    color: var(--white);
    border-bottom: 1px solid var(--ink);
  }

  .contact-header-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .header-avatar {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .header-avatar img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  /* 宋體標題 */
  .header-title {
    font-family: var(--font-serif);
    font-size: 0.88rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: #ffffff;
  }

  /* 叉叉旋轉與縮放動畫 (Interactive Rotate Close Button) */
  .contact-close-btn {
    appearance: none;
    background: none;
    border: none;
    color: var(--white);
    font-size: 1rem;
    cursor: pointer;
    padding: 0;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    line-height: 1;
    opacity: 0.75;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s, background 0.2s;
  }

  .contact-close-btn:hover {
    opacity: 1;
    transform: rotate(90deg) scale(1.18);
    background: rgba(255, 255, 255, 0.18);
  }

  .contact-close-btn:active {
    transform: rotate(180deg) scale(0.9);
  }

  /* 表單內容區 (半透明底色) */
  .contact-body {
    padding: 0.8rem 0.85rem;
    background: transparent;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .field-group label {
    font-family: var(--font-serif);
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--ink-2);
    letter-spacing: 0.08em;
  }

  .field-group input,
  .field-group textarea {
    width: 100%;
    background: rgba(255, 255, 255, 0.82);
    border: 1px solid rgba(28, 28, 28, 0.18);
    border-radius: 6px;
    padding: 0.4rem 0.55rem;
    font-family: var(--font-sans);
    font-size: 0.78rem;
    color: var(--ink);
    outline: none;
    box-sizing: border-box;
    transition: border-color var(--t), background var(--t), box-shadow var(--t);
  }

  .field-group input:focus,
  .field-group textarea:focus {
    border-color: var(--ink);
    background: #ffffff;
    box-shadow: 0 0 0 2px rgba(28, 28, 28, 0.08);
  }

  .contact-submit-btn {
    appearance: none;
    background: var(--ink);
    color: var(--white);
    border: 1px solid var(--ink);
    border-radius: 6px;
    padding: 0.45rem 0.6rem;
    font-family: var(--font-serif);
    font-size: 0.82rem;
    font-weight: 600;
    letter-spacing: 0.16em;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    margin-top: 0.15rem;
    box-shadow: 2px 2px 0px rgba(28, 28, 28, 0.12);
  }

  .contact-submit-btn:hover:not(:disabled) {
    background: #000000;
    transform: translateY(-1px);
    box-shadow: 2px 3px 6px rgba(28, 28, 28, 0.2);
  }

  .contact-submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .contact-feedback {
    padding: 1.2rem 0.6rem;
    text-align: center;
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid var(--border);
    border-radius: 8px;
    animation: contact-popup 0.25s ease-out;
  }

  .success-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #ffffff;
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ink);
    margin: 0 auto 0.45rem;
  }

  .feedback-title {
    font-family: var(--font-serif);
    font-size: 0.84rem;
    font-weight: 700;
    color: var(--ink);
    margin: 0;
  }

  .feedback-desc {
    font-size: 0.7rem;
    color: var(--ink-3);
    margin: 0.25rem 0 0;
  }

  @media (max-width: 480px) {
    .contact-widget-root {
      bottom: 14px;
      right: 14px;
    }
    .contact-window {
      width: calc(100vw - 28px);
    }
  }
</style>
