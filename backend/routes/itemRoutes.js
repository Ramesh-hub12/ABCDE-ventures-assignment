// const express = require('express');
// const router = express.Router();
// const Item = require('../models/Item');

// // GET /items: List all items
// router.get('/', async (req, res) => {
//     try {
//         const items = await Item.find();
//         res.json(items);
//     } catch (err) {
//         res.status(500).send('Error listing items');
//     }
// });

// // Optional: POST /items - To seed some initial data
// router.post('/', async (req, res) => {
//     const item = new Item({ name: req.body.name });
//     await item.save();
//     res.send(item);
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

/**
 * GET /items
 * Fetches all available products from the shopping_cart_db collection.
 */
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching items' });
    }
});

/**
 * POST /items
 * Creates a new item with name, description, and price.
 */
router.post('/', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        
        // Validation for required fields
        if (!name || !description || !price) {
            return res.status(400).json({ message: 'Name, description, and price are required' });
        }

        const newItem = new Item({ name, description, price });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: 'Error creating item' });
    }
});

module.exports = router;