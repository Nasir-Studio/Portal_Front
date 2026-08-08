export interface Post {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
}

const posts: Post[] = [
  {
    slug: 'windows-experience-freestyle',
    date: '2026.07.26',
    title: '新找到的玩意兒：利用 Win10 重新復刻 WinXP',
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
    title: '新的開始',
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
    title: '學期結束後，收獲的 github 開源工具',
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
];

export default posts;
