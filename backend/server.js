const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectionDb");
const cors = require("cors");
const path = require("path"); // ✅ required for serving static paths

const PORT = process.env.PORT || 3000;
connectDb();

app.use(express.json());
app.use(cors());

// ✅ Correctly serve images from 'upload' folder
app.use("/api/images", express.static(path.join(__dirname, "upload")));

app.use("/api/user", require("./routes/user"));
app.use("/api/recipe", require("./routes/recipe"));

app.listen(PORT, (err) => {
  console.log(`app is listening on port ${PORT}`);
});
