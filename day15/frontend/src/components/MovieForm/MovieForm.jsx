import { useState } from "react";
import { splitToList } from "../../utils/helpers.js";
import "./MovieForm.css";

const QUALITY_OPTIONS = [
  "WEB-DL 4K",
  "WEB-DL 1080p",
  "BluRay 4K",
  "BluRay 1080p",
  "HDRip",
  "Original HD",
];

const EMPTY_FORM = {
  MovieTitle: "",
  Director: "",
  Starring: "",
  Quality: QUALITY_OPTIONS[0],
  Genres: "",
  Language: "",
  Movie_Rating: "",
  Release_Date: "",
};

function validate(form) {
  const errors = {};

  if (!form.MovieTitle.trim()) errors.MovieTitle = "Movie name is required";
  if (!form.Director.trim()) errors.Director = "Director is required";
  if (!form.Starring.trim()) errors.Starring = "At least one cast member is required";
  if (!form.Quality.trim()) errors.Quality = "Quality is required";
  if (!form.Genres.trim()) errors.Genres = "At least one genre is required";
  if (!form.Language.trim()) errors.Language = "Language is required";

  if (form.Movie_Rating === "" || form.Movie_Rating === null) {
    errors.Movie_Rating = "Rating is required";
  } else {
    const rating = Number(form.Movie_Rating);
    if (Number.isNaN(rating) || rating < 0 || rating > 10) {
      errors.Movie_Rating = "Rating must be between 0 and 10";
    }
  }

  if (!form.Release_Date) errors.Release_Date = "Release date is required";

  return errors;
}

export default function MovieForm({
  initialValues = EMPTY_FORM,
  onSubmit,
  submitting = false,
  submitLabel = "Save Movie",
  serverError = "",
}) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initialValues });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit({
      MovieTitle: form.MovieTitle.trim(),
      Director: form.Director.trim(),
      Starring: splitToList(form.Starring),
      Quality: form.Quality,
      Genres: splitToList(form.Genres),
      Language: form.Language.trim(),
      Movie_Rating: Number(form.Movie_Rating),
      Release_Date: form.Release_Date,
    });
  }

  return (
    <form className="movie-form" onSubmit={handleSubmit} noValidate>
      {serverError && <p className="alert alert-error">{serverError}</p>}

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="MovieTitle">Movie Name</label>
          <input
            id="MovieTitle"
            name="MovieTitle"
            type="text"
            value={form.MovieTitle}
            onChange={handleChange}
            className={errors.MovieTitle ? "has-error" : ""}
            placeholder="e.g. Inception"
          />
          {errors.MovieTitle && <span className="field-error">{errors.MovieTitle}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="Director">Director</label>
          <input
            id="Director"
            name="Director"
            type="text"
            value={form.Director}
            onChange={handleChange}
            className={errors.Director ? "has-error" : ""}
            placeholder="e.g. Christopher Nolan"
          />
          {errors.Director && <span className="field-error">{errors.Director}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="Starring">Starring (comma separated)</label>
          <input
            id="Starring"
            name="Starring"
            type="text"
            value={form.Starring}
            onChange={handleChange}
            className={errors.Starring ? "has-error" : ""}
            placeholder="e.g. Leonardo DiCaprio, Tom Hardy"
          />
          {errors.Starring && <span className="field-error">{errors.Starring}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="Quality">Quality</label>
          <select id="Quality" name="Quality" value={form.Quality} onChange={handleChange}>
            {QUALITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="Genres">Genres (comma separated)</label>
          <input
            id="Genres"
            name="Genres"
            type="text"
            value={form.Genres}
            onChange={handleChange}
            className={errors.Genres ? "has-error" : ""}
            placeholder="e.g. Sci-Fi, Thriller"
          />
          {errors.Genres && <span className="field-error">{errors.Genres}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="Language">Language</label>
          <input
            id="Language"
            name="Language"
            type="text"
            value={form.Language}
            onChange={handleChange}
            className={errors.Language ? "has-error" : ""}
            placeholder="e.g. Tamil"
          />
          {errors.Language && <span className="field-error">{errors.Language}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="Movie_Rating">Rating (0-10)</label>
          <input
            id="Movie_Rating"
            name="Movie_Rating"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={form.Movie_Rating}
            onChange={handleChange}
            className={errors.Movie_Rating ? "has-error" : ""}
            placeholder="e.g. 8.5"
          />
          {errors.Movie_Rating && <span className="field-error">{errors.Movie_Rating}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="Release_Date">Release Date</label>
          <input
            id="Release_Date"
            name="Release_Date"
            type="date"
            value={form.Release_Date}
            onChange={handleChange}
            className={errors.Release_Date ? "has-error" : ""}
          />
          {errors.Release_Date && <span className="field-error">{errors.Release_Date}</span>}
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
