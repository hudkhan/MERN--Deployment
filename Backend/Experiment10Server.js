const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { MongoClient } = require("mongodb");
const dns = require("dns");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

// Configure public DNS servers for local Windows development when resolving MongoDB SRV records
if (process.env.NODE_ENV !== "production") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (e) {}
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5174",
  })
);

app.use(express.json());

// MongoDB connection
const client = new MongoClient(process.env.MONGO_URI);

let users;

async function connectDB() {
  try {
    await client.connect();

    const db = client.db("authDB");
    users = db.collection("users");

    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Authentication server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Database connection failed:", error);
  }
}

connectDB();


// --------------------------
// SIGN-UP
// --------------------------

app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.insertOne({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Sign-up successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error during sign-up",
    });
  }
});


// --------------------------
// LOGIN
// --------------------------

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login successful",
      token: token,
    });
 } catch (error) {
  console.log("Login Error:", error);

  res.status(500).json({
    message: "Error during login",
  });
}
});



