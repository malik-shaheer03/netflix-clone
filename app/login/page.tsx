"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast, ToastContainer } from "@/components/toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()
  const { toasts, removeToast, showError, showSuccess } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(email, password)
      showSuccess("Successfully signed in!")
      setTimeout(() => {
        router.push("/browse")
      }, 1000)
    } catch (error: any) {
      showError(error.message || "Invalid credentials. Please try again.")
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
              <h1 className="text-3xl font-bold mb-8">Sign In</h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="sr-only">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email or phone number"
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
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-sm"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="flex items-center justify-between mt-4 text-sm">
                <label className="flex items-center text-gray-400">
                  <input type="checkbox" className="mr-2" />
                  Remember me
                </label>
                <Link href="/forgot-password" className="text-gray-400 hover:text-white">
                  Need help?
                </Link>
              </div>

              <div className="mt-16 text-gray-400">
                New to Netflix?{" "}
                <Link href="/signup" className="text-white hover:underline">
                  Sign up now
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
