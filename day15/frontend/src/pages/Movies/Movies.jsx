import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteMovie, getMovies } from "../../services/movieService.js";
import MovieCard from "../../components/MovieCard/MovieCard.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog.jsx";
import { getErrorMessage } from "../../utils/helpers.js";
import "./Movies.css";

export default function Movies() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [movieToDelete, setMovieToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadMovies = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getMovies();
      setMovies(data.data || []);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load movies."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  async function handleConfirmDelete() {
    if (!movieToDelete) return;
    setDeleting(true);
    try {
      await deleteMovie(movieToDelete._id);
      setMovies((prev) => prev.filter((movie) => movie._id !== movieToDelete._id));
      setMovieToDelete(null);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete movie."));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="page-container">
      <div className="movies-header">
        <div>
          <h1>My Movie Collection</h1>
          <p className="movies-subtitle">{movies.length} movie(s) in your library</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => navigate("/movies/add")}>
          + Add Movie
        </button>
      </div>

      {error && <p className="alert alert-error">{error}</p>}

      {loading ? (
        <Loader label="Loading movies..." />
      ) : movies.length === 0 ? (
        <div className="empty-state">
          <h3>No movies yet</h3>
          <p>Start building your collection by adding your first movie.</p>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onEdit={(m) => navigate(`/movies/edit/${m._id}`, { state: { movie: m } })}
              onDelete={(m) => setMovieToDelete(m)}
            />
          ))}
        </div>
      )}

      {movieToDelete && (
        <ConfirmDialog
          title="Delete movie?"
          message={`This will permanently remove "${movieToDelete.MovieTitle}" from your collection.`}
          confirmLabel={deleting ? "Deleting..." : "Delete"}
          onConfirm={handleConfirmDelete}
          onCancel={() => !deleting && setMovieToDelete(null)}
        />
      )}
    </div>
  );
}
