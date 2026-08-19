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
    slug: 'security-research-report',
    category: 'tech',
    date: '2026.08.19',
    title: '【系統資安】全端資安防禦與風險日誌實踐',
    excerpt: '整理全端系統資安規範：包含 CVSS 滲透分級、OWASP 與 CWE 常見威脅應對、結構化日誌格式與自動化防禦機制。',
    content: `
      <p class="post-intro">
        這篇整理了近期研讀企業全端資安架構、滲透指數分級與風險日誌標準後的心得筆記。核心目標只有一個：當系統遭遇異常流量或攻擊嘗試時，該如何準確評估危害等級、留存關鍵證據，並在最短時間內啟動自動化應變。
      </p>

      <h2>為什麼需要統一的資安標準？</h2>
      <p>
        在前後端分離與微服務架構普及的今天，單純看「伺服器有沒有壞」已經遠遠不夠。完整的防護體系需要回答三件事：
      </p>
      <p>
        第一是<strong>危害程度量化</strong>（透過 CVSS v4.0 計算客觀分數）；第二是<strong>漏洞精準分類</strong>（對照 OWASP Top 10 與 CWE 標準名稱）；第三是<strong>線索結構化留存</strong>（產出標準格式的風險日誌供自動化處置與追蹤）。
      </p>

      <h2>CVSS 嚴重度分級邏輯</h2>
      <p>
        CVSS 評分範圍為 0.0 到 10.0 分，實務上通常劃分為四個等級：
      </p>
      <ul>
        <li><strong>CRITICAL 嚴重（9.0 – 10.0）：</strong>例如遠端代碼執行（RCE）、資料庫提權注入，或伺服器環境變數外洩。處置策略為立即阻斷連線、封鎖來源 IP 網段、銷毀快取 Token/Session，並同步發送特急通報。</li>
        <li><strong>HIGH 高（7.0 – 8.9）：</strong>例如未授權存取敏感 API（Server Actions 越權）、儲存型 XSS 攻擊等。需在 24 小時內凍結惡意帳號、限制端點請求頻率並提交修補工單。</li>
        <li><strong>MEDIUM 中（4.0 – 6.9）：</strong>例如除錯資訊外洩、CORS 設定不夠嚴謹等。可排入下個開發週期修正，同時對相關存取路徑持續進行異常行為觀測。</li>
        <li><strong>LOW 低（0.1 – 3.9）：</strong>例如非敏感的回應標頭版本洩漏、靜態測試路徑暴露等。列入例行維護清單於後續部署時一併優化。</li>
      </ul>

      <h2>常見全端攻擊手法與防禦重點</h2>
      <p>現代全端系統的威脅來源可以按架構層級來拆解：</p>

      <h3>前端與瀏覽器層</h3>
      <ul>
        <li><strong>跨站指令碼（XSS, CWE-79）：</strong>惡意 JavaScript 被注入前端渲染流程。防禦重點在於嚴格的 CSP 內容安全政策（監聽腳本載入違規日誌），並對所有使用者輸入實施強制編碼與消毒。</li>
        <li><strong>客戶端 Token 劫持：</strong>存放在 Storage 中的敏感金鑰遭惡意腳本讀取。應優先使用 HttpOnly / Secure Cookie 存放驗證憑證，並監控異常的 Token 存取模式。</li>
      </ul>

      <h3>後端 API 與資料庫層</h3>
      <ul>
        <li><strong>SQL 注入（SQL Injection, CWE-89）：</strong>利用拼接語法篡改查詢邏輯。防禦核心是全面採用 ORM 參數化查詢，並監控後端資料庫拋出的異常語法錯誤。</li>
        <li><strong>物件層級越權與大量賦值（BOLA / Mass Assignment, CWE-915）：</strong>修改請求欄位試圖提升權限或存取他人資源。後端須嚴格驗證 Payload 欄位白名單，並對 Resource ID 進行持有者權限比對。</li>
        <li><strong>伺服器端請求偽造（SSRF）：</strong>伺服器被誘導向內網發起請求。對外發送 HTTP 請求的服務需建立目標網段白名單，嚴禁存取內部迴圈位址與私有 IP。</li>
      </ul>

      <h3>全端跨層通訊</h3>
      <ul>
        <li><strong>Server Actions 邏輯越權（CWE-285）：</strong>直接呼叫未設防的內部 RPC 路由。所有寫入端點均須在後端實作 Session 驗證與 CSRF 防護。</li>
        <li><strong>HTTP 請求走私（HTTP Request Smuggling, CWE-444）：</strong>前端代理與後端解析 Content-Length / Transfer-Encoding 不一致。反向代理層應強制統一規範並拒絕畸形 Header。</li>
        <li><strong>JWT 簽章偽造（CWE-347）：</strong>攻擊者嘗試將演算法改為 None 或替換金鑰。驗證時必須明確限定簽章演算法與過期機制。</li>
      </ul>

      <h2>結構化風險日誌（Security Log Schema）</h2>
      <p>統一的日誌格式是日後自動化分析的基石，關鍵欄位包含：</p>
      <ul>
        <li><strong>trace_id：</strong>貫穿前後端的全局唯一追蹤識別碼，確保分散式呼叫鏈路可完整串聯。</li>
        <li><strong>timestamp 與 environment：</strong>記錄事件發生的精確時間戳（ISO 8601）與運行環境標籤。</li>
        <li><strong>architecture_layer：</strong>標註發生異常的具體層級（邊緣網路、SSR、後端 API 或資料庫）與對應程式檔案。</li>
        <li><strong>vulnerability_metadata：</strong>記錄 OWASP 分類代碼與 CWE 編號。</li>
        <li><strong>penetration_index：</strong>包含 CVSS 分數、嚴重等級與攻擊難易度評估。</li>
        <li><strong>http_context：</strong>記錄請求 URL、HTTP 方法、來源 IP、User-Agent 以及過濾後的關鍵 Payload。</li>
        <li><strong>execution_status：</strong>記錄最終結果（已被阻擋、引發異常、攻擊成功或探測被拒）。</li>
      </ul>

      <h2>自動化應變處置機制</h2>
      <p>
        透過建立自動化處置劇本，系統在偵測到威脅時能即時採取行動：嚴重威脅由 WAF 於邊緣節點自動封鎖 IP 並吊銷 Session；中高風險則觸發帳號暫時凍結與動態頻率限制，大幅縮短人工排查與反應的時間差。
      </p>

      <p class="post-outro">
        資安是一場動態的攻防過程，後續實際整合漏洞掃描工具與日誌分析平台時，會再持續補充更多實戰細節。
      </p>
    `,
  },
    {
    slug: 'tech-notes-architecture',
    category: 'tech',
    date: '2026.08.19',
    title: '【技術筆記】現代全端網站系統架構解析',
    excerpt: '從 Cloudflare 邊緣防線、Nginx 反向代理到 Django 與 Next.js 服務架構，整理完整系統分層與模組化設計經驗。',
    content: `
      <p class="post-intro">
        每次在構建大型全端專案時，架構規劃往往決定了系統未來的穩定性與擴展上限。這篇筆記記錄了我在實際架構系統時的分層設計、技術選型邏輯與模組化拆分原則。
      </p>

      <h2>系統分層架構</h2>
      <p>
        整套系統由外至內可劃分為清晰的四個主要層次，每一層各司其職且具備獨立的防護能力：
      </p>

      <h3>網路入口層（Network Edge）</h3>
      <p>使用技術：Cloudflare</p>
      <ul>
        <li><strong>DNS 與全域路由：</strong>統籌全站網域解析，提供高可用性路由切換。</li>
        <li><strong>CDN 邊緣快取：</strong>將靜態資源快取於全球邊緣節點，大幅降低源站負載並加速本地與海外存取。</li>
        <li><strong>WAF 應用防火牆：</strong>在流量抵達伺服器前，過濾自動化掃描工具、惡意 Fuzzing 與異常高頻流量。</li>
        <li><strong>HTTPS 端到端加密：</strong>全面強制啟用安全傳輸協定，確保通訊隱私。</li>
      </ul>

      <h3>伺服器反向代理層（Application Gateway）</h3>
      <p>使用技術：Nginx, GCP VM, GitHub Actions</p>
      <ul>
        <li><strong>Nginx 反向代理：</strong>負責 SSL 解密、靜態資源分流，並設置第二層流量漏桶限制（<code>limit_req</code>），平滑突發請求。</li>
        <li><strong>雲端虛擬主機：</strong>後端核心運算與 API 服務運行的基礎環境。</li>
        <li><strong>GitHub Actions 自動化部署：</strong>建立 CI/CD 流水線，代碼推送到主分支後自動執行測試與安全部署。</li>
      </ul>

      <h3>應用服務層（Application Services）</h3>
      <p>使用技術：Next.js (App Router), Django REST Framework, SSE</p>
      <ul>
        <li><strong>前端應用：</strong>採用 Next.js App Router 構建，結合 SSR 伺服器端渲染、SWR 資料快取與 PWA 漸進式網頁應用能力。</li>
        <li><strong>後端核心 API：</strong>基於 Django REST Framework 實現，負責身分驗證、權限控制、內容管理與資料持久化。</li>
        <li><strong>即時資料通訊：</strong>前後端之間透過 Server-Sent Events（SSE）建立單向事件推播，即時傳遞系統狀態變化。</li>
      </ul>

      <h3>資料與資產儲存層（Data & Assets）</h3>
      <p>使用技術：MySQL, Cloudflare R2, SMTP, WebPush</p>
      <ul>
        <li><strong>結構化資料庫：</strong>MySQL 搭配優化索引設計，支撐核心業務資料的 ACID 操作。</li>
        <li><strong>物件儲存：</strong>相容 S3 API 的 Cloudflare R2，專門託管使用者上傳的圖片與媒體資產。</li>
        <li><strong>通知服務：</strong>結合 SMTP 電子郵件與基於 VAPID 標準的 Web Push，支援跨裝置主動通知。</li>
      </ul>

      <h2>關鍵技術選型與設計考量</h2>

      <h3>認證與授權機制</h3>
      <p>
        內部 API 呼叫採用基於 HS256 的自訂 JWT 簽章，並整合第三方 OAuth 登入。認證層實作了自訂配接器，支援特定組織網域限制與白名單驗證，確保只有授權使用者能存取受保護資源。
      </p>

      <h3>多層頻率限制（Rate Limiting）</h3>
      <p>
        防護機制採用多層漏桶與計數器策略：第一層由 Cloudflare 阻斷惡意掃描；第二層由 Nginx 保護登入與管理端點；第三層由 Django Throttling 依業務行為（如發表內容、查詢資料）設定專屬閥值，計數器儲存於高效能記憶體快取。
      </p>

      <h3>媒體處理與自動化審查</h3>
      <p>
        上傳圖片先由本機電腦視覺庫完成規格化與色彩優化，並引入輕量化模型進行內容安全判定，全程於本機環境完成處理，兼顧隱私與處理效能。
      </p>

      <h2>模組化架構拆分原則</h2>
      <p>
        在資料模型設計上，依照業務邊界拆分為獨立模組（如身分認證、內容管理、通知中心等），確保模組之間高內聚、低耦合。各模組透過定義清晰的 API 介面溝通，單一模組的修改不會波及其他系統，利於長期維護與功能擴充。
      </p>

      <p class="post-outro">
        系統架構的核心在於「分工明確與防護層層相扣」。隨著專案需求演進，這份筆記將持續記錄更多架構實踐與優化方案。
      </p>
    `,
  },
    {
    slug: 'cf-pages-pwa-webpush',
    category: 'tech',
    date: '2026.08.19',
    title: '【CF Pages】PWA WebPush 設計原理',
    excerpt: '透過 Service Worker 資料回拉、Web Crypto 原生憑證簽署與靜默推播，在 Cloudflare Pages 邊緣環境打造高穩定的 WebPush 機制。',
    content: `
      <p class="post-intro">
        這篇記錄在 Cloudflare 邊緣運算環境中實作 PWA 網頁推播（WebPush）的關鍵技術原理與優化策略。
      </p>

      <h2>Service Worker 資料回拉機制（Fetch on Push）</h2>
      <p>
        當使用者裝置收到推播喚醒信號時，Service Worker 在背景被啟動，隨即向伺服器端點發起資料請求，從後端取得最新一筆通知內容後再進行本機渲染顯示。此設計確保通知內容始終為最新狀態，避免推播封包內容與伺服器資料脫節。
      </p>

      <h2>Web Crypto API 原生憑證簽署</h2>
      <p>
        傳統的 Node.js 推播套件依賴原生底層加密模組，在邊緣環境（如 Cloudflare Workers / Pages Functions）中容易發生相容性問題。改採瀏覽器標準 Web Crypto API 手動簽署 VAPID 憑證，能確保在邊緣執行環境中具備最高的相容性與運算效能。
      </p>

      <h2>靜默推播信號設計（Silent Push）</h2>
      <p>
        伺服器發送推播時僅傳送觸發信號而不直接夾帶複雜的加密載荷，由終端裝置接收信號後再回拉資料。此方式大幅簡化了伺服器端的封包加密流程，有效提升了跨平台瀏覽器推播的成功率。
      </p>

      <p class="post-outro">
        結合資料回拉、原生加密與靜默信號，即可在邊緣運算環境中建構出一套輕量、穩定且低延遲的 PWA 推播架構。
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

      <h2>💡 想拿高分的幾個小彩蛋</h2>
      <ul>
        <li><strong>動態導覽（Breadcrumbs）：</strong>左上角那顆紅色箭頭標籤會跟著簡報進度切換（問題背景 ➔ 功能與解法 ➔ 技術與系統），聽眾永遠知道現在講到哪一段，不會迷路。</li>
        <li><strong>結論先行（Headline First）：</strong>每頁的主標題、副標題直接就是重點，像是「身分無法被確認」、「重要交易訊息被洗掉」，聽眾瞄一眼就知道這頁要講什麼，不用猜。</li>
        <li><strong>結構化視覺：</strong>左邊放一個大圖示（PWA、通知機制、Email 聯繫的黃/灰色箭頭），右邊條列式文字、關鍵字加粗，畫面乾淨又容易掃讀。</li>
      </ul>

      <p class="post-outro">
        整套下來就是新創競賽、黑客松、大學畢業專題都很通用的發表邏輯！下次做簡報，記得先問自己：Why？What？How？順順講完，保證說服力 up up！
      </p>
    `,
  },
  {
    slug: 'front-end-design',
    category: 'tech',
    date: '2026.08.19',
    title: '【文章】Front End Design ( 好看的推薦）',
    excerpt: '看到好看的設計前端就要收藏起來',
    content: `
      <p class="post-intro">
        看到好看的設計前端就要收藏起來：
      </p>
      <ul>
        <li>Design Prompts <a href="https://www.designprompts.dev/" target="_blank" rel="noopener noreferrer">https://www.designprompts.dev/</a></li>
        <li>21st.dev Sign-in 元件 <a href="https://21st.dev/community/components/s/sign-in" target="_blank" rel="noopener noreferrer">https://21st.dev/community/components/s/sign-in</a></li>
        <li>Web Design Clip <a href="https://webdesignclip.com/" target="_blank" rel="noopener noreferrer">https://webdesignclip.com/</a></li>
        <li>Awwwards 精選：圖片與幻燈片 <a href="https://www.awwwards.com/awwwards/collections/image-gallery-and-slideshows/" target="_blank" rel="noopener noreferrer">https://www.awwwards.com/awwwards/collections/image-gallery-and-slideshows/</a></li>
        <li>Awwwards 精選：載入頁面 <a href="https://www.awwwards.com/awwwards/collections/loading-page/" target="_blank" rel="noopener noreferrer">https://www.awwwards.com/awwwards/collections/loading-page/</a></li>
        <li>Awwwards 精選：Hover、游標與可愛互動 <a href="https://www.awwwards.com/awwwards/collections/hovers-cursors-and-cute-interactions/" target="_blank" rel="noopener noreferrer">https://www.awwwards.com/awwwards/collections/hovers-cursors-and-cute-interactions/</a></li>
        <li>Awwwards 精選：選單 <a href="https://www.awwwards.com/awwwards/collections/menu/" target="_blank" rel="noopener noreferrer">https://www.awwwards.com/awwwards/collections/menu/</a></li>
        <li>Awwwards <a href="https://www.awwwards.com/" target="_blank" rel="noopener noreferrer">https://www.awwwards.com/</a></li>
        <li>Best Website Gallery <a href="https://bestwebsite.gallery/" target="_blank" rel="noopener noreferrer">https://bestwebsite.gallery/</a></li>
      </ul>
    `,
  },
  {
    slug: 'proxy-list-tools',
    category: 'tech',
    date: '2026.08.19',
    title: '【文章】Proxy List & Tools 推薦',
    excerpt: '前一陣子在找代理，我的好朋朋364同學大力推薦這些，我還沒來得及研究，等研究完再來寫一篇文章好了！',
    content: `
      <p class="post-intro">
        前一陣子在找代理，我的好朋朋 364 同學大力推薦這些，我還沒來得及研究，等研究完再來寫一篇文章好了！
      </p>
      <ul>
        <li>Proxy Seller <a href="https://proxy-seller.com/zh/" target="_blank" rel="noopener noreferrer">https://proxy-seller.com/zh/</a></li>
        <li>Decodo <a href="https://decodo.com/#gref" target="_blank" rel="noopener noreferrer">https://decodo.com/#gref</a></li>
        <li>Lumi Proxy <a href="https://www.lumiproxy.com/zh-hant/" target="_blank" rel="noopener noreferrer">https://www.lumiproxy.com/zh-hant/</a></li>
        <li>AdsPower <a href="https://www.adspower.com/tc/" target="_blank" rel="noopener noreferrer">https://www.adspower.com/tc/</a></li>
      </ul>
    `,
  },
  {
    slug: 'ntub-credit-program',
    category: 'tech',
    date: '2026.08.19',
    title: '【工具】NTUB學分學程查詢及預算學分',
    excerpt: 'NTUB 學分學程簡章與學分勾選，一站查詢各學分學程的設置要點與計畫書內容。',
    content: `
      <p class="post-intro">
        為了方便查閱 NTUB 各學分學程與微學程的設置要點暨計畫書內容，特別整理了這支「學分學程查詢及預算學分」工具！
      </p>

      <h2>📖 工具介紹</h2>
      <p>收錄 NTUB 各學分學程與微學程的簡章，可以快速查詢設置要點、計畫書內容與學分勾選資訊，方便你規劃自己的學分預算。</p>
      <p><a href="/ntub/" target="_blank" rel="noopener noreferrer">點此開啟「學分學程查詢及預算學分」→</a></p>
    `,
  },
  {
    slug: 'ig-unsend-tool',
    category: 'tech',
    date: '2026.08.17',
    title: '【工具】IG 收回工具 Batch',
    excerpt: 'IG 訊息傳錯人？想要一次收回所有你傳送的訊息？「IG自動訊息收回工具 （Nasir）」讓你批次收回 Instagram 私訊！',
    content: `
      <p class="post-intro">
        不小心傳錯訊息、或是傳了不該傳的內容？「IG自動訊息收回工具 （Nasir）」是一支 Chrome 擴充套件，可以批次收回 Instagram 私訊中「你所傳送」的訊息，不用一隻一隻手動刪！
      </p>

      <h2>📥 工具下載</h2>
      <p><a class="audit-dl" href="/files/IGUnsend.zip">📥 下載 IGUnsend.zip</a></p>
      <p class="audit-note">下載後請先「解壓縮」，再到 Chrome 的 <code>chrome://extensions</code> 開啟開發人員模式，點「載入未封裝功能」選取資料夾即可安裝。</p>
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
    slug: 'windows-experience-freestyle',
    category: 'tech',
    date: '2026.07.26',
    title: '【文章】新找到的玩意兒：利用 Win10 重新復刻 WinXP',
    excerpt: '我相信很多人是從 XP 時代過來的，我自己也是，我真的很常懷念 XP 的時代…',
    content: `
      <p>
        我相信很多人是從 XP 時代過來的，我自己也是，我真的很常懷念 XP 的時代，那個工具查找什麼的真的很方便，就是用習慣後，用 Win10（Win7 我也覺得很好用）Win11 就會覺得不習慣！前幾天找到一位國外大佬開發的利用 Win10 的核心改了主題等，變成 XP 的樣式，真的超有趣，我決定找時間來玩玩看！
      </p>
      <p>
        連結如下
        <a href="https://archive.org/details/windows-experience-freestyle/Freestyle%20Test%201-2023-02-11-10-55-14.png" target="_blank" rel="noopener noreferrer">https://archive.org/details/windows-experience-freestyle</a>
      </p>
    `,
  },
  {
    slug: 'a-new-beginning',
    category: 'general',
    date: '2026.07.01',
    title: '【文章】新的開始',
    excerpt: '決定用這個 Repo 來記錄自己的每一天，像是一本專屬的日記本。',
    content: `
      <p class="post-intro">
        決定用這個 Repo 來記錄自己的每一天，像是一本專屬的日記本。
      </p>
      <p>
        也即將要邁入大三了，我覺得大學生活也即將過半了，在大學的這兩年下來，除了一方面是自己搬出來臺北北漂住，然後生存，課業方面，當然有擅長的跟非常不擅長的（像是數學 XD）而日常生活中除了讀書，我也覺得北部很有趣，在大學期間這兩年去了蠻多地方，也體驗蠻多事物，但偶爾也是會思考，我大學到底做了什麼，有沒有把時間效率最大化，這個日記本，我覺得我會把無論是我的小專案、還是我的心情還是我的一些正在學習的東西，放上來，並且督促自己！讓自己越來越進步，不要讓大學生活渾渾噩噩跑掉了！
      </p>
      <p class="post-outro">
        這個也是 Nasir 我的第一篇開頭！
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
        暑假即將開始了，同時這兩個學期也收獲很多，無論是跟好朋友一起討論還是說從 AI、IG 上面的人進行分享，總結了一些有趣的工具，打算暑假來好好的研究一下！
      </p>
      <p>
        這學期特別喜歡 Astro 框架，一方面他是一個全端的框架，另一個方面是他是蠻輕量的，也可以顧及安全！
      </p>
      <p>廢話不多說，我來把我的筆記貼上，暑假或是之後來好好摸索：</p>
      <h2>1. AI Agent 擴充、Skill 與 API</h2>
      <p>我找到這些 Github 專案都是 AI Agent 或是 Skill（大部分呢可用於 Opencode）</p>
      <ul>
        <li>caveman <a href="https://github.com/JuliusBrussee/caveman" target="_blank" rel="noopener noreferrer">https://github.com/JuliusBrussee/caveman</a></li>
        <li>taste-skill <a href="https://github.com/Leonxlnx/taste-skill" target="_blank" rel="noopener noreferrer">https://github.com/Leonxlnx/taste-skill</a></li>
        <li>OmniRoute <a href="https://github.com/diegosouzapw/OmniRoute" target="_blank" rel="noopener noreferrer">https://github.com/diegosouzapw/OmniRoute</a></li>
        <li>graphiti <a href="https://github.com/getzep/graphiti" target="_blank" rel="noopener noreferrer">https://github.com/getzep/graphiti</a></li>
        <li>deer-flow <a href="https://github.com/bytedance/deer-flow" target="_blank" rel="noopener noreferrer">https://github.com/bytedance/deer-flow</a></li>
        <li>kilocode <a href="https://github.com/Kilo-Org/kilocode" target="_blank" rel="noopener noreferrer">https://github.com/Kilo-Org/kilocode</a></li>
        <li>codeg <a href="https://github.com/xintaofei/codeg" target="_blank" rel="noopener noreferrer">https://github.com/xintaofei/codeg</a></li>
        <li>Wegent <a href="https://github.com/wecode-ai/Wegent" target="_blank" rel="noopener noreferrer">https://github.com/wecode-ai/Wegent</a></li>
        <li>oh-my-opencode <a href="https://github.com/opensoft/oh-my-opencode" target="_blank" rel="noopener noreferrer">https://github.com/opensoft/oh-my-opencode</a></li>
        <li>notebooklm-skill <a href="https://github.com/claude-world/notebooklm-skill" target="_blank" rel="noopener noreferrer">https://github.com/claude-world/notebooklm-skill</a></li>
      </ul>
      <h2>2. 前端模板、使用者 Dashboard 模板跟與後台 Dashboard</h2>
      <p>蠻多都是 Astro 模板、Bootstrap/Vue 後台管理介面，以及個人 Profile 的模板。</p>
      <ul>
        <li>DataNova <a href="https://github.com/mearashadowfax/DataNova" target="_blank" rel="noopener noreferrer">https://github.com/mearashadowfax/DataNova</a></li>
        <li>astro-shopify <a href="https://github.com/thomasKn/astro-shopify" target="_blank" rel="noopener noreferrer">https://github.com/thomasKn/astro-shopify</a></li>
        <li>mizu-light-astro-theme <a href="https://github.com/oxygenna-themes/mizu-light-astro-theme" target="_blank" rel="noopener noreferrer">https://github.com/oxygenna-themes/mizu-light-astro-theme</a></li>
        <li>astrosaas <a href="https://github.com/michael-andreuzza/astrosaas" target="_blank" rel="noopener noreferrer">https://github.com/michael-andreuzza/astrosaas</a></li>
        <li>hub-itsteddydev <a href="https://github.com/tedevs0/hub-itsteddydev" target="_blank" rel="noopener noreferrer">https://github.com/tedevs0/hub-itsteddydev</a></li>
        <li>bootstrap-admin-template <a href="https://github.com/asterodigital/bootstrap-admin-template" target="_blank" rel="noopener noreferrer">https://github.com/asterodigital/bootstrap-admin-template</a></li>
        <li>soft-ui-dashboard <a href="https://github.com/creativetimofficial/soft-ui-dashboard" target="_blank" rel="noopener noreferrer">https://github.com/creativetimofficial/soft-ui-dashboard</a></li>
        <li>adminkit <a href="https://github.com/adminkit/adminkit" target="_blank" rel="noopener noreferrer">https://github.com/adminkit/adminkit</a></li>
        <li>coreui-free-bootstrap-admin-template <a href="https://github.com/coreui/coreui-free-bootstrap-admin-template" target="_blank" rel="noopener noreferrer">https://github.com/coreui/coreui-free-bootstrap-admin-template</a></li>
        <li>simpleui <a href="https://github.com/newpanjing/simpleui" target="_blank" rel="noopener noreferrer">https://github.com/newpanjing/simpleui</a></li>
        <li>front10 <a href="https://github.com/ntub-rental-passport/front10" target="_blank" rel="noopener noreferrer">https://github.com/ntub-rental-passport/front10</a></li>
        <li>dashboard（Kubernetes 通用 Web UI）<a href="https://github.com/kubernetes-retired/dashboard" target="_blank" rel="noopener noreferrer">https://github.com/kubernetes-retired/dashboard</a></li>
        <li>meijiasha.github.io（世新資傳 LINE BOT 作品展示）<a href="https://github.com/meijiasha/meijiasha.github.io" target="_blank" rel="noopener noreferrer">https://github.com/meijiasha/meijiasha.github.io</a></li>
      </ul>
      <h2>3. LeetCode 學習</h2>
      <p>專注於 LeetCode 刷題資源與演算法解析。</p>
      <ul>
        <li>Leetcode-Solution-All <a href="https://github.com/fuxuemingzhu/Leetcode-Solution-All" target="_blank" rel="noopener noreferrer">https://github.com/fuxuemingzhu/Leetcode-Solution-All</a></li>
        <li>LeetCodeJourney <a href="https://github.com/TheExplainthis/LeetCodeJourney" target="_blank" rel="noopener noreferrer">https://github.com/TheExplainthis/LeetCodeJourney</a></li>
      </ul>
      <h2>4. 應用程式或是其他專案等</h2>
      <p>這裏是搜集到各式各樣的工具包</p>
      <ul>
        <li>worldmonitor（全球情報儀表板）<a href="https://github.com/koala73/worldmonitor" target="_blank" rel="noopener noreferrer">https://github.com/koala73/worldmonitor</a></li>
        <li>QGIS（開源地理資訊系統）<a href="https://github.com/qgis/QGIS" target="_blank" rel="noopener noreferrer">https://github.com/qgis/QGIS</a></li>
        <li>GSAP（Apple 網頁動畫 JavaScript 函式庫）<a href="https://github.com/greensock/GSAP" target="_blank" rel="noopener noreferrer">https://github.com/greensock/GSAP</a></li>
        <li>free-proxy-list（免費 ProxyList）<a href="https://github.com/proxifly/free-proxy-list" target="_blank" rel="noopener noreferrer">https://github.com/proxifly/free-proxy-list</a></li>
        <li>mach（網頁 Fuzzing 安全測試工具）<a href="https://github.com/clickswave/mach" target="_blank" rel="noopener noreferrer">https://github.com/clickswave/mach</a></li>
        <li>awesome-selfhosted（自架網路服務資源）<a href="https://github.com/awesome-selfhosted/awesome-selfhosted" target="_blank" rel="noopener noreferrer">https://github.com/awesome-selfhosted/awesome-selfhosted</a></li>
      </ul>
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

      <h2>📥 程式下載</h2>
      <p>請點選下方連結，直接下載檔案（下載後記得務必先解壓縮後再依照說明書執行）：</p>
      <p><a class="audit-dl" href="/files/NTUB_Audit.zip">📥 下載 NTUB_Audit.zip</a></p>
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
        <li>⚠️ <strong>重要警告（不建議使用複製的方式）</strong>：若您是自行複製網頁代碼手動建立檔案，存檔時請務必確認檔案編碼選擇 <strong>UTF-8 (帶簽名/BOM)</strong>，否則執行時的命令提示字元視窗將會出現中文字亂碼。</li>
      </ul>

      <h3>步驟二：以系統管理員身分執行</h3>
      <ul>
        <li>找到剛才下載的 NTUB_Audit.bat 檔案。</li>
        <li>在檔案上點擊 <strong>滑鼠右鍵</strong> ➔ 選擇 <strong>「以系統管理員身分執行」</strong> (Run as administrator)。</li>
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