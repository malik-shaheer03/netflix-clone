"use client"

import { useState, useEffect } from "react"
import { Play, Info, VolumeX, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Movie, getImageUrl } from "@/lib/tmdb"

interface HeroSectionWithContentProps {
  title: string
  subtitle: string
  movies: Movie[]
  gradientFrom?: string
  gradientTo?: string
}

export function HeroSectionWithContent({
  title,
  subtitle,
  movies,
  gradientFrom = "from-black",
  gradientTo = "to-transparent",
}: HeroSectionWithContentProps) {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    if (movies.length > 0) {
      // Select a random movie from the first 5 for better quality
      const topMovies = movies.slice(0, 5)
      const randomMovie = topMovies[Math.floor(Math.random() * topMovies.length)]
      setFeaturedMovie(randomMovie)
    }
  }, [movies])

  if (!featuredMovie) {
    return (
      <div className={`relative h-[70vh] md:h-[80vh] bg-gradient-to-r ${gradientFrom} ${gradientTo}`}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex items-center h-full px-4 lg:px-16">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-none">{title}</h1>
            <p className="text-lg md:text-xl text-white mb-8 leading-relaxed">{subtitle}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{
          backgroundImage: `url(${getImageUrl(featuredMovie.backdrop_path, "original")})`,
        }}
      />

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#141414] to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-4 lg:px-16">
        <div className="max-w-2xl">
          {/* Category Badge */}
          <div className="flex items-center mb-4">
            <span className="text-white text-sm font-medium tracking-widest bg-red-600 px-3 py-1 rounded">
              FEATURED
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-none">
            {featuredMovie.title || featuredMovie.name}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white mb-8 line-clamp-3 leading-relaxed max-w-xl">
            {featuredMovie.overview}
          </p>

          {/* Buttons */}
          <div className="flex items-center space-x-4 mb-8">
            <Button className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-bold rounded-md flex items-center space-x-2 transition-all duration-200 hover:scale-105">
              <Play className="w-6 h-6 fill-current" />
              <span>Play</span>
            </Button>
            <Button
              variant="secondary"
              className="bg-gray-500/70 text-white hover:bg-gray-500/50 px-8 py-3 text-lg font-bold rounded-md flex items-center space-x-2 transition-all duration-200 hover:scale-105"
            >
              <Info className="w-6 h-6" />
              <span>More Info</span>
            </Button>
          </div>

          {/* Age Rating and Year */}
          <div className="flex items-center space-x-4 text-white">
            <span className="border border-gray-400 px-2 py-1 text-sm">16+</span>
            <span className="text-lg font-medium">
              {featuredMovie.release_date?.split("-")[0] || featuredMovie.first_air_date?.split("-")[0]}
            </span>
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mute Button */}
      <div className="absolute bottom-24 right-4 lg:right-16 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="bg-transparent border-2 border-white/50 text-white hover:bg-white/20 rounded-full w-12 h-12"
          onClick={() => setIsMuted(!isMuted)}
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </Button>
      </div>
    </div>
  )
}
