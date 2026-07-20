import React from "react";
import MovieCard from "./MovieCard";

// Renders the loading / error / empty / grid states for the movie collection.
function MovieList({ movies, loading, error, onEdit, onDelete }) {
  if (loading) {
    return <p className="status-message">Loading movies...</p>;
  }

  if (error) {
    return <p className="status-message error-message">Error: {error}</p>;
  }

  if (movies.length === 0) {
    return <p className="status-message">No movies found. Add one to get started!</p>;
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default MovieList;
