import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    MovieTitle: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    Director: {
      type: String,
      required: true,
      trim: true,
    },

    Starring: {
      type: [String],
      required: true,
      validate: (value) => value.length > 0,
    },

    Quality: {
      type: String,
      required: true,
      enum: [
        "WEB-DL 4K",
        "WEB-DL 1080p",
        "BluRay 4K",
        "BluRay 1080p",
        "Original HD",
      ],
    },

    Genres: {
      type: [String],
      required: true,
      validate: (value) => value.length > 0,
    },

    Language: {
      type: String,
      default: "Tamil",
      required: true,
      trim: true,
    },

    Movie_Rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    Release_Date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model("Movie", movieSchema);
