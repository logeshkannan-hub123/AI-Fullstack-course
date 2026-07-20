import React, { useState } from "react";

const QUALITY_OPTIONS = [
  "WEB-DL 4K",
  "WEB-DL 1080p",
  "BluRay 4K",
  "BluRay 1080p",
  "Original HD",
];

// Builds the form's local state from an existing movie (edit mode)
// or empty defaults (add mode).
function toFormState(movie) {
  return {
    MovieTitle: movie?.MovieTitle || "",
    Director: movie?.Director || "",
    Starring: movie?.Starring?.join(", ") || "",
    Quality: movie?.Quality || QUALITY_OPTIONS[0],
    Genres: movie?.Genres?.join(", ") || "",
    Language: movie?.Language || "Tamil",
    Movie_Rating: movie?.Movie_Rating ?? "",
    Release_Date: movie?.Release_Date ? movie.Release_Date.slice(0, 10) : "",
  };
}

// Same form is used for both adding a new movie and editing an existing one.
// Pass initialMovie to edit; omit it (or pass null) to add.
function MovieForm({ initialMovie, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => toFormState(initialMovie));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const isEditing = Boolean(initialMovie);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    const movieData = {
      MovieTitle: form.MovieTitle.trim(),
      Director: form.Director.trim(),
      Starring: form.Starring.split(",").map((name) => name.trim()).filter(Boolean),
      Quality: form.Quality,
      Genres: form.Genres.split(",").map((genre) => genre.trim()).filter(Boolean),
      Language: form.Language.trim(),
      Movie_Rating: Number(form.Movie_Rating),
      Release_Date: form.Release_Date,
    };

    try {
      await onSubmit(movieData);
      if (!isEditing) {
        setForm(toFormState(null));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="movie-form-section">
      <h2>{isEditing ? "Update Movie" : "Add Movie"}</h2>

      <form onSubmit={handleSubmit} className="movie-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="movie-title">Movie Title</label>
            <input
              id="movie-title"
              type="text"
              value={form.MovieTitle}
              onChange={handleChange("MovieTitle")}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="movie-director">Director</label>
            <input
              id="movie-director"
              type="text"
              value={form.Director}
              onChange={handleChange("Director")}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="movie-starring">Starring (comma separated)</label>
            <input
              id="movie-starring"
              type="text"
              value={form.Starring}
              onChange={handleChange("Starring")}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="movie-quality">Quality</label>
            <select id="movie-quality" value={form.Quality} onChange={handleChange("Quality")}>
              {QUALITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="movie-genres">Genres (comma separated)</label>
            <input
              id="movie-genres"
              type="text"
              value={form.Genres}
              onChange={handleChange("Genres")}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="movie-language">Language</label>
            <input
              id="movie-language"
              type="text"
              value={form.Language}
              onChange={handleChange("Language")}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="movie-rating">Rating (0-10)</label>
            <input
              id="movie-rating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={form.Movie_Rating}
              onChange={handleChange("Movie_Rating")}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="movie-release-date">Release Date</label>
            <input
              id="movie-release-date"
              type="date"
              value={form.Release_Date}
              onChange={handleChange("Release_Date")}
              required
            />
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : isEditing ? "Update Movie" : "Add Movie"}
          </button>

          {isEditing && (
            <button type="button" className="secondary-button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default MovieForm;
