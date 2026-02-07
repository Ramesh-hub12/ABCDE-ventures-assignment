const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth'); 

// POST /users - Signup logic
router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).send({ message: "User created successfully" });
    } catch (err) {
        res.status(400).send("Error creating user: " + err.message);
    }
});

// POST /users/login - Single-Device Login Logic
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(400).send('Invalid username/password');

        if (user.token) {
            return res.status(403).send('You cannot login on another device.');
        }

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).send('Invalid username/password');
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        
        user.token = token;
        await user.save();

        res.send({ token });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// POST /users/logout 
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