const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'ABCDE_SECRET';


router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).send('User Created');
    } catch (err) {
        if (err.code === 11000) return res.status(400).send('Username already exists');
        res.status(500).send('Error');
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).send('Invalid username/password');
    }
    if (user.token) {
        return res.status(403).send('You cannot login on another device.');
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    user.token = token;
    await user.save();

    res.json({ token });
});


router.post('/logout', auth, async (req, res) => {
    try {
        req.user.token = null;
        await req.user.save();
        res.send('Logged out successfully');
    } catch (err) {
        res.status(500).send('Error during logout');
    }
});

module.exports = router;