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
  <!-- 💬 懸浮 LiveChat 圖示按鈕 -->
  {#if !isOpen}
    <button
      class="contact-launcher"
      type="button"
      on:click={() => (isOpen = true)}
      aria-label="開啟即時聯絡表單"
      title="聯絡站長 / 即時訊息"
    >
      <span class="launcher-icon" aria-hidden="true">
        <!-- 經典 LiveChat 對話泡泡圖標 -->
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
      </span>
      <span class="live-status-dot"></span>
    </button>
  {/if}

  <!-- ✉️ 迷你浮動聯絡表單視窗 (精緻小巧、Google Form 串接) -->
  {#if isOpen}
    <div class="contact-window" role="dialog" aria-label="聯絡站長視窗">
      <!-- 標題列 -->
      <div class="contact-header">
        <div class="contact-header-info">
          <div class="header-avatar">
            <img src="/sheep-hd.png" alt="OviNas" width="22" height="22" />
          </div>
          <div>
            <div class="header-title">聯絡 OviNas 站長</div>
            <div class="header-subtitle">快速留言 / 技術交流</div>
          </div>
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
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </div>
            <p class="feedback-title">訊息已成功送出！</p>
            <p class="feedback-desc">感謝您的來信，我會盡快回覆您。</p>
          </div>
        {:else if formStatus === 'error'}
          <div class="contact-feedback is-error">
            <p class="feedback-title">傳送失敗</p>
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
                rows="2"
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

  /* 💬 懸浮 LiveChat 按鈕 (暖橙色調 + 浮動陰影) */
  .contact-launcher {
    appearance: none;
    background: #ff6b00;
    color: #ffffff;
    border: none;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(255, 107, 0, 0.4), 0 2px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s, box-shadow 0.2s;
    position: relative;
  }

  .contact-launcher:hover {
    transform: translateY(-4px) scale(1.08);
    background: #ea580c;
    box-shadow: 0 10px 25px rgba(255, 107, 0, 0.5);
  }

  .contact-launcher:active {
    transform: translateY(0) scale(0.96);
  }

  .live-status-dot {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 12px;
    height: 12px;
    background-color: #22c55e;
    border: 2px solid #ffffff;
    border-radius: 50%;
  }

  .launcher-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s ease;
  }

  .contact-launcher:hover .launcher-icon {
    transform: scale(1.08);
  }

  /* ✉️ 迷你浮動聯絡表單視窗 */
  .contact-window {
    width: 290px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.18);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: contact-popup 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes contact-popup {
    0% {
      opacity: 0;
      transform: translateY(16px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .contact-header {
    background: #ff6b00;
    color: #ffffff;
    padding: 12px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .contact-header-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .header-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }

  .header-avatar img {
    width: 22px;
    height: 22px;
    object-fit: contain;
  }

  .header-title {
    font-size: 13.5px;
    font-weight: 700;
    line-height: 1.2;
  }

  .header-subtitle {
    font-size: 11px;
    opacity: 0.9;
    font-weight: 400;
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
    padding: 14px 16px 16px;
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
    gap: 3px;
  }

  .field-group label {
    font-size: 11.5px;
    font-weight: 600;
    color: #4b5563;
  }

  .field-group input,
  .field-group textarea {
    width: 100%;
    background: #f9fafb;
    border: 1px solid #d1d5db;
    border-radius: 5px;
    padding: 6px 9px;
    font-family: inherit;
    font-size: 12.5px;
    color: #1f2937;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s, background 0.15s;
  }

  .field-group input:focus,
  .field-group textarea:focus {
    border-color: #ff6b00;
    background: #ffffff;
  }

  .field-group textarea {
    resize: none;
    min-height: 52px;
    line-height: 1.4;
  }

  .contact-submit-btn {
    background: #ff6b00;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    margin-top: 4px;
  }

  .contact-submit-btn:hover:not(:disabled) {
    background: #ea580c;
  }

  .contact-submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .contact-feedback {
    text-align: center;
    padding: 20px 10px;
  }

  .contact-feedback.is-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }

  .success-icon-wrap {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #dcfce7;
    color: #16a34a;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
  }

  .feedback-title {
    font-size: 14px;
    font-weight: 700;
    color: #16a34a;
    margin: 0;
  }

  .feedback-desc {
    font-size: 12px;
    color: #6b7280;
    margin: 0;
  }
</style>
