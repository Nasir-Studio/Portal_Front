import type { Program } from '$ntub/types';

/** 社群媒體行銷微學程 */
export const socialMediaMarketing: Program = {
	id: 'social-media-marketing',
	name: '社群媒體行銷微學程',
	nameEn: 'Social Media Marketing Micro Program',
	kind: '微學程',
	college: '創新設計與經營學院',
	planningUnit: '創新設計與經營學院',
	participatingUnits: ['商業設計管理系', '數位多媒體設計系', '創意科技與產品設計系'],
	purpose:
		'社群媒體已成為近年來最重要的網路行銷工具，如何善用社群媒體的設計結合網路進行品牌行銷、創新創業是身為新世代的年輕人都需要具備的素養與能力。本微學程主要培養學生具有品牌經營與創新的思維，並具備設計及運用社群媒體進行行銷的能力。',
	eligibility: '本校大學部（四技學制、二技學制）可申請修讀本學程。',
	procedure: [
		'學生於學校公告期程內至本校「學分學程系統」線上申請修習。',
		'學生修畢本學程課程學分者，於取得原系所組畢業資格後，須自學分學程系統下載「學分學程/微學程審核表」並檢附歷年成績單正本乙份，經原系所組主任同意簽章後，送至本學程辦公室辦理，發給學程證明書。',
		'所修課程若有先修課程擋修之規定，學生須自行修讀先修課程，以符合各系所組選課之要求。課程修習與學分抵免認定事宜，悉由本學程辦公室辦理。',
		'修讀本學程之學生若中途因故無法繼續修習，需填寫「終止修習學程申請書」，經原系所組主任簽章後，送至本學程辦公室辦理，終止其修習資格。',
		'修讀本學程學生，若已符合原系所組畢業資格而尚未修滿學程規定之科目與學分，得檢具相關證明，向教務處申請延長修業年限。'
	],
	requirement: {
		total: 12,
		crossDept: true,
		core: '含核心課程；進階課程應至少跨系修習一門課程',
		detail: '欲取得本學程證明之學生，應至少修畢 12 學分（含核心課程），進階課程應至少跨系修習一門課程，且課程名稱及內容相同之科目，不得重複計算。'
	},
	courses: [
		// 核心課程
		{ id: 'sm-1', name: '設計思考', group: null, groupNote: null, category: 'core', required: true, credits: 3, hours: 3, unit: '創新設計與經營學院' },
		// 進階課程
		{ id: 'sm-2', name: '行銷策略規劃', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '商業設計管理系' },
		{ id: 'sm-3', name: '數位增長', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '商業設計管理系' },
		{ id: 'sm-4', name: '品牌整合實務設計', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '商業設計管理系' },
		{ id: 'sm-5', name: '創新創業新思維', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '商業設計管理系' },
		{ id: 'sm-6', name: '影片後製作', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '數位多媒體設計系' },
		{ id: 'sm-7', name: '音樂音效剪輯', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '數位多媒體設計系' },
		{ id: 'sm-8', name: '虛擬網紅製作與商業應用', group: '虛擬人二擇一', groupNote: '虛擬網紅製作與商業應用、3D 虛擬人與動作捕捉兩門僅准予擇一門選修', category: 'advanced', required: false, credits: 3, hours: 3, unit: '數位多媒體設計系' },
		{ id: 'sm-9', name: '3D 虛擬人與動作捕捉', group: '虛擬人二擇一', groupNote: '虛擬網紅製作與商業應用、3D 虛擬人與動作捕捉兩門僅准予擇一門選修（新增）', category: 'advanced', required: false, credits: 3, hours: 3, unit: '數位多媒體設計系' },
		{ id: 'sm-10', name: '動態圖像設計', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '數位多媒體設計系' },
		{ id: 'sm-11', name: '品牌設計與行銷', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '創意科技與產品設計系' },
		{ id: 'sm-12', name: '創意科技程式應用', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '創意科技與產品設計系' },
		{ id: 'sm-13', name: '故事行銷與表達', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '創意科技與產品設計系' },
		{ id: 'sm-14', name: '互動數位敘事', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '創意科技與產品設計系' }
	],
	notes: [
		'進階課程應至少跨系修習一門課程。',
		'虛擬網紅製作與商業應用與 3D 虛擬人與動作捕捉此兩門課程僅准予擇一門選修。',
		'依本校「學分學程設置辦法」第十一條第一款規定：113學年度（含）以後入學之四技日間部學生，在學期間應至少選讀一門學程（含微學程）。'
	],
	lastUpdated: '115年01月07日（114學年度第1學期第02次教務會議通過）'
};
