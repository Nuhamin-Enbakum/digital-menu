const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const pool = require("../config/db");

router.post("/add", verifyToken, async (req, res) => {
    try {
        const {name} = req.body;
        const restaurant_id = req.user.restaurant_id;

        const category = await pool.query("INSERT INTO categories (name, restaurant_id) VALUES ($1, $2) RETURNING *", [name, restaurant_id]);
        res.status(201).json(category.rows[0]);

    } catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

router.get("/", verifyToken, async (req, res) => {
    try{
        const category = await pool.query("SELECT * FROM categories WHERE restaurant_id = $1", [req.user.restaurant_id]);
        res.status(200).json(category.rows);
    } catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

router.put("/:id", verifyToken, async (req, res) => {
    try{
        const {name} = req.body;
        const category = await pool.query("UPDATE categories SET name = $1 WHERE id = $2 AND restaurant_id = $3 RETURNING *", [name, req.params.id, req.user.restaurant_id]);
        res.status(200).json(category.rows[0]);
    } catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    try{
        const category = await pool.query("DELETE FROM categories WHERE id = $1 AND restaurant_id = $2 RETURNING *", [req.params.id, req.user.restaurant_id]);
        res.status(200).json({message: "Deleted successfully"});
    } catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

module.exports = router;