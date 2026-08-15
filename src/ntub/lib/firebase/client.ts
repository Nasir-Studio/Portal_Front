// Firebase Web SDK 初始化（前端公開設定）
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyB59k0o7gtNJLJryq0CTXIgwYrk3DlcCiE',
	authDomain: 'nasircyl.firebaseapp.com',
	databaseURL: 'https://nasircyl-default-rtdb.asia-southeast1.firebasedatabase.app',
	projectId: 'nasircyl',
	storageBucket: 'nasircyl.firebasestorage.app',
	messagingSenderId: '310865822058',
	appId: '1:310865822058:web:998a3fa372e841f1eba513'
};

/** 單例 Firebase App */
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

/** 取得 App（避免 SSR 期間初始化） */
export function getApp(): FirebaseApp {
	if (!app) app = initializeApp(firebaseConfig);
	return app;
}

/** 取得 Auth 實例（僅瀏覽器可用） */
export function getAuthInstance(): Auth {
	if (!auth) auth = getAuth(getApp());
	return auth;
}

/** 取得 Firestore 實例（僅瀏覽器可用） */
export function getFirestoreInstance(): Firestore {
	if (!db) db = getFirestore(getApp());
	return db;
}
