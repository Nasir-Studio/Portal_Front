export interface Post {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
}

const posts: Post[] = [
  {
    slug: 'tech-notes-architecture',
    date: '2026.08.19',
    title: '【技術文章】技術筆記本',
    excerpt: '白話拆解整套二手書平台的系統架構：從 Cloudflare 第一道防線、Nginx 到 Django 技術棧，再到 10 個 App 模組，一篇看懂所有設計重點！',
    content: `
      <p class="post-intro">
        這篇是我的「技術筆記本」第一集：把整套系統的架構設計，從外到內、從選型到模組，全部用白話文整理一遍。講給未來的自己聽，也講給正在看這篇的你聽！
      </p>

      <h2>起：為什麼會有這本筆記？</h2>
      <p>
        每次架系統，最怕的就是「做完就忘」。所以我把整套二手書平台的架構畫成一張圖、拆成一張表，然後用這篇筆記記錄下來。
      </p>
      <p>
        打個比方：整套系統就像一棟大樓，<strong>從門口保全、櫃檯接待，到辦公室分工、倉庫管理</strong>，每一層都有各自的任務，而且層層防護。下面我們就從大門口開始，一層一層往裡面逛。
      </p>

      <h2>承：系統多層級架構（從外到內五層）</h2>

      <h3>第 2 層：網路入口（Network Entry）＝大樓門口的保全都</h3>
      <p>使用的技術：<code>Cloudflare</code></p>
      <ul>
        <li><strong>DNS 解析：</strong>全站網域路由的總管，別人打網址要怎麼找到你家，由它決定。</li>
        <li><strong>CDN 靜態加速：</strong>把前端靜態資源快取在世界各地的節點，離使用者近的節點直接送貨，全球/本地存取都變快。</li>
        <li><strong>WAF（Web Application Firewall）：</strong>第一道防線！專門過濾惡意工具、Web Fuzzing 漏洞攻擊（舉例：有人拿萬用鑰匙一支一支狂試你家門鎖）跟異常高頻流量（舉例：一秒內被敲門一萬次，正常人誰會這樣？）。</li>
        <li><strong>HTTPS 全面加密：</strong>門口到路上的對話全部加密，強制走安全傳輸協定，不讓別人偷聽。</li>
      </ul>

      <h3>第 3 層：應用入口（Application Entry）＝櫃檯接待 + 辦公室本體</h3>
      <p>使用的技術：<code>Nginx Reverse Proxy</code>、<code>GCP VM</code>、<code>GitHub Actions</code></p>
      <ul>
        <li><strong>Nginx 反向代理：</strong>站在雲端主機前方的櫃檯。負責 HTTPS 解密、靜態檔案託管分流，還會做<strong>第二層流量限制</strong>（<code>limit_req</code>），客人太多就先排在門外慢慢放行。</li>
        <li><strong>GCP VM：</strong>整個後端服務住的辦公室，所有 API 都在這台虛擬主機上跑。</li>
        <li><strong>GitHub Actions（CI/CD）：</strong>自動化的「打卡上班」流程。開發者把代碼推到 GitHub，它就會自動觸發建置，再透過安全通道（Deploy to VM）把新版本部署到 GCP 虛擬機，不用半夜爬起來手動上線。</li>
      </ul>

      <h3>第 4 層：應用服務層（Application Services）＝真正的辦公室同事們</h3>
      <p>使用的技術：<code>Next.js (App Router)</code>、<code>Django REST API</code>、<code>SSE</code></p>
      <ul>
        <li><strong>Build Frontend（前端構建）：</strong>用 <strong>Next.js App Router</strong> 打造，整合了 <strong>SSR</strong>（伺服器端渲染，搜尋引擎看得懂）、<strong>SWR</strong>（資料請求快取，免一直 reload）、<strong>PWA</strong>（漸進式網頁應用，可以裝成 App）、還有<strong>事件驅動 UI</strong>（Event-Driven UI），頁面會自己「聽」資料變化即時更新。</li>
        <li><strong>Migrate Backend（後端核心）：</strong>用 <strong>Django REST API</strong>，負責身份驗證（Auth）、內容審查（Moderation）、通知發送（Notification）跟 SQL 查詢優化。</li>
        <li><strong>即時通訊（SSE）：</strong>Django 跟 Next.js 之間用 <strong>SSE（Server-Sent Events）</strong>建立<strong>單向</strong>即時通道，打個比方就是廣播電台——後端有新消息就直接放送給前端，不用前端一直跑回去問。</li>
      </ul>

      <h3>第 5 層：資料與資產層（Data & Assets Layer）＝倉庫跟郵務室</h3>
      <p>使用的技術：<code>MySQL / Cloud SQL</code>、<code>Cloudflare R2</code>、<code>Email SMTP</code>、<code>Web Push / VAPID</code></p>
      <ul>
        <li><strong>MySQL / Cloud SQL：</strong>放結構化業務資料的倉庫，搭配優化過的索引查詢（Optimized Indexes），翻東西才快。</li>
        <li><strong>Cloudflare R2：</strong>相容 S3 的分散式物件儲存，專門放刊登的商品圖片這類媒體資產。</li>
        <li><strong>Email SMTP：</strong>郵務室，負責寄交易型跟通知型郵件。</li>
        <li><strong>Web Push / VAPID：</strong>瀏覽器主動推送服務，走 VAPID 協議標準，手機關著網頁也能收到通知。</li>
      </ul>

      <h2>轉：核心技術棧白話對照表</h2>
      <p>架構看完，來拆技術細節。我把後端跟運維用到的技術分門別類，每一項都用一句白話講「它是誰、幹嘛用的」：</p>

      <h3>1.1 框架核心（Core Framework）</h3>
      <ul>
        <li><strong>Django：</strong>後端總指揮，MVC/MTV 框架，所有 API 業務邏輯都由它調度。</li>
        <li><strong>mysqlclient：</strong>MySQL 的 C 語言驅動，Django 連 MySQL 的「專用快車道」，效能比慢吞吞的 PyMySQL 好，所以捨棄了後者。</li>
      </ul>

      <h3>1.2 資料庫 / ORM（Database & Cache）</h3>
      <ul>
        <li><strong>Django ORM：</strong>在 <code>models.py</code> 用物件導向操作資料庫，不用手寫原生 SQL，寫起來像在填空而不是在背咒語。</li>
        <li><strong>MySQL：</strong>核心關聯式資料庫，在 <code>settings.py</code> 的 <code>DATABASES</code> 設定為預設引擎。</li>
        <li><strong>Django Cache：</strong>快取抽象層，實際用於 <code>core/rate_limit.py</code> 跟 <code>listings/ratelimit.py</code>，專門暫存頻率限制的計數器。</li>
      </ul>

      <h3>1.3 認證 / 授權（Authentication & Authorization）</h3>
      <ul>
        <li><strong>自訂 JWT（HS256）：</strong>核發跟解讀內部 API 呼叫用的 <code>app_token</code>，採用 HS256 安全雜湊演算法簽章。</li>
        <li><strong>PyJWT + cryptography：</strong>PyJWT 負責 Token 的 Encode/Decode，cryptography 是底層加密庫，確保簽章不會被偽造。</li>
        <li><strong>django-allauth：</strong>整合第三方登入，這裡專門接 <strong>Google OAuth</strong>。</li>
        <li><strong>Custom User Model：</strong>自訂使用者模型，擴充欄位存 <code>auth_provider: google_sub</code>（Google 唯一識別碼）跟 <code>identity_type</code>。</li>
        <li><strong>Custom Auth Adapter：</strong>自訂認證配接器，實作<strong>校園信箱網域限制</strong>——只准 <code>@ntub.edu.tw</code> 結尾的信箱註冊登入，還加了白名單機制。舉例：校外信箱想進來？直接被擋在門外。</li>
        <li><strong>Django Auth Backend：</strong>管理員登入 Django Admin 後台用的認證系統。</li>
        <li><strong>CSRF Protection + CORS Headers：</strong>一個防跨站請求偽造，保護敏感寫入操作；<code>django-cors-headers</code> 負責跨域設定，讓獨立部署的 Next.js 前端可以合法打 Django API。</li>
      </ul>

      <h3>1.4 圖片處理 / 儲存（Image Processing & Storage）</h3>
      <ul>
        <li><strong>Cloudflare R2（S3-compatible）：</strong>放使用者上傳的商品圖片跟媒體檔案，自帶 CDN 節點。</li>
        <li><strong>boto3：</strong>AWS 官方 SDK，但因為 R2 相容 S3 API，直接拿它來上傳、下載、管理 R2 的檔案。</li>
        <li><strong>opencv-python：</strong>本地端電腦視覺庫，做圖片色彩分析、尺寸處理——全程本地運算，不靠外部 API。</li>
        <li><strong>TensorFlow：</strong>深度學習框架，本地載入輕量化模型，做<strong>圖片 NSFW（不當內容）自動過濾審查</strong>。舉例：有人上傳奇怪圖片，模型直接幫你攔下來。</li>
      </ul>

      <h3>1.5 安全 / 防爬蟲（Security & Anti-Bot）</h3>
      <ul>
        <li><strong>Google reCAPTCHA v3：</strong>無感人機驗證，後端根據使用者行為給風險評分，0.0 是機器人、1.0 是人類，你根本感覺不到它在考試。</li>
        <li><strong>Google reCAPTCHA v2：</strong>經典「我不是機器人」勾選式驗證，當 v3 評分太低時當作第二次挑戰。</li>
        <li><strong>requests：</strong>Python HTTP 函式庫，後端用它打 Google verify endpoint，驗證 reCAPTCHA 是否合法。</li>
      </ul>

      <h3>1.6 內容審核（Content Moderation）</h3>
      <ul>
        <li><strong>文字 Moderation：</strong>基於詞級別（Phrase-level）比對加上古文/歷史詞庫，實作 <strong>BLOCK（直接封鎖）/ REVIEW（人工審核）/ ALLOW（直接通過）</strong> 三級敏感詞控制。</li>
        <li><strong>敏感詞寬容比對：</strong>演算法支援<strong>拼音、注音</strong>等變體諧音比對。舉例：有人用特殊符號或同音字想繞過審查？照樣被抓出來。</li>
        <li><strong>🔬 待研究（TensorFlow 內容審核）：</strong>除了圖片 NSFW 過濾，<a href="https://www.tensorflow.org/?hl=zh-tw" target="_blank" rel="noopener noreferrer">TensorFlow</a> 也能用 AI 審核<strong>文字內容</strong>或<strong>影音內容</strong>！先把官方網站收藏起來，等我研究完再補一篇實作筆記。</li>
      </ul>

      <h3>1.7 多層流量限制與防濫用（Multi-layer Rate Limiting）</h3>
      <p>防濫用不是只靠一道牆，而是三道關卡層層過濾：</p>
      <ul>
        <li><strong>第一層：Cloudflare WAF / Rate Limit —</strong>在網路邊緣直接阻斷自動化黑客工具、惡意 Web Fuzzing 掃描跟異常高頻的 DDoS 流量。</li>
        <li><strong>第二層：Nginx limit_req —</strong>伺服器入口的漏桶（Leaky Bucket）緩衝（緩衝區大小 425），重點保護 API、Auth（登入驗證）跟 Admin（後台）等高風險端點，防止暴力破解密碼。</li>
        <li><strong>第三層：DRF / Django Throttling —</strong>應用層的細粒度限制，針對登入、一般查詢、NSFW 圖片檢測、發表文章/刊登等不同行為，各自設定獨立的頻率阻斷閥值。</li>
        <li><strong>快取儲存：Django Cache / LocMemCache —</strong>第三層計數器的高速儲存後端，用本地記憶體快取，數字記得住又讀得快。</li>
      </ul>

      <h3>1.8 通知系統（Notification System）</h3>
      <ul>
        <li><strong>Web Push（pywebpush）：</strong>瀏覽器標準網頁推播，基於 <strong>VAPID 機制</strong>，使用者關掉網頁也收得到通知。</li>
        <li><strong>Django SMTP Email：</strong>發送結構化的交易式電子郵件。</li>
        <li><strong>Django Template Emails：</strong>用 Django 模板引擎動態渲染 <strong>HTML + 純文字雙格式</strong>郵件，乾淨又不怕對方信箱不吃 HTML。</li>
        <li><strong>Django Signals（post_save）：</strong>資料庫一建立 <code>Notification</code> 紀錄（<code>post_save</code> 觸發），就自動在背景非同步呼叫 Web Push 跟 Email 發送邏輯——業務代碼不用自己到處呼叫，事件發生就有人接手。</li>
      </ul>

      <h3>1.9 基礎設施 / 部署（Infrastructure & Deployment）</h3>
      <ul>
        <li><strong>Gunicorn：</strong>高效能 WSGI HTTP 伺服器，負責解析 HTTP 請求並執行 Django 應用程式。</li>
        <li><strong>systemd：</strong>Linux 服務管理器，管理跟守護 Gunicorn 進程（這裡走 Linux 原生路線，不用 Node.js 圈常看到的 pm2）。</li>
        <li><strong>nginx：</strong>高效能前端網頁跟反向代理伺服器，處理靜態檔案託管、安全分流跟負載緩衝。</li>
        <li><strong>django-environ：</strong>管理十二要素（12-Factor App）環境變數，把資料庫密碼、Secret Key、API 密鑰這些敏感資訊跟程式碼徹底分離。</li>
        <li><strong>Django Logging：</strong>分級日誌系統（DEBUG/INFO/WARNING/ERROR），搭配 <code>RotatingFileHandler</code> 做日誌大小輪替跟自動封存，防止日誌檔把磁碟塞爆。</li>
        <li><strong>WSGI / ASGI：</strong>生產環境走穩定的 WSGI；ASGI 是「預留技術」，等之後需要非同步功能再切過去。</li>
      </ul>

      <h3>1.10 後台管理（Admin Dashboard）</h3>
      <ul>
        <li><strong>Django Admin：</strong>Django 內建原生管理後台，管理基礎資料。</li>
        <li><strong>django-simpleui：</strong>基於 Vue.js 和 Element-UI 封裝的後台主題，把陽春後台變成現代化 SPA 管理介面。</li>
        <li><strong>Custom Admin Views：</strong>自訂管理員視圖，在後台顯示平台營運統計數據跟視覺化圖表。</li>
        <li><strong>Admin URL：</strong>自訂又隱蔽的後台路由，刻意不用預設的 <code>/admin/</code>，讓惡意自動化腳本掃不到門在哪。</li>
      </ul>

      <h2>合：資料模型——10 個 App 就像一家公司的部門</h2>
      <p>
        最後是資料模型設計：系統把 Django ORM 模型拆成 <strong>10 個獨立 App（部門）</strong>、<strong>24 個資料模型（員工）</strong>，並拆成 6 個子圖避免一張圖複雜到看不懂。用部門分工來比喻，一眼就懂：
      </p>
      <ul>
        <li><strong>1. accounts（使用者與身份）＝人事部：</strong>管全站使用者（學生/管理員）的核心檔案、Google 認證綁定（<code>google_sub</code>）、登入權限跟身分識別（例如學生證驗證狀態）。</li>
        <li><strong>2. books（書籍主資料）＝書籍百科：</strong>定義書籍基礎元資料（Metadata）：ISBN、書名、作者、出版社、分類。</li>
        <li><strong>3. listings（刊登與商品）＝陳列部：</strong>處理使用者上架二手書的業務——書況描述、二手售價、上架狀態，並關聯 <code>Cloudflare R2</code> 的商品圖片路徑。</li>
        <li><strong>4. cart（購物車）＝暫存區：</strong>暫存使用者想買的二手書清單，處理前端暫存跟後端同步。</li>
        <li><strong>5. purchase_requests（預約與交易）＝交易部：</strong>管理校園面交或交易的預約請求，追蹤訂單狀態機：已發送 ➔ 雙方同意 ➔ 面交完成／取消。</li>
        <li><strong>6. moderation（內容審查與檢舉）＝風紀股長：</strong>使用者舉報違規商品、不當言論或不安全行為時建立檢舉單，並對接 TensorFlow（圖片）跟文字 Moderation（文字變體）審查與申訴處置。</li>
        <li><strong>7. notifications（全站通知）＝廣播室：</strong>存系統主動發送的通知（商品被預約、檢舉結果、即時訊息提醒），靠 <code>Django Signals</code> 觸發多端（Web Push/Email）推送。</li>
        <li><strong>8. chat（即時聊天室）＝客服線：</strong>買家跟賣家針對特定刊登商品的溝通管道，紀錄對話歷史。</li>
        <li><strong>9. subscriptions（求書與訂閱）＝許願池：</strong>某本書目前沒人刊登？使用者可以建立訂閱，未來一有人上架，系統自動比對並通知訂閱者。</li>
        <li><strong>10. core（核心與背景任務）＝總務處：</strong>全站公用基礎功能、非同步背景任務調度（例如定期清理過期快取）、全系統層級的日誌操作紀錄。</li>
      </ul>

      <h2>📚 附錄：每天多學一點（待研究清單）</h2>
      <p>
        看完整篇架構後，其實還有一串「已經用到、但還沒研究透」跟「未來想引入」的主題。我把它們整理成待研究清單，按照對應的章節分門別類，研究完一篇就補一篇筆記：
      </p>

      <h3>🔐 認證與授權（對應 1.3）</h3>
      <ul>
        <li><strong>JWT 是什麼：</strong>專案已經在用自訂 JWT（HS256），但原理還是要徹底搞懂——<a href="https://jwt.io/" target="_blank" rel="noopener noreferrer">JWT.IO</a> 有互動式解說，還可以直接把 token 丟上去轉碼看內容。</li>
        <li><strong>自訂 JWT：</strong>1.3 提到的 <code>app_token</code> 就是自訂 JWT 的實作，動手之前先用 <a href="https://jwt.io/" target="_blank" rel="noopener noreferrer">JWT.IO</a> 練習編碼/解碼流程。</li>
      </ul>

      <h3>⚙️ 後端與背景任務（對應 1.1 / core 總務處）</h3>
      <ul>
        <li><strong>DRF（Django REST Framework）：</strong>Django 寫 API 的神器，1.7 提到的「DRF / Django Throttling」就是它的一環——官方文件先卡位：<a href="https://www.django-rest-framework.org/" target="_blank" rel="noopener noreferrer">django-rest-framework.org</a>。</li>
        <li><strong>Celery 排程：</strong>背景任務的進階解法，適合把「寄信、推播通知、清理快取」這種耗時工作丟到佇列排隊慢慢跑——參考：<a href="https://medium.com/@v0220225/backend-%E6%8E%92%E7%A8%8B%E6%8E%92%E8%B5%B7%E4%BE%86-celery-7cd8ca964716" target="_blank" rel="noopener noreferrer">[Backend] 排程排起來 — Celery</a>。</li>
      </ul>

      <h3>🗄️ 資料庫（對應第 5 層）</h3>
      <ul>
        <li><strong>Database Replication（資料庫複寫）：</strong>探討為什麼要做主從複製、優缺點跟實際做法，評估未來讀寫分離的可能性——參考：<a href="https://homuchen.com/posts/what-and-why-database-replication-advantage-and-disadvantage/" target="_blank" rel="noopener noreferrer">[System Design] 淺談 Database Replication</a>。</li>
      </ul>

      <h3>🎨 前端與設計（對應第 4 層）</h3>
      <ul>
        <li><strong>masonry 套件：</strong>瀑布流排版（Pinterest 那種格子牆），之後做商品牆或圖片牆會用到——官方網站：<a href="https://masonry.desandro.com/" target="_blank" rel="noopener noreferrer">masonry.desandro.com</a>。</li>
        <li><strong>Aura Build：</strong>主打用 AI 快速生成漂亮 Landing Page 的平台，研究看看能不能拿來做活動頁或行銷頁。</li>
        <li><strong>名片樣式設計：</strong>收藏的名片排版靈感，之後做個人主頁或電子名片可以參考。</li>
      </ul>

      <p class="post-outro">
        總結來說，整套架構的哲學就是一句話：<strong>每一層只做自己的事——該擋的擋、該存的存、該推的推</strong>。從 Cloudflare 大門、Nginx 櫃檯、Next.js 前台、Django 後台，到 10 個部門分工的資料模型，重點不是用了多潮的技術，而是每個環節都知道自己為什麼站在這裡。這本技術筆記會持續更新，下次見！
      </p>
    `,
  },
  {
    slug: 'cf-pages-pwa-webpush',
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