import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieForm from "../../components/MovieForm/MovieForm.jsx";
import { createMovie } from "../../services/movieService.js";
import { getErrorMessage } from "../../utils/helpers.js";
import "./AddMovie.css";

export default function AddMovie() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  async function handleSubmit(payload) {
    setServerError("");
    setSubmitting(true);
    try {
      const { data } = await createMovie(payload);
      if (!data.success) {
        setServerError(data.message || "Failed to add movie.");
        return;
      }
      navigate("/movies");
    } catch (error) {
      setServerError(getErrorMessage(error, "Failed to add movie."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-container add-movie-page">
      <h1>Add a New Movie</h1>
      <p className="movies-subtitle">Fill in the details below to add it to your collection.</p>

      <MovieForm
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Add Movie"
        serverError={serverError}
      />
    </div>
  );
}
