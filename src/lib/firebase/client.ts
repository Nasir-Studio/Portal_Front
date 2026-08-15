// 主站（首頁 home）專用 Firebase Web SDK 初始化（前端公開設定）
// 與 ntub 子站的 client 分開，避免跨子站混用
import { initializeApp, type FirebaseApp } from 'firebase/app';
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

/** 主站專用單例 Firebase App（命名 app，避免與 ntub 的預設 app 衝突） */
let app: FirebaseApp | undefined;
let db: Firestore | undefined;

/** 取得主站 App（避免 SSR 期間初始化） */
export function getHomeApp(): FirebaseApp {
	if (!app) app = initializeApp(firebaseConfig, 'home');
	return app;
}

/** 取得主站 Firestore 實例（僅瀏覽器可用） */
export function getHomeFirestore(): Firestore {
	if (!db) db = getFirestore(getHomeApp());
	return db;
}
