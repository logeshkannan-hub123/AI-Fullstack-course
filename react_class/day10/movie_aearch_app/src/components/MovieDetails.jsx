import "../css/MovieDetails.css";

function MovieDetails({ movie }) {
  // Don't render anything if no movie is selected
  if (!movie) {
    return null;
  }

  const poster =
    movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <div className="movie-details">
      <h2>Movie Details</h2>

      <img src={poster} alt={movie.Title} />

      <h3>{movie.Title}</h3>

      <p>
        <strong>Year:</strong> {movie.Year}
      </p>

      <p>
        <strong>Released:</strong> {movie.Released}
      </p>

      <p>
        <strong>Genre:</strong> {movie.Genre}
      </p>

      <p>
        <strong>Runtime:</strong> {movie.Runtime}
      </p>

      <p>
        <strong>Actors:</strong> {movie.Actors}
      </p>

      <p>
        <strong>Director:</strong> {movie.Director}
      </p>

      <p>
        <strong>Writer:</strong> {movie.Writer}
      </p>

      <p>
        <strong>Language:</strong> {movie.Language}
      </p>

      <p>
        <strong>Country:</strong> {movie.Country}
      </p>

      <p>
        <strong>IMDb Rating:</strong> {movie.imdbRating}
      </p>

      <p>
        <strong>Plot:</strong> {movie.Plot}
      </p>
    </div>
  );
}

export default MovieDetails;
