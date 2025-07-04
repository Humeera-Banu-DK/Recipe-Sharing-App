const express = require("express");
const router = express.Router();
const {
  addRecipe,
  getRecipe,
  getRecipes,
  deleteRecipe
} = require("../controller/recipe");

const verifyToken = require("../middleware/auth");

// 🔧 Multer setup
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "upload/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// 🔐 Apply verifyToken to recipe creation
router.post("/", verifyToken, upload.single("coverImage"), addRecipe);

router.get("/", getRecipes);
router.get("/:id", getRecipe);
router.delete("/:id", verifyToken, deleteRecipe); 

module.exports = router;
