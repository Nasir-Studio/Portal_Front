import type { Program } from '$ntub/types';


export const corporateSustainability: Program = {
	id: 'corporate-sustainability',
	name: '企業永續經營管理學分學程',
	nameEn: 'Corporate Sustainability Management Credit Program',
	kind: '學分學程',
	college: '管理學院',
	planningUnit: '企業管理系',
	participatingUnits: ['企業管理系', '國際商務系', '會計資訊系', '財務金融系', '資訊管理系', '通識教育中心'],
	purpose:
		'本學程之設置宗旨在於整合本校各系科有關企業永續經營管理之相關課程，培育產業界所需之管理技能整合的實務人才，增加學生競爭力，達到畢業即就業目標。',
	eligibility: '本校五專部、大學部及碩士班學生皆可申請修讀本學程。',
	procedure: [
		'學生於學校公告期程內至本校「學分學程系統」線上申請修習。',
		'學生修畢本學程課程學分者，於取得原系所組畢業資格後，須自學分學程系統下載「學分學程/微學程審核表」並檢附歷年成績單正本乙份，經原系所組主任同意簽章後，送至本學程辦公室（企業管理系）辦理，由本學程辦公室（企業管理系）發給學程證明書。',
		'所修課程若有先修課程擋修之規定，學生須自行修讀先修課程，以符合各系所組選課之要求。課程修習與學分抵免認定事宜，悉由本院辦公室辦理。',
		'修讀本學程之學生若中途因故無法繼續修習，需填寫「終止修習學程申請書」，經原系所組主任簽章後，送至本學程辦公室（企業管理系）辦理，終止其修習資格。',
		'學生修畢學程並取得證明者，另得向教務處申請於學位證書加註學程名稱，惟學位證書遺失或重補發者，不再重新加註。',
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
		{ id: 'cs-1', name: '企業永續管理', group: null, groupNote: null, category: null, required: true, credits: 2, hours: 2, unit: '企業管理系' },
		{ id: 'cs-2', name: '生產與作業管理', group: null, groupNote: null, category: null, required: false, credits: 3, hours: 3, unit: '企業管理系' },
		{ id: 'cs-3', name: '通路管理', group: null, groupNote: null, category: null, required: false, credits: 3, hours: 3, unit: '企業管理系' },
		{ id: 'cs-4', name: '物流管理', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '企業管理系' },
		{ id: 'cs-5', name: '非營利事業組織經營策略與管理', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '企業管理系' },
		{ id: 'cs-6', name: '零售管理', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '企業管理系' },
		{ id: 'cs-7', name: '供應鏈管理', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '企業管理系 / 資管系(進修部)', note: '2/2 或 3/3' },
		{ id: 'cs-8', name: '國際行銷管理', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '國際商務系', note: '2/2 或 3/3' },
		{ id: 'cs-9', name: '內部稽核與公司治理', group: null, groupNote: null, category: null, required: false, credits: 3, hours: 3, unit: '會計資訊系' },
		{ id: 'cs-10', name: '公司治理', group: null, groupNote: null, category: null, required: false, credits: 3, hours: 3, unit: '財務金融系' },
		{ id: 'cs-11', name: '智慧綠能', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '通識教育中心' },
		{ id: 'cs-12', name: '全球環境變遷與永續發展', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '通識教育中心' },
		{ id: 'cs-13', name: '綠生活與消費', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '通識教育中心' },
		{ id: 'cs-14', name: '環境永續與企業綠化', group: null, groupNote: null, category: null, required: false, credits: 2, hours: 2, unit: '通識教育中心' }
	],
	notes: [
		'欲取得本學程證明之學生應至少跨系修習一門課程。',
		'學分學程/微學程所納課程規劃，依各系實際開課學分數進行調整之。',
		'依本校「學分學程設置辦法」第十一條第一款規定：113學年度（含）以後入學之四技日間部學生，在學期間應至少選讀一門學程（含微學程）。'
	],
	lastUpdated: '114年10月27日（114學年度第1學期第01次教務會議包裹修正）'
};
