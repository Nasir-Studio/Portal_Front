export type Lang = 'zh-TW' | 'en' | 'ja';

export const translations: Record<Lang, Record<string, string>> = {
  'zh-TW': {
    'nav.home': '首頁',
    'nav.news': '最新消息',
    'nav.blog': '部落格',
    'nav.vip': 'VIP 專區',
    'nav.logout': '登出',
    'nav.reserve': '預約系統',
    'nav.tools': 'Ovis Tools',
    'nav.services': '主要服務',
    'nav.cctv': '羊監視你',
    'nav.badges': '羊集章',
    'nav.vocab': '單字測驗',
    'nav.exam': '羊愛考試',
    'nav.shorturl': '羊-短網址',
    'nav.nytools': 'NYTools',
    'module.quote': '每日一句',
    'module.news': '最新消息',
    'module.calendar': '行事曆',
    'module.badges': '資格認證',
    'module.badges_more': '查看更多資格認證',
    'module.gh_chart': 'GitHub 貢獻',
    'news.tab_all': '最新消息',
    'news.tab_posts': '其他文章',
    'news.tab_tech': '技術文章',
    'news.read_more': '閱讀更多',
    'news.prev': '上一頁',
    'news.next': '下一頁',
    'contact.title': '聯絡表單',
    'contact.name': '姓名',
    'contact.name_ph': '您的姓名',
    'contact.email': '電子郵件',
    'contact.email_ph': 'example@email.com',
    'contact.message': '聯絡內容',
    'contact.message_ph': '請輸入您想詢問或反應的內容…',
    'contact.submit': '送出訊息',
    'contact.submitting': '傳送中…',
    'contact.success_title': '訊息已成功送出',
    'contact.success_desc': '我們會盡快透過 Email 與您聯繫！',
    'contact.error_title': '傳送失敗',
    'contact.error_desc': '請稍後再試，或直接透過電子郵件聯繫。',
    'login.title': '帳號登入',
    'login.sub': '使用 VIP 帳號登入',
    'login.email': '電子郵件',
    'login.password': '密碼',
    'login.submit': '登入',
    'login.reserve_note': '訪客不需登入即可預約 — ',
    'login.reserve_link': '前往預約系統',
    'loader.loading': '載入系統中…',
    'loader.ready': '準備就緒',
    'lang.zh': '繁體中文',
    'lang.en': 'English',
    'lang.ja': '日本語',
  },
  en: {
    'nav.home': 'Home',
    'nav.news': 'News',
    'nav.blog': 'Blog',
    'nav.vip': 'VIP Area',
    'nav.logout': 'Logout',
    'nav.reserve': 'Reservation',
    'nav.tools': 'Ovis Tools',
    'nav.services': 'Main Services',
    'nav.cctv': 'Sheep CCTV',
    'nav.badges': 'Sheep Stamps',
    'nav.vocab': 'Vocab Test',
    'nav.exam': 'Sheep Exam',
    'nav.shorturl': 'Sheep ShortURL',
    'nav.nytools': 'NYTools',
    'module.quote': 'Quote of the Day',
    'module.news': 'Latest News',
    'module.calendar': 'Calendar',
    'module.badges': 'Certifications',
    'module.badges_more': 'View More Credentials',
    'module.gh_chart': 'GitHub Contributions',
    'news.tab_all': 'News',
    'news.tab_posts': 'Articles',
    'news.tab_tech': 'Tech Notes',
    'news.read_more': 'Read More',
    'news.prev': 'Prev',
    'news.next': 'Next',
    'contact.title': 'Contact Form',
    'contact.name': 'Name',
    'contact.name_ph': 'Your Name',
    'contact.email': 'Email',
    'contact.email_ph': 'example@email.com',
    'contact.message': 'Message',
    'contact.message_ph': 'Type your message or inquiry here…',
    'contact.submit': 'Send Message',
    'contact.submitting': 'Sending…',
    'contact.success_title': 'Message Sent Successfully',
    'contact.success_desc': 'We will get back to you via email shortly!',
    'contact.error_title': 'Submission Failed',
    'contact.error_desc': 'Please try again later or contact us directly.',
    'login.title': 'Account Login',
    'login.sub': 'Log in with your VIP account',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit': 'Log in',
    'login.reserve_note': 'Guests can make a reservation without login — ',
    'login.reserve_link': 'Go to Reservation',
    'loader.loading': 'Loading System…',
    'loader.ready': 'Ready',
    'lang.zh': '繁體中文',
    'lang.en': 'English',
    'lang.ja': '日本語',
  },
  ja: {
    'nav.home': 'ホーム',
    'nav.news': 'お知らせ',
    'nav.blog': 'ブログ',
    'nav.vip': 'VIPエリア',
    'nav.logout': 'ログアウト',
    'nav.reserve': '予約システム',
    'nav.tools': 'Ovis ツール',
    'nav.services': '主なサービス',
    'nav.cctv': 'ひつじ監視カメラ',
    'nav.badges': 'ひつじスタンプ',
    'nav.vocab': '単語テスト',
    'nav.exam': 'ひつじ試験',
    'nav.shorturl': '短縮URL',
    'nav.nytools': 'NYTools',
    'module.quote': '今日の一言',
    'module.news': '最新ニュース',
    'module.calendar': 'カレンダー',
    'module.badges': '資格認定',
    'module.badges_more': '資格一覧を見る',
    'module.gh_chart': 'GitHub コントリビューション',
    'news.tab_all': '最新お知らせ',
    'news.tab_posts': 'その他記事',
    'news.tab_tech': '技術ノート',
    'news.read_more': '続きを読む',
    'news.prev': '前へ',
    'news.next': '次へ',
    'contact.title': 'お問い合わせ',
    'contact.name': 'お名前',
    'contact.name_ph': 'お名前をご入力ください',
    'contact.email': 'メールアドレス',
    'contact.email_ph': 'example@email.com',
    'contact.message': 'お問い合わせ内容',
    'contact.message_ph': 'ご質問やご意見をご入力ください…',
    'contact.submit': '送信する',
    'contact.submitting': '送信中…',
    'contact.success_title': '送信が完了しました',
    'contact.success_desc': 'メールにて折り返しご連絡いたします。',
    'contact.error_title': '送信に失敗しました',
    'contact.error_desc': 'しばらくしてからもう一度お試しください。',
    'login.title': 'ログイン',
    'login.sub': 'VIPアカウントでログイン',
    'login.email': 'メールアドレス',
    'login.password': 'パスワード',
    'login.submit': 'ログイン',
    'login.reserve_note': 'ゲストはログインなしで予約できます — ',
    'login.reserve_link': '予約システムへ',
    'loader.loading': 'システム読み込み中…',
    'loader.ready': '準備完了',
    'lang.zh': '繁體中文',
    'lang.en': 'English',
    'lang.ja': '日本語',
  },
};

