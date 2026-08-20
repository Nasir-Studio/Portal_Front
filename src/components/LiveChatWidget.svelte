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
      }, 4500);
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
  <!-- 💬 懸浮 LiveChat 圖示按鈕 (純圓形、溫暖活力、無黑邊) -->
  {#if !isOpen}
    <button
      class="contact-launcher"
      type="button"
      on:click={() => (isOpen = true)}
      aria-label="開啟即時聯絡表單"
      title="聯絡站長 / 即時訊息"
    >
      <span class="launcher-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
        </svg>
      </span>
      <span class="live-status-dot"></span>
    </button>
  {/if}

  <!-- ✉️ 現代俐落聯絡表單視窗 (無黑色粗邊框、圓角柔和、現代精緻) -->
  {#if isOpen}
    <div class="contact-window" role="dialog" aria-label="聯絡站長視窗">
      <!-- 標題列 -->
      <div class="contact-header">
        <div class="contact-header-info">
          <div class="header-avatar">
            <img src="/sheep-hd.png" alt="OviNas" width="22" height="22" />
          </div>
          <div class="header-title">聯絡 Nasir / OviNas</div>
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

      <!-- 內容區 -->
      <div class="contact-body">
        <div class="status-badge-row">
          <span class="online-indicator"></span>
          <span class="status-desc">目前線上 · 站長即時收件</span>
        </div>

        {#if formStatus === 'success'}
          <div class="status-feedback is-success">
            <span class="fb-icon">✓</span>
            <div class="fb-text">
              <strong>訊息已成功送出！</strong>
              <p>感謝您的來信，我會儘快回覆您。</p>
            </div>
          </div>
        {:else if formStatus === 'error'}
          <div class="status-feedback is-error">
            <span class="fb-icon">!</span>
            <div class="fb-text">
              <strong>發送失敗</strong>
              <p>請稍後再試，或利用頁尾表單發送。</p>
            </div>
          </div>
        {:else}
          <form on:submit={handleFormSubmit} class="live-contact-form">
            <div class="form-group">
              <label for="contact-name">稱呼 / 姓名 *</label>
              <input
                id="contact-name"
                type="text"
                bind:value={name}
                required
                placeholder="如何稱呼您？"
                disabled={formStatus === 'submitting'}
              />
            </div>

            <div class="form-group">
              <label for="contact-email">電子郵件 *</label>
              <input
                id="contact-email"
                type="email"
                bind:value={email}
                required
                placeholder="您的 Email 信箱"
                disabled={formStatus === 'submitting'}
              />
            </div>

            <div class="form-group">
              <label for="contact-message">洽詢內容 / 訊息 *</label>
              <textarea
                id="contact-message"
                bind:value={message}
                required
                rows="3"
                placeholder="想交流的話題或問題…"
                disabled={formStatus === 'submitting'}
              ></textarea>
            </div>

            <button
              type="submit"
              class="contact-submit-btn"
              disabled={formStatus === 'submitting'}
            >
              {#if formStatus === 'submitting'}
                <span>傳送中…</span>
              {:else}
                <span>送出訊息 →</span>
              {/if}
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
    right: 24px;
    bottom: 24px;
    z-index: 99999;
    font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
  }

  /* 💬 懸浮按鈕：純圓形、暖橙色、細緻高雅陰影、無黑色邊框 */
  .contact-launcher {
    appearance: none;
    background: #ff6b00;
    color: #ffffff;
    border: none;
    border-radius: 50%;
    width: 54px;
    height: 54px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(255, 107, 0, 0.38), 0 2px 6px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s, box-shadow 0.2s;
    position: relative;
  }

  .contact-launcher:hover {
    background: #ea580c;
    transform: translateY(-3px) scale(1.06);
    box-shadow: 0 10px 24px rgba(255, 107, 0, 0.48);
  }

  .contact-launcher:active {
    transform: translateY(0) scale(0.96);
  }

  .live-status-dot {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 12px;
    height: 12px;
    background-color: #10b981;
    border: 2px solid #ffffff;
    border-radius: 50%;
  }

  .launcher-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ✉️ 現代聯絡表單視窗：純淨白底、淺灰柔邊、零黑色粗框 */
  .contact-window {
    width: 320px;
    max-width: calc(100vw - 32px);
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 14px 40px rgba(0, 0, 0, 0.12), 0 2px 10px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: contact-popup 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes contact-popup {
    0% {
      opacity: 0;
      transform: translateY(12px) scale(0.97);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .contact-header {
    background: #ff6b00;
    color: #ffffff;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .contact-header-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .header-avatar {
    width: 28px;
    height: 28px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  }

  .header-avatar img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }

  .header-title {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: #ffffff;
  }

  .contact-close-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: #ffffff;
    font-size: 13px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s ease;
  }

  .contact-close-btn:hover {
    background: rgba(255, 255, 255, 0.35);
  }

  .contact-body {
    padding: 16px 18px 20px;
    background: #ffffff;
  }

  .status-badge-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 1px dashed #f1f5f9;
  }

  .online-indicator {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #10b981;
  }

  .status-desc {
    font-size: 11.5px;
    color: #64748b;
    font-weight: 500;
  }

  .live-contact-form {
    display: flex;
    flex-direction: column;
    gap: 11px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .form-group label {
    font-size: 11.5px;
    color: #475569;
    font-weight: 500;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 7px 10px;
    font-size: 13px;
    color: #0f172a;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    outline: none;
    font-family: inherit;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    border-color: #ff6b00;
    box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.12);
  }

  .form-group textarea {
    resize: none;
    min-height: 64px;
  }

  .contact-submit-btn {
    margin-top: 4px;
    padding: 9px;
    background: #ff6b00;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    text-align: center;
    box-shadow: 0 3px 10px rgba(255, 107, 0, 0.25);
  }

  .contact-submit-btn:hover {
    background: #ea580c;
    transform: translateY(-1px);
  }

  .contact-submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .status-feedback {
    display: flex;
    gap: 10px;
    padding: 14px;
    border-radius: 6px;
    margin: 8px 0;
  }

  .status-feedback.is-success {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #166534;
  }

  .status-feedback.is-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #991b1b;
  }

  .fb-icon {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: currentColor;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 12px;
    flex-shrink: 0;
  }

  .fb-text strong {
    font-size: 13.5px;
    display: block;
    margin-bottom: 2px;
  }

  .fb-text p {
    font-size: 12px;
    margin: 0;
    opacity: 0.85;
  }
</style>
