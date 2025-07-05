const API_KEY = "06dd8bb7f4f960bc7d4567e2f5fedd0c"
const BASE_URL = "https://api.themoviedb.org/3"

export interface Movie {
  id: number
  title?: string
  name?: string
  overview: string
  poster_path: string
  backdrop_path: string
  vote_average: number
  release_date?: string
  first_air_date?: string
  genre_ids: number[]
  adult: boolean
  original_language: string
  popularity: number
}

export interface MovieDetails extends Movie {
  runtime?: number
  genres: { id: number; name: string }[]
  production_companies: { id: number; name: string; logo_path: string }[]
  videos: {
    results: {
      id: string
      key: string
      name: string
      site: string
      type: string
    }[]
  }
}

export const tmdbApi = {
  getTrending: async (): Promise<Movie[]> => {
    const response = await fetch(`${BASE_URL}/trending/all/week?api_key=${API_KEY}`)
    const data = await response.json()
    return data.results
  },

  getNetflixOriginals: async (): Promise<Movie[]> => {
    const response = await fetch(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_networks=213`)
    const data = await response.json()
    return data.results
  },

  getTopRated: async (): Promise<Movie[]> => {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`)
    const data = await response.json()
    return data.results
  },

  getActionMovies: async (): Promise<Movie[]> => {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=28`)
    const data = await response.json()
    return data.results
  },

  getComedyMovies: async (): Promise<Movie[]> => {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=35`)
    const data = await response.json()
    return data.results
  },

  getHorrorMovies: async (): Promise<Movie[]> => {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=27`)
    const data = await response.json()
    return data.results
  },

  getRomanceMovies: async (): Promise<Movie[]> => {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=10749`)
    const data = await response.json()
    return data.results
  },

  getDocumentaries: async (): Promise<Movie[]> => {
    const response = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=99`)
    const data = await response.json()
    return data.results
  },

  getMovieDetails: async (id: number): Promise<MovieDetails> => {
    const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`)
    return response.json()
  },

  getTVDetails: async (id: number): Promise<MovieDetails> => {
    const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=videos`)
    return response.json()
  },

  searchMovies: async (query: string): Promise<Movie[]> => {
    const response = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
    const data = await response.json()
    return data.results
  },
}

export const getImageUrl = (path: string, size = "w500") => {
  return `https://image.tmdb.org/t/p/${size}${path}`
}
