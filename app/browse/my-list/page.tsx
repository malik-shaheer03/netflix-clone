"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { MovieModal } from "@/components/movie-modal"
import type { Movie } from "@/lib/tmdb"
import { MovieCard } from "@/components/movie-card"
import { HeroSectionWithContent } from "@/components/hero-section-with-content"

export default function MyListPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [myList, setMyList] = useState<number[]>([])
  const [myListMovies, setMyListMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

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
    const fetchMyListMovies = async () => {
      if (myList.length === 0) {
        setLoading(false)
        return
      }

      try {
        const moviePromises = myList.map(async (movieId) => {
          try {
            // Try to fetch as movie first
            const movieResponse = await fetch(
              `https://api.themoviedb.org/3/movie/${movieId}?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c`,
            )
            if (movieResponse.ok) {
              return movieResponse.json()
            }

            // If movie fails, try as TV show
            const tvResponse = await fetch(
              `https://api.themoviedb.org/3/tv/${movieId}?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c`,
            )
            if (tvResponse.ok) {
              return tvResponse.json()
            }

            return null
          } catch (error) {
            console.error(`Error fetching movie/show ${movieId}:`, error)
            return null
          }
        })

        const movies = await Promise.all(moviePromises)
        const validMovies = movies.filter((movie) => movie !== null)
        setMyListMovies(validMovies)
      } catch (error) {
        console.error("Error fetching my list movies:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user && myList.length > 0) {
      fetchMyListMovies()
    } else {
      setLoading(false)
    }
  }, [user, myList])

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMovie(null)
  }

  const handleRemoveFromList = (movieId: number) => {
    const newList = myList.filter((id) => id !== movieId)
    setMyList(newList)
    localStorage.setItem("netflix-my-list", JSON.stringify(newList))
    setMyListMovies((prev) => prev.filter((movie) => movie.id !== movieId))
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header onMovieClick={handleMovieClick} />

      {/* Hero Section */}
      <HeroSectionWithContent
        title="My List"
        subtitle="Your personal collection of movies and shows to watch later."
        movies={myListMovies}
        gradientFrom="from-indigo-900"
        gradientTo="to-pink-900"
      />

      {/* Content - Exact spacing match with Home page */}
      <div className="relative z-10 -mt-20 sm:-mt-24 md:-mt-28 lg:-mt-32 px-4 lg:px-16 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="w-full h-[240px] md:h-[280px] lg:h-[320px] bg-gray-700 animate-pulse rounded-md"
              />
            ))}
          </div>
        ) : myListMovies.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Your list is empty</h2>
            <p className="text-gray-400 text-lg mb-8">
              Add movies and shows to your list by clicking the + icon when you hover over them.
            </p>
            <button
              onClick={() => router.push("/browse")}
              className="bg-white text-black px-8 py-3 rounded font-bold hover:bg-gray-200 transition-colors"
            >
              Browse Content
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-white text-2xl font-bold">
                {myListMovies.length} {myListMovies.length === 1 ? "title" : "titles"}
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {myListMovies.map((movie, index) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => handleMovieClick(movie)}
                  index={index}
                  isInMyList={true}
                  onRemoveFromList={() => handleRemoveFromList(movie.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <MovieModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isInMyList={selectedMovie ? myList.includes(selectedMovie.id) : false}
        onRemoveFromList={() => selectedMovie && handleRemoveFromList(selectedMovie.id)}
      />
    </div>
  )
}
