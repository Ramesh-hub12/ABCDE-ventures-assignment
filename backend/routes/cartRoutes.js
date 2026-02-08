const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!itemId) return res.status(400).send("Item ID required");

        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [] });
        }

        
        cart.items.push({ itemId: itemId });
        
        await cart.save();
        res.status(201).send("Item added to cart");
    } catch (err) {
        console.error("Cart Add Error:", err);
        res.status(500).send("Add failed. Ensure ID is a valid MongoDB ObjectId.");
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        res.json(cart || { _id: "N/A", items: [] });
    } catch (err) {
        res.status(500).send("Cart fetch error");
    }
});

module.exports = router;