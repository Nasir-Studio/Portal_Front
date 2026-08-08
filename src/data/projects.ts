export interface Project {
  name: string;
  desc: string;
  href: string;
}

const projects: Project[] = [
  {
    name: 'NYTools',
    desc: 'P2P 即時工具集 — 客服排隊、檔案傳輸、點播、投影',
    href: '/nytools/',
  },
  {
    name: 'VOC 單字測驗',
    desc: 'TOEIC 背單字刷題，支援多種題型',
    href: '/vocab/',
  },
];

export default projects;
