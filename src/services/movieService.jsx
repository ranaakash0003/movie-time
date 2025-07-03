import axios from "axios";
import {
  TMDB_API_KEY,
  TMDB_API_BASE_URL,
  TMDB_IMAGE_BASE_URL,
} from "../constants";

// Real TMDB API implementation (uncomment to use real API)

export const api = axios.create({
  baseURL: TMDB_API_BASE_URL,
  // params: { api_key: TMDB_API_KEY },
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
      return response.data.results; // single movie detail
    } else {
      response = await api.get(`/movie/${searchQuery}?api_key=${TMDB_API_KEY}`);
      return response.data.results; // array of search results
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
};

const searchMovies = async (query) => {
  try {
    const response = await fetch(
      `${TMDB_API_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

const getMovieDetails = async (id) => {
  try {
    const response = await api.get(`/movie/${id}?api_key=${TMDB_API_KEY}`);
    return response.data;

    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }

    // return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const APIs = {
  searchMovies,
  getMovieDetails,
  fetchMovies,
};
