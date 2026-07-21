import { getReleaseYear } from "../../utils/helpers.js";
import "./MovieCard.css";

// Backend has no poster image field, so each card gets a deterministic
// gradient "poster" seeded from the title, plus the title initial.
const GRADIENTS = [
  "linear-gradient(135deg, #6366f1, #8b5cf6)",
  "linear-gradient(135deg, #06b6d4, #3b82f6)",
  "linear-gradient(135deg, #f97316, #ef4444)",
  "linear-gradient(135deg, #10b981, #14b8a6)",
  "linear-gradient(135deg, #ec4899, #f43f5e)",
  "linear-gradient(135deg, #a855f7, #6366f1)",
];

function posterGradient(title = "") {
  const sum = [...title].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return GRADIENTS[sum % GRADIENTS.length];
}

export default function MovieCard({ movie, onEdit, onDelete }) {
  return (
    <article className="movie-card">
      <div className="movie-poster" style={{ background: posterGradient(movie.MovieTitle) }}>
        <span>{movie.MovieTitle?.charAt(0)?.toUpperCase() || "?"}</span>
        <span className="movie-rating-badge">⭐ {movie.Movie_Rating}</span>
      </div>

      <div className="movie-body">
        <h3 className="movie-title" title={movie.MovieTitle}>
          {movie.MovieTitle}
        </h3>

        <p className="movie-meta">
          <strong>Director:</strong> {movie.Director}
        </p>
        <p className="movie-meta">
          <strong>Starring:</strong> {movie.Starring?.join(", ")}
        </p>
        <p className="movie-meta">
          <strong>Language:</strong> {movie.Language}
        </p>
        <p className="movie-meta">
          <strong>Year:</strong> {getReleaseYear(movie.Release_Date)}
        </p>

        <div className="movie-tags">
          <span className="tag tag-quality">{movie.Quality}</span>
          {movie.Genres?.map((genre) => (
            <span className="tag" key={genre}>
              {genre}
            </span>
          ))}
        </div>
      </div>

      <div className="movie-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={() => onEdit(movie)}>
          Edit
        </button>
        <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(movie)}>
          Delete
        </button>
      </div>
    </article>
  );
}
