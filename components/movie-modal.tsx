"use client"

import { useState, useEffect } from "react"
import { X, Play, Plus, ThumbsUp, ThumbsDown, VolumeX, Volume2, Check } from "lucide-react"
import { type Movie, type MovieDetails, tmdbApi, getImageUrl } from "@/lib/tmdb"
import { Button } from "@/components/ui/button"
import { SeasonDropdown } from "./season-dropdown"

interface Episode {
  id: number
  name: string
  overview: string
  episode_number: number
  season_number: number
  still_path: string | null
  runtime: number
  air_date: string
  vote_average: number
}

interface Season {
  id: number
  name: string
  episode_count: number
  season_number: number
  episodes?: Episode[]
}

interface MovieModalProps {
  movie: Movie | null
  isOpen: boolean
  onClose: () => void
  isInMyList?: boolean
  onAddToList?: () => void
  onRemoveFromList?: () => void
}

export function MovieModal({
  movie,
  isOpen,
  onClose,
  isInMyList = false,
  onAddToList,
  onRemoveFromList,
}: MovieModalProps) {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [episodesLoading, setEpisodesLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    if (movie && isOpen) {
      setLoading(true)
      setMovieDetails(null)
      setEpisodes([])
      setSeasons([])
      setSimilarMovies([])
      setShowTrailer(false)
      setSelectedSeason(1)

      const fetchDetails = async () => {
        try {
          const details = movie.title ? await tmdbApi.getMovieDetails(movie.id) : await tmdbApi.getTVDetails(movie.id)
          setMovieDetails(details)

          // Auto-show trailer if available
          if (details.videos?.results?.length > 0) {
            setShowTrailer(true)
          }

          // Fetch episodes for TV shows
          if (!movie.title) {
            try {
              const tvResponse = await fetch(
                `https://api.themoviedb.org/3/tv/${movie.id}?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c&append_to_response=season/1`,
              )
              const tvData = await tvResponse.json()

              if (tvData.seasons) {
                setSeasons(tvData.seasons.filter((season: Season) => season.season_number > 0))
              }

              // Fetch first season episodes
              const seasonResponse = await fetch(
                `https://api.themoviedb.org/3/tv/${movie.id}/season/1?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c`,
              )
              const seasonData = await seasonResponse.json()
              if (seasonData.episodes) {
                setEpisodes(seasonData.episodes)
              }
            } catch (error) {
              console.error("Error fetching TV show details:", error)
            }
          }

          // Fetch similar content
          try {
            const similarResponse = await fetch(
              `https://api.themoviedb.org/3/${movie.title ? "movie" : "tv"}/${movie.id}/similar?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c`,
            )
            const similarData = await similarResponse.json()
            setSimilarMovies(similarData.results?.slice(0, 12) || [])
          } catch (error) {
            console.error("Error fetching similar content:", error)
          }
        } catch (error) {
          console.error("Error fetching movie details:", error)
        } finally {
          setLoading(false)
        }
      }
      fetchDetails()
    }
  }, [movie, isOpen])

  const handleSeasonChange = async (seasonNumber: number) => {
    if (!movie || movie.title) return

    setSelectedSeason(seasonNumber)
    setEpisodesLoading(true)

    try {
      const seasonResponse = await fetch(
        `https://api.themoviedb.org/3/tv/${movie.id}/season/${seasonNumber}?api_key=06dd8bb7f4f960bc7d4567e2f5fedd0c`,
      )
      const seasonData = await seasonResponse.json()
      if (seasonData.episodes) {
        setEpisodes(seasonData.episodes)
      }
    } catch (error) {
      console.error("Error fetching season episodes:", error)
    } finally {
      setEpisodesLoading(false)
    }
  }

  if (!movie) return null

  const trailer =
    movieDetails?.videos?.results?.find((video) => video.type === "Trailer" && video.site === "YouTube") ||
    movieDetails?.videos?.results?.[0]

  const handleListToggle = () => {
    if (isInMyList) {
      onRemoveFromList?.()
    } else {
      onAddToList?.()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-[95vw] max-w-6xl h-[90vh] bg-[#181818] text-white rounded-lg overflow-hidden shadow-2xl">
        <div className="relative h-full overflow-y-auto netflix-scrollbar">
          {/* Hero Section */}
          <div className="relative h-[50vh] md:h-[60vh] min-h-[400px]">
            {/* Background Image or Video */}
            {showTrailer && trailer ? (
              <div className="relative w-full h-full">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&loop=1&playlist=${trailer.key}`}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  style={{
                    border: "none",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent pointer-events-none" />
              </div>
            ) : (
              <>
                <img
                  src={getImageUrl(movie.backdrop_path, "original") || getImageUrl(movie.poster_path, "original")}
                  alt={movie.title || movie.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
              </>
            )}

            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#181818]/80 via-transparent to-transparent" />

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-black/50 rounded-full w-10 h-10 z-20"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Mute Button */}
            {showTrailer && trailer && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute bottom-4 right-4 bg-transparent border-2 border-white/50 text-white hover:bg-white/20 rounded-full w-10 h-10 z-20"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
            )}

            {/* Content */}
            <div className="absolute bottom-8 left-8 right-8 z-10">
              <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{movie.title || movie.name}</h1>

              <div className="flex items-center space-x-4 mb-6">
                <Button className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-bold rounded-md flex items-center space-x-2 transition-all hover:scale-105">
                  <Play className="w-5 h-5 fill-current" />
                  <span>Play</span>
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-gray-400 text-white hover:bg-gray-700 hover:border-white rounded-full w-12 h-12 p-0 bg-transparent transition-all hover:scale-105"
                  onClick={handleListToggle}
                >
                  {isInMyList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-gray-400 text-white hover:bg-gray-700 hover:border-white rounded-full w-12 h-12 p-0 bg-transparent transition-all hover:scale-105"
                >
                  <ThumbsUp className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-gray-400 text-white hover:bg-gray-700 hover:border-white rounded-full w-12 h-12 p-0 bg-transparent transition-all hover:scale-105"
                >
                  <ThumbsDown className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8">
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-700 rounded animate-pulse w-1/2" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-green-400 font-bold text-lg">
                      {Math.round(movie.vote_average * 10)}% Match
                    </span>
                    <span className="text-gray-300">
                      {movie.release_date?.split("-")[0] || movie.first_air_date?.split("-")[0]}
                    </span>
                    <span className="border border-gray-400 px-2 py-1 text-sm text-gray-300 rounded">16+</span>
                    {movieDetails?.runtime && (
                      <span className="text-gray-300">
                        {Math.floor(movieDetails.runtime / 60)}h {movieDetails.runtime % 60}m
                      </span>
                    )}
                    <span className="border border-gray-400 px-2 py-1 text-sm text-gray-300 rounded">HD</span>
                  </div>

                  <p className="text-gray-300 mb-6 text-lg leading-relaxed">{movie.overview}</p>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  <div>
                    <span className="text-gray-400">Cast: </span>
                    <span className="text-white">
                      {movieDetails?.credits?.cast
                        ?.slice(0, 4)
                        .map((actor) => actor.name)
                        .join(", ") || "Cast information not available"}
                    </span>
                  </div>

                  {movieDetails?.genres && (
                    <div>
                      <span className="text-gray-400">Genres: </span>
                      <span className="text-white">{movieDetails.genres.map((genre) => genre.name).join(", ")}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-gray-400">This {movie.title ? "movie" : "show"} is: </span>
                    <span className="text-white">
                      {movieDetails?.genres
                        ?.slice(0, 3)
                        .map((genre) => {
                          // Convert genre names to descriptive adjectives
                          const descriptors: { [key: string]: string } = {
                            Action: "Action-packed",
                            Adventure: "Thrilling", 
                            Animation: "Animated",
                            Comedy: "Hilarious",
                            Crime: "Suspenseful",
                            Documentary: "Informative",
                            Drama: "Emotional",
                            Family: "Family-friendly",
                            Fantasy: "Magical",
                            History: "Historical",
                            Horror: "Terrifying",
                            Music: "Musical",
                            Mystery: "Mysterious",
                            Romance: "Romantic",
                            "Science Fiction": "Futuristic",
                            "TV Movie": "Compelling",
                            Thriller: "Intense",
                            War: "Epic",
                            Western: "Classic"
                          };
                          return descriptors[genre.name] || genre.name;
                        })
                        .join(", ") || "Entertaining"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Episodes Section (for TV shows) */}
            {!movie.title && seasons.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Episodes</h3>
                  <SeasonDropdown
                    seasons={seasons}
                    selectedSeason={selectedSeason}
                    onSeasonChange={handleSeasonChange}
                  />
                </div>

                {episodesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex space-x-4 p-4">
                        <div className="w-8 h-6 bg-gray-700 rounded animate-pulse" />
                        <div className="w-40 h-24 bg-gray-700 rounded animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-700 rounded animate-pulse" />
                          <div className="h-3 bg-gray-700 rounded animate-pulse w-3/4" />
                          <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto netflix-scrollbar">
                    {episodes.map((episode) => (
                      <div
                        key={episode.id}
                        className="flex space-x-4 p-4 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors group"
                      >
                        <div className="text-2xl font-bold text-gray-400 w-8 flex-shrink-0">
                          {episode.episode_number}
                        </div>
                        <div className="relative flex-shrink-0">
                          <img
                            src={
                              episode.still_path
                                ? getImageUrl(episode.still_path)
                                : getImageUrl(movie.backdrop_path) || "/placeholder.svg?height=90&width=160"
                            }
                            alt={episode.name}
                            className="w-40 h-24 object-cover rounded"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                            <Play className="w-8 h-8 text-white fill-current" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-lg truncate pr-2">{episode.name}</h4>
                            <span className="text-gray-400 text-sm flex-shrink-0">{episode.runtime || 45}m</span>
                          </div>
                          <p className="text-gray-400 text-sm leading-relaxed mb-2 line-clamp-3">
                            {episode.overview || "No description available for this episode."}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>★ {episode.vote_average.toFixed(1)}</span>
                            <span>{episode.air_date}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* More Like This */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-6">More Like This</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto netflix-scrollbar">
                {similarMovies.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 cursor-pointer transition-colors group"
                  >
                    <div className="relative">
                      <img
                        src={
                          getImageUrl(item.backdrop_path || item.poster_path) || "/placeholder.svg?height=180&width=320"
                        }
                        alt={item.title || item.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-8 h-8 text-white fill-current" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-green-400 font-bold">{Math.round(item.vote_average * 10)}% Match</span>
                        <span className="border border-gray-400 px-1 text-xs rounded">16+</span>
                      </div>
                      <h4 className="text-white font-semibold mb-2 line-clamp-1">{item.title || item.name}</h4>
                      <p className="text-gray-400 text-sm line-clamp-3">
                        {item.overview || "No description available for this title."}
                      </p>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                        <span>★ {item.vote_average.toFixed(1)}</span>
                        <span>{item.release_date?.split("-")[0] || item.first_air_date?.split("-")[0]}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
