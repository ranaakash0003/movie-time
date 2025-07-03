// services/watchlistService.js - Watchlist Management Service
const watchlistService = {
  getWatchlist: (userId) => {
    const key = `watchlist_${userId}`;
    const watchlist = localStorage.getItem(key);
    return watchlist ? JSON.parse(watchlist) : [];
  },

  addToWatchlist: (userId, movie) => {
    const key = `watchlist_${userId}`;
    const watchlist = watchlistService.getWatchlist(userId);
    if (!watchlist.find((m) => m.id === movie.id)) {
      watchlist.push(movie);
      localStorage.setItem(key, JSON.stringify(watchlist));
      return true;
    }
    return false; // Movie already in watchlist
  },

  removeFromWatchlist: (userId, movieId) => {
    const key = `watchlist_${userId}`;
    const watchlist = watchlistService.getWatchlist(userId);
    const filtered = watchlist.filter((m) => m.id !== movieId);
    localStorage.setItem(key, JSON.stringify(filtered));
    return true;
  },

  isInWatchlist: (userId, movieId) => {
    const watchlist = watchlistService.getWatchlist(userId);
    return watchlist.some((m) => m.id === movieId);
  },

  clearWatchlist: (userId) => {
    const key = `watchlist_${userId}`;
    localStorage.removeItem(key);
  },

  getWatchlistCount: (userId) => {
    const watchlist = watchlistService.getWatchlist(userId);
    return watchlist.length;
  },
};
export default watchlistService;
