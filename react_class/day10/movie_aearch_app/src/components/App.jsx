import { useRef, useState } from "react";
import "../css/App.css";

import SearchBar from "./SearchBar";
import MovieList from "./MovieList";
import MovieDetails from "./MovieDetails";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

function App() {
  // =========================
  // State
  // =========================

  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [searchLoading, setSearchLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");

  // Abort previous search request
  const searchController = useRef(null);

  // =========================
  // Search Movies
  // =========================

  async function searchMovies() {
    // Prevent multiple clicks
    if (searchLoading) return;

    // Check API Key
    if (!API_KEY) {
      setError("API Key is missing.");
      return;
    }

    // Remove extra spaces
    const query = searchTerm.trim();

    // Empty input
    if (query === "") {
      setError("Please enter a movie name.");
      setMovies([]);
      setSelectedMovie(null);
      return;
    }

    // Minimum characters
    if (query.length < 3) {
      setError("Please enter at least 3 characters.");
      setMovies([]);
      setSelectedMovie(null);
      return;
    }

    // Cancel previous request
    if (searchController.current) {
      searchController.current.abort();
    }

    searchController.current = new AbortController();

    setSearchLoading(true);
    setError("");
    setSelectedMovie(null);

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?s=${encodeURIComponent(
          query,
        )}&apikey=${API_KEY}`,
        {
          signal: searchController.current.signal,
        },
      );

      // HTTP Error
      if (!response.ok) {
        throw new Error("Unable to fetch movies.");
      }

      const data = await response.json();

      // OMDb Error
      if (data.Response === "False") {
        setMovies([]);
        setError(data.Error);
        return;
      }

      setMovies(data.Search);
    } catch (err) {
      // Ignore aborted request
      if (err.name === "AbortError") {
        return;
      }

      setMovies([]);
      setError(err.message || "Something went wrong.");
    } finally {
      setSearchLoading(false);
    }
  }

  // =========================
  // Movie Details
  // =========================

  async function selectMovie(id) {
    // Prevent multiple clicks
    if (detailsLoading) return;

    if (!API_KEY) {
      setError("API Key is missing.");
      return;
    }

    setDetailsLoading(true);
    setError("");
    setSelectedMovie(null);

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`,
      );

      if (!response.ok) {
        throw new Error("Unable to fetch movie details.");
      }

      const data = await response.json();

      if (data.Response === "False") {
        setError(data.Error);
        return;
      }

      setSelectedMovie(data);
    } catch (err) {
      setError(err.message || "Unable to load movie details.");
    } finally {
      setDetailsLoading(false);
    }
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="container">
      <h1>🎬 Movie Search App</h1>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={searchMovies}
        loading={searchLoading}
      />

      <Loader loading={searchLoading || detailsLoading} />

      <ErrorMessage message={error} />

      <MovieList
        movies={movies}
        onSelectMovie={selectMovie}
        detailsLoading={detailsLoading}
      />

      {selectedMovie && <MovieDetails movie={selectedMovie} />}
    </div>
  );
}

export default App;
