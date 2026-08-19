export interface Announcement {
  slug: string;
  date: string;
  title: string;
  content: string;
}

const announcements: Announcement[] = [
  {
    slug: 'portal-launch',
    date: '2026.08.08',
    title: '【公告】OviNas 正式啟用',
    content:
      '歡迎來到 OviNas！這個名字的由來：因為我的綽號叫小羊（Ovis 是羊的拉丁文），結合我的名字 Nasir，組合成 OviNas。那這個網站以後將會是發布公告、預約、部落格等入口系統，歡迎多多善用並留意是否有發布新訊息喔！',
  },
  {
    slug: 'a-new-beginning',
    date: '2026.07.01',
    title: '【公告】新的開始',
    content:
      '決定用這個 Repo 來記錄自己的每一天，像是一本專屬的日記本。\n\n也即將要邁入大三了，我覺得大學生活也即將過半了，在大學的這兩年下來，除了一方面是自己搬出來臺北北漂住，然後生存，課業方面，當然有擅長的跟非常不擅長的（像是數學 XD）而日常生活中除了讀書，我也覺得北部很有趣，在大學期間這兩年去了蠻多地方，也體驗蠻多事物，但偶爾也是會思考，我大學到底做了什麼，有沒有把時間效率最大化，這個日記本，我覺得我會把無論是我的小專案、還是我的心情還是我的一些正在學習的東西，放上來，並且督促自己！讓自己越來越進步，不要讓大學生活渾渾噩噩跑掉了！\n\n那為什麼叫做 OviNas 呢 ？ 這個名字的由來：因為我的綽號叫小羊（Ovis 是羊的拉丁文），結合我的名字 Nasir，組合成 OviNas XDXD\n\n這個也是 Nasir 我的第一篇開頭！',
  },
];

export default announcements;
