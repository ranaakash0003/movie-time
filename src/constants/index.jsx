export const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const TMDB_API_KEY = "766bf879a9cb6abbb38ffc4998e86911";

export const getImageBasePath = (imageSize) => {
  return `https://image.tmdb.org/t/p/${imageSize || "w342"}`;
};

export const onInitialLoad = () => {
  const defaultUser = { email: "test@gmail.com", password: "test1234" };

  const stored = localStorage.getItem("users");
  const users = stored ? JSON.parse(stored) : [];
  const found = users.find(
    (u) => u.email === defaultUser.email && u.password === defaultUser.password
  );

  if (!found) {
    localStorage.setItem("users", JSON.stringify([...users, defaultUser]));
    localStorage.setItem("user", JSON.stringify(defaultUser));
  }
};
// Image sizes helper for TMDB
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
