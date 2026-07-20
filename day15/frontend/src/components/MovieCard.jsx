import React from "react";

// Displays a single movie. The backend doesn't provide a poster image,
// so we show a placeholder graphic in its place.
function MovieCard({ movie, onEdit, onDelete }) {
  const releaseYear = new Date(movie.Release_Date).getFullYear();

  return (
    <div className="movie-card">
      <div className="movie-poster-placeholder">🎬</div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.MovieTitle}</h3>

        <p className="movie-detail">
          <span className="movie-label">Director:</span> {movie.Director}
        </p>

        <p className="movie-detail">
          <span className="movie-label">Starring:</span> {movie.Starring.join(", ")}
        </p>

        <p className="movie-detail">
          <span className="movie-label">Quality:</span> {movie.Quality}
        </p>

        <p className="movie-detail">
          <span className="movie-label">Language:</span> {movie.Language}
        </p>

        <p className="movie-detail">
          <span className="movie-label">Genre:</span> {movie.Genres.join(", ")}
        </p>

        <p className="movie-detail">
          <span className="movie-label">Year:</span> {releaseYear}
        </p>

        <p className="movie-rating">⭐ {movie.Movie_Rating} / 10</p>

        <div className="movie-actions">
          <button type="button" onClick={() => onEdit(movie)}>
            Edit
          </button>
          <button type="button" className="delete-button" onClick={() => onDelete(movie._id)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
