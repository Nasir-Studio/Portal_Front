import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { getDatabase, ref, get, set } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyB59k0o7gtNJLJryq0CTXIgwYrk3DlcCiE',
  authDomain: 'nasircyl.firebaseapp.com',
  databaseURL: 'https://nasircyl-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'nasircyl',
  storageBucket: 'nasircyl.firebasestorage.app',
  messagingSenderId: '310865822058',
  appId: '1:310865822058:web:928496f6b17dbbe4eba513'
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getDatabase(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

export function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider)
}

export function logout() {
  return signOut(auth)
}

export { ref, get, set, onAuthStateChanged }
