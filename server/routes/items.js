const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const pool = require("../config/db");

router.post("/add", verifyToken, async (req, res) => {
    try{
        const {name, description, price, image_url, category_id} = req.body;
        const restaurant_id = req.user.restaurant_id;

        const menu_item = await pool.query
        ("INSERT INTO menu_items (name, description, price, image_url, category_id, restaurant_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [name, description, price, image_url, category_id, req.user.restaurant_id]
        );
        res.status(201).json(menu_item.rows[0]);
    } catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

router.get("/", verifyToken, async (req, res) => {
    try{
        const menu_item = await pool.query
        ("SELECT * FROM menu_items WHERE restaurant_id = $1",
             [req.user.restaurant_id]
        );
        res.status(200).json(menu_item.rows);
    } catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

router.put("/:id", verifyToken, async (req, res) => {
    try{
        const {name, description, price, image_url, category_id} = req.body;
        const menu_item = await pool.query
        (
            "UPDATE menu_items SET name = $1, description = $2, price = $3, image_url = $4, category_id = $5 WHERE id = $6 AND restaurant_id = $7 RETURNING *",
            [name, description, price, image_url, category_id, req.params.id, req.user.restaurant_id]
        );
        res.status(200).json(menu_item.rows[0]);
    } catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    try{
        const menu_item = await pool.query
        (
            "DELETE FROM menu_items WHERE id = $1 AND restaurant_id = $2 RETURNING *",
            [req.params.id, req.user.restaurant_id]

        );
        res.status(200).json({message: "Deleted successfully"});
    } catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

router.put("/:id/toggle", verifyToken, async (req, res) => {
    try{
        const menu_item = await pool.query
        (
            "UPDATE menu_items SET is_available = NOT is_available WHERE id = $1 AND restaurant_id = $2 RETURNING *",
            [req.params.id, req.user.restaurant_id]
        );

        res.status(200).json(menu_item.rows[0]);
    } catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

module.exports = router;