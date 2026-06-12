const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

const JWT_SECRET = "mysecretkey123";

app.get("/", (req, res) => {
  res.send("Day 11 JWT Authentication API Running");
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword
  };

  users.push(newUser);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: "1h"
  });

  res.json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

app.get("/api/auth/dashboard", (req, res) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    jwt.verify(token, JWT_SECRET);

    res.json({
      message: "Welcome to protected dashboard"
    });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});