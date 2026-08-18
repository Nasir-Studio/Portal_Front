

export type ProgramKind = '學分學程' | '微學程';

export type CourseCategory = 'core' | 'advanced' | null;

export interface Course {
	
	id: string;
	
	name: string;
	
	group: string | null;
	
	groupNote: string | null;
	
	category: CourseCategory;
	
	required: boolean;
	
	credits: number;
	
	hours: number;
	
	unit: string;
	
	semester?: string;
	
	note?: string;
}

export interface Program {
	
	id: string;
	
	name: string;
	
	nameEn: string;
	
	kind: ProgramKind;
	
	college: string;
	
	planningUnit: string;
	
	participatingUnits: string[];
	
	purpose: string;
	
	eligibility: string;
	
	procedure: string[];
	
	requirement: {
		
		total: number;
		
		required?: number;
		
		elective?: number;
		
		core?: string;
		
		crossDept: boolean;
		
		detail: string;
	};
	
	courses: Course[];
	
	notes: string[];
	
	lastUpdated: string;
}
