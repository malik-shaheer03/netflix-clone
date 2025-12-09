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

export default function TVShowsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [myList, setMyList] = useState<number[]>([])
  const [tvData, setTvData] = useState<{
    trending: Movie[]
    netflixOriginals: Movie[]
    topRated: Movie[]
    actionThriller: Movie[]
    comedy: Movie[]
    drama: Movie[]
    documentary: Movie[]
    crime: Movie[]
  }>({
    trending: [],
    netflixOriginals: [],
    topRated: [],
    actionThriller: [],
    comedy: [],
    drama: [],
    documentary: [],
    crime: [],
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
    const fetchTVShows = async () => {
      try {
        const [trending, netflixOriginals, topRated, actionThriller, comedy, drama, documentary, crime] =
          await Promise.all([
            fetch("https://api.themoviedb.org/3/trending/tv/week?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c").then(
              (res) => res.json(),
            ),
            tmdbApi.getNetflixOriginals(),
            fetch("https://api.themoviedb.org/3/tv/top_rated?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c").then((res) =>
              res.json(),
            ),
            fetch(
              "https://api.themoviedb.org/3/discover/tv?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_genres=10759",
            ).then((res) => res.json()),
            fetch(
              "https://api.themoviedb.org/3/discover/tv?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_genres=35",
            ).then((res) => res.json()),
            fetch(
              "https://api.themoviedb.org/3/discover/tv?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_genres=18",
            ).then((res) => res.json()),
            fetch(
              "https://api.themoviedb.org/3/discover/tv?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_genres=99",
            ).then((res) => res.json()),
            fetch(
              "https://api.themoviedb.org/3/discover/tv?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_genres=80",
            ).then((res) => res.json()),
          ])

        setTvData({
          trending: trending.results || [],
          netflixOriginals,
          topRated: topRated.results || [],
          actionThriller: actionThriller.results || [],
          comedy: comedy.results || [],
          drama: drama.results || [],
          documentary: documentary.results || [],
          crime: crime.results || [],
        })
      } catch (error) {
        console.error("Error fetching TV shows:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchTVShows()
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
        title="TV Shows"
        subtitle="Discover the best TV series from around the world. From gripping dramas to hilarious comedies, find your next binge-worthy show."
        movies={tvData.trending}
        gradientFrom="from-purple-900"
        gradientTo="to-indigo-900"
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
                title="Trending TV Shows"
                movies={tvData.trending}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Netflix Originals"
                movies={tvData.netflixOriginals}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Top Rated TV Shows"
                movies={tvData.topRated}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Action & Thriller"
                movies={tvData.actionThriller}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Comedy Series"
                movies={tvData.comedy}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Drama Series"
                movies={tvData.drama}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Crime Shows"
                movies={tvData.crime}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Documentaries"
                movies={tvData.documentary}
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
