import type { Program } from '$ntub/types';

export const dataAnalysisVisualization: Program = {
	id: 'data-analysis-visualization',
	name: '數據分析與視覺化微學程',
	nameEn: 'Data Analysis and Visualization Micro Program',
	kind: '微學程',
	college: '管理學院',
	planningUnit: '資訊管理系',
	participatingUnits: ['資訊管理系', '會計資訊系', '財務金融系', '創意科技與產品設計系', '資訊與決策科學研究所'],
	purpose:
		'本校資訊管理系為整合本校各系科數據分析與視覺化應用之相關課程，培養產業界所需之實務人才，增加學生競爭力，達到畢業即就業之目標，特設置本學程。',
	eligibility: '本校五專部、大學部及碩士班學生皆可申請修讀本學程。',
	procedure: [
		'學生於學校公告期程內至本校「學分學程系統」線上申請修習。',
		'學生修畢本學程課程學分者，於取得原系所組畢業資格後，須自學分學程系統下載「學分學程/微學程審核表」並檢附歷年成績單正本乙份，經原系所組主任同意簽章後，送至本學程辦公室（資訊管理系）辦理，由本學程辦公室（資訊管理系）發給學程證明書。',
		'所修課程若有先修課程擋修之規定，學生須自行修讀先修課程，以符合各系所組選課之要求。課程修習與學分抵免認定事宜，悉由本學程辦公室（資訊管理系）辦理。',
		'修讀本學程之學生若中途因故無法繼續修習，需填寫「終止修習學程申請書」，經原系所組主任簽章後，送至本學程辦公室（資訊管理系）辦理，終止其修習資格。',
		'修讀本學程學生，若已符合原系所組畢業資格而尚未修滿學程規定之科目與學分，得檢具相關證明，向教務處申請延長修業年限。'
	],
	requirement: {
		total: 8,
		crossDept: true,
		detail: '欲取得本學程證明之學生，應至少修畢 8 學分。課程名稱及內容相同之科目，不得重複修習。'
	},
	courses: [

		{ id: 'da-1', name: '資料處理 / 數位化資料處理', group: '資料處理必修', groupNote: '必修：三類課程擇一（最少 3 學分）', category: null, required: true, credits: 3, hours: 3, unit: '本校各系' },
		{ id: 'da-2', name: '商業套裝軟體 / 商業軟體應用', group: '資料處理必修', groupNote: '必修：三類課程擇一（最少 3 學分）', category: null, required: true, credits: 3, hours: 3, unit: '本校各系' },
		{ id: 'da-3', name: 'Python 程式設計（內容需為 Python 或 R 語言或 excel 應用或統計軟體）', group: '資料處理必修', groupNote: '必修：三類課程擇一（最少 3 學分）', category: null, required: true, credits: 3, hours: 3, unit: '本校各系' },

		{ id: 'da-4', name: '資料庫基礎應用', group: '資料庫類', groupNote: '選修：最少 2 學分', category: null, required: false, credits: 2, hours: 2, unit: '本校各系' },
		{ id: 'da-5', name: '資料庫管理', group: '資料庫類', groupNote: '選修：最少 2 學分', category: null, required: false, credits: 2, hours: 2, unit: '本校各系' },
		{ id: 'da-6', name: '資料庫管理系統實作', group: '資料庫類', groupNote: '選修：最少 2 學分', category: null, required: false, credits: 2, hours: 2, unit: '本校各系' },
		{ id: 'da-7', name: '資料庫管理系統', group: '資料庫類', groupNote: '選修：最少 2 學分', category: null, required: false, credits: 2, hours: 2, unit: '本校各系' },
		{ id: 'da-8', name: '資料庫概論', group: '資料庫類', groupNote: '選修：最少 2 學分', category: null, required: false, credits: 2, hours: 2, unit: '本校各系' },
		{ id: 'da-9', name: '高等資料庫', group: '資料庫類', groupNote: '選修：最少 2 學分', category: null, required: false, credits: 2, hours: 2, unit: '本校各系' },

		{ id: 'da-10', name: '社群大數據分析', group: null, groupNote: null, category: null, required: false, credits: 3, hours: 3, unit: '本校各系' },

		{ id: 'da-11', name: '商業數據分析', group: '商業數據分析類', groupNote: '選修：最少 3 學分', category: null, required: false, credits: 3, hours: 3, unit: '資訊管理系 / 會計資訊系 / 財務金融系 / 資訊與決策科學研究所' },
		{ id: 'da-12', name: '資料探勘與大數據分析', group: '商業數據分析類', groupNote: '選修：最少 3 學分', category: null, required: false, credits: 3, hours: 3, unit: '資訊管理系 / 會計資訊系 / 財務金融系 / 資訊與決策科學研究所' },

		{ id: 'da-13', name: '資料探勘', group: '資料探勘類', groupNote: '選修：最少 3 學分', category: null, required: false, credits: 3, hours: 3, unit: '資訊管理系 / 會計資訊系 / 創意科技與產品設計系' },
		{ id: 'da-14', name: '大數據分析與應用', group: '資料探勘類', groupNote: '選修：最少 3 學分', category: null, required: false, credits: 3, hours: 3, unit: '資訊管理系 / 會計資訊系 / 創意科技與產品設計系' },
		{ id: 'da-15', name: '資產管理大數據應用', group: '資料探勘類', groupNote: '選修：最少 3 學分', category: null, required: false, credits: 3, hours: 3, unit: '資訊管理系 / 會計資訊系 / 創意科技與產品設計系' },
		{ id: 'da-16', name: '資料可視化', group: '資料探勘類', groupNote: '選修：最少 3 學分', category: null, required: false, credits: 3, hours: 3, unit: '資訊管理系 / 會計資訊系 / 創意科技與產品設計系' },

		{ id: 'da-17', name: '視覺化資料分析', group: '視覺化類', groupNote: '選修：最少 3 學分', category: null, required: false, credits: 3, hours: 3, unit: '資訊管理系 / 會計資訊系' },
		{ id: 'da-18', name: '資訊視覺化方法', group: '視覺化類', groupNote: '選修：最少 3 學分', category: null, required: false, credits: 3, hours: 3, unit: '資訊管理系 / 會計資訊系' },
		{ id: 'da-19', name: '資訊視覺化設計', group: '視覺化類', groupNote: '選修：最少 3 學分', category: null, required: false, credits: 3, hours: 3, unit: '資訊管理系 / 會計資訊系' },
		{ id: 'da-20', name: '數據處理與視覺化應用', group: '視覺化類', groupNote: '選修：最少 3 學分', category: null, required: false, credits: 3, hours: 3, unit: '資訊管理系 / 會計資訊系' },
		{ id: 'da-21', name: '數據處理與電腦視覺化', group: '視覺化類', groupNote: '選修：最少 3 學分', category: null, required: false, credits: 3, hours: 3, unit: '資訊管理系 / 會計資訊系' }
	],
	notes: [
		'必修課程：資料處理 / 數位化資料處理、商業套裝軟體 / 商業軟體應用、Python 程式設計（內容需為 Python 或 R 語言或 excel 應用或統計軟體）三者擇一，至少 3 學分。',
		'欲取得本學程證明之學生應至少跨系修習一門課程。',
		'依本校「學分學程設置辦法」第十一條第一款規定：113學年度（含）以後入學之四技日間部學生，在學期間應至少選讀一門學程（含微學程）。'
	],
	lastUpdated: '114年10月27日（114學年度第1學期第01次教務會議包裹修正）'
};
