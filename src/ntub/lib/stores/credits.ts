// 學分勾選狀態：localStorage 為基底，登入後同步至 Firestore（credit_checks/{uid}）
import { writable, get } from 'svelte/store';
const browser = true;
import type { Program } from '$ntub/types';
import { currentUser } from './auth';
import { getFirestoreInstance } from '$ntub/firebase/client';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';

const STORAGE_KEY = 'ntub-cource-checked';

/** 已勾選課程 id 集合（154 門課程 id 全學程唯一） */
export const checkedCourses = writable<Set<string>>(new Set());

/** 使用者的科系（本系），用於本系/外系判定 */
export const myDept = writable<string>('');

const DEPT_KEY = 'ntub-cource-dept';

/** 所有科系列表（供選擇本系用） */
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

// ---------- Firestore 雲端同步 ----------

let unsubCloud: (() => void) | null = null;
let writeTimer: ReturnType<typeof setTimeout> | null = null;
/** 是否正在套用雲端快照（避免回寫造成迴圈） */
let applyingCloud = false;

function subscribeCloud(uid: string) {
	unsubscribeCloud();
	const db = getFirestoreInstance();
	const ref = doc(db, 'credit_checks', uid);
	unsubCloud = onSnapshot(
		ref,
		(snap) => {
			if (!snap.exists()) return; // 尚未有雲端資料：保留本機當作種子
			const data = snap.data();
			const checked = data?.checked;
			if (!Array.isArray(checked)) return;
			applyingCloud = true;
			checkedCourses.set(new Set(checked as string[]));
			if (typeof data?.dept === 'string') myDept.set(data.dept);
			applyingCloud = false;
		},
		(err) => {
			// 權限不足或離線：忽略，繼續用本機資料
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
	}, 400); // 防抖，避免連續勾選頻繁寫入
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

	// 登入時訂閱雲端資料，登出時停止
	currentUser.subscribe((u) => {
		if (u) subscribeCloud(u.uid);
		else unsubscribeCloud();
	});
}

// ---------- 操作 ----------

/** 切換某課程勾選狀態 */
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

/** 計算某學程目前已勾選的總學分 */
export function earnedCredits(checked: Set<string>, program: Program): number {
	const earned = program.courses
		.filter((c) => checked.has(c.id))
		.reduce((sum, c) => sum + c.credits, 0);
	// 同群組課程擇一採計（只算群組中最高分一門），避免重複計算
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

/** 計算該學程必修、選修各已達多少學分 */
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

/** 判斷某課程是否為外系開課（開課單位不含本系） */
export function isCrossDept(program: Program, courseUnit: string): boolean {
	const dept = get(myDept);
	if (!dept) return false;
	return !courseUnit.includes(dept);
}
