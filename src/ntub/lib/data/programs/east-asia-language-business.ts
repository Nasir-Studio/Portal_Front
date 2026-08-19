import type { Program } from '$ntub/types';

export const eastAsiaLanguageBusiness: Program = {
	id: 'east-asia-language-business',
	name: '東亞語言與商務微學程',
	nameEn: 'East Asian Languages and Business Micro Program',
	kind: '微學程',
	college: '國際行銷學院',
	planningUnit: '國際商務系',
	participatingUnits: ['國際商務系', '應用外語系'],
	purpose:
		'隨著東亞成熟經濟體（日本、韓國）與東南亞新興經濟體逐漸成為全球經濟發展主要引擎，以及台灣與東南亞國協（ASEAN）經濟體之經貿往來日益熱絡，熟悉東亞商務的人才需求提高，為培育熟悉東亞語言、文化與社會、國際商務等專業之人才，特成立本學程。',
	eligibility: '本校二技部、四技部二年級（含）以上學生與碩士班學生皆可申請修讀本學程。',
	procedure: [
		'學生於學校公告期程內至本校「學分學程系統」線上申請修習。',
		'學生修畢本學程課程學分者，於取得原系所組畢業資格後，須自學分學程系統下載「學分學程/微學程審核表」並檢附歷年成績單正本乙份，經原系所組主任同意簽章後，送至本學程辦公室（國際商務系）辦理，由國際商務系發給學程證明書。',
		'所修課程若有先修課程擋修之規定，學生須自行修讀先修課程，以符合各系所組選課之要求。課程修習與學分抵免認定事宜，悉由本學程（國際商務系）辦公室辦理。',
		'修讀本學程之學生若中途因故無法繼續修習，需填寫「終止修習學程申請書」，經原系所組主任簽章後，送至本學程辦公室（國際商務系）辦理，終止其修習資格。',
		'修讀本學程學生，若已符合原系所組畢業資格而尚未修滿學程規定之科目與學分，得檢具相關證明，向教務處申請延長修業年限。'
	],
	requirement: {
		total: 8,
		crossDept: true,
		core: '核心必修課程 4 學分、專業選修課程至少 4 學分',
		detail: '欲取得本學程證明之學生，應至少修畢 8 學分（含核心必修課程：4 學分、專業選修課程：至少 4 學分）。課程名稱及內容相同之科目，不得重複修習。'
	},
	courses: [

		{ id: 'ea-1', name: '日語(一)(二)(三)(四)', group: '核心語言擇一', groupNote: '核心課程為四種語言課程擇一種修習，至少修習 4 學分，採認 4 學分', category: 'core', required: false, credits: 2, hours: 2, unit: '國際商務系 / 應用外語系', note: '2/2 或 3/3' },
		{ id: 'ea-2', name: '日語字彙與會話', group: '日語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'ea-3', name: '日語閱讀與文法', group: '日語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'ea-4', name: '日語寫作與翻譯', group: '日語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'ea-5', name: '韓語(一)(二)(三)(四)', group: '韓語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'ea-6', name: '實用韓語', group: '韓語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'ea-7', name: '越南語(一)(二)', group: '越南語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'ea-8', name: '泰國語(一)(二)', group: '泰國語', groupNote: '核心課程語言類', category: 'core', required: false, credits: 2, hours: 2, unit: '國際商務系' },

		{ id: 'ea-9', name: '現代商業導論與學習方法', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系 / 應用外語系' },
		{ id: 'ea-10', name: '國際行銷', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系 / 應用外語系' },
		{ id: 'ea-11', name: '全球運籌管理', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'ea-12', name: '國際經貿情勢分析', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'ea-13', name: '東南亞商務環境', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'ea-14', name: '跨文化商務溝通', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'ea-15', name: '數位行銷', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'ea-16', name: '網路行銷', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'ea-17', name: '市場開發策略', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '應用外語系' },
		{ id: 'ea-18', name: 'AI 行銷應用', group: null, groupNote: null, category: 'advanced', required: false, credits: 2, hours: 2, unit: '應用外語系' }
	],
	notes: [
		'核心課程為四種語言課程擇一種修習，至少修習 4 學分，採認 4 學分。',
		'專業課程為十擇二，至少修習 4 學分，採認 4 學分。',
		'欲取得本學程證明之學生應至少跨系修習一門課程。',
		'本學程課程規劃以兩年開課期間為原則，學生得在原系所組修業期限內完成本學程所需學分。',
		'依本校「學分學程設置辦法」第十一條第一款規定：113學年度（含）以後入學之四技日間部學生，在學期間應至少選讀一門學程（含微學程）。'
	],
	lastUpdated: '115年04月21日（114學年度第2學期第01次教務會議修正）'
};
