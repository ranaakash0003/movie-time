// API Configuration Constants
export const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// API Key - In production, this should come from environment variables
export const TMDB_API_KEY =
  import.meta.env.VITE_TMDB_API_KEY || "766bf879a9cb6abbb38ffc4998e86911";

export const getImageBasePath = (imageSize) => {
  return `https://image.tmdb.org/t/p/${imageSize || "w220_and_h330_face"}`;
};

// Image sizes for TMDB
export const IMAGE_SIZES = {
  poster: {
    small: "w185",
    medium: "w342",
    large: "w500",
    original: "original",
  },
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
};
