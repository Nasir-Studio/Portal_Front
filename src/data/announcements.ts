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
    title: '【公告】羊家的入口網正式啟用',
    content:
      '歡迎來到羊家，為什麼叫羊家呢，因為我的綽號叫小羊，所以叫羊家XD 那這個網站以後將會是發布公告、預約、部落格等入口系統，歡迎多多善用並留意是否有發布新訊息喔！',
  },
];

export default announcements;
