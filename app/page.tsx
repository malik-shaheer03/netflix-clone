"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const router = useRouter()

  const handleGetStarted = () => {
    if (email) {
      router.push(`/signup?email=${encodeURIComponent(email)}`)
    } else {
      router.push("/signup")
    }
  }

  const handleSignIn = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen">
        {/* Netflix authentic background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://assets.nflxext.com/ffe/siteui/vlv3/fc164b4b-f085-44ee-bb7f-ec7df8539eff/d23a1608-7d90-4da1-93d6-bae2fe60a69b/IN-en-20230814-popsignuptwoweeks-perspective_alpha_website_large.jpg')",
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />

        {/* Header */}
        <header className="relative z-10 flex justify-between items-center px-6 lg:px-12 py-6">
          <div className="text-red-600 text-2xl lg:text-3xl font-bold">NETFLIX</div>
          <Button
            onClick={handleSignIn}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium rounded"
          >
            Sign In
          </Button>
        </header>

        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center h-full px-6">
          <div className="text-center max-w-4xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
              Unlimited movies, TV shows, and more
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-4 font-normal">Watch anywhere. Cancel anytime.</p>
            <p className="text-base md:text-lg lg:text-xl mb-8 font-normal">
              Ready to watch? Enter your email to create or restart your membership.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 md:h-14 text-base md:text-lg bg-black/70 border-gray-500 text-white placeholder-gray-400 rounded-sm"
              />
              <Button
                onClick={handleGetStarted}
                className="bg-red-600 hover:bg-red-700 h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-medium whitespace-nowrap rounded-sm"
              >
                Get Started
                <ChevronRight className="ml-1 w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="h-2 bg-gray-800" />

      {/* Features Section */}
      <div className="py-16 lg:py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          {/* Feature 1 */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 lg:mb-20">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-5xl font-black mb-4 lg:mb-6">Enjoy on your TV</h2>
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png"
                alt="TV"
                className="relative z-10 w-full"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/5">
                <video autoPlay playsInline muted loop className="w-full h-full object-cover">
                  <source
                    src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/video-tv-0819.m4v"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="h-2 bg-gray-800 mb-16 lg:mb-20" />

          {/* Feature 2 */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 lg:mb-20">
            <div className="order-2 lg:order-1 relative">
              <img
                src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/mobile-0819.jpg"
                alt="Mobile"
                className="w-full"
              />
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black border-2 border-gray-700 rounded-xl px-4 py-2 flex items-center space-x-4">
                <img
                  src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/boxshot.png"
                  alt="Stranger Things"
                  className="h-16 w-12"
                />
                <div className="flex-1">
                  <div className="text-white font-medium">Stranger Things</div>
                  <div className="text-blue-500 text-sm">Downloading...</div>
                </div>
                <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-3xl lg:text-5xl font-black mb-4 lg:mb-6">Download your shows to watch offline</h2>
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                Save your favorites easily and always have something to watch.
              </p>
            </div>
          </div>

          {/* Separator */}
          <div className="h-2 bg-gray-800 mb-16 lg:mb-20" />

          {/* Feature 3 */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 lg:mb-20">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-5xl font-black mb-4 lg:mb-6">Watch everywhere</h2>
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/device-pile-in.png"
                alt="Devices"
                className="w-full"
              />
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-1/2 h-1/3">
                <video autoPlay playsInline muted loop className="w-full h-full object-cover">
                  <source
                    src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/video-devices-in.m4v"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="h-2 bg-gray-800 mb-16 lg:mb-20" />

          {/* Feature 4 */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://occ-0-2611-3663.1.nflxso.net/dnm/api/v6/19OhWN2dO19C9txTON9tvTFtefw/AAAABVr8nYuAg0xDpXDv0VI9HUoH7r2aGp4TKRCsKNQrMwxzTtr-NlwOHeS8bCI2oeZddmu3nMYr3j9MjYhHyjBASb1FaOGYZNYvPBCL.png?r=54d"
                alt="Kids"
                className="w-full"
              />
            </div>
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-3xl lg:text-5xl font-black mb-4 lg:mb-6">Create profiles for kids</h2>
              <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">
                Send kids on adventures with their favorite characters in a space made just for them—free with your
                membership.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="h-2 bg-gray-800" />

      {/* FAQ Section */}
      <div className="py-16 lg:py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl lg:text-5xl font-black text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {[
              {
                question: "What is Netflix?",
                answer:
                  "Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies and documentaries on thousands of internet-connected devices.",
              },
              {
                question: "How much does Netflix cost?",
                answer:
                  "Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from ₹149 to ₹649 a month.",
              },
              {
                question: "Where can I watch?",
                answer:
                  "Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device.",
              },
              {
                question: "How do I cancel?",
                answer:
                  "Netflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks.",
              },
              {
                question: "What can I watch on Netflix?",
                answer:
                  "Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more.",
              },
              {
                question: "Is Netflix good for kids?",
                answer:
                  "The Netflix Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-gray-800 hover:bg-gray-700 transition-colors">
                <button className="w-full p-6 text-left flex justify-between items-center">
                  <span className="text-lg lg:text-xl font-normal">{faq.question}</span>
                  <span className="text-3xl font-thin">+</span>
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-base lg:text-lg mb-8">
              Ready to watch? Enter your email to create or restart your membership.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 md:h-14 text-base md:text-lg bg-black/70 border-gray-500 text-white placeholder-gray-400 rounded-sm"
              />
              <Button
                onClick={handleGetStarted}
                className="bg-red-600 hover:bg-red-700 h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-medium whitespace-nowrap rounded-sm"
              >
                Get Started
                <ChevronRight className="ml-1 w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="h-2 bg-gray-800" />
      <footer className="bg-black py-16">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-gray-400 mb-8">Questions? Contact us.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
            <div className="space-y-3">
              <a href="#" className="block hover:underline">
                FAQ
              </a>
              <a href="#" className="block hover:underline">
                Investor Relations
              </a>
              <a href="#" className="block hover:underline">
                Privacy
              </a>
              <a href="#" className="block hover:underline">
                Speed Test
              </a>
            </div>
            <div className="space-y-3">
              <a href="#" className="block hover:underline">
                Help Center
              </a>
              <a href="#" className="block hover:underline">
                Jobs
              </a>
              <a href="#" className="block hover:underline">
                Cookie Preferences
              </a>
              <a href="#" className="block hover:underline">
                Legal Notices
              </a>
            </div>
            <div className="space-y-3">
              <a href="#" className="block hover:underline">
                Account
              </a>
              <a href="#" className="block hover:underline">
                Ways to Watch
              </a>
              <a href="#" className="block hover:underline">
                Corporate Information
              </a>
              <a href="#" className="block hover:underline">
                Only on Netflix
              </a>
            </div>
            <div className="space-y-3">
              <a href="#" className="block hover:underline">
                Media Center
              </a>
              <a href="#" className="block hover:underline">
                Terms of Use
              </a>
              <a href="#" className="block hover:underline">
                Contact Us
              </a>
            </div>
          </div>
          <div className="mt-8 text-gray-400 text-sm">Netflix India</div>
        </div>
      </footer>
    </div>
  )
}
