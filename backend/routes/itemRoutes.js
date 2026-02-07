const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET /items - List all available items
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.send(items);
    } catch (err) {
        res.status(500).send("Error fetching items");
    }
});

// Optional: POST /items - To seed some initial data
router.post('/', async (req, res) => {
    const item = new Item({ name: req.body.name });
    await item.save();
    res.send(item);
});

module.exports = router;