export interface Announcement {
  date: string;
  title: string;
  content: string;
}

// 公告資料：以後新增公告就在這裡加一筆
const announcements: Announcement[] = [
  {
    date: '2026.08.08',
    title: '羊家的入口網正式啟用',
    content:
      '歡迎蒞臨羊家的入口。今後所有羊家服務，都將由這扇門進入。若有任何問題，歡迎隨時回到入口找羊。',
  },
];

export default announcements;
