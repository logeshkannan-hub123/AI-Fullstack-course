import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Movie from "./movie.model.js";
import User from "./userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import requireAuth from "./auth.js";

dotenv.config();

const app = express();

app.use(express.json());
// app.use(express.static("public"));

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

app.post("/signup", async (req, res) => {
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

app.get("/movies", requireAuth, async (req, res) => {
  try {
    const movies = await Movie.find({
      userId: req.user.user_id,
    });

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

// CREATE MOVIE

app.post("/movies", requireAuth, async (req, res) => {
  try {
    const movie = await Movie.create({
      ...req.body,
      userId: req.user.user_id,
    });

    res.status(201).json({
      success: true,
      message: "Movie Added Successfully",
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

    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Check ownership
    if (movie.userId !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: "Not your movie",
      });
    }

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Movie updated successfully",
      data: updatedMovie,
    });
  } catch (error) {
    res.status(500).json({
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

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    // Check ownership
    if (movie.userId !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: "Not your movie",
      });
    }

    await Movie.findByIdAndDelete(req.params.id);

    res.status(200).json({
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
