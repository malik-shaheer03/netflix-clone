import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}


// Enhanced debugging
console.log('🔍 Firebase Environment Variables Debug:')
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set ✅' : 'Missing ❌')
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set ✅' : 'Missing ❌')
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set ✅' : 'Missing ❌')

console.log('🔧 Firebase Config Object:', firebaseConfig)

// Validate required config
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('❌ Firebase configuration is incomplete!')
  console.log('Missing values:', {
    apiKey: !firebaseConfig.apiKey,
    authDomain: !firebaseConfig.authDomain,
    projectId: !firebaseConfig.projectId,
  })
  throw new Error('Firebase configuration is incomplete. Please check your environment variables.')
}

console.log('✅ Firebase configuration is complete')

/**
 * Always return a single Firebase app instance
 * (avoids "Firebase App named '[DEFAULT]' already exists" on fast refresh)
 */
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export default app