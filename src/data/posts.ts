export interface Post {
  slug: string;
  category: 'tech' | 'general';
  date: string;
  title: string;
  excerpt: string;
  content: string;
}

const posts: Post[] = [
    {
        slug: 'tech-notes-architecture',
    category: 'tech',
    date: '2026.08.19',
    title: '【技術文章】技術筆記本',
    excerpt: '白話拆解現代網站系統架構：從 Cloudflare 第一道防線、Nginx 到 Django 技術棧，再到模組化設計，一篇看懂所有設計重點！',
    content: `
      <p class="post-intro">
        每次架構新的網站或服務，最怕的就是「做完就忘」。這篇是我的技術筆記整理，把整套現代 Web 系統的架構設計、選型邏輯與安全防護用白話文記錄下來。
      </p>

      <h2>為什麼整理這份架構筆記？</h2>
      <p>
        不管是自己接案、開發校園專案還是建置企業級應用，一套穩定且具備防禦力的系統通常不會綁定單一特定平台，而是遵循通用的<strong>分層防護與模組化邏輯</strong>。
      </p>
      <p>
        整套系統就像一棟現代大樓：從門口警衛保全（CDN / WAF）、櫃檯接待分流（Nginx 反向代理）、辦公室核心業務（Django REST API / Next.js），到最後方的倉庫與郵務（資料庫、物件儲存與 Web Push），每一層各司其職且層層把關。
      </p>

      <h2>五層架構核心拆解</h2>
      <p>
        在實際部屬中，我們通常由外向內將流量切分為五個關鍵層級：
      </p>
      <ul>
        <li><strong>邊緣網路層（Cloudflare）：</strong>掌管全站 DNS 解析、全球靜態 CDN 快取、HTTPS 傳輸加密與第一道 WAF 邊緣防線，直接在網路入口攔截惡意爬蟲與高頻 DDoS 攻擊。</li>
        <li><strong>主機與反向代理（Nginx + GCP VM）：</strong>做為伺服器前台櫃檯，負責 SSL 憑證解密、靜態資源分流，並利用 <code>limit_req</code> 漏桶機制設定第二層頻率限制，防堵暴力密碼破解。透過 GitHub Actions CI/CD 自動化建置並安全部署至虛擬機。</li>
        <li><strong>前後端核心服務（Next.js + Django REST API）：</strong>前端採用 Next.js App Router 實現 SSR 渲染與事件驅動 UI；後端由 Django 負責資料庫 ORM、業務權限審查、SQL 查詢最佳化，並透過 SSE（Server-Sent Events）建立單向推播通道。</li>
        <li><strong>資料儲存與資產層（MySQL + Cloudflare R2）：</strong>結構化商業資料儲存於關聯式資料庫並建立索引；使用者上傳的圖片與媒體資產則託管於 S3 相容的 Cloudflare R2 分散式儲存。</li>
        <li><strong>訊息通知系統（Web Push + SMTP）：</strong>基於 VAPID 協定的 pywebpush 實現跨裝置離線推播，搭配 Django Signals 在資料庫異動時自動觸發背景非同步寄信與推播。</li>
      </ul>

      <h2>實戰技術棧與防護細節</h2>
      <p>
        在安全性與效能調校方面，有幾個特別關鍵的實作重點：
      </p>
      <p>
        <strong>1. 認證與授權機制：</strong>採用自訂 JWT（HS256 簽章）傳遞內部權限，搭配 Google OAuth 第三方登入；同時在自訂 Auth Adapter 中實作校園信箱網域限制與白名單過濾，確保非授權信箱無法存取。
      </p>
      <p>
        <strong>2. 內容審核與多媒體防護：</strong>文字部分採用 Phrase-level 比對加上敏感詞庫，支援拼音與注音諧音模糊比對；圖片處理則在本地端透過 OpenCV 進行分析，並搭配輕量化模型實現不當內容自動攔截。
      </p>
      <p>
        <strong>3. 三層階梯式流量限制（Rate Limiting）：</strong>
        第一層由 Cloudflare 阻擋異常機器人；第二層由 Nginx 針對 <code>/api/auth/</code> 等敏感端點進行漏桶排隊；第三層則在 Django 應用層針對特定操作設定計數閥值，並暫存於記憶體快取中，徹底杜絕介面濫用。
      </p>

      <h2>模組化設計與架構原則</h2>
      <p>
        後端開發最忌諱將所有商業邏輯寫成單一龐大程式碼。依照<strong>業務邊界（Domain Boundaries）</strong>拆分獨立 App：帳號驗證、工單管理、即時通訊與通知排程各自獨立，介面固定後即可任意替換底層實作而不影響整體系統。
      </p>
      <p class="post-outro">
        整套架構的哲學非常純粹：<strong>每一層只專注做好自己的任務——該擋的邊緣擋、該存的安全存、該推的即時推</strong>。系統設計不在於堆疊多複雜的炫技名詞，而在於每個環節都清清楚楚知道為何而存在。
      </p>
    `,
  },
  {
    slug: 'cf-pages-pwa-webpush',
    category: 'tech',
    date: '2026.08.19',
    title: '【CF Page 】PWA WebPush 設計原理',
    excerpt: 'PWA 網頁推播三招設計原理：Service Worker 資料回拉、Web Crypto 原生加密、靜默推播，讓推播在 Cloudflare Pages 上穩定又快速！',
    content: `
      <p class="post-intro">
        這篇記錄我架設 PWA WebPush（網頁推播）時的設計原理，三招讓推播在 Cloudflare 邊緣環境跑得又快又穩！
      </p>

      <h2>1. Service Worker 資料回拉（Fetch on Push）</h2>
      <p>當你的手機（Service Worker）收到那個「信號」後，並不會直接把通知彈出來，而是會在背景立刻執行以下動作：</p>
      <ul>
        <li>醒過來，收到 push 事件。</li>
        <li>主動連回你的伺服器（<code>/api/notifications</code>），問：「剛才發生了什麼事？」</li>
        <li>從資料庫（D1）抓取最新的一則通知內容。</li>
        <li>最後才把通知框彈出來給你。</li>
      </ul>
      <p class="audit-tip">這樣的好處是：通知內容永遠是即時從伺服器拉取的最新狀態，不會有推播出去才發現內容過期的問題。</p>

      <h2>2. Web Crypto API（原生加密）</h2>
      <p>原本使用的 <code>web-push</code> 套件是為了 Node.js 設計的，依賴很多 Node.js 底層的加密模組，在 Cloudflare Workers 這種「邊緣運算（Edge Computing）」環境中常常會出錯。</p>
      <p>解法是改用 Cloudflare 原生支援的 <strong>Web Crypto API</strong>，手動簽署你的 VAPID 數位憑證。白話來說，就像是直接用 Cloudflare 的母語跟它溝通，所以速度極快而且不會出錯。</p>

      <h2>3. 靜默推播（Silent Push）</h2>
      <p>這是這套架構最聰明的地方！</p>
      <ul>
        <li><strong>傳統方式：</strong>要把通知內容（標題、文字）在伺服器端加密，然後塞進推播封包。這部分加密規格極度複雜，而且容易跟手機瀏覽器不相容。</li>
        <li><strong>現在方式：</strong>伺服器只發送一個「信號」給手機（不帶內容）。就像是伺服器對手機說：「嘿！你有新消息了，快回來拿！」因為不帶內容，就不需要複雜的加密，成功率是 100%。</li>
      </ul>

      <p class="post-outro">
        總結：資料回拉拿最新內容、Web Crypto 原生簽署零出錯、靜默推播直接繞過複雜加密——三招合起來，就是一套穩定又快速的 PWA WebPush 架構！
      </p>
    `,
  },
  {
    slug: 'presentation-design-logic',
    category: 'general',
    date: '2026.08.19',
    title: '【文章】簡報的設計方式跟邏輯：',
    excerpt: '簡報設計其實就是 Why → What → How 三步驟！用白話文加例子，教你把簡報講得超有說服力。',
    content: `
      <p class="post-intro">
        這篇來聊聊「簡報到底怎麼設計，才不會被台下的教授或評審問倒？」其實有一套超好記的邏輯框架，簡單來說就是 <strong>Why → What → How</strong> 三步驟！下面用白話文加例子講給你聽～
      </p>

      <h2>1. Why：先講「為什麼要做？」</h2>
      <p>這一段就是在幫你的專案「撐腰」，要先說服大家：這個東西真的有存在的必要啦！</p>
      <ul>
        <li><strong>痛點分析：</strong>先把現況的慘況講出來。舉例來說，你是不是也看過 Dcard 或二手書社團有人賣二手書，但根本不知道對方是不是自己學校的同學？身分沒人驗證、信任度低到不行，而且貼文沒多久就被新的文章淹沒（洗掉）了。</li>
        <li><strong>可行性分析：</strong>證明這不是白日夢。像是：需求很明確（真的有人要買賣）、場域很集中（就在北商校園內）、使用門檻不高（學生就能上手）、而且還有測試靶場可以先練功。講到這裡，評審心裡就會想：「嗯，好像真的做得起來耶！」</li>
      </ul>

      <h2>2. What：再講「要做什麼來解決問題？」</h2>
      <p>這一段要展現你的產品「值錢」在哪，人家買單的是核心價值跟實際功能。</p>
      <ul>
        <li><strong>專案亮點：</strong>直接把口號丟出來——<em>Beyond simple CRUD</em>！白話來說就是：我們可不只是做一個死板的資料庫網站，而是一個具備「校園驗證、安全媒合、內容治理」的信任生態系，光是這句話就先贏一半。</li>
        <li><strong>核心功能細拆：</strong>把解法拆成三大支柱給大家看：PWA 行動化（手機隨時隨地都能開）、通知機制（交易有動靜馬上提醒你）、Email 聯繫（重要訊息不怕漏）。三個加起來其實就是在說：讓交易「可追蹤、可提醒、可持續」。</li>
      </ul>

      <h2>3. How：最後講「技術上怎麼實現？」</h2>
      <p>這一段是要讓人家知道你選工具不是亂選的，工程能力要拿出來見客。</p>
      <ul>
        <li><strong>技術選型理由：</strong>為什麼不乾脆用傳統的 Django Templates 一路刻到底就好？因為我們的定位是「互動式校園媒體」，需要前端狀態管理、即時回饋這種比較靈活的東西。用白話講就是：<strong>工具要配場景</strong>，選對工具，系統才會跑得又順又不卡。</li>
      </ul>

      <h2>想拿高分的幾個小彩蛋</h2>
      <ul>
        <li><strong>動態導覽（Breadcrumbs）：</strong>左上角那顆紅色箭頭標籤會跟著簡報進度切換（問題背景  功能與解法  技術與系統），聽眾永遠知道現在講到哪一段，不會迷路。</li>
        <li><strong>結論先行（Headline First）：</strong>每頁的主標題、副標題直接就是重點，像是「身分無法被確認」、「重要交易訊息被洗掉」，聽眾瞄一眼就知道這頁要講什麼，不用猜。</li>
        <li><strong>結構化視覺：</strong>左邊放一個大圖示（PWA、通知機制、Email 聯繫的黃/灰色箭頭），右邊條列式文字、關鍵字加粗，畫面乾淨又容易掃讀。</li>
      </ul>

      <p class="post-outro">
        整套下來就是新創競賽、黑客松、大學畢業專題都很通用的發表邏輯！下次做簡報，記得先問自己：Why？What？How？順順講完，保證說服力 up up！
      </p>
    `,
  },
      
  
  {
    slug: 'ai-planner-past-exam-info',
    category: 'general',
    date: '2026.08.17',
    title: '【文章】AI應用規劃師考古資訊',
    excerpt: '想要測驗AI應用規劃師的，輸入 hi@nasirlin.net 就可以測驗囉！',
    content: `
      <p>
        想要測驗AI應用規劃師的，輸入 <a href="mailto:hi@nasirlin.net">hi@nasirlin.net</a> 就可以測驗囉！測驗網站：<a href="https://1ztests.nsir.uk" target="_blank" rel="noopener noreferrer">1ztests.nsir.uk</a>
      </p>
    `,
  },
    {
    slug: 'github-open-source-tools',
    category: 'tech',
    date: '2026.06.30',
    title: '【文章】學期結束後，收獲的 github 開源工具',
    excerpt: '暑假即將開始了，同時這兩個學期也收獲很多，總結了一些有趣的工具，打算暑假來好好的研究一下！',
    content: `
      <p class="post-intro">
        暑假即將開始了，同時這兩個學期也收獲很多！無論是跟好朋友一起討論、從 AI 獲取靈感，還是 IG、社群大佬們的精彩分享，我把這段時間蒐集到的高價值開源工具、前端設計靈感、網路代理與極客玩具做了一個完整的大整合與系統化分類，方便自己隨時查閱，也分享給有需要的朋友們一起研究！
      </p>
      <p>
        這學期特別喜歡 Astro 框架，一方面他是一個全端的現代架構，另一方面非常輕量極速，也能兼顧安全性與極佳的自定義能力！
      </p>

      <h2>1. AI Agent 擴充、Skill 與 API 專題</h2>
      <p>
        AI 正在徹底改寫軟體開發與自動化的工作流。這裡將我平時蒐集到、測試過的高價值 Agent 執行環境、擴充 Skill 與路由工具依照<strong>「架構定位與應用場景」</strong>進行細緻分類：
      </p>

      <h3>1.1 Agent 執行環境與工作流編排 (Runtime & Orchestration)</h3>
      <p>專注於提供獨立乾淨的執行環境或多 Agent 協同作戰框架：</p>
      <ul>
        <li><strong>caveman</strong>：極簡純粹的 AI Agent 獨立沙盒執行環境，適合打造專屬輕量助理。<a href="https://github.com/JuliusBrussee/caveman" target="_blank" rel="noopener noreferrer">https://github.com/JuliusBrussee/caveman</a></li>
        <li><strong>deer-flow</strong>：字節跳動開源的輕量級工作流引擎，適合複雜多步任務自動化。<a href="https://github.com/bytedance/deer-flow" target="_blank" rel="noopener noreferrer">https://github.com/bytedance/deer-flow</a></li>
        <li><strong>Wegent</strong>：協同式多 Agent 團隊開發框架，實現多角色分工自動構建代碼。<a href="https://github.com/wecode-ai/Wegent" target="_blank" rel="noopener noreferrer">https://github.com/wecode-ai/Wegent</a></li>
      </ul>

      <h3>1.2 知識記憶與上下文圖譜 (Memory & Knowledge Graph)</h3>
      <p>解決 Agent 長期記憶、時間演進與深度文檔萃取的核心利器：</p>
      <ul>
        <li><strong>graphiti</strong>：為 AI Agent 構建具備時間感知能力（Temporal-aware）的動態知識圖譜與長期記憶。<a href="https://github.com/getzep/graphiti" target="_blank" rel="noopener noreferrer">https://github.com/getzep/graphiti</a></li>
        <li><strong>notebooklm-skill</strong>：串接 Google NotebookLM 深度文檔理解與結構化筆記萃取的專屬技能。<a href="https://github.com/claude-world/notebooklm-skill" target="_blank" rel="noopener noreferrer">https://github.com/claude-world/notebooklm-skill</a></li>
      </ul>

      <h3>1.3 智慧路由、多模型分發與閘道 (Smart Routing & Gateway)</h3>
      <p>在不同大語言模型之間動態分發請求，兼顧成本與響應速度：</p>
      <ul>
        <li><strong>OmniRoute</strong>：多模型與多端點智能 API 負載均衡與動態路由分發器，實現高可用與自動容錯。<a href="https://github.com/diegosouzapw/OmniRoute" target="_blank" rel="noopener noreferrer">https://github.com/diegosouzapw/OmniRoute</a></li>
      </ul>

      <h3>1.4 程式碼生成、重構與開發輔助 (Code Generation & Tooling)</h3>
      <p>深度整合進終端與 IDE 的全自動編程加速模組：</p>
      <ul>
        <li><strong>kilocode</strong>：現代化代碼生成、深度重構與品質分析輔助工具。<a href="https://github.com/Kilo-Org/kilocode" target="_blank" rel="noopener noreferrer">https://github.com/Kilo-Org/kilocode</a></li>
        <li><strong>codeg</strong>：命令列極速代碼架構與模組模板產生器，秒級建立專案骨架。<a href="https://github.com/xintaofei/codeg" target="_blank" rel="noopener noreferrer">https://github.com/xintaofei/codeg</a></li>
      </ul>

      <h3>1.5 Opencode 專屬生態與擴充技能 (Opencode Ecosystem & Skills)</h3>
      <p>專為 Opencode 設計的高級擴充包與自定義審查規則：</p>
      <ul>
        <li><strong>taste-skill</strong>：高品味 UI/UX 設計規範與代碼美學審查專用技能包。<a href="https://github.com/Leonxlnx/taste-skill" target="_blank" rel="noopener noreferrer">https://github.com/Leonxlnx/taste-skill</a></li>
        <li><strong>oh-my-opencode</strong>：開箱即用的 Opencode 增強擴充套件庫，預先配置最佳提示詞與工具組合。<a href="https://github.com/opensoft/oh-my-opencode" target="_blank" rel="noopener noreferrer">https://github.com/opensoft/oh-my-opencode</a></li>
      </ul>

      <h2>2. 前端 UI/UX 設計、現代元件與動效靈感資源</h2>
      <p>看到令人驚艷的前端設計與動效元件就要立刻收藏！以下整理了涵蓋現代登入介面、設計提示詞與高階動效庫的精選網站：</p>
      <ul>
        <li><strong>Design Prompts</strong>：高質感設計提示詞與介面構想庫 <a href="https://www.designprompts.dev/" target="_blank" rel="noopener noreferrer">https://www.designprompts.dev/</a></li>
        <li><strong>21st.dev Sign-in Components</strong>：現代極簡風格的精選登入/註冊元件庫 <a href="https://21st.dev/community/components/s/sign-in" target="_blank" rel="noopener noreferrer">https://21st.dev/community/components/s/sign-in</a></li>
        <li><strong>Web Design Clip</strong>：日本精選高質感網站設計作品收集剪貼簿 <a href="https://webdesignclip.com/" target="_blank" rel="noopener noreferrer">https://webdesignclip.com/</a></li>
        <li><strong>Awwwards 精選 Slideshow 效果</strong>：結合 GSAP 的頂級網頁幻燈片流體動畫 <a href="https://www.awwwards.com/inspiration/slideshow-gsap-codegrid" target="_blank" rel="noopener noreferrer">https://www.awwwards.com/inspiration/slideshow-gsap-codegrid</a></li>
        <li><strong>GSAP (GreenSock)</strong>：Apple 官網級頂級絲滑網頁動畫 JavaScript 函式庫 <a href="https://github.com/greensock/GSAP" target="_blank" rel="noopener noreferrer">https://github.com/greensock/GSAP</a></li>
      </ul>

      <h2>3. 現代前端模板、Dashboard 與後台介面</h2>
      <p>包含 Astro 極速模板、Vue/Bootstrap 後台管理介面以及個人 Profile 專屬主題：</p>
      <ul>
        <li><strong>DataNova</strong>：現代數據視覺化與儀表板模板 <a href="https://github.com/mearashadowfax/DataNova" target="_blank" rel="noopener noreferrer">https://github.com/mearashadowfax/DataNova</a></li>
        <li><strong>astro-shopify</strong>：結合 Astro 與 Shopify 的超極速電商前端架構 <a href="https://github.com/thomasKn/astro-shopify" target="_blank" rel="noopener noreferrer">https://github.com/thomasKn/astro-shopify</a></li>
        <li><strong>mizu-light-astro-theme</strong>：清爽簡約的 Astro 輕量級部落格主題 <a href="https://github.com/oxygenna-themes/mizu-light-astro-theme" target="_blank" rel="noopener noreferrer">https://github.com/oxygenna-themes/mizu-light-astro-theme</a></li>
        <li><strong>astrosaas</strong>：專為 SaaS 產品打造的高轉換率 Landing Page 模板 <a href="https://github.com/michael-andreuzza/astrosaas" target="_blank" rel="noopener noreferrer">https://github.com/michael-andreuzza/astrosaas</a></li>
        <li><strong>hub-itsteddydev</strong>：極簡現代個人作品集與技術入口 <a href="https://github.com/tedevs0/hub-itsteddydev" target="_blank" rel="noopener noreferrer">https://github.com/tedevs0/hub-itsteddydev</a></li>
        <li><strong>soft-ui-dashboard</strong>：精緻質感的 Soft UI 現代後台管理面板 <a href="https://github.com/creativetimofficial/soft-ui-dashboard" target="_blank" rel="noopener noreferrer">https://github.com/creativetimofficial/soft-ui-dashboard</a></li>
        <li><strong>adminkit</strong>：專業且開箱即用的 Bootstrap 5 響應式管理後台 <a href="https://github.com/adminkit/adminkit" target="_blank" rel="noopener noreferrer">https://github.com/adminkit/adminkit</a></li>
      </ul>

      <h2>4. 代理伺服器 Proxy 與網路環境工具箱</h2>
      <p>在進行網路資料收集、爬蟲研究或跨地域測試時，穩定的代理伺服器與指紋隔離環境至關重要：</p>
      <ul>
        <li><strong>free-proxy-list (GitHub)</strong>：開源自動化免費 Proxy 清單抓取與驗證模組 <a href="https://github.com/proxifly/free-proxy-list" target="_blank" rel="noopener noreferrer">https://github.com/proxifly/free-proxy-list</a></li>
        <li><strong>Proxy Seller</strong>：提供全球高品質專屬 IPv4/IPv6 與住宅代理服務 <a href="https://proxy-seller.com/zh/" target="_blank" rel="noopener noreferrer">https://proxy-seller.com/zh/</a></li>
        <li><strong>Decodo</strong>：智慧代理與數據採集輔助工具 <a href="https://decodo.com/#gref" target="_blank" rel="noopener noreferrer">https://decodo.com/#gref</a></li>
        <li><strong>Lumi Proxy</strong>：覆蓋全球海量節點的高可用動態住宅代理 <a href="https://www.lumiproxy.com/zh-hant/" target="_blank" rel="noopener noreferrer">https://www.lumiproxy.com/zh-hant/</a></li>
        <li><strong>AdsPower</strong>：專業級多帳號指紋防關聯與獨立環境瀏覽器 <a href="https://www.adspower.com/tc/" target="_blank" rel="noopener noreferrer">https://www.adspower.com/tc/</a></li>
      </ul>

      <h2>5. 系統復古改造玩物：利用 Win10 核心重新復刻 WinXP</h2>
      <p>
        相信許多朋友是從 Windows XP 時代一路走過來的，我自己也是！偶爾總會懷念 XP 那個純粹、直覺且工具查找無比快速的經典時代。
      </p>
      <p>
        前陣子在 Archive 發現了一位國外神人開發的 <strong>Windows Experience Freestyle</strong> 專案，巧妙利用 Windows 10 核心將介面、音效與系統主題 1:1 復刻為 WinXP 經典風格！既能享受 Win10 的硬體驅動與現代軟體相容性，又能重溫 XP 經典優雅的青草藍天主題，非常推薦極客玩家們在虛擬機或備用機中體驗：
      </p>
      <ul>
        <li><strong>Windows Experience Freestyle 專案載點與映像檔</strong>：<a href="https://archive.org/details/windows-experience-freestyle" target="_blank" rel="noopener noreferrer">https://archive.org/details/windows-experience-freestyle</a></li>
      </ul>

      <h2>6. LeetCode 刷題與演算法精進</h2>
      <p>專注於資料結構、演算法解題思維與高頻考題解析：</p>
      <ul>
        <li><strong>Leetcode-Solution-All</strong>：涵蓋各語言超詳盡 LeetCode 題解大全 <a href="https://github.com/fuxuemingzhu/Leetcode-Solution-All" target="_blank" rel="noopener noreferrer">https://github.com/fuxuemingzhu/Leetcode-Solution-All</a></li>
        <li><strong>LeetCodeJourney</strong>：系統化圖解資料結構與演算法精華旅程 <a href="https://github.com/TheExplainthis/LeetCodeJourney" target="_blank" rel="noopener noreferrer">https://github.com/TheExplainthis/LeetCodeJourney</a></li>
      </ul>

      <h2>7. 實用工具、地理資訊與自架服務</h2>
      <p>涵蓋網路安全測試、情報監控與強大的開源自架資源：</p>
      <ul>
        <li><strong>worldmonitor</strong>：即時全球情報與國際動態視覺化儀表板 <a href="https://github.com/koala73/worldmonitor" target="_blank" rel="noopener noreferrer">https://github.com/koala73/worldmonitor</a></li>
        <li><strong>QGIS</strong>：業界標準開源地理資訊系統（GIS）軟體 <a href="https://github.com/qgis/QGIS" target="_blank" rel="noopener noreferrer">https://github.com/qgis/QGIS</a></li>
        <li><strong>mach</strong>：高效能網頁 Fuzzing 與端點安全測試工具 <a href="https://github.com/clickswave/mach" target="_blank" rel="noopener noreferrer">https://github.com/clickswave/mach</a></li>
        <li><strong>awesome-selfhosted</strong>：全球最完整的自託管（Self-hosted）開源服務索引清單 <a href="https://github.com/awesome-selfhosted/awesome-selfhosted" target="_blank" rel="noopener noreferrer">https://github.com/awesome-selfhosted/awesome-selfhosted</a></li>
      </ul>

      <h2>8. 總結與心得</h2>
      <p>
        技術的演進日新月異，從早期的架站技術到現今蓬勃發展的 AI Agent、現代化前端框架與雲端邊緣運算，持續保持好奇心與動手實踐的習慣是最珍貴的資產。希望這份開源工具與實戰資源大補帖能為大家的學習與開發流程帶來實質的幫助！
      </p>
`,
  },
  {
    slug: 'ntub-audit',
    category: 'tech',
    date: '2026.06.14',
    title: '【文章】NTUB 2026 通識資安稽核一條龍',
    excerpt: '為了符合國家資安稽核的指標，並加速檢測流程的進度，特別做這個一鍵式全自動資安檢測工具！',
    content: `
      <p class="post-intro">
        為了符合國家資安稽核的指標，並加速檢測流程的進度，特別做這個一鍵式全自動資安檢測工具！
      </p>

      <h2>程式下載</h2>
      <p>請點選下方連結，直接下載檔案（下載後記得務必先解壓縮後再依照說明書執行）：</p>
      <p><a class="audit-dl" href="/files/NTUB_Audit.zip"> 下載 NTUB_Audit.zip</a></p>
      <p class="audit-note">下載說明：點擊上方連結後，瀏覽器將會直接下載 .zip 壓縮檔。下載後請將其「解壓縮」，再以「最高管理員」執行 NTUB_Audit.bat。</p>

      <h2>功能說明</h2>
      <ul>
        <li><strong>版本檢查</strong>：自動讀取系統版本，針對舊版 Windows 10（低於 22H2）提示重大資安風險，並建議後續升級。</li>
        <li><strong>更新服務重置</strong>：強制清除 Windows Update 損壞快取，重新啟動更新服務，並在背景調用。</li>
        <li><strong>取消密碼永久有效</strong>：自動檢查本機所有帳號，強制取消「密碼永久有效」設定，落實定期變更密碼之稽核要點。</li>
        <li><strong>Admin 與 Guest 帳號</strong>：精準鎖定本機內建最高權限 Administrator 與 Guest 帳號，若偵測為啟用狀態則強制停用，防止被惡意掃描或利用。</li>
        <li><strong>四大重點軟體檢查</strong>：偵測系統中是否安裝 Google Chrome、Microsoft Edge、Adobe Acrobat Reader 及 Java。</li>
        <li><strong>背景更新</strong>：自動使用 Windows 內建 winget 軟體包管理器，在背景強制執行靜默升級至最新安全版本。</li>
      </ul>

      <h2>使用步驟說明</h2>

      <h3>步驟一：下載並解壓縮程式檔</h3>
      <ul>
        <li>點擊上方的 <strong>下載連結</strong>，將 NTUB_Audit.zip 儲存至您的電腦中（例如桌面或下載資料夾），並將其解壓縮取出 NTUB_Audit.bat 檔案。</li>
        <li> <strong>重要警告（不建議使用複製的方式）</strong>：若您是自行複製網頁代碼手動建立檔案，存檔時請務必確認檔案編碼選擇 <strong>UTF-8 (帶簽名/BOM)</strong>，否則執行時的命令提示字元視窗將會出現中文字亂碼。</li>
      </ul>

      <h3>步驟二：以系統管理員身分執行</h3>
      <ul>
        <li>找到剛才下載的 NTUB_Audit.bat 檔案。</li>
        <li>在檔案上點擊 <strong>滑鼠右鍵</strong>  選擇 <strong>「以系統管理員身分執行」</strong> (Run as administrator)。</li>
      </ul>
      <p><img src="/images/nub-audit/1.png" alt="以系統管理員身分執行" /></p>

      <h3>步驟三：按下【是】後，不要動讓他跑！</h3>
      <ul>
        <li>程式啟動後，將全自動執行初檢！</li>
        <li>過程中若偵測到未更新的軟體，會透過 winget 於背景下載並靜默安裝，請耐心等待其完成。</li>
      </ul>
      <p><img src="/images/nub-audit/2.png" alt="執行中畫面" /></p>

      <h3>步驟四：執行完畢與確認</h3>
      <ul>
        <li>腳本全自動跑完後，畫面最後會停留在：<code>所有資安強制防護與盤點任務已執行完畢！</code></li>
        <li>此時請檢視視窗中是否有任何紅色/黃色警告，並按鍵盤上的 <strong>任意鍵</strong> 即可安全結束視窗。</li>
      </ul>
      <p><img src="/images/nub-audit/3.png" alt="執行完畢畫面" /></p>

      <h2>為什麼要做這個工具？</h2>
      <p>在通識中心處理的過程中，發現流程卡最久的部分是在於修改密碼永久選項及更新系統和軟體部分。為了加快整體處理與檢查的進度，特別製作這個一鍵式整合工具，目的就是希望能夠通過稽核，以及校園檢查過程中流程能夠更順利。</p>
      <p class="audit-tip">建議：由於很多軟體都一直在不定時更新，系統也是，建議在正式稽核的前幾天，將此程式重新開啟執行一次，確保所有的安全性或是應用程式都是在最新狀態。</p>
    `,
  },
];

export default posts;