export interface Project {
  name: string;
  desc: string;
  href: string;
}

const projects: Project[] = [
  {
    name: '【小專案】NYTools',
    desc: 'P2P 工具集 — 檔案傳輸、螢幕投影',
    href: '/nytools/',
  },
  {
    name: '【小專案】VOC 單字測驗',
    desc: 'TOEIC 背單字刷題，支援多種題型',
    href: '/vocab/',
  },
];

export default projects;
