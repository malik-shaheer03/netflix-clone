"use client"

import { useState, useEffect } from "react"
import { Play, Info, VolumeX, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Movie, tmdbApi, getImageUrl } from "@/lib/tmdb"

export function HeroSection() {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    const fetchHeroMovie = async () => {
      try {
        const trending = await tmdbApi.getTrending()
        const randomMovie = trending[Math.floor(Math.random() * trending.length)]
        setMovie(randomMovie)
      } catch (error) {
        console.error("Error fetching hero movie:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHeroMovie()
  }, [])

  if (loading || !movie) {
    return (
      <div className="relative h-screen bg-gray-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>
    )
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{
          backgroundImage: `url(${getImageUrl(movie.backdrop_path, "original")})`,
        }}
      />

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#141414] to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full px-4 lg:px-16">
        <div className="max-w-2xl">
          {/* Netflix Original Badge */}
          <div className="flex items-center mb-4">
            <img
              src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/mobile-0819.jpg"
              alt="Netflix"
              className="h-6 mr-3"
            />
            <span className="text-white text-sm font-medium tracking-widest">SERIES</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-none">
            {movie.title || movie.name}
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white mb-8 line-clamp-3 leading-relaxed max-w-xl">{movie.overview}</p>

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
              {movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0]}
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
