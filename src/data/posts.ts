export interface Post {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
}

const posts: Post[] = [
  {
    slug: 'ig-unsend-tool',
    date: '2026.08.17',
    title: '【工具】IG 收回工具 Batch',
    excerpt: 'IG 訊息傳錯人？想要一次收回所有你傳送的訊息？「IG自動訊息收回工具 （Nasir）」讓你批次收回 Instagram 私訊！',
    content: `
      <p class="post-intro">
        不小心傳錯訊息、或是傳了不該傳的內容？「IG自動訊息收回工具 （Nasir）」是一支 Chrome 擴充套件，可以批次收回 Instagram 私訊中「你所傳送」的訊息，不用一隻一隻手動刪！
      </p>

      <h2>📥 程式下載</h2>
      <p>請點選下方連結，直接下載擴充套件 ZIP 檔（下載後請先解壓縮）：</p>
      <p><a class="audit-dl" href="/files/IGUnsend.zip">📥 下載 IGUnsend.zip</a></p>
      <p class="audit-note">下載說明：點擊上方連結後，瀏覽器將直接下載 .zip 壓縮檔。下載後請將其「解壓縮」，再依照下方步驟安裝至 Chrome。</p>

      <h2>功能特色</h2>
      <ul>
        <li><strong>批次收回</strong>：一次收回聊天室中所有你傳送的訊息，不用逐則手動處理。</li>
        <li><strong>安全間隔</strong>：每則訊息之間可設定隨機間隔（最短 2 秒起），避免被 IG 限速或觸發風控。</li>
        <li><strong>即時進度</strong>：擴充視窗即時顯示收回進度與狀態，隨時可以一鍵停止。</li>
        <li><strong>只處理你的訊息</strong>：只會收回你傳送的訊息，完全不會動到對方傳送的內容。</li>
      </ul>

      <h2>安裝步驟說明</h2>

      <h3>步驟一：下載並解壓縮</h3>
      <ul>
        <li>點擊上方 <strong>下載連結</strong>，將 IGUnsend.zip 儲存至您的電腦中，並將其解壓縮成一個資料夾（例如 <code>IGUnsend</code>）。</li>
      </ul>

      <h3>步驟二：開啟 Chrome 擴充功能頁面</h3>
      <ul>
        <li>在 Chrome 網址列輸入 <code>chrome://extensions</code> 並按下 Enter。</li>
        <li>開啟右上角的 <strong>「開發人員模式」</strong> (Developer mode) 開關。</li>
      </ul>

      <h3>步驟三：載入未封裝擴充功能</h3>
      <ul>
        <li>點擊左上角 <strong>「載入未封裝功能」</strong> (Load unpacked) 按鈕。</li>
        <li>選擇剛才解壓縮出來的 <code>IGUnsend</code> 資料夾，即可完成安裝。</li>
        <li>安裝完成後，瀏覽器工具列會出現 🐑 小羊圖示。</li>
      </ul>

      <h2>使用方式</h2>
      <ul>
        <li>先開啟 Instagram 的 <strong>私訊聊天室</strong>。</li>
        <li>點擊工具列的小羊圖示，開啟擴充視窗。</li>
        <li>設定每則訊息的 <strong>收回間隔</strong>（建議維持預設 3–7 秒）。</li>
        <li>點擊 <strong>「開始收回」</strong>，擴充就會批次收回你在這個聊天室傳送的訊息。</li>
      </ul>
      <p class="audit-tip">提醒：收回訊息後，雙方都看不到這則訊息，也無法還原，請確定真的要收回再執行！</p>
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