const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        
        const cart = await Cart.findOne({ userId: req.user._id });

        if (!cart || cart.items.length === 0) {
            return res.status(400).send("Checkout failed: Your cart is empty.");
        }

        
        const newOrder = new Order({
            userId: req.user._id,
            cart_id: cart._id.toString(), 
            items: cart.items, 
            status: 'Completed'
        });

        await newOrder.save();

        await Cart.deleteOne({ userId: req.user._id });

        res.status(201).send("Order successful");
    } catch (err) {
        console.error("Checkout Error:", err);
        res.status(500).send("Server error during checkout");
    }
});


router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id });
        res.json(orders);
    } catch (err) {
        res.status(500).send("Error fetching order history");
    }
});

module.exports = router;