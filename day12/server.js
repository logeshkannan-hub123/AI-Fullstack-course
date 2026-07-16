import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./movie.model.js";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = 3000;

console.log(process.env.MONGODB_URI);

async function connectDB() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found inside .env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Error");
    console.error(error.message);
    process.exit(1);
  }
}

connectDB();

// GET ALL MOVIES

app.get("/movies", async (req, res) => {
  try {
    const movies = await Movie.find();

    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET MOVIE BY ID

app.get("/movies/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Movie ID",
      });
    }

    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.json({
      success: true,
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// CREATE MOVIE

app.post("/movies", async (req, res) => {
  try {
    const movie = await Movie.insertMany(req.body);

    res.status(201).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE MOVIE

app.put("/movies/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Movie ID",
      });
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.json({
      success: true,
      data: movie,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE MOVIE

app.delete("/movies/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Movie ID",
      });
    }

    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
