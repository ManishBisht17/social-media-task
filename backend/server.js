const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.istyd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
);

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  socialMediaHandle: String,
  images: [Buffer],
  date: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// POST API: Add new user
app.post("/api/users", upload.array("images", 10), async (req, res) => {
  try {
    const { name, socialMediaHandle } = req.body;
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

// Serve index.html at root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});