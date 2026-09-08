import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCAcOXf4fS1nrfXzV0aHuC_a45xFwhKNEY",
  authDomain: "tools-10e33.firebaseapp.com",
  projectId: "tools-10e33",
  storageBucket: "tools-10e33.firebasestorage.app",
  messagingSenderId: "256015814343",
  appId: "1:256015814343:web:192ecb6c725dc835cc78e2",
  measurementId: "G-JGY51W8WDW"
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth helper functions
export async function registerWithFirebase(email: string, password?: string, name?: string) {
  const pwd = password && password.length >= 6 ? password : 'UserPass123!';
  const userCredential = await createUserWithEmailAndPassword(auth, email, pwd);
  const user = userCredential.user;

  if (name) {
    await updateProfile(user, { displayName: name });
  }

  // Save/Update user document in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    displayName: name || user.displayName || '',
    isRegistered: true,
    promptsUsed: 0,
    subscribedAt: new Date().toISOString(),
  }, { merge: true });

  return user;
}

export async function loginWithFirebase(email: string, password?: string) {
  const pwd = password && password.length >= 6 ? password : 'UserPass123!';
  const userCredential = await signInWithEmailAndPassword(auth, email, pwd);
  return userCredential.user;
}

export async function logoutFromFirebase() {
  await signOut(auth);
}

export { onAuthStateChanged, type FirebaseUser };
