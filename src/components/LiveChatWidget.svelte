<script>
  let isOpen = false;
  let activeTab = 'chat'; // 'chat' | 'form'

  // Chat 狀態
  let messages = [
    {
      id: 1,
      sender: 'bot',
      text: '您好！歡迎來到 OviNas，有任何問題或想法，都可以隨時在此交流！',
      time: getNowTime(),
    },
  ];
  let inputMessage = '';
  let isTyping = false;
  let chatBodyEl;

  function getNowTime() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }

  function handleSendChat() {
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    messages = [
      ...messages,
      { id: Date.now(), sender: 'user', text: userText, time: getNowTime() },
    ];
    inputMessage = '';
    scrollToBottom();

    // 模擬即時回覆
    isTyping = true;
    setTimeout(() => {
      isTyping = false;
      let replyText = '感謝您的訊息！我們已收到您的反饋。若有重要事項，您也可以切換至「聯絡表單」留言，我們會透過 Email 盡快回覆您！';
      if (userText.includes('工具') || userText.includes('服務') || userText.includes('nytools')) {
        replyText = 'OviNas 目前提供 NYTools、單字測驗、羊監視你、羊集章、羊愛考試及短網址等多項實用服務，歡迎在上方導覽列瀏覽體驗！';
      } else if (userText.includes('預約') || userText.includes('時間')) {
        replyText = '您可以點擊導覽列上的「預約系統」前往查看可預約的時間段喔！';
      } else if (userText.includes('你好') || userText.includes('嗨') || userText.includes('hello')) {
        replyText = '嗨！很高興遇見你，今天有什麼想探索的嗎？';
      }

      messages = [
        ...messages,
        { id: Date.now() + 1, sender: 'bot', text: replyText, time: getNowTime() },
      ];
      scrollToBottom();
    }, 900);
  }

  function sendQuickPrompt(prompt) {
    inputMessage = prompt;
    handleSendChat();
  }

  function scrollToBottom() {
    setTimeout(() => {
      if (chatBodyEl) {
        chatBodyEl.scrollTop = chatBodyEl.scrollHeight;
      }
    }, 50);
  }

  // 聯絡表單複製份狀態 (Google Form)
  let name = '';
  let email = '';
  let message = '';
  let formStatus = 'idle';

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

