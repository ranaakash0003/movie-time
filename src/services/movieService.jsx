import axios from "axios";
import { TMDB_API_KEY, TMDB_API_BASE_URL } from "../constants";

export const api = axios.create({
  baseURL: TMDB_API_BASE_URL,
});

const fetchMovies = async (searchQuery, type = "") => {
  try {
    let response;

    if (type === "search") {
      response = await api.get(
        `/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
          searchQuery
        )}`
      );
      return response.data.results;
    } else {
      response = await api.get(`/movie/${searchQuery}?api_key=${TMDB_API_KEY}`);
      return response.data.results;
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
};

const getMovieDetails = async (id) => {
  try {
    const response = await api.get(`/movie/${id}?api_key=${TMDB_API_KEY}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const APIs = {
  getMovieDetails,
  fetchMovies,
};
