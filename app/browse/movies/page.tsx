"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { MovieRow } from "@/components/movie-row"
import { MovieModal } from "@/components/movie-modal"
import { MovieRowSkeleton } from "@/components/loading-skeleton"
import { type Movie, tmdbApi } from "@/lib/tmdb"
import { HeroSectionWithContent } from "@/components/hero-section-with-content"

export default function MoviesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [myList, setMyList] = useState<number[]>([])
  const [movieData, setMovieData] = useState<{
    trending: Movie[]
    topRated: Movie[]
    popular: Movie[]
    action: Movie[]
    comedy: Movie[]
    horror: Movie[]
    romance: Movie[]
    sciFi: Movie[]
    thriller: Movie[]
  }>({
    trending: [],
    topRated: [],
    popular: [],
    action: [],
    comedy: [],
    horror: [],
    romance: [],
    sciFi: [],
    thriller: [],
  })
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
    const fetchMovies = async () => {
      try {
        const [trending, topRated, popular, action, comedy, horror, romance, sciFi, thriller] = await Promise.all([
          fetch("https://api.themoviedb.org/3/trending/movie/week?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c").then(
            (res) => res.json(),
          ),
          tmdbApi.getTopRated(),
          fetch("https://api.themoviedb.org/3/movie/popular?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c").then((res) =>
            res.json(),
          ),
          tmdbApi.getActionMovies(),
          tmdbApi.getComedyMovies(),
          tmdbApi.getHorrorMovies(),
          tmdbApi.getRomanceMovies(),
          fetch(
            "https://api.themoviedb.org/3/discover/movie?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_genres=878",
          ).then((res) => res.json()),
          fetch(
            "https://api.themoviedb.org/3/discover/movie?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_genres=53",
          ).then((res) => res.json()),
        ])

        setMovieData({
          trending: trending.results || [],
          topRated,
          popular: popular.results || [],
          action,
          comedy,
          horror,
          romance,
          sciFi: sciFi.results || [],
          thriller: thriller.results || [],
        })
      } catch (error) {
        console.error("Error fetching movies:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchMovies()
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
        title="Movies"
        subtitle="Explore thousands of movies from every genre. From blockbuster hits to indie gems, discover your next favorite film."
        movies={movieData.trending}
        gradientFrom="from-red-900"
        gradientTo="to-yellow-900"
      />

      {/* Content Rows - Exact spacing match with Home page */}
      <div className="relative z-10 -mt-20 sm:-mt-24 md:-mt-28 lg:-mt-32">
        {loading ? (
          <div>
            <MovieRowSkeleton />
            <MovieRowSkeleton />
            <MovieRowSkeleton />
            <MovieRowSkeleton />
            <MovieRowSkeleton />
          </div>
        ) : (
          <div className="pb-20">
            <div className="py-8">
              <MovieRow
                title="Trending Movies"
                movies={movieData.trending}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Popular Movies"
                movies={movieData.popular}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Top Rated Movies"
                movies={movieData.topRated}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Action Movies"
                movies={movieData.action}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Comedy Movies"
                movies={movieData.comedy}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Horror Movies"
                movies={movieData.horror}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Romance Movies"
                movies={movieData.romance}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Sci-Fi Movies"
                movies={movieData.sciFi}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Thriller Movies"
                movies={movieData.thriller}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
          </div>
        )}
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