<div class="live-chat-root">
  <!-- 💬 懸浮純圖示按鈕 -->
  {#if !isOpen}
    <button
      class="chat-launcher"
      type="button"
      on:click={() => { isOpen = true; scrollToBottom(); }}
      aria-label="開啟即時交談"
    >
      <span class="launcher-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </span>
    </button>
  {/if}

  <!-- 💬 聊天視窗 -->
  {#if isOpen}
    <div class="chat-window" role="dialog" aria-label="即時交談視窗">
      <!-- 標題列 -->
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="header-avatar">
            <img src="/favicon.png" alt="OviNas" width="24" height="24" />
          </div>
          <div class="header-title">OviNas</div>
        </div>
        <button
          class="chat-close-btn"
          type="button"
          on:click={() => (isOpen = false)}
          aria-label="關閉交談"
        >
          ✕
        </button>
      </div>

      <!-- 分頁切換 (即時交談 / 聯絡表單) -->
      <div class="chat-tabs" role="tablist">
        <button
          class="chat-tab"
          class:active={activeTab === 'chat'}
          on:click={() => { activeTab = 'chat'; scrollToBottom(); }}
          type="button"
        >
          即時交談
        </button>
        <button
          class="chat-tab"
          class:active={activeTab === 'form'}
          on:click={() => (activeTab = 'form')}
          type="button"
        >
          聯絡表單
        </button>
      </div>

      <!-- Tab 1: 即時交談 -->
      {#if activeTab === 'chat'}
        <div class="chat-body" bind:this={chatBodyEl}>
          <div class="quick-chips">
            <button class="chip" on:click={() => sendQuickPrompt('有哪些工具服務？')}>有哪些工具？</button>
            <button class="chip" on:click={() => sendQuickPrompt('如何預約諮詢？')}>如何預約？</button>
            <button class="chip" on:click={() => sendQuickPrompt('我想聯絡站長')}>聯絡站長</button>
          </div>

          <div class="message-list">
            {#each messages as msg (msg.id)}
              <div class="chat-message {msg.sender}">
                <div class="message-bubble">
                  <p class="message-text">{msg.text}</p>
                  <span class="message-time">{msg.time}</span>
                </div>
              </div>
            {/each}

            {#if isTyping}
              <div class="chat-message bot">
                <div class="message-bubble typing-bubble">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </div>
              </div>
            {/if}
          </div>
        </div>

        <form class="chat-footer" on:submit|preventDefault={handleSendChat}>
          <input
            type="text"
            class="chat-input"
            bind:value={inputMessage}
            placeholder="輸入訊息…"
            aria-label="輸入訊息"
          />
          <button type="submit" class="chat-send-btn" disabled={!inputMessage.trim()}>
            送出
          </button>
        </form>
      {/if}

      <!-- Tab 2: 聯絡表單複製份 -->
      {#if activeTab === 'form'}
        <div class="chat-form-body">
          {#if formStatus === 'success'}
            <div class="contact-feedback is-success">
              <div class="success-icon-wrap" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
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
                <label for="chat-contact-name">姓名</label>
                <input
                  id="chat-contact-name"
                  type="text"
                  bind:value={name}
                  name="entry.57084769"
                  placeholder="您的姓名"
                  required
                  disabled={formStatus === 'submitting'}
                />
              </div>

              <div class="field-group">
                <label for="chat-contact-email">電子郵件</label>
                <input
                  id="chat-contact-email"
                  type="email"
                  bind:value={email}
                  name="entry.135399445"
                  placeholder="example@email.com"
                  required
                  disabled={formStatus === 'submitting'}
                />
              </div>

              <div class="field-group">
                <label for="chat-contact-message">聯絡內容</label>
                <textarea
                  id="chat-contact-message"
                  bind:value={message}
                  name="entry.1753446536"
                  placeholder="請輸入您想詢問或反應的內容…"
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
      {/if}
    </div>
  {/if}
</div>

<style>
  .live-chat-root {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
  }

  /* 懸浮純圖示按鈕 (更精巧與圓潤) */
  .chat-launcher {
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

  .chat-launcher:hover {
    transform: translateY(-2px);
    background: #000;
  }

  .launcher-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 聊天視窗主體 (精緻尺寸與圓角) */
  .chat-window {
    width: 318px;
    height: 445px;
    background: var(--surface);
    border: 1.5px solid var(--ink);
    border-radius: 12px;
    box-shadow: 4px 4px 0px rgba(28, 28, 28, 0.14);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: chat-popup 0.22s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes chat-popup {
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
  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.65rem 0.9rem;
    background: var(--ink);
    color: var(--white);
    border-bottom: 1.5px solid var(--ink);
  }

  .chat-header-info {
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

  .chat-close-btn {
    appearance: none;
    background: none;
    border: none;
    color: var(--white);
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0.2rem;
    line-height: 1;
    opacity: 0.8;
  }

  .chat-close-btn:hover {
    opacity: 1;
  }

  /* 分頁切換 */
  .chat-tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
    background: var(--bg-soft);
  }

  .chat-tab {
    flex: 1;
    appearance: none;
    background: none;
    border: none;
    padding: 0.6rem;
    font-family: inherit;
    font-size: 0.82rem;
    letter-spacing: 0.08em;
    color: var(--ink-3);
    cursor: pointer;
    transition: all var(--t);
  }

  .chat-tab.active {
    color: var(--ink);
    background: var(--surface);
    font-weight: 600;
    border-bottom: 2px solid var(--ink);
  }

  /* 聊天內容區 */
  .chat-body {
    flex: 1;
    padding: 0.85rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: var(--bg-soft);
  }

  .quick-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .chip {
    appearance: none;
    background: var(--surface);
    border: 1px solid var(--border-strong);
    border-radius: 12px;
    padding: 0.3rem 0.65rem;
    font-size: 0.72rem;
    color: var(--ink);
    cursor: pointer;
    transition: all var(--t);
  }

  .chip:hover {
    background: var(--ink);
    color: var(--white);
  }

  .message-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .chat-message {
    display: flex;
    max-width: 85%;
  }

  .chat-message.bot {
    align-self: flex-start;
  }

  .chat-message.user {
    align-self: flex-end;
  }

  .message-bubble {
    padding: 0.55rem 0.8rem;
    border-radius: 8px;
    font-size: 0.82rem;
    line-height: 1.45;
  }

  .bot .message-bubble {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--ink);
  }

  .user .message-bubble {
    background: var(--ink);
    color: var(--white);
  }

  .message-text {
    margin: 0;
  }

  .message-time {
    display: block;
    font-size: 0.62rem;
    margin-top: 0.25rem;
    text-align: right;
    opacity: 0.65;
  }

  .typing-bubble {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.6rem 0.8rem;
  }

  .typing-bubble .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--ink-3);
    animation: typing-blink 1.2s infinite ease-in-out;
  }

  .typing-bubble .dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-bubble .dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes typing-blink {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.1); }
  }

  /* 底部輸入框 */
  .chat-footer {
    display: flex;
    align-items: center;
    padding: 0.65rem 0.8rem;
    background: var(--surface);
    border-top: 1px solid var(--border);
    gap: 0.5rem;
  }

  .chat-input {
    flex: 1;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.45rem 0.65rem;
    font-size: 0.82rem;
    color: var(--ink);
    outline: none;
  }

  .chat-input:focus {
    border-color: var(--ink);
    background: var(--surface);
  }

  .chat-send-btn {
    appearance: none;
    background: var(--ink);
    color: var(--white);
    border: none;
    border-radius: 6px;
    padding: 0.45rem 0.85rem;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    transition: background var(--t);
  }

  .chat-send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Tab 2: 聯絡表單樣式 */
  .chat-form-body {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
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
    border-radius: 7px;
    padding: 0.45rem 0.65rem;
    font-family: inherit;
    font-size: 0.82rem;
    color: var(--ink);
    outline: none;
    box-sizing: border-box;
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

  .contact-feedback {
    padding: 1.5rem 1rem;
    text-align: center;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .success-icon-wrap {
    width: 48px;
    height: 48px;
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
    .live-chat-root {
      bottom: 16px;
      right: 16px;
    }
    .chat-window {
      width: calc(100vw - 32px);
      height: 480px;
    }
  }
</style>
