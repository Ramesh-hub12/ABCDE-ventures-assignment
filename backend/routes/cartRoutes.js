
// const express = require('express');
// const router = express.Router();
// const Cart = require('../models/Cart');
// const Item = require('../models/Item');
// const auth = require('../middleware/auth');

// // POST /api/carts
// // Requirement: Add items to the user's specific cart
// router.post('/', auth, async (req, res) => {
//     try {
//         const { itemId } = req.body;
        
//         if (!itemId) {
//             return res.status(400).send("Item ID is required");
//         }

//         // 1. Find user's cart or create a new one
//         let cart = await Cart.findOne({ userId: req.user._id });
//         if (!cart) {
//             cart = new Cart({ userId: req.user._id, items: [] });
//         }

//         // 2. Add the item to the items array
//         // We store the ID as a string as per the requirement "show item_id in alert"
//         cart.items.push({ itemId: itemId });
        
//         await cart.save();
//         res.status(201).send("Item added to cart successfully");
//     } catch (err) {
//         console.error("Add to Cart Error:", err);
//         res.status(500).send("Server error while adding to cart");
//     }
// });

// // GET /api/carts
// // Requirement: Identify the Cart by the User's ID
// router.get('/', auth, async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ userId: req.user._id });
//         // Return cart or empty structure if none exists
//         res.json(cart || { _id: "No Cart Yet", items: [] });
//     } catch (err) {
//         res.status(500).send("Error fetching cart");
//     }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

// POST /api/carts
router.post('/', auth, async (req, res) => {
    try {
        const { itemId } = req.body;

        if (!itemId) {
            return res.status(400).send("Item ID is required");
        }

        // Find user's cart
        let cart = await Cart.findOne({ userId: req.user._id });
        
        // If no cart exists, create one
        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [] });
        }

        // Push the object matching the schema: { itemId: "..." }
        cart.items.push({ itemId: itemId });
        
        await cart.save();
        res.status(201).send("Item added to cart");
    } catch (err) {
        console.error("Add to Cart Error:", err);
        res.status(500).send("Server error: Check if Item ID is a valid 24-character hex string");
    }
});

// GET /api/carts
router.get('/', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        // Return cart object or empty structure
        res.json(cart || { _id: "No Cart", items: [] });
    } catch (err) {
        res.status(500).send("Error fetching cart");
    }
});

module.exports = router;