
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

export const currentUser = writable<AppUser | null>(null);

export const authReady = writable(false);

export async function loginWithEmail(email: string, password: string): Promise<void> {
	const auth = getAuthInstance();
	await signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email: string, password: string): Promise<void> {
	const auth = getAuthInstance();
	await createUserWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle(): Promise<void> {
	const auth = getAuthInstance();
	const provider = new GoogleAuthProvider();
	await signInWithPopup(auth, provider);
}

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
