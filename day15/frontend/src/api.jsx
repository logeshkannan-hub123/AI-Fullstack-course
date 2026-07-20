// Small wrapper around fetch for talking to the backend.
// Requests use relative paths (e.g. "/movies") because package.json sets
// "proxy": "http://localhost:3000", so the dev server forwards them to the
// backend without needing CORS support there.

async function request(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export function signup(username, email, password) {
  return request("/signup", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export function login(email, password) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function fetchMovies(token) {
  return request("/movies", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function addMovie(token, movieData) {
  return request("/movies", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(movieData),
  });
}

export function updateMovie(token, id, movieData) {
  return request(`/movies/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(movieData),
  });
}

export function deleteMovie(token, id) {
  return request(`/movies/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
