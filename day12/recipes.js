import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    RecipeName: {
      type: String,
      required: true,
      trim: true,
    },

    Category: {
      type: String,
      required: true,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Beverage"],
    },

    Cuisine: {
      type: String,
      required: true,
      trim: true,
    },

    Ingredients: [
      {
        type: String,
        required: true,
      },
    ],

    Instructions: [
      {
        type: String,
        required: true,
      },
    ],

    PreparationTime: {
      type: Number,
      required: true,
      min: 1,
    },

    CookingTime: {
      type: Number,
      required: true,
      min: 0,
    },

    Servings: {
      type: Number,
      required: true,
      min: 1,
    },

    Difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    Calories: {
      type: Number,
      required: true,
      min: 0,
    },

    Vegetarian: {
      type: Boolean,
      default: false,
    },

    Rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    Image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model("Recipe", recipeSchema);
