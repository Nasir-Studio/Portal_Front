import type { Program } from '$ntub/types';

/** 外語與商務學分學程 */
export const foreignBusiness: Program = {
	id: 'foreign-business',
	name: '外語與商務學分學程',
	nameEn: 'Foreign Languages and Business Credit Program',
	kind: '學分學程',
	college: '國際行銷學院',
	planningUnit: '國際商務系、應用外語系',
	participatingUnits: ['國際商務系', '應用外語系'],
	purpose:
		'因應全球經濟發展重要動能，產業對外語與國際商務專業人才需求日增，特設置「外語與商務學分學程」。本學分學程結合理論與實務課程，培養學生具備外語實務能力、國際商務管理專業素養。藉由跨領域學習，提升學生就業競爭力，拓展多元職涯發展，達成畢業即就業之目標。',
	eligibility: '本校大學部學生皆可申請修讀本學分學程。',
	procedure: [
		'學生於學校公告期程內至本校「學分學程系統」線上申請修習。',
		'學生修畢本學分學程課程學分者，於取得原系所組畢業資格後，須自學分學程系統下載「學分學程/微學程審核表」並檢附歷年成績單正本乙份，經原系所組主任同意簽章後，送至本國際行銷學院辦公室辦理，發給學分學程證明書。',
		'所修課程若有先修課程擋修之規定，學生須自行修讀先修課程，以符合各系所組選課之要求。課程修習與學分抵免認定事宜，悉由國際行銷學院辦公室辦理。',
		'修讀本學分學程之學生若中途因故無法繼續修習，需填寫「終止修習學程申請書」，經原系所組主任簽章後，送至本國際行銷學院辦公室辦理，終止其修習資格。',
		'修讀本學分學程學生，若已符合原系所組畢業資格而尚未修滿本學分學程規定之科目與學分，得檢具相關證明，向教務處申請延長修業年限。'
	],
	requirement: {
		total: 15,
		crossDept: true,
		core: '核心課程應修習至少三門、進階課程至少四門',
		detail: '欲取得本學分學程證明之學生，應至少修畢 15 學分（含核心課程應修習至少三門、進階課程至少四門）。惟課程名稱及內容相同之科目，不得重複修習。'
	},
	courses: [
		// 核心課程（語言類）
		{ id: 'fb-1', name: '日語(一)(二)(三)(四)', group: '日語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '國際商務系 / 應用外語系', note: '2/2 或 3/3' },
		{ id: 'fb-2', name: '日語字彙與會話', group: '日語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'fb-3', name: '日語閱讀與文法', group: '日語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'fb-4', name: '日語寫作與翻譯', group: '日語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'fb-5', name: '韓語(一)(二)(三)(四)', group: '韓語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'fb-6', name: '實用韓語', group: '韓語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'fb-7', name: '越南語(一)(二)', group: '越南語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'fb-8', name: '泰國語(一)(二)', group: '泰國語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'fb-9', name: '西語字彙與會話', group: '西班牙語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'fb-10', name: '西語閱讀與文法', group: '西班牙語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'fb-11', name: '西班牙語(一)(二)', group: '西班牙語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 3, hours: 3, unit: '應用外語系' },
		{ id: 'fb-12', name: '法語字彙與會話', group: '法語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'fb-13', name: '法語閱讀與文法', group: '法語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'fb-14', name: '法語(一)(二)', group: '法語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 3, hours: 3, unit: '應用外語系' },
		{ id: 'fb-15', name: '德語字彙與會話', group: '德語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'fb-16', name: '德語閱讀與文法', group: '德語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'fb-17', name: '德語(一)(二)', group: '德語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 3, hours: 3, unit: '應用外語系' },
		// 進階課程
		{ id: 'fb-18', name: '現代商業導論與學習方法', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系 / 應用外語系' },
		{ id: 'fb-19', name: '國際行銷', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系 / 應用外語系' },
		{ id: 'fb-20', name: '全球運籌管理', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'fb-21', name: '國際經貿情勢分析', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'fb-22', name: '東南亞商務環境', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'fb-23', name: '跨文化商務溝通', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'fb-24', name: '數位行銷', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'fb-25', name: '網路行銷', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'fb-26', name: '市場開發策略', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'fb-27', name: 'AI 行銷應用', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '應用外語系' }
	],
	notes: [
		'欲取得本學分學程證明之學生應至少跨系修習一門課程。',
		'依本校「學分學程設置辦法」第十一條第一款規定：113學年度（含）以後入學之四技日間部學生，在學期間應至少選讀一門學程（含微學程）。'
	],
	lastUpdated: '115年4月21日（114學年度第2學期第1次教務會議通過）'
};
