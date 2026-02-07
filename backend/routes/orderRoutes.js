const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// POST /orders - Convert the current cart into an order
router.post('/', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id, status: 'active' });
        
        if (!cart || cart.items.length === 0) {
            return res.status(400).send("Cart is empty");
        }
        const newOrder = new Order({
            userId: req.user._id,
            cartId: cart._id
        });
        await newOrder.save();

        cart.status = 'ordered';
        await cart.save();

        res.status(201).send({ message: "Order successful", orderId: newOrder._id });
    } catch (err) {
        res.status(500).send("Error placing order");
    }
});

// GET /orders - List all placed orders for the user
router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id });
        res.send(orders);
    } catch (err) {
        res.status(500).send("Error fetching orders");
    }
});

module.exports = router;