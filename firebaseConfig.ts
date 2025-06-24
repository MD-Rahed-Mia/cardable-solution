import AsyncStorage from "@react-native-async-storage/async-storage";
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwFTgqOEhY9nh2pXTseOTK9R8yEHfJnk8",
  authDomain: "inventory-management-f19ec.firebaseapp.com",
  projectId: "inventory-management-f19ec",
  storageBucket: "inventory-management-f19ec.firebasestorage.app",
  messagingSenderId: "865261227277",
  appId: "1:865261227277:web:99a7a699b6a9a30fb3b444",
  measurementId: "G-5GTX1W47X9",
};

const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

let auth: Auth;

// db
const db: Firestore = getFirestore(app);

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  auth = getAuth(app);
}
export { app, auth, db };