export function getCurrentLang(): Lang {
  if (typeof window === 'undefined') return 'zh-TW';
  const saved = localStorage.getItem('portal_lang') as Lang;
  if (saved && ['zh-TW', 'en', 'ja'].includes(saved)) {
    return saved;
  }
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('en')) return 'en';
  return 'zh-TW';
}

export function t(key: string, lang?: Lang): string {
  const current = lang || getCurrentLang();
  return translations[current]?.[key] || translations['zh-TW']?.[key] || key;
}

export function setLanguage(lang: Lang) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('portal_lang', lang);
  document.documentElement.lang = lang;
  applyTranslations(lang);
  window.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
}

export function applyTranslations(lang?: Lang) {
  if (typeof document === 'undefined') return;
  const currentLang = lang || getCurrentLang();
  document.documentElement.lang = currentLang;

  // 1. Text elements
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key && translations[currentLang]?.[key]) {
      el.textContent = translations[currentLang][key];
    }
  });

  // 2. Placeholder elements
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key && translations[currentLang]?.[key]) {
      (el as HTMLInputElement | HTMLTextAreaElement).placeholder = translations[currentLang][key];
    }
  });

  // 3. Language switcher UI sync
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    const targetLang = btn.getAttribute('data-lang');
    if (targetLang === currentLang) {
      btn.classList.add('is-active');
    } else {
      btn.classList.remove('is-active');
    }
  });
}

// 自動初始化
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyTranslations());
  } else {
    applyTranslations();
  }
}
