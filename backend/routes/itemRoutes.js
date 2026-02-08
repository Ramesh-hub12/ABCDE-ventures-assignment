const express = require('express');
const router = express.Router();
const Item = require('../models/Item');


router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching items' });
    }
});


router.post('/', async (req, res) => {
    try {
        const { name, description, price } = req.body;
        
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