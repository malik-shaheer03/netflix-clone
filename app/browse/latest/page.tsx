"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { MovieRow } from "@/components/movie-row"
import { MovieModal } from "@/components/movie-modal"
import { MovieRowSkeleton } from "@/components/loading-skeleton"
import type { Movie } from "@/lib/tmdb"
import { HeroSectionWithContent } from "@/components/hero-section-with-content"

export default function NewAndPopularPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [myList, setMyList] = useState<number[]>([])
  const [contentData, setContentData] = useState<{
    newReleases: Movie[]
    comingSoon: Movie[]
    trending: Movie[]
    topPicks: Movie[]
    worthTheWait: Movie[]
    everyonesWatching: Movie[]
  }>({
    newReleases: [],
    comingSoon: [],
    trending: [],
    topPicks: [],
    worthTheWait: [],
    everyonesWatching: [],
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
    const fetchNewAndPopular = async () => {
      try {
        const currentDate = new Date()
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).toISOString().split("T")[0]
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0).toISOString().split("T")[0]

        const [newReleases, comingSoon, trending, topPicks, worthTheWait, everyonesWatching] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&primary_release_date.gte=${lastMonth}&sort_by=release_date.desc`,
          ).then((res) => res.json()),
          fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&primary_release_date.gte=${currentDate.toISOString().split("T")[0]}&primary_release_date.lte=${nextMonth}&sort_by=release_date.asc`,
          ).then((res) => res.json()),
          fetch("https://api.themoviedb.org/3/trending/all/week?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c").then((res) =>
            res.json(),
          ),
          fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c").then((res) =>
            res.json(),
          ),
          fetch("https://api.themoviedb.org/3/movie/upcoming?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c").then((res) =>
            res.json(),
          ),
          fetch("https://api.themoviedb.org/3/movie/popular?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c").then((res) =>
            res.json(),
          ),
        ])

        setContentData({
          newReleases: newReleases.results || [],
          comingSoon: comingSoon.results || [],
          trending: trending.results || [],
          topPicks: topPicks.results || [],
          worthTheWait: worthTheWait.results || [],
          everyonesWatching: everyonesWatching.results || [],
        })
      } catch (error) {
        console.error("Error fetching new and popular content:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchNewAndPopular()
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
        title="New & Popular"
        subtitle="Stay up to date with the latest releases and trending content. Discover what's new and what everyone's talking about."
        movies={contentData.trending}
        gradientFrom="from-green-900"
        gradientTo="to-blue-900"
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
                title="New Releases"
                movies={contentData.newReleases}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Coming Soon"
                movies={contentData.comingSoon}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Trending Now"
                movies={contentData.trending}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Top Picks for You"
                movies={contentData.topPicks}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Worth the Wait"
                movies={contentData.worthTheWait}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Everyone's Watching"
                movies={contentData.everyonesWatching}
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
