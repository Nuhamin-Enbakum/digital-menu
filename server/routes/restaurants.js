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

module.exports = router;
