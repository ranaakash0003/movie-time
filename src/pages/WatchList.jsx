import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import watchlistService from "../services/watchlistService";
import { Film, Search } from "lucide-react";
import MovieCard from "../components/MovieCard";

const WatchList = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const userWatchlist = watchlistService.getWatchlist(user.email);
      setWatchlist(userWatchlist);
      setFilteredList(userWatchlist);
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...watchlist];
    if (searchQuery) {
      filtered = filtered.filter(
        (movie) =>
          movie.original_title
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          movie.genre?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredList(filtered);
  }, [watchlist, searchQuery]);

  const handleRemoveFromWatchlist = (movie) => {
    watchlistService.removeFromWatchlist(user.email, movie.id);
    const updatedWatchlist = watchlistService.getWatchlist(user.email);
    setWatchlist(updatedWatchlist);
  };

  const removeAllFromWatchlist = (userEmail) => {
    watchlistService.clearWatchlist(userEmail);
    setWatchlist([]);
  };

  const handleMovieDetails = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Please sign in to view your watchlist
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Watchlist</h1>
          <p className="text-gray-400">
            Your personal collection of movies to watch
          </p>
        </div>

        {watchlist.length === 0 ? (
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-gray-800">
            <Film className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">
              Your watchlist is empty
            </h2>
            <p className="text-gray-400 mb-8">
              Start adding movies from the browse page to create your personal
              collection
            </p>
            <button
              onClick={() => navigate("/search")}
              className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white px-8 py-3 rounded-lg font-medium transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Browse Movies
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-800">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your movies..."
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-gray-400 text-sm">
                  {filteredList.length === watchlist.length ? (
                    <>
                      <span className="font-semibold text-[var(--primary-color)]">
                        {watchlist.length}
                      </span>{" "}
                      {watchlist.length === 1 ? "movie" : "movies"} in your
                      watchlist
                      <span
                        className="text-[var(--primary-color)] cursor-pointer px-6 hover:underline"
                        onClick={() => removeAllFromWatchlist(user.email)}
                      >
                        Remove All
                      </span>
                    </>
                  ) : (
                    <>
                      Showing{" "}
                      <span className="font-semibold text-[var(--primary-color)]">
                        {filteredList.length}
                      </span>{" "}
                      of{" "}
                      <span className="font-semibold text-[var(--primary-color)]">
                        {watchlist.length}
                      </span>{" "}
                      movies
                    </>
                  )}
                </p>
              </div>
            </div>
            {filteredList.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No movies found
                </h3>
                <p className="text-gray-400">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredList.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onDetails={handleMovieDetails}
                    onWatchlistToggle={handleRemoveFromWatchlist}
                    isInWatchlist={true}
                    showRemove={true}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WatchList;
