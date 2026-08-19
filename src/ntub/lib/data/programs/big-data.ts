import type { Program } from '$ntub/types';

export const bigData: Program = {
	id: 'big-data',
	name: '大數據微學程',
	nameEn: 'Big Data Micro Program',
	kind: '微學程',
	college: '財經學院',
	planningUnit: '財經學院',
	participatingUnits: ['會計資訊系', '財務金融系', '財政稅務系', '資訊管理系'],
	purpose:
		'為培育學生具備洗錢/資恐風險意識及防制洗錢的觀念，深化學生具備應用數位科技於風險管理與防制洗錢之能力，未來在業界能成為數位洗防人才。',
	eligibility: '本校大學部學生皆可申請修讀大數據微學程。',
	procedure: [
		'學生於學校公告期程內至本校「學分學程系統」線上申請修習。',
		'學生修畢大數據微學程課程學分者，於取得原系所組畢業資格後，須自學分學程系統下載「學分學程/微學程審核表」並檢附歷年成績單正本乙份，經原系所組主任同意簽章後，送至財經學院辦公室辦理，發給學程證明書。',
		'所修課程若有先修課程擋修之規定，學生須自行修讀先修課程，以符合各系所組選課之要求。課程修習與學分抵免認定事宜，悉由財經學院辦公室辦理。',
		'修讀大數據微學程之學生若中途因故無法繼續修習，需填寫「終止修習學程申請書」，經原系所組主任簽章後，送至財經學院辦公室辦理，終止其修習資格。',
		'修讀大數據微學程學生，若已符合原系所組畢業資格而尚未修滿學程規定之科目與學分，得檢具相關證明，向教務處申請延長修業年限。'
	],
	requirement: {
		total: 8,
		crossDept: true,
		core: '核心課程應修習至少一門（1學期）、進階課程應修習至少二門',
		detail: '欲取得大數據微學程證明之學生，應至少修畢 8 學分，核心課程應修習至少一門（1學期）、進階課程應修習至少二門，惟課程名稱及內容相同之科目，不得重複修習。'
	},
	courses: [

		{ id: 'bd-1', name: '程式設計', group: '程式設計', groupNote: '核心課程：各系開設之程式設計擇一修習', category: 'core', required: true, credits: 3, hours: 3, unit: '會計資訊系', semester: '三上' },
		{ id: 'bd-2', name: '程式設計', group: '程式設計', groupNote: '核心課程：各系開設之程式設計擇一修習', category: 'core', required: true, credits: 3, hours: 3, unit: '財政稅務系', semester: '二下' },
		{ id: 'bd-3', name: '程式設計', group: '程式設計', groupNote: '核心課程：各系開設之程式設計擇一修習', category: 'core', required: true, credits: 3, hours: 3, unit: '財務金融系', semester: '二下' },
		{ id: 'bd-4', name: '程式設計', group: '程式設計', groupNote: '核心課程：各系開設之程式設計擇一修習', category: 'core', required: true, credits: 3, hours: 3, unit: '資訊管理系', semester: '一上' },

		{ id: 'bd-5', name: '機器學習概論與應用', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '財務金融系', semester: '四下' },
		{ id: 'bd-6', name: '多語言與財經程式應用', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '財務金融系', semester: '三下' },
		{ id: 'bd-7', name: '大數據金融', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '財務金融系', semester: '三上' },
		{ id: 'bd-8', name: '資料探勘', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '會計資訊系', semester: '三上' },
		{ id: 'bd-9', name: '視覺化資料分析', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '會計資訊系', semester: '二上' },
		{ id: 'bd-10', name: '機器學習與深度學習', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '資訊管理系', semester: '三下' },
		{ id: 'bd-11', name: '資料探勘與大數據分析', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '資訊管理系', semester: '四下' },
		{ id: 'bd-12', name: '商業智慧與資料科學(進修學制)', group: null, groupNote: null, category: 'advanced', required: false, credits: 3, hours: 3, unit: '資訊管理系', semester: '二下' },
		{ id: 'bd-13', name: '人工智慧商業運用 (AI in Business)', group: null, groupNote: null, category: 'advanced', required: false, credits: 1, hours: 20, unit: '財經學院', note: '20小時，另行公布時間地點' },
		{ id: 'bd-14', name: '永續發展商業運用 (SDGs in Business)', group: null, groupNote: null, category: 'advanced', required: false, credits: 1, hours: 20, unit: '財經學院', note: '20小時，另行公布時間地點' }
	],
	notes: [
		'欲取得大數據微學程證明之學生應至少跨系修習一門課程。',
		'依本校「學分學程設置辦法」第十一條第一款規定：113學年度（含）以後入學之四技日間部學生，在學期間應至少選讀一門學程（含微學程）。'
	],
	lastUpdated: '114年10月27日（114學年度第1學期第01次教務會議包裹修正）'
};
