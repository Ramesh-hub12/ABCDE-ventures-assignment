const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// POST /carts - Add an item to the user's specific cart 
router.post('/', auth, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id, status: 'active' });
        
        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [], status: 'active' });
        }
        cart.items.push(req.body.itemId);
        await cart.save();
        
        res.status(200).send({ message: "Item added to cart", cart });
    } catch (err) {
        res.status(500).send("Error adding to cart");
    }
});

// GET /carts - List items in the current cart 
router.get('/', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id, status: 'active' })
                               .populate('items'); // Fetches item details
        res.send(cart || { items: [] });
    } catch (err) {
        res.status(500).send("Error fetching cart");
    }
});

module.exports = router;