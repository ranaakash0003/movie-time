import React from "react";
import { Star, Plus, Minus, Eye, Calendar, Play } from "lucide-react";
import { TMDB_IMAGE_BASE_URL } from "../constants";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getImageBasePath } from "../constants";

const MovieCard = ({
  movie,
  onDetails,
  onWatchlistToggle,
  isInWatchlist,
  showRemove = false,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDetailsClick = () => {
    if (onDetails) {
      onDetails(movie.id);
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  const handleWatchlistClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (onWatchlistToggle) {
      onWatchlistToggle(movie);
    }
  };

  // const posterUrl = movie.poster_path
  //   ? movie.poster_path.startsWith("http")
  //     ? movie.poster_path
  //     : `${TMDB_IMAGE_BASE_URL}/w300${movie.poster_path}`
  //   : "/api/placeholder/300/450";

  const posterUrl = `${getImageBasePath()}${movie.poster_path}`;

  return (
    <div className="group relative bg-gray-900/80 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 hover:border-[var(--primary-color)]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {/* Movie Poster */}
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "/api/placeholder/300/450";
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs font-medium">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        )}

        {/* Play Button Overlay */}
        {/* <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleDetailsClick}
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-4 rounded-full transition-all duration-200 hover:scale-110"
          >
            <Play className="w-8 h-8 fill-current" />
          </button>
        </div> */}
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 group-hover:text-[var(--primary-color)] transition-colors">
          {movie.title}
        </h3>

        {movie.release_date && (
          <p className="text-gray-400 text-xs mb-3 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(movie.release_date).getFullYear()}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleDetailsClick}
            className="flex-1 bg-white hover:bg-gray-200 text-black py-2 px-3 rounded-md transition-all duration-200 flex items-center justify-center gap-2 text-xs font-semibold hover:scale-105"
          >
            <Eye className="w-3 h-3" />
            Details
          </button>

          <button
            onClick={handleWatchlistClick}
            className={`p-2 rounded-md transition-all duration-200 hover:scale-105 ${
              showRemove || isInWatchlist
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white"
            }`}
            title={
              showRemove
                ? "Remove from Watchlist"
                : isInWatchlist
                ? "Remove from Watchlist"
                : "Add to Watchlist"
            }
          >
            {showRemove || isInWatchlist ? (
              <Minus className="w-3 h-3" />
            ) : (
              <Plus className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Hover Effect Glow */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[var(--primary-color)]/20 to-transparent blur-xl" />
      </div>
    </div>
  );
};

export default MovieCard;
