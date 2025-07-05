import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Play,
  Plus,
  Minus,
  Star,
  Calendar,
  Clock,
  Globe,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getImageBasePath } from "../constants";
import { APIs } from "../services/movieService";
import watchlistService from "../services/watchListService";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDetails(id);
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      setIsInWatchlist(watchlistService.isInWatchlist(user.email, id));
    }
  }, [user, id]);

  const fetchDetails = async (id) => {
    try {
      setLoading(true);
      const data = await APIs.getMovieDetails(id);
      window.scrollTo(0, 0);
      setMovie(data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    let updated;
    if (isInWatchlist) {
      watchlistService.removeFromWatchlist(user.email, movie.id);
      updated = watchlistService.getWatchlist(user.email);
    } else {
      updated = [
        ...watchlist,
        { ...movie, dateAdded: new Date().toISOString() },
      ];
    }

    setWatchlist(updated);
    setIsInWatchlist(!isInWatchlist);
    localStorage.setItem(`watchlist_${user.email}`, JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--primary-color)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Movie not found
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white px-6 py-3 rounded-lg font-medium transition-all hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  const posterUrl = `${getImageBasePath("w342")}${movie.poster_path}`;
  const backdropUrl = `${getImageBasePath("original")}${movie.backdrop_path}`;
  return (
    <div className="min-h-screen bg-black">
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src={backdropUrl}
            alt={movie.original_title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="absolute z-20 top-20 left-4 sm:left-8 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110 backdrop-blur-sm cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-1">
                <div className="max-w-sm mx-auto lg:mx-0">
                  <img
                    src={posterUrl}
                    alt={movie.original_title}
                    className="w-full rounded-xl shadow-2xl border border-gray-700"
                  />
                </div>
              </div>
              <div className="lg:col-span-2 text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                  {movie.original_title}
                </h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6 text-gray-300">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{movie.release_date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{movie.runtime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{movie.vote_average}/10</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>{movie.origin_country[0]}</span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                  {movie.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="bg-gray-800/80 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-700"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl">
                  {movie.overview}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    className="bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-3"
                    onClick={() => alert("Coming Soon...")}
                  >
                    <Play className="w-6 h-6 fill-current" />
                    Watch Trailer
                  </button>

                  <button
                    onClick={toggleWatchlist}
                    className={`px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-3 ${
                      isInWatchlist
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-[var(--primary-color)] hover:bg-[var(--primary-hover)] text-white"
                    }`}
                  >
                    {isInWatchlist ? (
                      <>
                        <Minus className="w-6 h-6" />
                        Remove from List
                      </>
                    ) : (
                      <>
                        <Plus className="w-6 h-6" />
                        Add to List
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-[var(--primary-color)] font-semibold mb-1">
                    Title
                  </h4>
                  <p className="text-gray-300">{movie.original_title}</p>
                </div>
                <div>
                  <h4 className="text-[var(--primary-color)] font-semibold mb-1">
                    Status
                  </h4>
                  <p className="text-gray-300">{movie.status}</p>
                </div>
                <div>
                  <h4 className="text-[var(--primary-color)] font-semibold mb-1">
                    Runtime
                  </h4>
                  <p className="text-gray-300">{movie.runtime} minutes</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">
                Technical Details
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-[var(--primary-color)] font-semibold mb-1">
                    Language
                  </h4>
                  <p className="text-gray-300">{movie.original_language}</p>
                </div>
                <div>
                  <h4 className="text-[var(--primary-color)] font-semibold mb-1">
                    Rated
                  </h4>
                  <p className="text-gray-300">{movie.adult ? "R" : "PG-13"}</p>
                </div>
                <div>
                  <h4 className="text-[var(--primary-color)] font-semibold mb-1">
                    Box Office
                  </h4>
                  <p className="text-gray-300">{movie.box_office || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">
                Awards & Recognition
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-[var(--primary-color)] font-semibold mb-1">
                    Vote Count
                  </h4>
                  <p className="text-gray-300">{movie.vote_count || "N/A"}</p>
                </div>
                <div>
                  <h4 className="text-[var(--primary-color)] font-semibold mb-1">
                    Metascore
                  </h4>
                  <p className="text-gray-300">{movie.metascore || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
