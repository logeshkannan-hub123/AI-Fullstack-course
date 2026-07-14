import express from "express";
import tamilMovies from "./movie_details.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let nextId = 11;

app.get("/movies", (req, res) => {
  res.status(200).json(tamilMovies);
});

app.get("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id);
  const movie = tamilMovies.find((m) => m.id === movieId);

  if (!movie) {
    return res
      .status(404)
      .json({ message: `Movie with ID ${movieId} not found.` });
  }

  res.status(200).json(movie);
});

app.post("/AddMovie", (req, res) => {
  const {
    MovieTitle,
    Director,
    Starring,
    Quality,
    Genres,
    Language,
    Movie_Rating,
    Release_Date,
  } = req.body;

  // Simple validation to ensure required fields are present
  if (!MovieTitle || !Director) {
    return res
      .status(400)
      .json({ message: "Title and Director are required fields." });
  }

  const newMovie = {
    id: nextId++,
    MovieTitle,
    Director,
    Starring,
    Quality,
    Genres,
    Language,
    Movie_Rating,
    Release_Date,
  };

  tamilMovies.push(newMovie);
  res
    .status(201)
    .json({ message: "Movie added successfully!", data: newMovie });
});

app.put("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id);

  const movieIndex = tamilMovies.findIndex((m) => m.id === movieId);

  if (movieIndex === -1) {
    return res.status(404).json({
      message: `Movie with ID ${movieId} not found.`,
    });
  }

  const movie = tamilMovies[movieIndex];

  const {
    MovieTitle,
    Director,
    Starring,
    Quality,
    Genres,
    Language,
    Movie_Rating,
    Release_Date,
  } = req.body;

  tamilMovies[movieIndex] = {
    ...movie, // Keep existing values
    MovieTitle: MovieTitle,
    Director: Director,
    Starring: Starring,
    Quality: Quality,
    Genres: Genres,
    Language: Language,
    Movie_Rating: Movie_Rating,
    Release_Date: Release_Date,
  };

  res.status(200).json({
    message: "Movie updated successfully!",
    data: tamilMovies[movieIndex],
  });
});

app.delete("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id);
  const movieIndex = tamilMovies.findIndex((m) => m.id === movieId);

  if (movieIndex === -1) {
    return res
      .status(404)
      .json({ message: `Movie with ID ${movieId} not found.` });
  }

  // Remove the object from the array
  const deletedMovie = tamilMovies.splice(movieIndex, 1);

  res
    .status(200)
    .json({ message: "Movie deleted successfully!", data: deletedMovie[0] });
});

app.listen(3000, () => {
  console.log(`the server run url:http://localhost:3000`);
  console.log("Server is running");
});
