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
    title: '【系統資安】資安研究報告',
    excerpt: '整理三份資安規範檔：CVSS v4.0 滲透分級、OWASP/CWE 標準、九種攻擊手法特徵矩陣、風險日誌 Schema 與 AI 自動化防禦，附白話解說與檢查重點！',
    content: `
      <p class="post-intro">
        這篇是「系統資安」系列的第一份研究報告：我把下載資料夾裡的三份資安規範檔——<strong>企業級全端資安規範、巨型架構資安規範、資安系統滲透指數與風險日誌標準規範</strong>——全部濃縮成一份白話文筆記。三份其實是同一套主題（滲透指數分級 + 風險日誌標準）的不同版本，重點全部併在一起，每一段都附上<strong>檢查重點</strong>！
      </p>

      <h2>起：這三份文件到底在講什麼？</h2>
      <p>
        簡單說，這三份文件在回答一個問題：<strong>「當駭客打你的網站時，你怎麼知道事情有多嚴重？要記錄什麼？又要怎麼自動反應？」</strong>
      </p>
      <p>
        答案分三步：先用 <strong>CVSS v4.0</strong> 算嚴重度分級，再用 <strong>OWASP / CWE</strong> 幫漏洞貼上「身分證標籤」，最後把所有線索寫成<strong>結構化風險日誌</strong>，交給 AI Agent 自動處置。下面一節一節講。
      </p>

      <h2>一、滲透指數分級：先算「事情有多嚴重」（CVSS v4.0）</h2>
      <p>
        CVSS 是國際通用的漏洞評分系統，分數 <code>0.0 ~ 10.0</code>，越高越嚴重。分級邏輯白話版：
      </p>
      <ul>
        <li><strong>CRITICAL 嚴重（9.0 – 10.0）：</strong>最慘的情況。例如後端被遠端代碼執行（RCE）、SQL 注入直接拿到 <code>superuser</code> 最高權限、或伺服器端環境變數（資料庫密碼、AWS 金鑰）被整包偷走。<br><strong>檢查重點：</strong>看到這級立刻斷線、封 IP 網段、銷毀 token/session，觸發 P1 特急告警（簡訊 + 即時通訊 + Email 群發）。</li>
        <li><strong>HIGH 高（7.0 – 8.9）：</strong>很嚴重。例如沒登入就能直接呼叫改資料的 API（Server Actions 越權）、儲存型 XSS 偷走管理員 Session。<br><strong>檢查重點：</strong>24 小時內必修：凍結攻擊帳號、強制登出所有裝置、API 閘道加臨時 Rate Limiting、自動開修補工單（附 Payload 證據）。</li>
        <li><strong>MEDIUM 中（4.0 – 6.9）：</strong>有風險但還能撐。例如後端 <code>DEBUG=False</code> 沒設好、把完整 Python 報錯 Traceback 噴給外人看；或 CORS Policy 沒設好，別人的網站能讀你的敏感資料。<br><strong>檢查重點：</strong>排進下一個 Sprint 修，並對該路徑做長期行為分析，看有沒有進一步提權的嘗試。</li>
        <li><strong>LOW 低（0.1 – 3.9）：</strong>小擦傷。例如靜態頁面原始碼不小心暴露了內部測試網址、回應標頭洩漏 <code>Server: WSGI / gunicorn</code> 版本資訊。<br><strong>檢查重點：</strong>記到月度資安健檢報告，下次 CI/CD 部署順手修掉。</li>
      </ul>

      <h2>二、漏洞身分證：OWASP 跟 CWE 是幹嘛的？</h2>
      <ul>
        <li><strong>OWASP Top 10：</strong>網頁應用程式最常見的十種風險排行榜，是網頁端防禦的主幹標準。</li>
        <li><strong>OWASP Top 10 API Security：</strong>前後端分離架構專用，專門防 API 等級的漏洞（例如物件層級越權 BOLA / IDOR）。</li>
        <li><strong>CWE（通用弱點列舉）：</strong>弱點的「身分證字號」——<code>CWE-89</code> = SQL 注入、<code>CWE-79</code> = XSS，一目瞭然。<br><strong>檢查重點：</strong>每一筆風險日誌都要寫上 OWASP 代碼 + CWE 編號，AI 才能精準判斷漏洞根因。</li>
      </ul>

      <h2>三、全端攻擊特徵矩陣：常見攻擊手法白話總覽（含檢查重點）</h2>
      <p>三份文件加起來共整理出九種常見攻擊手法，分成三個層面來看：</p>

      <h3>前端層（瀏覽器 / SSR）</h3>
      <ul>
        <li><strong>XSS 跨站指令碼（CWE-79）：</strong>駭客把惡意 JavaScript 塞進你的網頁，讓瀏覽器幫他執行。分「儲存型」（留言存進資料庫，之後每個人看都中獎）、「反射型」跟「DOM 型」。<br><strong>檢查重點：</strong>監聽 <code>window.onerror</code> 報出非白名單網域的 Script 載入路徑，或 CSP 日誌出現 <code>violated-directive: script-src</code>。</li>
        <li><strong>客戶端 Session 劫持（A07）：</strong>存在 <code>localStorage</code> / <code>sessionStorage</code> 的 Token，被異常的編碼腳本讀走。<br><strong>檢查重點：</strong>偵測敏感 Token 在短時間內被非預期腳本讀取的行為。</li>
      </ul>

      <h3>後端層（API / 資料庫）</h3>
      <ul>
        <li><strong>SQL Injection（CWE-89）：</strong>在輸入框塞 SQL 語法，讓資料庫執行壞人的指令，盲注跟報錯注入都算。<br><strong>檢查重點：</strong>請求參數出現 <code>'</code>、<code>--</code>、<code>UNION SELECT</code> 等特徵字串，加上 Django 噴出 <code>ProgrammingError</code> / <code>OperationalError</code>。</li>
        <li><strong>BOLA / Mass Assignment（CWE-915）：</strong>改 API 請求的欄位來「大量指派」權限，例如 Payload 塞 <code>"is_superuser": true</code> 或 <code>"role": "admin"</code>。<br><strong>檢查重點：</strong>PATCH/PUT 請求的 Payload 出現未對外開放的權限欄位，或改了 Object ID（<code>?user_id=99</code>）但 Token 身分不符（IDOR）。</li>
        <li><strong>SSRF 伺服器端請求偽造（A10）：</strong>後端程式被騙去連「不該連的地方」，例如內部迴圈位址 <code>127.0.0.1</code> 或內網網段 <code>10.0.0.0/8</code>。<br><strong>檢查重點：</strong>後端對外請求模組（如 cURL）的目標出現內網 IP。</li>
      </ul>

      <h3>全端混合層（Node.js ↔ Django 跨層攻擊）</h3>
      <ul>
        <li><strong>Next.js Server Actions 越權邏輯繞過（CWE-285）：</strong>沒登入的人直接 POST 呼叫內部路由去改資料。<br><strong>檢查重點：</strong>POST 直接打 <code>_next/data</code> 內部路由、Headers 缺 CSRF Token、或 JWT 權限跟呼叫的函數不符。</li>
        <li><strong>WebFolding（HTTP 請求走私，CWE-444）：</strong>利用 <code>Transfer-Encoding: chunked</code> 跟 <code>Content-Length</code> 同時出現（TE.CL / CL.TE 衝突），把惡意請求「折疊」在正常請求後面，繞過前面的代理直接打後端。<br><strong>檢查重點：</strong>單一 TCP 連線中兩個 Header 同時出現、或收到非預期的 <code>\\r\\n\\r\\n</code> 折疊斷行符。</li>
        <li><strong>GraphQL Batch Folding（CWE-770）：</strong>單一個請求裡塞數千個巢狀查詢（Batching 或大量重複 <code>alias</code>），把後端 API 癱瘓並暴力枚舉。<br><strong>檢查重點：</strong>單一請求含大量重複 <code>alias</code> 欄位或 JSON 陣列形式的複數查詢。</li>
        <li><strong>JWT 簽章偽造 / Key 混淆（CWE-347）：</strong>把 JWT 的 <code>alg</code> 改成 <code>"none"</code> 騙過驗證，或拿公開金鑰當對稱 HMAC 密鑰簽章。<br><strong>檢查重點：</strong>收到 <code>"alg": "none"</code> 的 Token、或簽章算法被換成非預期類型。</li>
      </ul>

      <h2>四、風險日誌長什麼樣？標準欄位白話解說（JSON Schema）</h2>
      <p>不管哪一層出事，日誌都要寫成同一種「標準格式」，AI 才能自動分析。白話版欄位解說：</p>
      <ul>
        <li><strong>trace_id：</strong>全系統唯一追蹤碼，前端、後端的日誌靠它串成一條線（分散式追蹤）。<br><strong>檢查重點：</strong>一筆請求從頭到尾 trace_id 要一致，缺了它線索就斷了。</li>
        <li><strong>timestamp / environment：</strong>事件時間（ISO 8601）+ 環境標籤：<code>PRODUCTION</code> / <code>STAGING</code> / <code>DEVELOPMENT</code> / <code>PEN_TEST_SANDBOX</code>。</li>
        <li><strong>architecture_layer / framework_context：</strong>出事在哪一層（邊緣網路 / 瀏覽器 / SSR / 後端 API / 資料庫）+ 哪個框架（Next.js / Astro / Django…）跟哪個檔案（<code>views.py</code>、<code>SubmitButton.astro</code>…）。</li>
        <li><strong>vulnerability_metadata：</strong>漏洞身分證：OWASP 代碼 + CWE 編號 + 漏洞名稱。</li>
        <li><strong>penetration_index：</strong>CVSS v4.0 分數 + 等級（CRITICAL/HIGH/MEDIUM/LOW/INFO）+ 可利用難易度（有沒有現成工具）。</li>
        <li><strong>http_context：</strong>出事的請求長相：網址、方法、來源 IP、User-Agent、攔截到的 Payload；進階版還會記錄「Header 折疊異常」跟「批次數量 batch_count」。</li>
        <li><strong>execution_status：</strong>最後結果四選一：<code>VULNERABILITY_EXPLOITED</code>（被打穿了）/ <code>ATTACK_BLOCKED_BY_WAF</code>（被擋下）/ <code>EXCEPTION_THROWN</code>（系統噴錯）/ <code>PROBING_REJECTED</code>（踩點被拒）。</li>
        <li><strong>evidence_payload：</strong>佐證證據：完整 Stack Trace、被污染的實際 SQL 語法、回應狀態碼。</li>
      </ul>

      <h2>五、AI Agent 自動化防禦：從「被動記錄」到「主動反擊」</h2>
      <p>這份規範最特別的地方：不只教你記錄，還設計了「自動處置劇本」——依照嚴重度分級，AI 直接動手處理：</p>
      <ul>
        <li><strong>CRITICAL：</strong>自動在 WAF / 邊緣網路封鎖惡意 IP 網段、在快取（Redis）全面銷毀被污染的 Token/Session、觸發 P1 特急告警。</li>
        <li><strong>HIGH：</strong>自動凍結攻擊帳號並強制登出所有裝置、API 閘道動態加嚴 Rate Limiting、自動開 GitHub / Jira 修補工單（附 Payload 證據）。</li>
        <li><strong>MEDIUM：</strong>記入漏洞修補清單、AI 提高該路徑的審查權限做長期行為分析，觀察是否有提權嘗試。</li>
        <li><strong>LOW：</strong>寫進月度健檢報告，下次 CI/CD 部署時自動修正。</li>
      </ul>

      <p class="post-outro">
        這份研究報告把三份規範的完整重點濃縮成一篇。之後實際拿工具測漏洞、或把日誌接上自動化平台時，再回來補實作筆記。系統資安系列，未完待續！
      </p>
    `,
  },
  {
    slug: 'tech-notes-architecture',
    category: 'tech',
    date: '2026.08.19',
    title: '【技術文章】技術筆記本',
    excerpt: '白話拆解現代網站系統架構：從 Cloudflare 第一道防線、Nginx 到 Django 技術棧，再到模組化設計，一篇看懂所有設計重點！',
    content: `
      <p class="post-intro">
        這篇是我的「技術筆記本」第一集：把整套系統的架構設計，從外到內、從選型到模組，全部用白話文整理一遍。講給未來的自己聽，也講給正在看這篇的你聽！
      </p>

      <h2>起：為什麼會有這本筆記？</h2>
      <p>
        每次架系統，最怕的就是「做完就忘」。所以我把一套現代網站系統常見的架構畫成一張圖、拆成一張表，然後用這篇筆記記錄下來。這本筆記不綁定任何特定平台，重點是那些<strong>「不管做什麼專案都用得到」的設計邏輯</strong>。
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
        <li><strong>Cloudflare R2：</strong>相容 S3 的分散式物件儲存，專門放使用者上傳的圖片、檔案這類媒體資產。</li>
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
        <li><strong>Django Cache：</strong>快取抽象層，實際用於 <code>core/rate_limit.py</code> 等頻率限制模組，專門暫存頻率限制的計數器。</li>
      </ul>

      <h3>1.3 認證 / 授權（Authentication & Authorization）</h3>
      <ul>
        <li><strong>自訂 JWT（HS256）：</strong>核發跟解讀內部 API 呼叫用的 <code>app_token</code>，採用 HS256 安全雜湊演算法簽章。</li>
        <li><strong>PyJWT + cryptography：</strong>PyJWT 負責 Token 的 Encode/Decode，cryptography 是底層加密庫，確保簽章不會被偽造。</li>
        <li><strong>django-allauth：</strong>整合第三方登入，這裡專門接 <strong>Google OAuth</strong>。</li>
        <li><strong>Custom User Model：</strong>自訂使用者模型，擴充欄位存 <code>auth_provider: google_sub</code>（Google 唯一識別碼）跟 <code>identity_type</code>。</li>
        <li><strong>Custom Auth Adapter：</strong>自訂認證配接器，實作<strong>信箱網域限制</strong>——例如只允許特定組織/學校信箱註冊登入，還加了白名單機制。舉例：不在名單內的信箱想進來？直接被擋在門外。</li>
        <li><strong>Django Auth Backend：</strong>管理員登入 Django Admin 後台用的認證系統。</li>
        <li><strong>CSRF Protection + CORS Headers：</strong>一個防跨站請求偽造，保護敏感寫入操作；<code>django-cors-headers</code> 負責跨域設定，讓獨立部署的 Next.js 前端可以合法打 Django API。</li>
      </ul>

      <h3>1.4 圖片處理 / 儲存（Image Processing & Storage）</h3>
      <ul>
        <li><strong>Cloudflare R2（S3-compatible）：</strong>放使用者上傳的圖片跟媒體檔案，自帶 CDN 節點。</li>
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
        <li><strong> 待研究（TensorFlow 內容審核）：</strong>除了圖片 NSFW 過濾，<a href="https://www.tensorflow.org/?hl=zh-tw" target="_blank" rel="noopener noreferrer">TensorFlow</a> 也能用 AI 審核<strong>文字內容</strong>或<strong>影音內容</strong>！先把官方網站收藏起來，等我研究完再補一篇實作筆記。</li>
      </ul>

      <h3>1.7 多層流量限制與防濫用（Multi-layer Rate Limiting）</h3>
      <p>防濫用不是只靠一道牆，而是三道關卡層層過濾：</p>
      <ul>
        <li><strong>第一層：Cloudflare WAF / Rate Limit —</strong>在網路邊緣直接阻斷自動化黑客工具、惡意 Web Fuzzing 掃描跟異常高頻的 DDoS 流量。</li>
        <li><strong>第二層：Nginx limit_req —</strong>伺服器入口的漏桶（Leaky Bucket）緩衝（緩衝區大小 425），重點保護 API、Auth（登入驗證）跟 Admin（後台）等高風險端點，防止暴力破解密碼。</li>
        <li><strong>第三層：DRF / Django Throttling —</strong>應用層的細粒度限制，針對登入、一般查詢、NSFW 圖片檢測、發表文章等不同行為，各自設定獨立的頻率阻斷閥值。</li>
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

      <h2>合：模組化設計——把系統拆成能分工的部門</h2>
      <p>
        最後聊資料模型設計的大原則：大系統最忌諱「一坨程式碼」走到底，所以會把 Django ORM 模型依<strong>業務邊界</strong>拆成多個獨立 App（模組），每個 App 就像公司裡的一個部門——身份驗證一間、內容管理一間、通知一間、聊天一間……各自管各自的事，<strong>改 A 不會炸 B，壞了也好修</strong>。
      </p>
      <p>拆模組時有幾條實務原則可以參考：</p>
      <ul>
        <li><strong>依業務邊界切：</strong>帳號、內容、交易、通知彼此獨立，不要貪方便全塞進一支大程式，之後維護會哭出來。</li>
        <li><strong>介面穩定好替換：</strong>每個模組的介面（API）固定下來後，未來想換套件、換服務，都只動一小塊，不會牽一髮動全身。</li>
        <li><strong>圖拆小張：</strong>模型一多，設計圖就拆成多張子圖，一張圖只畫重點，才不會複雜到沒人看得懂。</li>
        <li><strong>背景任務集中管理：</strong>清理快取、定時重算這類雜事，統一丟給一個核心模組排程，全系統日誌也集中在這裡查。</li>
      </ul>

      <h2>附錄：每天多學一點（待研究清單）</h2>
      <p>
        看完整篇架構後，其實還有一串「已經用到、但還沒研究透」跟「未來想引入」的主題。我把它們整理成待研究清單，按照對應的章節分門別類，研究完一篇就補一篇筆記：
      </p>

      <h3>認證與授權（對應 1.3）</h3>
      <ul>
        <li><strong>JWT 是什麼：</strong>專案已經在用自訂 JWT（HS256），但原理還是要徹底搞懂——<a href="https://jwt.io/" target="_blank" rel="noopener noreferrer">JWT.IO</a> 有互動式解說，還可以直接把 token 丟上去轉碼看內容。</li>
        <li><strong>自訂 JWT：</strong>1.3 提到的 <code>app_token</code> 就是自訂 JWT 的實作，動手之前先用 <a href="https://jwt.io/" target="_blank" rel="noopener noreferrer">JWT.IO</a> 練習編碼/解碼流程。</li>
      </ul>

      <h3>後端與背景任務（對應 1.1 / core 總務處）</h3>
      <ul>
        <li><strong>DRF（Django REST Framework）：</strong>Django 寫 API 的神器，1.7 提到的「DRF / Django Throttling」就是它的一環——官方文件先卡位：<a href="https://www.django-rest-framework.org/" target="_blank" rel="noopener noreferrer">django-rest-framework.org</a>。</li>
        <li><strong>Celery 排程：</strong>背景任務的進階解法，適合把「寄信、推播通知、清理快取」這種耗時工作丟到佇列排隊慢慢跑——參考：<a href="https://medium.com/@v0220225/backend-%E6%8E%92%E7%A8%8B%E6%8E%92%E8%B5%B7%E4%BE%86-celery-7cd8ca964716" target="_blank" rel="noopener noreferrer">[Backend] 排程排起來 — Celery</a>。</li>
      </ul>

      <h3>資料庫（對應第 5 層）</h3>
      <ul>
        <li><strong>Database Replication（資料庫複寫）：</strong>探討為什麼要做主從複製、優缺點跟實際做法，評估未來讀寫分離的可能性——參考：<a href="https://homuchen.com/posts/what-and-why-database-replication-advantage-and-disadvantage/" target="_blank" rel="noopener noreferrer">[System Design] 淺談 Database Replication</a>。</li>
      </ul>

      <h3>前端與設計（對應第 4 層）</h3>
      <ul>
        <li><strong>masonry 套件：</strong>瀑布流排版（Pinterest 那種格子牆），之後做圖片牆或相簿頁會用到——官方網站：<a href="https://masonry.desandro.com/" target="_blank" rel="noopener noreferrer">masonry.desandro.com</a>。</li>
        <li><strong>Aura Build：</strong>主打用 AI 快速生成漂亮 Landing Page 的平台，研究看看能不能拿來做活動頁或行銷頁。</li>
        <li><strong>名片樣式設計：</strong>收藏的名片排版靈感，之後做個人主頁或電子名片可以參考。</li>
      </ul>

      <p class="post-outro">
        總結來說，整套架構的哲學就是一句話：<strong>每一層只做自己的事——該擋的擋、該存的存、該推的推</strong>。從 Cloudflare 大門、Nginx 櫃檯、Next.js 前台、Django 後台，到模組化分工的資料設計，重點不是用了多潮的技術，而是每個環節都知道自己為什麼站在這裡。這本技術筆記會持續更新，下次見！
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
    slug: 'ntub-credit-program',
    category: 'tech',
    date: '2026.08.19',
    title: '【工具】NTUB學分學程查詢及預算學分',
    excerpt: 'NTUB 學分學程簡章與學分勾選，一站查詢各學分學程的設置要點與計畫書內容。',
    content: `
      <p class="post-intro">
        為了方便查閱 NTUB 各學分學程與微學程的設置要點暨計畫書內容，特別整理了這支「學分學程查詢及預算學分」工具！
      </p>

      <h2>工具介紹</h2>
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

      <h2>工具下載</h2>
      <p><a class="audit-dl" href="/files/IGUnsend.zip"> 下載 IGUnsend.zip</a></p>
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

      <h2>1. AI Agent 擴充、Skill 與 API</h2>
      <p>這裡蒐集了許多實用的 AI Agent 擴充、Skill 腳本與 API 整合專案（大部分可用於 Opencode 或各類自動化工作流）：</p>
      <ul>
        <li><strong>caveman</strong>：極簡純粹的 AI Agent 執行環境 <a href="https://github.com/JuliusBrussee/caveman" target="_blank" rel="noopener noreferrer">https://github.com/JuliusBrussee/caveman</a></li>
        <li><strong>taste-skill</strong>：高品味 UI/UX 與代碼審查技能包 <a href="https://github.com/Leonxlnx/taste-skill" target="_blank" rel="noopener noreferrer">https://github.com/Leonxlnx/taste-skill</a></li>
        <li><strong>OmniRoute</strong>：多模型與多端點智能路由分發器 <a href="https://github.com/diegosouzapw/OmniRoute" target="_blank" rel="noopener noreferrer">https://github.com/diegosouzapw/OmniRoute</a></li>
        <li><strong>graphiti</strong>：為 AI Agent 構建時間感知動態知識圖譜 <a href="https://github.com/getzep/graphiti" target="_blank" rel="noopener noreferrer">https://github.com/getzep/graphiti</a></li>
        <li><strong>deer-flow</strong>：字節跳動開源的輕量工作流引擎 <a href="https://github.com/bytedance/deer-flow" target="_blank" rel="noopener noreferrer">https://github.com/bytedance/deer-flow</a></li>
        <li><strong>kilocode</strong>：現代化代碼生成與重構輔助工具 <a href="https://github.com/Kilo-Org/kilocode" target="_blank" rel="noopener noreferrer">https://github.com/Kilo-Org/kilocode</a></li>
        <li><strong>codeg</strong>：命令列極速代碼產生器 <a href="https://github.com/xintaofei/codeg" target="_blank" rel="noopener noreferrer">https://github.com/xintaofei/codeg</a></li>
        <li><strong>Wegent</strong>：協同式多 Agent 團隊開發框架 <a href="https://github.com/wecode-ai/Wegent" target="_blank" rel="noopener noreferrer">https://github.com/wecode-ai/Wegent</a></li>
        <li><strong>oh-my-opencode</strong>：開箱即用的 Opencode 增強擴充套件庫 <a href="https://github.com/opensoft/oh-my-opencode" target="_blank" rel="noopener noreferrer">https://github.com/opensoft/oh-my-opencode</a></li>
        <li><strong>notebooklm-skill</strong>：整合 Google NotebookLM 知識萃取能力的專屬技能 <a href="https://github.com/claude-world/notebooklm-skill" target="_blank" rel="noopener noreferrer">https://github.com/claude-world/notebooklm-skill</a></li>
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