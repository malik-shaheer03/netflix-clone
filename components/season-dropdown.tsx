"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface Season {
  id: number
  name: string
  episode_count: number
  season_number: number
}

interface SeasonDropdownProps {
  seasons: Season[]
  selectedSeason: number
  onSeasonChange: (seasonNumber: number) => void
}

export function SeasonDropdown({ seasons, selectedSeason, onSeasonChange }: SeasonDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedSeasonData = seasons.find((s) => s.season_number === selectedSeason)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border border-gray-600 hover:border-gray-400 rounded px-4 py-2 min-w-[200px] transition-all duration-200 focus:outline-none focus:border-white"
      >
        <span className="font-medium">{selectedSeasonData?.name || `Season ${selectedSeason}`}</span>
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#2a2a2a] border border-gray-600 rounded shadow-2xl z-50 overflow-hidden animate-fadeIn">
          <div className="max-h-64 overflow-y-auto netflix-scrollbar">
            {seasons.map((season) => (
              <button
                key={season.id}
                onClick={() => {
                  onSeasonChange(season.season_number)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-3 hover:bg-[#3a3a3a] transition-colors duration-150 ${
                  season.season_number === selectedSeason ? "bg-[#3a3a3a] text-white" : "text-gray-300"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{season.name}</span>
                  <span className="text-sm text-gray-400">{season.episode_count} episodes</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
