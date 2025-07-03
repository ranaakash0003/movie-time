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
  Heart,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getImageBasePath } from "../constants";
import { APIs } from "../services/movieService";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    // const fetchDetails = async () => {
    //   try {
    //     setLoading(true);
    //     const res = await axios.get(
    //       `https://www.omdbapi.com/?apikey=YOUR_KEY&i=${id}&plot=full`
    //     );
    //     if (res.data.Response === "True") {
    //       setMovie(res.data);
    //     } else {
    //       console.error("Movie not found");
    //     }
    //   } catch (error) {
    //     console.error("Error fetching movie details:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    if (id) {
      fetchDetails(id);
    }
  }, [id]);

  useEffect(() => {
    if (user) {
      const stored =
        JSON.parse(localStorage.getItem(`watchlist_${user.id}`)) || [];
      setWatchlist(stored);
      setIsInWatchlist(stored.some((m) => m.imdbID === id));
    }
  }, [user, id]);

  const fetchDetails = async (id) => {
    try {
      setLoading(true);
      const data = await APIs.getMovieDetails(id);
      console.log("ggggggggggg", data);
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
      updated = watchlist.filter((m) => m.imdbID !== id);
    } else {
      updated = [
        ...watchlist,
        { ...movie, dateAdded: new Date().toISOString() },
      ];
    }

    setWatchlist(updated);
    setIsInWatchlist(!isInWatchlist);
    localStorage.setItem(`watchlist_${user.id}`, JSON.stringify(updated));
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
      {/* Hero Section with Backdrop */}
      <div className="relative h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={backdropUrl}
            alt={movie.Title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute z-20 top-20 left-4 sm:left-8 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all hover:scale-110 backdrop-blur-sm cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Poster */}
              <div className="lg:col-span-1">
                <div className="max-w-sm mx-auto lg:mx-0">
                  <img
                    src={posterUrl}
                    alt={movie.Title}
                    className="w-full rounded-xl shadow-2xl border border-gray-700"
                  />
                </div>
              </div>

              {/* Movie Info */}
              <div className="lg:col-span-2 text-center lg:text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                  {movie.Title}
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
                    <span>{movie.vote_count}/10</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <span>{movie.origin_country[0]}</span>
                  </div>
                </div>

                {/* Genres */}
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

                {/* Plot */}
                <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-3xl">
                  {movie.overview}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button className="bg-white hover:bg-gray-200 text-black px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-3">
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

      {/* Additional Details */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Cast & Crew */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">Cast & Crew</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-[var(--primary-color)] font-semibold mb-1">
                    Director
                  </h4>
                  <p className="text-gray-300">{movie.status}</p>
                </div>
                <div>
                  <h4 className="text-[var(--primary-color)] font-semibold mb-1">
                    Writer
                  </h4>
                  <p className="text-gray-300">{movie.status}</p>
                </div>
                <div>
                  <h4 className="text-[var(--primary-color)] font-semibold mb-1">
                    Stars
                  </h4>
                  <p className="text-gray-300">{movie.status}</p>
                </div>
              </div>
            </div>

            {/* Technical Details */}
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
                  <p className="text-gray-300">{movie.original_language}</p>
                </div>
                <div>
                  <h4 className="text-[var(--primary-color)] font-semibold mb-1">
                    Box Office
                  </h4>
                  <p className="text-gray-300">
                    {movie.original_language || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Awards */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-white mb-4">
                Awards & Recognition
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-[var(--primary-color)] font-semibold mb-1">
                    Awards
                  </h4>
                  <p className="text-gray-300">{movie.original_language}</p>
                </div>
                <div>
                  <h4 className="text-[var(--primary-color)] font-semibold mb-1">
                    Metascore
                  </h4>
                  <p className="text-gray-300">
                    {movie.original_language || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
