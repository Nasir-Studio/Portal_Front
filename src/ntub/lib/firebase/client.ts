
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


let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;


export function getApp(): FirebaseApp {
	if (!app) app = initializeApp(firebaseConfig);
	return app;
}


export function getAuthInstance(): Auth {
	if (!auth) auth = getAuth(getApp());
	return auth;
}


export function getFirestoreInstance(): Firestore {
	if (!db) db = getFirestore(getApp());
	return db;
}
