<script>
  let isOpen = false;

  // 聯絡表單狀態 (Google Form)
  let name = '';
  let email = '';
  let message = '';
  let formStatus = 'idle'; // 'idle' | 'submitting' | 'success' | 'error'

  const FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSeeWapjagLqPsg7i2y_TYhNq2xKW-nNFj6JywiqiDZ8Hkiheg/formResponse';

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
  <!-- ✉️ 懸浮純圖示按鈕 -->
  {#if !isOpen}
    <button
      class="contact-launcher"
      type="button"
      on:click={() => (isOpen = true)}
      aria-label="開啟聯絡表單"
    >
      <span class="launcher-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="4" width="20" height="16" rx="2"></rect>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
      </span>
    </button>
  {/if}

  <!-- ✉️ 浮動聯絡表單視窗 -->
  {#if isOpen}
    <div class="contact-window" role="dialog" aria-label="聯絡我們視窗">
      <!-- 標題列 -->
      <div class="contact-header">
        <div class="contact-header-info">
          <div class="header-avatar">
            <img src="/favicon.png" alt="OviNas" width="22" height="22" />
          </div>
          <div class="header-title">OviNas</div>
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

      <!-- 表單本體 -->
      <div class="contact-body">
        {#if formStatus === 'success'}
          <div class="contact-feedback is-success">
            <div class="success-icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </div>
            <p class="feedback-title">訊息已成功送出</p>
            <p class="feedback-desc">我們會盡快透過 Email 與您聯繫！</p>
          </div>
        {:else if formStatus === 'error'}
          <div class="contact-feedback is-error">
            <p class="feedback-title">傳送失敗</p>
            <p class="feedback-desc">請稍後再試，或直接透過電子郵件聯繫。</p>
          </div>
        {:else}
          <form class="contact-form" on:submit={handleFormSubmit}>
            <div class="field-group">
              <label for="floating-contact-name">姓名</label>
              <input
                id="floating-contact-name"
                type="text"
                bind:value={name}
                name="entry.57084769"
                placeholder="您的姓名"
                required
                disabled={formStatus === 'submitting'}
              />
            </div>

            <div class="field-group">
              <label for="floating-contact-email">電子郵件</label>
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
              <label for="floating-contact-message">聯絡內容</label>
              <textarea
                id="floating-contact-message"
                bind:value={message}
                name="entry.1753446536"
                placeholder="請輸入您想詢問或反應的內容…"
                rows="4"
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
    bottom: 20px;
    right: 20px;
    z-index: 9999;
  }

  /* 懸浮純圖示按鈕 */
  .contact-launcher {
    appearance: none;
    background: var(--ink);
    color: var(--white);
    border: 1.5px solid var(--ink);
    border-radius: 50%;
    width: 46px;
    height: 46px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 3px 3px 0px rgba(28, 28, 28, 0.14);
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background var(--t);
  }

  .contact-launcher:hover {
    transform: translateY(-2px);
    background: #000;
  }

  .launcher-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 聯絡視窗主體 */
  .contact-window {
    width: 310px;
    background: var(--surface);
    border: 1.5px solid var(--ink);
    border-radius: 12px;
    box-shadow: 4px 4px 0px rgba(28, 28, 28, 0.14);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: contact-popup 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes contact-popup {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* 標題列 */
  .contact-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.65rem 0.9rem;
    background: var(--ink);
    color: var(--white);
    border-bottom: 1.5px solid var(--ink);
  }

  .contact-header-info {
    display: flex;
    align-items: center;
    gap: 0.55rem;
  }

  .header-avatar {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .header-avatar img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .header-title {
    font-size: 0.88rem;
    font-weight: 600;
    letter-spacing: 0.08em;
  }

  .contact-close-btn {
    appearance: none;
    background: none;
    border: none;
    color: var(--white);
    font-size: 1.05rem;
    cursor: pointer;
    padding: 0.2rem;
    line-height: 1;
    opacity: 0.8;
  }

  .contact-close-btn:hover {
    opacity: 1;
  }

  /* 表單內容區 */
  .contact-body {
    padding: 1rem;
    background: var(--surface);
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .field-group label {
    font-size: 0.74rem;
    font-weight: 500;
    color: var(--ink-2);
    letter-spacing: 0.08em;
  }

  .field-group input,
  .field-group textarea {
    width: 100%;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 7px;
    padding: 0.48rem 0.65rem;
    font-family: inherit;
    font-size: 0.82rem;
    color: var(--ink);
    outline: none;
    box-sizing: border-box;
    transition: border-color var(--t), background var(--t);
  }

  .field-group input:focus,
  .field-group textarea:focus {
    border-color: var(--ink);
    background: var(--surface);
  }

  .contact-submit-btn {
    appearance: none;
    background: var(--ink);
    color: var(--white);
    border: 1px solid var(--ink);
    border-radius: 7px;
    padding: 0.52rem 0.8rem;
    font-family: inherit;
    font-size: 0.84rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    cursor: pointer;
    transition: all var(--t);
    margin-top: 0.2rem;
  }

  .contact-submit-btn:hover:not(:disabled) {
    background: var(--surface);
    color: var(--ink);
  }

  .contact-feedback {
    padding: 1.5rem 0.8rem;
    text-align: center;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .success-icon-wrap {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: var(--surface);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ink);
    margin: 0 auto 0.6rem;
  }

  .feedback-title {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--ink);
    margin: 0;
  }

  .feedback-desc {
    font-size: 0.75rem;
    color: var(--ink-3);
    margin: 0.3rem 0 0;
  }

  @media (max-width: 480px) {
    .contact-widget-root {
      bottom: 16px;
      right: 16px;
    }
    .contact-window {
      width: calc(100vw - 32px);
    }
  }
</style>
