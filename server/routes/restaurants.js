const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const pool = require("../config/db");

router.get("/profile", verifyToken, async (req, res) => {
    try{
    const restaurant = await pool.query("SELECT * FROM restaurants WHERE id = $1", [req.user.restaurant_id]);
    if(restaurant.rows.length === 0){
        return res.status(404).json({message: "Restaurant not found"});
    } else{
        res.status(200).json(restaurant.rows[0]);

    }
    } catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }

});

router.get("/:slug", async (req, res) => {
    try{
        const restaurant = await pool.query
        (
            "SELECT * FROM restaurants WHERE slug = $1",
            [req.params.slug]
        );

        if(restaurant.rows.length === 0){
            return res.status(404).json({message: "Restaurant not found"});
        } else{
            const restaurantId = restaurant.rows[0].id;
            const categories = await pool.query
            (
                "SELECT * FROM categories WHERE restaurant_id = $1", [restaurantId]
            );
            const menu = await Promise.all(
                categories.rows.map(async (category) => {
                    const items = await pool.query(
                        "SELECT * FROM menu_items WHERE category_id = $1 AND restaurant_id = $2",
                        [category.id, restaurantId]
                    );
                    return {
                        category: category.name,
                        items: items.rows
                    };
                })
            );
            res.status(200).json(menu);
        }
  

    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
});

module.exports = router;
