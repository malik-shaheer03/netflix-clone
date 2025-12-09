"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Search, Bell, ChevronDown, Gift, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { SearchResults } from "./search-results"
import type { Movie } from "@/lib/tmdb"

interface HeaderProps {
  onMovieClick?: (movie: Movie) => void
}

export function Header({ onMovieClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isProfileHovered, setIsProfileHovered] = useState(false)
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSearchResults(true)
    }
  }

  const handleSearchClose = () => {
    setShowSearchResults(false)
    setSearchQuery("")
    setShowSearch(false)
  }

  const handleMovieClick = (movie: Movie) => {
    setShowSearchResults(false)
    if (onMovieClick) {
      onMovieClick(movie)
    }
  }

  const navigationItems = [
    { name: "Home", href: "/browse" },
    { name: "TV Shows", href: "/browse/tv" },
    { name: "Movies", href: "/browse/movies" },
    { name: "New & Popular", href: "/browse/latest" },
    { name: "My List", href: "/browse/my-list" },
    { name: "Browse by Languages", href: "/browse/languages" },
  ]

  const handleKidsProfileClick = () => {
    router.push("/browse/kids")
  }

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "bg-[#141414]" : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-12 xl:px-16 py-4">
          {/* Left Section */}
          <div className="flex items-center space-x-6 lg:space-x-8">
            {/* Netflix Logo */}
            <Link href="/browse" className="text-[#e50914] text-xl sm:text-2xl font-black tracking-tight">
              NETFLIX
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-5">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-gray-300 ${
                    pathname === item.href ? "text-white" : "text-gray-300"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white hover:text-gray-300 transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">Browse</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showMobileMenu ? "rotate-180" : ""}`} />
              </div>
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {showSearch ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <div className="flex items-center bg-black/90 border border-white px-3 py-2 rounded-sm">
                    <Search className="w-5 h-5 text-white mr-2" />
                    <input
                      type="text"
                      placeholder="Titles, people, genres"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent text-white placeholder-gray-400 outline-none text-sm w-48 sm:w-64"
                      autoFocus
                    />
                    {searchQuery && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="p-1 h-auto text-white hover:text-gray-300 transition-colors duration-200"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 text-white hover:text-gray-300 hidden sm:block transition-colors duration-200"
                    onClick={() => {
                      setShowSearch(false)
                      setSearchQuery("")
                    }}
                  >
                    Cancel
                  </Button>
                </form>
              ) : (
                <Search
                  className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors duration-200"
                  onClick={() => setShowSearch(true)}
                />
              )}
            </div>

            {/* Gift Icon - Hidden on mobile */}
            <Gift className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors duration-200 hidden md:block" />

            {/* Notifications */}
            <div className="relative">
              <Bell className="w-6 h-6 text-white cursor-pointer hover:text-gray-300 transition-colors duration-200" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#e50914] rounded-full"></div>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div
                  className="relative cursor-pointer"
                  onMouseEnter={() => setIsProfileHovered(true)}
                  onMouseLeave={() => setIsProfileHovered(false)}
                >
                  <div className="flex items-center space-x-2 text-white transition-all duration-200 ease-out">
                    <div className="relative">
                      <div
                        className={`w-8 h-8 rounded overflow-hidden transition-all duration-200 ease-out ${
                          isProfileHovered ? "ring-2 ring-white" : ""
                        }`}
                      >
                        <img
                          src="https://occ-0-2611-3663.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABdpkabKqQAxyWzo6QW_ZnPz1IZLqlmNfK-t4L1VIeV1DY00JhLo_LMVFp936keDxj-V5UELAVJrU--iUUY2MaDxQSSO-0qw.png?r=e6e"
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-all duration-200 ease-out ${
                        isProfileHovered ? "rotate-180 text-gray-300" : "text-white"
                      }`}
                    />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#141414] border border-gray-600 text-white min-w-[200px] shadow-2xl animate-in slide-in-from-top-2 duration-200"
                sideOffset={8}
              >
                <DropdownMenuItem className="flex items-center space-x-3 hover:bg-[#333333] cursor-pointer p-3 transition-colors duration-150 focus:bg-[#333333] text-white hover:text-white">
                  <div className="w-8 h-8 rounded overflow-hidden">
                    <img
                      src="https://occ-0-2611-3663.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABdpkabKqQAxyWzo6QW_ZnPz1IZLqlmNfK-t4L1VIeV1DY00JhLo_LMVFp936keDxj-V5UELAVJrU--iUUY2MaDxQSSO-0qw.png?r=e6e"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-sm">Profile 1</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center space-x-3 hover:bg-[#333333] cursor-pointer p-3 transition-colors duration-150 focus:bg-[#333333] text-white hover:text-white"
                  onClick={handleKidsProfileClick}
                >
                  <div className="w-8 h-8 rounded overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center">
                    <div className="text-white text-lg font-black">👶</div>
                  </div>
                  <span className="font-medium text-sm">Kids</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-600 my-1" />
                <DropdownMenuItem className="hover:bg-[#333333] cursor-pointer p-3 transition-colors duration-150 focus:bg-[#333333] text-white hover:text-white">
                  <span className="text-sm">Manage Profiles</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#333333] cursor-pointer p-3 transition-colors duration-150 focus:bg-[#333333] text-white hover:text-white">
                  <span className="text-sm">Transfer Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#333333] cursor-pointer p-3 transition-colors duration-150 focus:bg-[#333333] text-white hover:text-white">
                  <span className="text-sm">Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-[#333333] cursor-pointer p-3 transition-colors duration-150 focus:bg-[#333333] text-white hover:text-white">
                  <span className="text-sm">Help Center</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-600 my-1" />
                <DropdownMenuItem
                  className="hover:bg-[#333333] cursor-pointer p-3 transition-colors duration-150 focus:bg-[#333333] text-white hover:text-white"
                  onClick={logout}
                >
                  <span className="text-sm">Sign out of Netflix</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-black/95 border-t border-gray-800 animate-fadeIn">
            <nav className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block py-2 text-sm font-medium transition-colors duration-200 hover:text-gray-300 ${
                    pathname === item.href ? "text-white" : "text-gray-300"
                  }`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Search Results Overlay */}
      {showSearchResults && (
        <SearchResults query={searchQuery} onClose={handleSearchClose} onMovieClick={handleMovieClick} />
      )}
    </>
  )
}
