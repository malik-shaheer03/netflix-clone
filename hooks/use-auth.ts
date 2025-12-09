"use client"

import { useEffect, useState } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Set persistence to local
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.error("Error setting persistence:", error)
    })

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result
    } catch (error: any) {
      console.error("Sign in error:", error)
      throw new Error(getErrorMessage(error.code))
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      return result
    } catch (error: any) {
      console.error("Sign up error:", error)
      throw new Error(getErrorMessage(error.code))
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error: any) {
      console.error("Logout error:", error)
      throw new Error("Failed to sign out")
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    logout,
  }
}

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/user-not-found":
      return "No account found with this email address."
    case "auth/wrong-password":
      return "Incorrect password."
    case "auth/email-already-in-use":
      return "An account with this email already exists."
    case "auth/weak-password":
      return "Password should be at least 6 characters."
    case "auth/invalid-email":
      return "Please enter a valid email address."
    case "auth/configuration-not-found":
      return "Email/Password sign-in is not enabled for this Firebase project. Enable it in Firebase Console ➜ Authentication ➜ Sign-in method."
    case "auth/network-request-failed":
      return "Network error. Please check your connection."
    default:
      return "An error occurred. Please try again."
  }
}
