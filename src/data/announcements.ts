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
    title: '羊家的入口網正式啟用',
    content:
      '歡迎蒞臨羊家的入口。今後所有羊家服務，都將由這扇門進入。若有任何問題，歡迎隨時回到入口找羊。',
  },
];

export default announcements;
