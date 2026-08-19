<script>
  let name = '';
  let email = '';
  let message = '';
  let status = 'idle'; // 'idle' | 'submitting' | 'success' | 'error'

  const FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSeeWapjagLqPsg7i2y_TYhNq2xKW-nNFj6JywiqiDZ8Hkiheg/formResponse';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    status = 'submitting';

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

      status = 'success';
      name = '';
      email = '';
      message = '';

      setTimeout(() => {
        status = 'idle';
      }, 4000);
    } catch (err) {
      console.error('聯絡表單發送失敗:', err);
      status = 'error';
      setTimeout(() => {
        status = 'idle';
      }, 4000);
    }
  }
</script>

<div class="contact-form-wrap">
  {#if status === 'success'}
    <div class="contact-feedback is-success">
      <p class="feedback-title">訊息已成功送出</p>
      <p class="feedback-desc">感謝您的聯繫，我們會盡快回覆您！</p>
    </div>
  {:else if status === 'error'}
    <div class="contact-feedback is-error">
      <p class="feedback-title">傳送失敗</p>
      <p class="feedback-desc">請稍後再試，或直接透過電子郵件聯繫。</p>
    </div>
  {:else}
    <form class="contact-form" on:submit={handleSubmit}>
      <div class="field-group">
        <label for="contact-name">姓名</label>
        <input
          id="contact-name"
          type="text"
          bind:value={name}
          name="entry.57084769"
          placeholder="您的姓名"
          required
          disabled={status === 'submitting'}
        />
      </div>

      <div class="field-group">
        <label for="contact-email">電子郵件</label>
        <input
          id="contact-email"
          type="email"
          bind:value={email}
          name="entry.135399445"
          placeholder="example@email.com"
          required
          disabled={status === 'submitting'}
        />
      </div>

      <div class="field-group">
        <label for="contact-message">聯絡內容</label>
        <textarea
          id="contact-message"
          bind:value={message}
          name="entry.1753446536"
          placeholder="請輸入您想詢問或反應的內容…"
          rows="3"
          required
          disabled={status === 'submitting'}
        ></textarea>
      </div>

      <button
        type="submit"
        class="contact-submit-btn"
        disabled={status === 'submitting'}
      >
        {status === 'submitting' ? '正在傳送…' : '送出訊息'}
      </button>
    </form>
  {/if}
</div>

<style>
  .contact-form-wrap {
    padding: 0.9rem 1rem 1.1rem;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
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
    border-radius: 0;
    padding: 0.45rem 0.65rem;
    font-family: inherit;
    font-size: 0.82rem;
    color: var(--ink);
    outline: none;
    transition: border-color var(--t), background var(--t), box-shadow var(--t);
    box-sizing: border-box;
  }

  .field-group textarea {
    resize: vertical;
    min-height: 60px;
    line-height: 1.5;
  }

  .field-group input::placeholder,
  .field-group textarea::placeholder {
    color: var(--ink-3);
    font-size: 0.78rem;
  }

  .field-group input:focus,
  .field-group textarea:focus {
    border-color: var(--ink);
    background: var(--surface);
    box-shadow: 0 0 0 2px rgba(28, 28, 28, 0.06);
  }

  .contact-submit-btn {
    appearance: none;
    background: var(--ink);
    color: var(--white);
    border: 1px solid var(--ink);
    border-radius: 0;
    padding: 0.5rem 0.8rem;
    font-family: inherit;
    font-size: 0.82rem;
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

  .contact-submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .contact-feedback {
    padding: 1.2rem 0.8rem;
    text-align: center;
    background: var(--bg-soft);
    border: 1px solid var(--border);
  }

  .feedback-title {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--ink);
    margin: 0 0 0.25rem 0;
    letter-spacing: 0.05em;
  }

  .feedback-desc {
    font-size: 0.75rem;
    color: var(--ink-3);
    margin: 0;
    line-height: 1.5;
  }

  .contact-feedback.is-error .feedback-title {
    color: #b91c1c;
  }
</style>
