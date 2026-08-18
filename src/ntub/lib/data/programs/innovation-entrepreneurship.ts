import type { Program } from '$ntub/types';


export const innovationEntrepreneurship: Program = {
	id: 'innovation-entrepreneurship',
	name: '創新與創業管理學分學程',
	nameEn: 'Innovation and Entrepreneurship Credit Program',
	kind: '學分學程',
	college: '管理學院',
	planningUnit: '企業管理系',
	participatingUnits: ['企業管理系', '國際商務系', '財務金融系', '會計資訊系', '應用外語系'],
	purpose:
		'本學程之設置宗旨在於整合本校各系科創業管理之相關課程，培養學生創新思維及創業家精神，以及學習開創事業相關知識及實務能力，使得學生能夠結合本身專業知能，進而實踐創業理想與目標。',
	eligibility: '本校五專部、大學部及碩士班學生皆可申請修讀本學程。',
	procedure: [
		'學生於學校公告期程內至本校「學分學程系統」線上申請修習。',
		'學生修畢本學程課程學分者，於取得原系所組畢業資格後，須自學分學程系統下載「學分學程/微學程審核表」並檢附歷年成績單正本乙份，經原系所組主任同意簽章後，送至本學程辦公室（企業管理系）辦理，由本學程辦公室（企業管理系）發給學程證明書。',
		'所修課程若有先修課程擋修之規定，學生須自行修讀先修課程，以符合各系所組選課之要求。課程修習與學分抵免認定事宜，悉由本院辦公室辦理。',
		'修讀本學程之學生若中途因故無法繼續修習，需填寫「終止修習學程申請書」，經原系所組主任簽章後，送至本學程辦公室（企業管理系）辦理，終止其修習資格。',
		'依本校「學生選課辦法」第五條規定：碩士生得修大學部所開課程，其成績不計入當學期及畢業總平均，亦不列入畢業學分數。',
		'修讀本學程學生，若已符合原系所組畢業資格而尚未修滿學程規定之科目與學分，得檢具相關證明，向教務處申請延長修業年限。'
	],
	requirement: {
		total: 15,
		required: 2,
		elective: 13,
		crossDept: true,
		detail: '欲取得本學程證明之學生，應至少修畢 15 學分（必修達到 2 學分、選修達到 13 學分）。課程名稱及內容相同之科目，不得重複修習。'
	},
	courses: [
		{ id: 'ie-1', name: '創新與創業管理', group: null, groupNote: null, category: null, required: true, credits: 2, hours: 2, unit: '企業管理系' },
		{ id: 'ie-2', name: '產業競爭分析', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '企業管理系' },
		{ id: 'ie-3', name: '顧客關係管理', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '企業管理系' },
		{ id: 'ie-4', name: '服務業管理', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '企業管理系' },
		{ id: 'ie-5', name: '新產品行銷', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '企業管理系' },
		{ id: 'ie-6', name: '行銷企劃實作', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '企業管理系' },
		{ id: 'ie-7', name: '企業成功個案', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '企業管理系' },
		{ id: 'ie-8', name: '企業品牌個案', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '企業管理系' },
		{ id: 'ie-9', name: '全球產業分析', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'ie-10', name: '跨文化商務溝通', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'ie-11', name: '國際經貿情勢分析', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'ie-12', name: '跨境電子商務', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '國際商務系' },
		{ id: 'ie-13', name: '風險管理', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '財務金融系' },
		{ id: 'ie-14', name: '商業模式研討', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '會計資訊系' },
		{ id: 'ie-15', name: '創新與專案管理', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '應用外語系' }
	],
	notes: [
		'欲取得本學程證明之學生應至少跨系修習一門課程。',
		'學分學程/微學程所納課程規劃，依各系實際開課學分數進行調整之。',
		'依本校「學分學程設置辦法」第十一條第一款規定：113學年度（含）以後入學之四技日間部學生，在學期間應至少選讀一門學程（含微學程）。'
	],
	lastUpdated: '114年10月27日（114學年度第1學期第01次教務會議包裹修正）'
};
