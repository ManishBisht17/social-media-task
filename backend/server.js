const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json()); // For parsing JSON data

// MongoDB connection
mongoose.connect(
  `mongodb+srv://manisbst123:Ur6ElqGMcXG4mFNt@cluster0.istyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  socialMediaHandle: String,
  images: [Buffer], // Store image as binary data
  date: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// Multer setup for in-memory storage (no file storage on disk)
const storage = multer.memoryStorage(); // Use memoryStorage for in-memory upload
const upload = multer({ storage });

// POST API: Add new user
app.post("/api/users", upload.array("images", 10), async (req, res) => {
  try {
    const { name, socialMediaHandle } = req.body;
    // Convert uploaded images to Buffers and save them in the database
    const imageBuffers = req.files.map((file) => file.buffer);

    const user = new User({ name, socialMediaHandle, images: imageBuffers });
    await user.save();
    res.status(201).json({ message: "User data saved successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET API: Fetch all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();

    // Convert image buffers to Base64 strings for frontend rendering
    const usersWithBase64Images = users.map((user) => ({
      ...user._doc,
      images: user.images.map((imgBuffer) =>
        `data:image/jpeg;base64,${imgBuffer.toString("base64")}`
      ),
    }));

    res.json(usersWithBase64Images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
