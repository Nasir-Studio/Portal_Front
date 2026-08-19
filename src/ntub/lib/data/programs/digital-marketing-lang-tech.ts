import type { Program } from '$ntub/types';

export const digitalMarketingLangTech: Program = {
	id: 'digital-marketing-lang-tech',
	name: '數位行銷與語言科技應用微學程',
	nameEn: 'Digital Marketing and Language Technology Applications Micro Program',
	kind: '微學程',
	college: '國際行銷學院',
	planningUnit: '國際行銷學院',
	participatingUnits: ['國際商務系', '應用外語系'],
	purpose:
		'為培育具備數位科技素養與實務應用能力的跨領域專業人才，國際行銷學院整合應用外語系與國際商務系資源，開設此微學程。本學程透過涵蓋程式設計、多媒體製作、數位行銷與 AI 應用等課程，使學生具備運用數位工具解決實務問題的能力，強化未來職場的數位競爭力與跨域溝通協作能力。',
	eligibility: '本校大學部（四技學制、二技學制）可申請修讀本學程。',
	procedure: [
		'學生於學校公告期程內至本校「學分學程系統」線上申請修習。',
		'學生修畢本學程課程學分者，於取得原系所組畢業資格後，須自學分學程系統下載「學分學程/微學程審核表」並檢附歷年成績單正本乙份，經原系所組主任同意簽章後，送至本院辦公室辦理，由本院發給學程證明書。',
		'所修課程若有先修課程擋修之規定，學生須自行修讀先修課程，以符合各系所組選課之要求。課程修習與學分抵免認定事宜，悉由本院辦公室辦理。',
		'修讀本學程之學生若中途因故無法繼續修習，需填寫「終止修習學程申請書」，經原系所組主任簽章後，送至本院辦公室辦理，終止其修習資格。',
		'修讀本學程學生，若已符合原系所組畢業資格而尚未修滿學程規定之科目與學分，得檢具相關證明，向教務處申請延長修業年限。'
	],
	requirement: {
		total: 8,
		crossDept: true,
		core: '核心課程二擇一，至少修習 2 學分，採認 2 學分；進階課程至少修習 6 學分，採認 6 學分',
		detail: '欲取得本學程證明之學生，應至少修畢 8 學分，核心課程二擇一，至少修習 2 學分，採認 2 學分；進階課程至少修習 6 學分，採認 6 學分。課程名稱及內容相同之科目，不得重複修習，應至少修習跨系一門課程。'
	},
	courses: [

		{ id: 'dl-1', name: '數位行銷', group: '核心二擇一', groupNote: '核心課程二擇一，至少修習 2 學分', category: 'core', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'dl-2', name: '網路行銷', group: '核心二擇一', groupNote: '核心課程二擇一，至少修習 2 學分', category: 'core', required: false, credits: 2, hours: 2, unit: '應用外語系' },

		{ id: 'dl-3', name: '基礎程式設計', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'dl-4', name: '程式設計', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '國際商務系' },
		{ id: 'dl-5', name: '數位教材與教法', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'dl-6', name: 'AI與法律翻譯 / AI輔助法律翻譯入門', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'dl-7', name: 'AI 輔助文化與社會探究', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'dl-8', name: '電腦多媒體設計', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'dl-9', name: '網頁與多媒體製作', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'dl-10', name: '多媒體製作與中英文簡報技巧', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'dl-11', name: '貿易資訊與通關自動化', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'dl-12', name: '跨境電子商務', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'dl-13', name: '人工智慧(上)/(下)', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系' }
	],
	notes: [
		'進階課程至少修習 6 學分，採認 6 學分。',
		'依本校「學分學程設置辦法」第十一條第一款規定：113學年度（含）以後入學之四技日間部學生，在學期間應至少選讀一門學程（含微學程）。'
	],
	lastUpdated: '114年10月27日（114學年度第1學期第01次教務會議通過）'
};
