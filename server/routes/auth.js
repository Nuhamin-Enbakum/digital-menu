
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Register
router.post("/register", async (req, res) => {
  const { email, password, restaurant_name, slug } = req.body;

  try {
    // Check if email already exists
    const emailCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Check if slug already exists
    const slugCheck = await pool.query(
      "SELECT * FROM restaurants WHERE slug = $1",
      [slug]
    );
    if (slugCheck.rows.length > 0) {
      return res.status(400).json({ message: "Slug already taken" });
    }

    // Create the restaurant first
    const restaurant = await pool.query(
      "INSERT INTO restaurants (name, slug) VALUES ($1, $2) RETURNING *",
      [restaurant_name, slug]
    );
    const restaurantId = restaurant.rows[0].id;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create the user
    const user = await pool.query(
      "INSERT INTO users (email, password_hash, restaurant_id) VALUES ($1, $2, $3) RETURNING *",
      [email, password_hash, restaurantId]
    );

    // Update restaurant owner_id
    await pool.query(
      "UPDATE restaurants SET owner_id = $1 WHERE id = $2",
      [user.rows[0].id, restaurantId]
    );

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.rows[0].id,
        restaurant_id: restaurantId,
        role: user.rows[0].role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password_hash
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.rows[0].id,
        restaurant_id: user.rows[0].restaurant_id,
        role: user.rows[0].role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;