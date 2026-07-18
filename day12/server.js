import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./movie.model.js";
import Recipe from "./recipes.js";
import User from "./userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import requireAuth from "./auth.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

const PORT = 3000;

// console.log(process.env.MONGODB_URI);

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

/* =====================================
      CREATE USER
===================================== */

app.post("/users", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Check username
    const usernameExists = await User.findOne({ username });

    if (usernameExists) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Check email
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* =====================================
      LOGIN
===================================== */

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        user_id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // console.log("token", token);

    res.json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET ALL MOVIES

app.get("/movies", requireAuth,async (req, res) => {
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

app.post("/movies", requireAuth, async (req, res) => {
  try {
    // Accept either one movie object or an array of movies, always as an array
    const movies = Array.isArray(req.body) ? req.body : [req.body];

    // Stamp every movie with the logged-in user's id as the owner
    // (placed after ...movie so a client-supplied "owner" field can't override it)
    const moviesWithOwner = movies.map((movie) => ({
      ...movie,
      owner: req.user.user_id,
    }));

    const movie = await Movie.insertMany(moviesWithOwner);

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

app.put("/movies/:id", requireAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Movie ID",
      });
    }

    const existingMovie = await Movie.findById(req.params.id);

    if (!existingMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    if (String(existingMovie.owner) !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: "Not your movie",
      });
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "movie updated successfully",
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

app.delete("/movies/:id", requireAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Movie ID",
      });
    }

    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Not found" });

    if (String(movie.owner) !== req.user.user_id) {
      return res.status(403).json({ error: "Not your movie" });
    }

    await Movie.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET RECIPES

app.get("/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find();

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET RECIPE BY ID

app.get("/recipes/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Recipe ID",
      });
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// CREATE SINGLE RECIPE

app.post("/recipes/single", requireAuth, async (req, res) => {
  try {
    const recipe = await Recipe.create({
      ...req.body,
      owner: req.user.user_id,
    });

    res.status(201).json({
      success: true,
      message: "Recipe added successfully",
      data: recipe,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// CREATE MULTIPLE RECIPES

app.post("/recipes/bulk", requireAuth, async (req, res) => {
  try {
    // Accept either one recipe object or an array of recipes, always as an array
    const recipeInputs = Array.isArray(req.body) ? req.body : [req.body];

    // Stamp every recipe with the logged-in user's id as the owner
    // (placed after ...recipe so a client-supplied "owner" field can't override it)
    const recipesWithOwner = recipeInputs.map((recipe) => ({
      ...recipe,
      owner: req.user.user_id,
    }));

    const recipes = await Recipe.insertMany(recipesWithOwner);

    res.status(201).json({
      success: true,
      message: "Recipes added successfully",
      data: recipes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// UPDATE RECIPE

app.put("/recipes/:id", requireAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Recipe ID",
      });
    }

    const existingRecipe = await Recipe.findById(req.params.id);

    if (!existingRecipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    if (String(existingRecipe.owner) !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: "Not your recipe",
      });
    }

    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      data: recipe,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// DELETE RECIPE

app.delete("/recipes/:id", requireAuth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Recipe ID",
      });
    }

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Not found" });

    if (String(recipe.owner) !== req.user.user_id) {
      return res.status(403).json({ error: "Not your recipe" });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
