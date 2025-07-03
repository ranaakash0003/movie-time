import { useState, useEffect } from "react";
import { Search, Filter, X, Loader } from "lucide-react";
import MovieCard from "../components/MovieCard";
import { APIs } from "../services/movieService";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "War",
    "Western",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const searchMovies = async (searchQuery, type) => {
    if (!searchQuery || !searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await APIs.fetchMovies(searchQuery, type);
      setResults(res || []);
    } catch (error) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedGenre("");
    setSelectedYear("");
    setShowFilters(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchMovies(query, "search");
    }
  };

  // Popular movies on initial load - only run once
  useEffect(() => {
    searchMovies("popular");
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-gray-900 via-black to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Discover Amazing Movies
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore thousands of movies, create your personal watchlist, and
              never miss a great film again.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-gray-900/80 backdrop-blur-md border border-gray-700 rounded-full py-4 pl-12 pr-32 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent text-lg"
                placeholder="Search for movies, actors, directors..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-2">
                <button
                  onClick={() => searchMovies(query, "search")}
                  disabled={loading}
                  className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white px-6 py-2 rounded-full transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader className="w-12 h-12 text-[var(--primary-color)] mx-auto mb-4 animate-spin" />
              <p className="text-gray-400">Searching for movies...</p>
            </div>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {query ? `Search Results for "${query}"` : "Popular Movies"}
              </h2>
              <p className="text-gray-400">
                {results.length} {results.length === 1 ? "movie" : "movies"}{" "}
                found
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={{
                    ...movie,
                    id: movie.id,
                    title: movie.Title,
                    poster_path:
                      movie.poster_path !== "N/A" ? movie.poster_path : null,
                    release_date: movie.Year,
                    vote_average: 0, // OMDb doesn't provide ratings in search
                  }}
                />
              ))}
            </div>
          </>
        ) : query ? (
          <div className="text-center py-20">
            <div className="bg-gray-900/50 rounded-xl p-12 max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No movies found
              </h3>
              <p className="text-gray-400 mb-6">
                Try searching with different keywords or check your spelling.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  searchMovies("popular");
                }}
                className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white px-6 py-2 rounded-lg transition-all hover:scale-105"
              >
                Browse Popular Movies
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
