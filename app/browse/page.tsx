"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { MovieRow } from "@/components/movie-row"
import { MovieModal } from "@/components/movie-modal"
import { MovieRowSkeleton, HeroSkeleton } from "@/components/loading-skeleton"
import { type Movie, tmdbApi } from "@/lib/tmdb"

export default function BrowsePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [myList, setMyList] = useState<number[]>([])
  const [movieData, setMovieData] = useState<{
    netflixOriginals: Movie[]
    trending: Movie[]
    topRated: Movie[]
    actionMovies: Movie[]
    comedyMovies: Movie[]
    horrorMovies: Movie[]
    romanceMovies: Movie[]
    documentaries: Movie[]
  }>({
    netflixOriginals: [],
    trending: [],
    topRated: [],
    actionMovies: [],
    comedyMovies: [],
    horrorMovies: [],
    romanceMovies: [],
    documentaries: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    // Load my list from localStorage
    const savedList = localStorage.getItem("netflix-my-list")
    if (savedList) {
      setMyList(JSON.parse(savedList))
    }
  }, [])

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [
          netflixOriginals,
          trending,
          topRated,
          actionMovies,
          comedyMovies,
          horrorMovies,
          romanceMovies,
          documentaries,
        ] = await Promise.all([
          tmdbApi.getNetflixOriginals(),
          tmdbApi.getTrending(),
          tmdbApi.getTopRated(),
          tmdbApi.getActionMovies(),
          tmdbApi.getComedyMovies(),
          tmdbApi.getHorrorMovies(),
          tmdbApi.getRomanceMovies(),
          tmdbApi.getDocumentaries(),
        ])

        setMovieData({
          netflixOriginals,
          trending,
          topRated,
          actionMovies,
          comedyMovies,
          horrorMovies,
          romanceMovies,
          documentaries,
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

      {loading ? <HeroSkeleton /> : <HeroSection />}

      {/* Movie Rows - Consistent spacing with other pages */}
      <div className="relative z-10 -mt-32 lg:-mt-40">
        {loading ? (
          <div className="space-y-12">
            <MovieRowSkeleton />
            <MovieRowSkeleton />
            <MovieRowSkeleton />
            <MovieRowSkeleton />
            <MovieRowSkeleton />
          </div>
        ) : (
          <div className="pb-20 space-y-12">
            <div>
              <MovieRow
                title="Netflix Originals"
                movies={movieData.netflixOriginals}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div>
              <MovieRow
                title="Trending Now"
                movies={movieData.trending}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div>
              <MovieRow
                title="Top Rated"
                movies={movieData.topRated}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div>
              <MovieRow
                title="Action Thrillers"
                movies={movieData.actionMovies}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div>
              <MovieRow
                title="Comedies"
                movies={movieData.comedyMovies}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div>
              <MovieRow
                title="Scary Movies"
                movies={movieData.horrorMovies}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div>
              <MovieRow
                title="Romance Movies"
                movies={movieData.romanceMovies}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div>
              <MovieRow
                title="Documentaries"
                movies={movieData.documentaries}
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
