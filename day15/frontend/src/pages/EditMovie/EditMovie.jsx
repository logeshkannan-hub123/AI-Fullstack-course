import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MovieForm from "../../components/MovieForm/MovieForm.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import { getMovies, updateMovie } from "../../services/movieService.js";
import { getErrorMessage, toDateInputValue } from "../../utils/helpers.js";
import "../AddMovie/AddMovie.css";

export default function EditMovie() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(location.state?.movie || null);
  const [loading, setLoading] = useState(!location.state?.movie);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    // Backend has no "get single movie" endpoint, so if the movie wasn't
    // passed via navigation state (e.g. direct URL visit/refresh), fall
    // back to fetching the full list and picking it out.
    if (movie) return;

    async function loadMovie() {
      setLoading(true);
      setLoadError("");
      try {
        const { data } = await getMovies();
        const found = (data.data || []).find((m) => m._id === id);
        if (!found) {
          setLoadError("Movie not found.");
          return;
        }
        setMovie(found);
      } catch (error) {
        setLoadError(getErrorMessage(error, "Failed to load movie."));
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [id, movie]);

  async function handleSubmit(payload) {
    setServerError("");
    setSubmitting(true);
    try {
      const { data } = await updateMovie(id, payload);
      if (!data.success) {
        setServerError(data.message || "Failed to update movie.");
        return;
      }
      navigate("/movies");
    } catch (error) {
      setServerError(getErrorMessage(error, "Failed to update movie."));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="page-container add-movie-page">
        <Loader label="Loading movie..." />
      </div>
    );
  }

  if (loadError || !movie) {
    return (
      <div className="page-container add-movie-page">
        <p className="alert alert-error">{loadError || "Movie not found."}</p>
      </div>
    );
  }

  return (
    <div className="page-container add-movie-page">
      <h1>Edit Movie</h1>
      <p className="movies-subtitle">Update the details for “{movie.MovieTitle}”.</p>

      <MovieForm
        initialValues={{
          MovieTitle: movie.MovieTitle,
          Director: movie.Director,
          Starring: (movie.Starring || []).join(", "),
          Quality: movie.Quality,
          Genres: (movie.Genres || []).join(", "),
          Language: movie.Language,
          Movie_Rating: String(movie.Movie_Rating ?? ""),
          Release_Date: toDateInputValue(movie.Release_Date),
        }}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Save Changes"
        serverError={serverError}
      />
    </div>
  );
}
