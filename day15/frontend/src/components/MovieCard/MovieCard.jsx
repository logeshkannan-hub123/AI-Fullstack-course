import { getReleaseYear } from "../../utils/helpers.js";
import "./MovieCard.css";




export default function MovieCard({ movie, onEdit, onDelete }) {
  return (
    <article className="movie-card">


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
