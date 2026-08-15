// Auth 狀態管理：Firebase Auth 登入（無角色區分，所有人平等）
import { writable } from 'svelte/store';
const browser = true;
import {
	onAuthStateChanged,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
	signOut as fbSignOut,
	type User
} from 'firebase/auth';
import { getAuthInstance } from '$ntub/firebase/client';

export interface AppUser {
	uid: string;
	email: string | null;
	name: string;
}

/** 登入中的使用者（未登入為 null） */
export const currentUser = writable<AppUser | null>(null);
/** 是否已確認初始登入狀態（避免閃跳） */
export const authReady = writable(false);

/** 登入（email + 密碼） */
export async function loginWithEmail(email: string, password: string): Promise<void> {
	const auth = getAuthInstance();
	await signInWithEmailAndPassword(auth, email, password);
}

/** 註冊新帳號（email + 密碼） */
export async function registerWithEmail(email: string, password: string): Promise<void> {
	const auth = getAuthInstance();
	await createUserWithEmailAndPassword(auth, email, password);
}

/** Google 登入 */
export async function loginWithGoogle(): Promise<void> {
	const auth = getAuthInstance();
	const provider = new GoogleAuthProvider();
	await signInWithPopup(auth, provider);
}

/** 登出 */
export async function logout(): Promise<void> {
	await fbSignOut(getAuthInstance());
}

function toAppUser(user: User): AppUser {
	return {
		uid: user.uid,
		email: user.email,
		name: user.displayName ?? (user.email?.split('@')[0] ?? '學生')
	};
}

if (browser) {
	onAuthStateChanged(getAuthInstance(), (user) => {
		currentUser.set(user ? toAppUser(user) : null);
		authReady.set(true);
	});
}
