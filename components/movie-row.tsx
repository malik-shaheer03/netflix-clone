"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Movie } from "@/lib/tmdb"
import { MovieCard } from "./movie-card"
import { Button } from "@/components/ui/button"

interface MovieRowProps {
  title: string
  movies: Movie[]
  onMovieClick: (movie: Movie) => void
  myList?: number[]
  onAddToList?: (movieId: number) => void
  onRemoveFromList?: (movieId: number) => void
}

export const MovieRow = memo(function MovieRow({
  title,
  movies,
  onMovieClick,
  myList = [],
  onAddToList,
  onRemoveFromList,
}: MovieRowProps) {
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [isRowHovered, setIsRowHovered] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const rowRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const updateArrowVisibility = useCallback(() => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current
      setShowLeftArrow(scrollLeft > 5)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5)
    }
  }, [])

  const scroll = useCallback(
    (direction: "left" | "right") => {
      if (rowRef.current && !isScrolling) {
        setIsScrolling(true)

        const container = rowRef.current
        const cardWidth =
          window.innerWidth < 640
            ? 148
            : window.innerWidth < 768
              ? 168
              : window.innerWidth < 1024
                ? 208
                : window.innerWidth < 1280
                  ? 248
                  : 288
        const visibleCards = Math.floor(container.clientWidth / cardWidth)
        const scrollAmount = cardWidth * Math.max(1, Math.floor(visibleCards * 0.8))

        const targetScrollLeft =
          direction === "left"
            ? Math.max(0, container.scrollLeft - scrollAmount)
            : Math.min(container.scrollWidth - container.clientWidth, container.scrollLeft + scrollAmount)

        // Optimized smooth scroll animation
        const startScrollLeft = container.scrollLeft
        const distance = targetScrollLeft - startScrollLeft
        const duration = 300
        const startTime = performance.now()

        const animateScroll = (currentTime: number) => {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / duration, 1)

          // Netflix-like easing function
          const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1)

          const easedProgress = easeInOutCubic(progress)
          container.scrollLeft = startScrollLeft + distance * easedProgress

          if (progress < 1) {
            requestAnimationFrame(animateScroll)
          } else {
            setIsScrolling(false)
            updateArrowVisibility()
          }
        }

        requestAnimationFrame(animateScroll)
      }
    },
    [isScrolling, updateArrowVisibility],
  )

  useEffect(() => {
    if (rowRef.current) {
      updateArrowVisibility()
    }
  }, [updateArrowVisibility])

  useEffect(() => {
    const handleResize = () => {
      updateArrowVisibility()
    }

    window.addEventListener("resize", handleResize, { passive: true })
    return () => window.removeEventListener("resize", handleResize)
  }, [updateArrowVisibility])

  if (!movies.length) return null

  return (
    <div
      ref={containerRef}
      className="relative group"
      onMouseEnter={() => setIsRowHovered(true)}
      onMouseLeave={() => setIsRowHovered(false)}
    >
      {/* Title */}
      <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-2 px-4 sm:px-6 lg:px-12 xl:px-16 hover:text-gray-300 transition-colors cursor-pointer">
        {title}
      </h2>

      <div className="relative">
        {/* Left Arrow - Netflix Style */}
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 flex items-center justify-start z-40 bg-gradient-to-r from-black/80 to-transparent">
            <Button
              variant="ghost"
              size="icon"
              className={`bg-black/40 hover:bg-white text-white hover:text-black w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full transition-all duration-200 ml-2 border border-white/10 hover:border-white/30 ${
                isRowHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
              onClick={() => scroll("left")}
              disabled={isScrolling}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </Button>
          </div>
        )}

        {/* Right Arrow - Netflix Style */}
        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 flex items-center justify-end z-40 bg-gradient-to-l from-black/80 to-transparent">
            <Button
              variant="ghost"
              size="icon"
              className={`bg-black/40 hover:bg-white text-white hover:text-black w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full transition-all duration-200 mr-2 border border-white/10 hover:border-white/30 ${
                isRowHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
              }`}
              onClick={() => scroll("right")}
              disabled={isScrolling}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </Button>
          </div>
        )}

        {/* Movies Container */}
        <div
          ref={rowRef}
          className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-12 xl:px-16"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {movies.map((movie, index) => (
            <MovieCard
              key={`${movie.id}-${index}`}
              movie={movie}
              onClick={() => onMovieClick(movie)}
              index={index}
              isInMyList={myList.includes(movie.id)}
              onAddToList={() => onAddToList?.(movie.id)}
              onRemoveFromList={() => onRemoveFromList?.(movie.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
})
