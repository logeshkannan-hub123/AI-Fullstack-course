import "../css/MovieList.css";
import MovieCard from "./MovieCard";

function MovieList({ movies, onSelectMovie, detailsLoading }) {
  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          key={movie.imdbID}
          movie={movie}
          onSelectMovie={onSelectMovie}
          detailsLoading={detailsLoading}
        />
      ))}
    </div>
  );
}

export default MovieList;
