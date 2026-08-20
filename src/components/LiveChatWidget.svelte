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
  <!-- 💬 懸浮 LiveChat 圖示按鈕 (俐落幾何造型) -->
  {#if !isOpen}
    <button
      class="contact-launcher"
      type="button"
      on:click={() => (isOpen = true)}
      aria-label="開啟即時聯絡表單"
      title="聯絡站長 / 即時訊息"
    >
      <span class="launcher-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square" stroke-linejoin="miter">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </span>
      <span class="live-status-dot"></span>
    </button>
  {/if}

  <!-- ✉️ 俐落方正聯絡表單視窗 (無圓角、高對比俐落幾何) -->
  {#if isOpen}
    <div class="contact-window" role="dialog" aria-label="聯絡站長視窗">
      <!-- 標題列 -->
      <div class="contact-header">
        <div class="contact-header-info">
          <div class="header-avatar">
            <img src="/sheep-hd.png" alt="OviNas" width="20" height="20" />
          </div>
          <div class="header-title">聯絡 OviNas</div>
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
            <p class="feedback-title">✓ 訊息已成功送出！</p>
            <p class="feedback-desc">感謝您的來信，我會盡快回覆您。</p>
          </div>
        {:else if formStatus === 'error'}
          <div class="contact-feedback is-error">
            <p class="feedback-title">✕ 傳送失敗</p>
            <p class="feedback-desc">請稍後再試，或直接來信至站長信箱。</p>
          </div>
        {:else}
          <form class="contact-form" on:submit={handleFormSubmit}>
            <div class="field-group">
              <label for="floating-contact-name">姓名 / 稱呼 *</label>
              <input
                id="floating-contact-name"
                type="text"
                bind:value={name}
                name="entry.57084769"
                placeholder="您的姓名或暱稱"
                required
                disabled={formStatus === 'submitting'}
              />
            </div>

            <div class="field-group">
              <label for="floating-contact-email">電子郵件 *</label>
              <input
                id="floating-contact-email"
                type="email"
                bind:value={email}
                name="entry.135399445"
                placeholder="example@email.com"
                required
                disabled={formStatus === 'submitting'}
              />
            </div>

            <div class="field-group">
              <label for="floating-contact-message">聯絡內容 *</label>
              <textarea
                id="floating-contact-message"
                bind:value={message}
                name="entry.1753446536"
                placeholder="請輸入您想詢問或交流的內容…"
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
              {formStatus === 'submitting' ? '正在傳送…' : '送出訊息'}
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
    bottom: 24px;
    right: 24px;
    z-index: 9999;
  }

  /* 💬 懸浮 LiveChat 按鈕 (方正俐落、立體投影) */
  .contact-launcher {
    appearance: none;
    background: #10b981;
    color: #ffffff;
    border: 2px solid #059669;
    border-radius: 0px;
    width: 52px;
    height: 52px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
    transition: all 0.15s ease;
    position: relative;
  }

  .contact-launcher:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  }

  .contact-launcher:active {
    transform: translateY(0);
  }

  .live-status-dot {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 9px;
    height: 9px;
    background-color: #22c55e;
    border: 1.5px solid #ffffff;
    border-radius: 0px;
  }

  .launcher-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ✉️ 俐落方正聯絡表單視窗 (零圓角、高對比清晰邊框) */
  .contact-window {
    width: 300px;
    background: #ffffff;
    border: 2px solid #1e293b;
    border-radius: 0px;
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: contact-popup 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes contact-popup {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .contact-header {
    background-color: #10b981;
    color: #ffffff;
    padding: 10px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 2px solid #059669;
  }

  .contact-header-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .header-avatar {
    width: 24px;
    height: 24px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0px;
    border: 1px solid #059669;
    flex-shrink: 0;
  }

  .header-avatar img {
    width: 18px;
    height: 18px;
    object-fit: contain;
  }

  .header-title {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.02em;
  }

  .contact-close-btn {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.4);
    color: #ffffff;
    font-size: 12px;
    width: 22px;
    height: 22px;
    border-radius: 0px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }

  .contact-close-btn:hover {
    background: rgba(0, 0, 0, 0.2);
    border-color: #ffffff;
  }

  .contact-body {
    padding: 14px 14px 16px;
    background: #ffffff;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .field-group label {
    font-size: 12px;
    font-weight: 500;
    color: #1e293b;
  }

  .field-group input,
  .field-group textarea {
    width: 100%;
    background: #ffffff;
    border: 1.5px solid #64748b;
    border-radius: 0px;
    padding: 7px 10px;
    font-family: inherit;
    font-size: 13px;
    color: #0f172a;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s;
  }

  .field-group input:focus,
  .field-group textarea:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 1px #10b981;
  }

  .field-group textarea {
    resize: vertical;
    min-height: 60px;
    line-height: 1.4;
  }

  .contact-submit-btn {
    background: #10b981;
    color: #ffffff;
    border: 1.5px solid #059669;
    border-radius: 0px;
    padding: 9px 14px;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
    margin-top: 4px;
  }

  .contact-submit-btn:hover:not(:disabled) {
    background: #059669;
  }

  .contact-submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .contact-feedback {
    text-align: center;
    padding: 24px 12px;
  }

  .feedback-title {
    font-size: 14.5px;
    font-weight: 600;
    color: #16a34a;
    margin: 0 0 6px;
  }

  .feedback-desc {
    font-size: 12.5px;
    color: #475569;
    margin: 0;
  }
</style>
