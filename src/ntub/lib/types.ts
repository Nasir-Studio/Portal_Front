/** NTUB 學分學程資料型別定義 */

export type ProgramKind = '學分學程' | '微學程';

export type CourseCategory = 'core' | 'advanced' | null;

export interface Course {
	/** 課程唯一識別碼（如 sustainability-1） */
	id: string;
	/** 課程名稱 */
	name: string;
	/** 課程群組名稱（同一群組擇一修習，如「資料庫類」），非群組制為 null */
	group: string | null;
	/** 群組說明（如「同類課程擇一」） */
	groupNote: string | null;
	/** 核心 / 進階 / null */
	category: CourseCategory;
	/** 是否必修 */
	required: boolean;
	/** 學分數 */
	credits: number;
	/** 每週時數 */
	hours: number;
	/** 開課 / 支援單位 */
	unit: string;
	/** 開課學期（若有） */
	semester?: string;
	/** 備註 */
	note?: string;
}

export interface Program {
	/** 程式識別碼 */
	id: string;
	/** 學程中文名稱 */
	name: string;
	/** 學程英文名稱 */
	nameEn: string;
	/** 學分學程 / 微學程 */
	kind: ProgramKind;
	/** 規劃設置單位（學院層級） */
	college: string;
	/** 規劃設置單位（系所層級） */
	planningUnit: string;
	/** 參與教學單位 */
	participatingUnits: string[];
	/** 設置宗旨 */
	purpose: string;
	/** 申請資格（實施學制） */
	eligibility: string;
	/** 申請與證明流程說明 */
	procedure: string[];
	/** 修業條件 */
	requirement: {
		/** 應修總學分 */
		total: number;
		/** 必修最低學分（若有明列） */
		required?: number;
		/** 選修最低學分（若有明列） */
		elective?: number;
		/** 核心課程要求文字說明 */
		core?: string;
		/** 是否須至少跨系一門 */
		crossDept: boolean;
		/** 完整條件文字 */
		detail: string;
	};
	/** 課程清單 */
	courses: Course[];
	/** 備註事項 */
	notes: string[];
	/** 最近修正日期 */
	lastUpdated: string;
}
