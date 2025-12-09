"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast, ToastContainer } from "@/components/toast"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toasts, removeToast, showError, showSuccess } = useToast()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (password.length < 6) {
      showError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      await signUp(email, password)
      showSuccess("Account created successfully!")
      setTimeout(() => {
        router.push("/browse")
      }, 1000)
    } catch (error: any) {
      showError(error.message || "Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            backgroundImage:
              "url('https://assets.nflxext.com/ffe/siteui/vlv3/fc164b4b-f085-44ee-bb7f-ec7df8539eff/d23a1608-7d90-4da1-93d6-bae2fe60a69b/IN-en-20230814-popsignuptwoweeks-perspective_alpha_website_large.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10">
          <header className="px-6 lg:px-12 py-6">
            <Link href="/" className="text-red-600 text-2xl lg:text-3xl font-bold">
              NETFLIX
            </Link>
          </header>

          <div className="flex items-center justify-center min-h-[calc(100vh-100px)] px-6">
            <div className="bg-black/75 p-8 lg:p-16 rounded w-full max-w-md">
              <h1 className="text-3xl font-bold mb-8">Sign Up</h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="sr-only">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-sm"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="sr-only">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-sm"
                  />
                  <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters</p>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-sm"
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </Button>
              </form>

              <div className="mt-16 text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-white hover:underline">
                  Sign in now
                </Link>
                .
              </div>

              <div className="mt-4 text-xs text-gray-400">
                This page is protected by Google reCAPTCHA to ensure you're not a bot.{" "}
                <a href="#" className="text-blue-500 hover:underline">
                  Learn more
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
