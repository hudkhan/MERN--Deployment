const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 3000;

// Allow React frontend to communicate with backend
app.use(
  cors({
    origin: "http://localhost:5174",
  })
);

app.use(express.json());

// API route
app.get("/api/student", (req, res) => {
  res.json({
    name: "Hud Khan",
    course: "Computer Engineering",
    semester: 5,
    message: "Data received successfully from Node.js backend",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

