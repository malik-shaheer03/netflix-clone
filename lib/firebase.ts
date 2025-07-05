import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAjJY4b_czNQYKgFfTmRlNZ0Ax3CSBKQQA",
  authDomain: "netflix-clone-59003.firebaseapp.com",
  projectId: "netflix-clone-59003",
  storageBucket: "netflix-clone-59003.appspot.com", // ✅ correct domain
  messagingSenderId: "950518356253",
  appId: "1:950518356253:web:b88b56cdf2cd42b1c8e9f4",
}

/**
 * Always return a single Firebase app instance
 * (avoids “Firebase App named '[DEFAULT]' already exists” on fast refresh)
 */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export default app
