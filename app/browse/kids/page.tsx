"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { MovieModal } from "@/components/movie-modal"
import { MovieRowSkeleton } from "@/components/loading-skeleton"
import type { Movie } from "@/lib/tmdb"
import { MovieCard } from "@/components/movie-card"
import { Play, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function KidsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [myList, setMyList] = useState<number[]>([])
  const [kidsData, setKidsData] = useState<{
    familyMovies: Movie[]
    animation: Movie[]
    kidsTV: Movie[]
    educational: Movie[]
    adventure: Movie[]
    comedy: Movie[]
  }>({
    familyMovies: [],
    animation: [],
    kidsTV: [],
    educational: [],
    adventure: [],
    comedy: [],
  })
  const [loading, setLoading] = useState(true)
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const savedList = localStorage.getItem("netflix-my-list")
    if (savedList) {
      setMyList(JSON.parse(savedList))
    }
  }, [])

  useEffect(() => {
    const fetchKidsContent = async () => {
      try {
        const [familyMovies, animation, kidsTV, educational, adventure, comedy] = await Promise.all([
          fetch(
            "https://api.themoviedb.org/3/discover/movie?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_genres=10751&sort_by=popularity.desc",
          ).then((res) => res.json()),
          fetch(
            "https://api.themoviedb.org/3/discover/movie?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_genres=16&sort_by=popularity.desc",
          ).then((res) => res.json()),
          fetch(
            "https://api.themoviedb.org/3/discover/tv?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_genres=10762&sort_by=popularity.desc",
          ).then((res) => res.json()),
          fetch(
            "https://api.themoviedb.org/3/discover/tv?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_genres=99,10751&sort_by=popularity.desc",
          ).then((res) => res.json()),
          fetch(
            "https://api.themoviedb.org/3/discover/movie?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_genres=12,10751&sort_by=popularity.desc",
          ).then((res) => res.json()),
          fetch(
            "https://api.themoviedb.org/3/discover/movie?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_genres=35,10751&sort_by=popularity.desc",
          ).then((res) => res.json()),
        ])

        const kidsContent = {
          familyMovies: familyMovies.results || [],
          animation: animation.results || [],
          kidsTV: kidsTV.results || [],
          educational: educational.results || [],
          adventure: adventure.results || [],
          comedy: comedy.results || [],
        }

        setKidsData(kidsContent)

        // Set featured movie from animation or family movies
        const allMovies = [...kidsContent.animation, ...kidsContent.familyMovies]
        if (allMovies.length > 0) {
          setFeaturedMovie(allMovies[0])
        }
      } catch (error) {
        console.error("Error fetching kids content:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchKidsContent()
    }
  }, [user])

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMovie(null)
  }

  const handleAddToList = (movieId: number) => {
    const newList = [...myList, movieId]
    setMyList(newList)
    localStorage.setItem("netflix-my-list", JSON.stringify(newList))
  }

  const handleRemoveFromList = (movieId: number) => {
    const newList = myList.filter((id) => id !== movieId)
    setMyList(newList)
    localStorage.setItem("netflix-my-list", JSON.stringify(newList))
  }

  // Kids-specific movie row component with playful styling
  const KidsMovieRow = ({ title, movies, icon }: { title: string; movies: Movie[]; icon?: React.ReactNode }) => (
    <div className="mb-12">
      <div className="flex items-center mb-6 px-4 lg:px-16">
        {icon && <div className="mr-3 text-2xl">{icon}</div>}
        <h2
          className="text-white text-2xl md:text-3xl font-black tracking-wide"
          style={{ fontFamily: "Comic Sans MS, cursive" }}
        >
          {title}
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 lg:px-16">
        {movies.slice(0, 10).map((movie, index) => (
          <div key={movie.id} className="flex-shrink-0">
            <MovieCard
              movie={movie}
              onClick={() => handleMovieClick(movie)}
              index={index}
              isInMyList={myList.includes(movie.id)}
              onAddToList={() => handleAddToList(movie.id)}
              onRemoveFromList={() => handleRemoveFromList(movie.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center">
        <div className="text-white text-xl font-bold">Loading Kids Zone...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400">
      {/* Kids Header */}
      <header className="relative z-50 px-4 lg:px-16 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/browse")}
              className="text-white hover:text-yellow-300 transition-colors text-lg font-bold"
              style={{ fontFamily: "Comic Sans MS, cursive" }}
            >
              ← Back to Netflix
            </button>
            <div
              className="text-white text-3xl font-black tracking-wide"
              style={{ fontFamily: "Comic Sans MS, cursive" }}
            >
              NETFLIX KIDS
            </div>
          </div>
          <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src="https://occ-0-2611-3663.1.nflxso.net/dnm/api/v6/K6hjPJd6cR6FpVELC5Pd6ovHRSk/AAAABY20DrC9-11ewwAs6nfEgb1vrORxRPP9IGmlW1WtKuaLIz8VtiLn_-m4GY5KeWKT6OJFsIcEu5zQg5rH0MBRpZWfMBNvQwOmyLiW.png?r=229"
              alt="Kids Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Kids Hero Section */}
      {featuredMovie && (
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden mb-8">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/80 via-purple-500/60 to-blue-500/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="relative z-10 flex items-center h-full px-4 lg:px-16">
            <div className="max-w-2xl">
              <div className="bg-yellow-400 text-black px-4 py-2 rounded-full inline-block mb-4 font-bold text-sm">
                ⭐ FEATURED FOR KIDS
              </div>
              <h1
                className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight drop-shadow-lg"
                style={{ fontFamily: "Comic Sans MS, cursive" }}
              >
                {featuredMovie.title || featuredMovie.name}
              </h1>
              <p className="text-lg md:text-xl text-white mb-8 leading-relaxed drop-shadow-md">
                {featuredMovie.overview?.slice(0, 150)}...
              </p>
              <div className="flex items-center space-x-4">
                <Button
                  className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-4 text-lg font-black rounded-full flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-lg"
                  style={{ fontFamily: "Comic Sans MS, cursive" }}
                >
                  <Play className="w-6 h-6 fill-current" />
                  <span>PLAY NOW!</span>
                </Button>
                <Button
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 text-lg font-black rounded-full flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-lg border-2 border-white/30"
                  style={{ fontFamily: "Comic Sans MS, cursive" }}
                >
                  <Heart className="w-6 h-6" />
                  <span>ADD TO FAVORITES</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Rows */}
      <div className="relative z-10">
        {loading ? (
          <div className="space-y-8">
            <MovieRowSkeleton />
            <MovieRowSkeleton />
            <MovieRowSkeleton />
          </div>
        ) : (
          <div className="pb-20 space-y-4">
            <KidsMovieRow title="🎬 Family Movies" movies={kidsData.familyMovies} icon="🎬" />
            <KidsMovieRow title="🎨 Animation Fun" movies={kidsData.animation} icon="🎨" />
            <KidsMovieRow title="📺 Kids TV Shows" movies={kidsData.kidsTV} icon="📺" />
            <KidsMovieRow title="🎓 Learn & Play" movies={kidsData.educational} icon="🎓" />
            <KidsMovieRow title="🗺️ Adventure Time" movies={kidsData.adventure} icon="🗺️" />
            <KidsMovieRow title="😂 Comedy Corner" movies={kidsData.comedy} icon="😂" />
          </div>
        )}
      </div>

      {/* Floating Elements for Fun */}
      <div className="fixed top-20 left-10 text-6xl animate-bounce opacity-20 pointer-events-none">🌟</div>
      <div className="fixed top-40 right-20 text-4xl animate-pulse opacity-20 pointer-events-none">🎈</div>
      <div
        className="fixed bottom-20 left-20 text-5xl animate-bounce opacity-20 pointer-events-none"
        style={{ animationDelay: "1s" }}
      >
        🦄
      </div>
      <div
        className="fixed bottom-40 right-10 text-3xl animate-pulse opacity-20 pointer-events-none"
        style={{ animationDelay: "2s" }}
      >
        🌈
      </div>

      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isInMyList={selectedMovie ? myList.includes(selectedMovie.id) : false}
        onAddToList={() => selectedMovie && handleAddToList(selectedMovie.id)}
        onRemoveFromList={() => selectedMovie && handleRemoveFromList(selectedMovie.id)}
      />
    </div>
  )
}
