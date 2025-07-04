const Recipes = require("../models/recipe");
const multer = require("multer");
const path = require("path");

// ✅ Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload"); // Upload folder at backend root
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + "-" + file.fieldname + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// ✅ Get all recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find();
    res.json(recipes);
  } catch (err) {
    console.error("Error fetching recipes:", err.message);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

// ✅ Get a single recipe by ID
const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
  } catch (err) {
    console.error("Error fetching recipe:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Add a new recipe
const addRecipe = async (req, res) => {
  const { title, ingredients, instructions, time } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ message: "Required fields can't be empty" });
  }

  try {
    const newRecipe = await Recipes.create({
      title,
      ingredients: ingredients.split('\n'),
      instructions,
      time,
      coverImage: req.file?.filename || "",
      createdBy: req.user?.id || null,
    });

    res.status(201).json(newRecipe);
  } catch (err) {
    console.error("Error creating recipe:", err.message);
    res.status(500).json({ error: "Failed to create recipe" });
  }
};

// ✅ Edit a recipe
const editRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const updatedData = {
      ...req.body,
      coverImage: req.file?.filename || recipe.coverImage,
    };

    const updatedRecipe = await Recipes.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json(updatedRecipe);
  } catch (err) {
    console.error("Error updating recipe:", err.message);
    res.status(500).json({ error: "Failed to update recipe" });
  }
};

// ✅ Delete a recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // 🔐 Check if the user owns the recipe
    if (recipe.createdBy?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this recipe" });
    }

    await Recipes.deleteOne({ _id: req.params.id });
    res.json({ status: "ok" });
  } catch (err) {
    console.error("Error deleting recipe:", err.message);
    res.status(400).json({ message: "Error deleting recipe" });
  }
};


module.exports = {
  getRecipes,
  getRecipe,
  addRecipe,
  editRecipe,
  deleteRecipe,
  upload,
};
