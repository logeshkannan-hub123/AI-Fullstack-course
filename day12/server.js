import express from "express";
import fs from "fs";
import tamilMovies from "./movie_details.js";

const app = express();

app.use(express.json());

let nextId = 11;

function saveMovies() {
  const fileData = `const tamilMovies = ${JSON.stringify(tamilMovies, null, 2)};
  
export default tamilMovies;
`;

  fs.writeFileSync("./movie_details.js", fileData);
}

app.get("/movies", (req, res) => {
  res.status(200).json(tamilMovies);
});

app.get("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id);
  const movie = tamilMovies.find((movie) => movie.id === movieId);

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

  saveMovies();

  res
    .status(201)
    .json({ message: "Movie added successfully!", data: newMovie });
});

app.put("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id);

  const movieIndex = tamilMovies.findIndex((movie) => movie.id === movieId);

  if (movieIndex === -1) {
    return res.status(404).json({
      message: `Movie with ID ${movieId} not found.`,
    });
  }

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
    id: movieId,
    MovieTitle,
    Director,
    Starring,
    Quality,
    Genres,
    Language,
    Movie_Rating,
    Release_Date,
  };

  saveMovies();

  res.status(200).json({
    message: "Movie updated successfully!",
    data: tamilMovies[movieIndex],
  });
});

app.delete("/movies/:id", (req, res) => {
  const movieId = parseInt(req.params.id);
  const movieIndex = tamilMovies.findIndex((movie) => movie.id === movieId);
  // console.log(movieIndex);

  if (movieIndex === -1) {
    return res
      .status(404)
      .json({ message: `Movie with ID ${movieId} not found.` });
  }

  // Remove the object from the array
  const deletedMovie = tamilMovies.splice(movieIndex, 1);

  saveMovies();

  res
    .status(200)
    .json({ message: "Movie deleted successfully!", data: deletedMovie[0] });
});

app.listen(3000, () => {
  console.log(`the server run url:http://localhost:3000`);
  console.log("Server is running");
});
