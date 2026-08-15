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
];

export default announcements;
