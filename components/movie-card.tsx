"use client"

import type React from "react"

import { useState, useRef, useEffect, memo } from "react"
import { Play, Plus, ThumbsUp, ChevronDown, Check } from "lucide-react"
import { type Movie, getImageUrl } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"

interface MovieCardProps {
  movie: Movie
  onClick: () => void
  index: number
  isInMyList?: boolean
  onAddToList?: () => void
  onRemoveFromList?: () => void
}

export const MovieCard = memo(function MovieCard({
  movie,
  onClick,
  index,
  isInMyList = false,
  onAddToList,
  onRemoveFromList,
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [hoverPosition, setHoverPosition] = useState({ top: 0, left: 0, width: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout>()

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    // Calculate position for hover panel
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setHoverPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      })
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(true)
    }, 150)
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setIsHovered(false)
  }

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  const getImageSrc = () => {
    if (imageError) {
      return "/placeholder.svg?height=400&width=300"
    }
    return getImageUrl(movie.backdrop_path || movie.poster_path, "w500")
  }

  const handleListToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isInMyList) {
      onRemoveFromList?.()
    } else {
      onAddToList?.()
    }
  }

  return (
    <>
      <div
        ref={cardRef}
        className="relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-[200px] lg:w-[240px] xl:w-[280px] cursor-pointer transition-transform duration-200 ease-out"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered ? "scale(1.1)" : "scale(1)",
          zIndex: isHovered ? 9999 : 1,
        }}
      >
        {/* Card Container */}
        <div className="relative w-full bg-gray-900 rounded-md shadow-lg">
          {/* Image Container - Perfect 16:9 aspect ratio */}
          <div className="relative w-full rounded-md overflow-hidden" style={{ aspectRatio: "16/9" }}>
            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="w-full h-full bg-gray-700 animate-pulse flex items-center justify-center">
                <div className="text-gray-500 text-xs">Loading...</div>
              </div>
            )}

            {/* Movie Image */}
            <img
              src={getImageSrc() || "/placeholder.svg"}
              alt={movie.title || movie.name || "Movie poster"}
              className={`w-full h-full object-cover transition-opacity duration-200 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              loading="lazy"
            />

            {/* Light Gradient Overlay - Only at bottom */}
            {isHovered && (
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-200" />
            )}

            {/* Netflix-style Play Button Overlay - Only on hovered card */}
            {isHovered && (
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200">
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-gray-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 p-0 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-xl border-2 border-gray-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClick()
                  }}
                >
                  <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Position Hover Panel - Completely separate from card to prevent scrolling */}
      {isHovered && (
        <div
          className="fixed bg-[#181818] shadow-2xl rounded-b-md border-t border-gray-700 animate-fadeIn"
          style={{
            top: hoverPosition.top,
            left: hoverPosition.left,
            width: hoverPosition.width,
            zIndex: 99999,
            pointerEvents: "auto",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="p-4">
            {/* Action Buttons Row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-gray-200 rounded-full w-8 h-8 p-0 flex items-center justify-center transition-all duration-200 hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClick()
                  }}
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-400 text-white hover:bg-gray-700 hover:border-white rounded-full w-8 h-8 p-0 bg-transparent border-2 transition-all duration-200 hover:scale-110"
                  onClick={handleListToggle}
                >
                  {isInMyList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-400 text-white hover:bg-gray-700 hover:border-white rounded-full w-8 h-8 p-0 bg-transparent border-2 transition-all duration-200 hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation()
                    // Handle like action
                  }}
                >
                  <ThumbsUp className="w-4 h-4" />
                </Button>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-gray-400 text-white hover:bg-gray-700 hover:border-white rounded-full w-8 h-8 p-0 bg-transparent border-2 transition-all duration-200 hover:scale-110"
                onClick={(e) => {
                  e.stopPropagation()
                  onClick()
                }}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>

            {/* Movie Info - All content visible immediately */}
            <div className="space-y-2">
              {/* Match Percentage and Rating */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-green-400 font-bold">{Math.round(movie.vote_average * 10)}% Match</span>
                <span className="border border-gray-400 px-1 py-0.5 text-xs text-gray-300 rounded">16+</span>
                <span className="text-gray-300 text-xs">
                  {movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0]}
                </span>
              </div>

              {/* Title */}
              <h4 className="text-white font-semibold text-sm leading-tight">{movie.title || movie.name}</h4>

              {/* Genres */}
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <span>Action</span>
                <span>•</span>
                <span>Drama</span>
                <span>•</span>
                <span>Thriller</span>
              </div>

              {/* Description - Truncated but fully visible */}
              <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">
                {movie.overview || "No description available for this title."}
              </p>

              {/* Additional Info */}
              <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                <span>★ {movie.vote_average.toFixed(1)}</span>
                <span>{movie.adult ? "18+" : "PG-13"}</span>
                <span>{movie.original_language?.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
})
