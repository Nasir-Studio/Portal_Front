
import { writable, get } from 'svelte/store';
const browser = true;
import type { Program } from '$ntub/types';
import { currentUser } from './auth';
import { getFirestoreInstance } from '$ntub/firebase/client';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

const STORAGE_KEY = 'ntub-cource-checked';

export const checkedCourses = writable<Set<string>>(new Set());

export const myDept = writable<string>('');

const DEPT_KEY = 'ntub-cource-dept';

export const ALL_DEPTS = [
	'企業管理系',
	'國際商務系',
	'應用外語系',
	'財務金融系',
	'會計資訊系',
	'財政稅務系',
	'資訊管理系',
	'商業設計管理系',
	'數位多媒體設計系',
	'創意科技與產品設計系'
] as const;

function loadChecked(): Set<string> {
	if (!browser) return new Set();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return new Set();
		return new Set(JSON.parse(raw) as string[]);
	} catch {
		return new Set();
	}
}

function persist() {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify([...get(checkedCourses)]));
}

let unsubCloud: (() => void) | null = null;
let writeTimer: ReturnType<typeof setTimeout> | null = null;

let applyingCloud = false;

function subscribeCloud(uid: string) {
	unsubscribeCloud();
	const db = getFirestoreInstance();
	const ref = doc(db, 'credit_checks', uid);
	unsubCloud = onSnapshot(
		ref,
		(snap) => {
			if (!snap.exists()) return;
			const data = snap.data();
			const checked = data?.checked;
			if (!Array.isArray(checked)) return;
			applyingCloud = true;
			checkedCourses.set(new Set(checked as string[]));
			if (typeof data?.dept === 'string') myDept.set(data.dept);
			applyingCloud = false;
		},
		(err) => {

			console.error('credit_checks 同步失敗', err.message);
		}
	);
}

function unsubscribeCloud() {
	if (unsubCloud) {
		unsubCloud();
		unsubCloud = null;
	}
}

function scheduleCloudWrite() {
	if (!browser || applyingCloud) return;
	const u = get(currentUser);
	if (!u) return;
	if (writeTimer) clearTimeout(writeTimer);
	writeTimer = setTimeout(() => {
		const db = getFirestoreInstance();
		setDoc(doc(db, 'credit_checks', u.uid), {
			uid: u.uid,
			checked: [...get(checkedCourses)],
			dept: get(myDept),
			updatedAt: serverTimestamp()
		}).catch((err) => console.error('credit_checks 寫入失敗', err.message));
	}, 400);
}

if (browser) {
	checkedCourses.set(loadChecked());
	checkedCourses.subscribe(() => {
		persist();
		scheduleCloudWrite();
	});

	const saved = localStorage.getItem(DEPT_KEY);
	if (saved) myDept.set(saved);
	myDept.subscribe((v) => {
		if (browser) localStorage.setItem(DEPT_KEY, v);
		scheduleCloudWrite();
	});

	currentUser.subscribe((u) => {
		if (u) subscribeCloud(u.uid);
		else unsubscribeCloud();
	});
}

export function toggleCourse(courseId: string) {
	checkedCourses.update((set) => {
		const next = new Set(set);
		if (next.has(courseId)) {
			next.delete(courseId);
		} else {
			next.add(courseId);
		}
		return next;
	});
}

export function earnedCredits(checked: Set<string>, program: Program): number {
	const earned = program.courses
		.filter((c) => checked.has(c.id))
		.reduce((sum, c) => sum + c.credits, 0);

	const groupCap = new Map<string, number>();
	for (const c of program.courses) {
		if (!checked.has(c.id) || !c.group) continue;
		const cur = groupCap.get(c.group) ?? 0;
		groupCap.set(c.group, Math.max(cur, c.credits));
	}
	const groupTotal = [...groupCap.values()].reduce((a, b) => a + b, 0);
	const nonGroupEarned = program.courses
		.filter((c) => checked.has(c.id) && !c.group)
		.reduce((sum, c) => sum + c.credits, 0);
	return nonGroupEarned + groupTotal;
}

export function breakdown(checked: Set<string>, program: Program) {
	let required = 0;
	let elective = 0;
	for (const c of program.courses) {
		if (!checked.has(c.id)) continue;
		if (c.required) required += c.credits;
		else elective += c.credits;
	}
	return { required, elective };
}

export function isCrossDept(program: Program, courseUnit: string): boolean {
	const dept = get(myDept);
	if (!dept) return false;
	return !courseUnit.includes(dept);
}
