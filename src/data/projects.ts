export interface Project {
  name: string;
  desc: string;
  href: string;
}

const projects: Project[] = [
  {
    name: '【雙北捷運】捷運章集戳',
    desc: '收集台北捷運與新北捷運的紀念章',
    href: '/badges/',
  },
  {
    name: '【專案工具】NYTools',
    desc: 'P2P 工具集 — 檔案傳輸、螢幕投影',
    href: '/nytools/',
  },
  {
    name: '【專案工具】VOC 單字測驗',
    desc: 'TOEIC 背單字刷題，支援多種題型',
    href: '/vocab/',
  },
];

export default projects;
