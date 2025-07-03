import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function MovieWatchList() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("watchlist")) || [];
    setWatchlist(stored);
  }, []);

  const remove = (id) => {
    const updated = watchlist.filter((m) => m.imdbID !== id);
    setWatchlist(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  if (!user) return <div>Please log in to see your watchlist.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Watchlist</h2>
      {watchlist.map((movie) => (
        <div
          key={movie.imdbID}
          className="mb-2 flex justify-between items-center"
        >
          <span>
            {movie.Title} ({movie.Year})
          </span>
          <button
            className="bg-red-500 text-white px-2"
            onClick={() => remove(movie.imdbID)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
