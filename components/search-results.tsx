"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { type Movie, tmdbApi } from "@/lib/tmdb"
import { MovieCard } from "./movie-card"
import { Button } from "@/components/ui/button"

interface SearchResultsProps {
  query: string
  onClose: () => void
  onMovieClick: (movie: Movie) => void
}

export function SearchResults({ query, onClose, onMovieClick }: SearchResultsProps) {
  const [results, setResults] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const searchMovies = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      setError("")

      try {
        const searchResults = await tmdbApi.searchMovies(query.trim())
        // Filter out results without images
        const filteredResults = searchResults.filter((movie) => movie.poster_path || movie.backdrop_path)
        setResults(filteredResults)
      } catch (err) {
        console.error("Search error:", err)
        setError("Failed to search movies. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchMovies, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  if (!query.trim()) return null

  return (
    <div className="fixed inset-0 bg-[#141414] z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-[#141414] border-b border-gray-800 p-4 lg:px-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">Search results for "{query}"</h1>
            {!loading && (
              <p className="text-gray-400 text-sm mt-1">
                {results.length} {results.length === 1 ? "result" : "results"} found
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800 rounded-full" onClick={onClose}>
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:px-16 py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="w-full h-[240px] md:h-[280px] lg:h-[320px] bg-gray-700 animate-pulse rounded-md"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white">
              Try Again
            </Button>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-2">No results found for "{query}"</p>
            <p className="text-gray-500 text-sm">Try searching for a different title, actor, or genre</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((movie, index) => (
              <div key={`${movie.id}-${index}`} className="flex justify-center">
                <MovieCard movie={movie} onClick={() => onMovieClick(movie)} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
