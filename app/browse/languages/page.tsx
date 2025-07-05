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

export default function BrowseByLanguagesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [myList, setMyList] = useState<number[]>([])
  const [languageData, setLanguageData] = useState<{
    english: Movie[]
    spanish: Movie[]
    french: Movie[]
    german: Movie[]
    italian: Movie[]
    japanese: Movie[]
    korean: Movie[]
    hindi: Movie[]
    chinese: Movie[]
  }>({
    english: [],
    spanish: [],
    french: [],
    german: [],
    italian: [],
    japanese: [],
    korean: [],
    hindi: [],
    chinese: [],
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
    const fetchLanguageContent = async () => {
      try {
        const [english, spanish, french, german, italian, japanese, korean, hindi, chinese] = await Promise.all([
          fetch(
            "https://api.themoviedb.org/3/discover/movie?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_original_language=en&sort_by=popularity.desc",
          ).then((res) => res.json()),
          fetch(
            "https://api.themoviedb.org/3/discover/movie?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_original_language=es&sort_by=popularity.desc",
          ).then((res) => res.json()),
          fetch(
            "https://api.themoviedb.org/3/discover/movie?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_original_language=fr&sort_by=popularity.desc",
          ).then((res) => res.json()),
          fetch(
            "https://api.themoviedb.org/3/discover/movie?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_original_language=de&sort_by=popularity.desc",
          ).then((res) => res.json()),
          fetch(
            "https://api.themoviedb.org/3/discover/movie?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_original_language=it&sort_by=popularity.desc",
          ).then((res) => res.json()),
          fetch(
            "https://api.themoviedb.org/3/discover/movie?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_original_language=ja&sort_by=popularity.desc",
          ).then((res) => res.json()),
          fetch(
            "https://api.themoviedb.org/3/discover/movie?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_original_language=ko&sort_by=popularity.desc",
          ).then((res) => res.json()),
          fetch(
            "https://api.themoviedb.org/3/discover/movie?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_original_language=hi&sort_by=popularity.desc",
          ).then((res) => res.json()),
          fetch(
            "https://api.themoviedb.org/3/discover/movie?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&with_original_language=zh&sort_by=popularity.desc",
          ).then((res) => res.json()),
        ])

        setLanguageData({
          english: english.results || [],
          spanish: spanish.results || [],
          french: french.results || [],
          german: german.results || [],
          italian: italian.results || [],
          japanese: japanese.results || [],
          korean: korean.results || [],
          hindi: hindi.results || [],
          chinese: chinese.results || [],
        })
      } catch (error) {
        console.error("Error fetching language content:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchLanguageContent()
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
        title="Browse by Languages"
        subtitle="Discover amazing content from around the world. Explore movies and shows in different languages and cultures."
        movies={languageData.english}
        gradientFrom="from-cyan-900"
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
                title="English Movies & Shows"
                movies={languageData.english}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Spanish Movies & Shows"
                movies={languageData.spanish}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Korean Movies & Shows"
                movies={languageData.korean}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Japanese Movies & Shows"
                movies={languageData.japanese}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Hindi Movies & Shows"
                movies={languageData.hindi}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="French Movies & Shows"
                movies={languageData.french}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="German Movies & Shows"
                movies={languageData.german}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Italian Movies & Shows"
                movies={languageData.italian}
                onMovieClick={handleMovieClick}
                myList={myList}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
              />
            </div>
            <div className="py-8">
              <MovieRow
                title="Chinese Movies & Shows"
                movies={languageData.chinese}
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
