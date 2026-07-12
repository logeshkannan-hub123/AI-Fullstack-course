import "../css/MovieCard.css";

function MovieCard({ movie, onSelectMovie }) {
  // If poster is not available, show a placeholder image
  const poster =
    movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <div className="movie-card">
      <img src={poster} alt={movie.Title} />

      <h3>{movie.Title}</h3>

      <p>Year: {movie.Year}</p>

      <button onClick={() => onSelectMovie(movie.imdbID)}>View Details</button>
    </div>
  );
}

export default MovieCard;
