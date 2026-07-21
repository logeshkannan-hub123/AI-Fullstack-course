import api from "./api";

export function getMovies() {
  return api.get("/movies");
}

export function createMovie(movie) {
  return api.post("/movies", movie);
}

export function updateMovie(id, movie) {
  return api.put(`/movies/${id}`, movie);
}

export function deleteMovie(id) {
  return api.delete(`/movies/${id}`);
}
