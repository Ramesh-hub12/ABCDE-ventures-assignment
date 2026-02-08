// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jwt-simple');
// const User = require('../models/User');
// const authenticate = require('../middleware/auth');

// const SECRET_KEY = "ABCDE_SECRET_TOKEN";

// // SIGNUP
// router.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ username, password: hashedPassword });
//     await newUser.save();
//     res.status(201).send("User registered successfully");
//   } catch (err) {
//     // Catching MongoDB Duplicate Key Error (E11000)
//     if (err.code === 11000) return res.status(400).send("E11000: Username already taken");
//     res.status(500).send("Registration failed");
//   }
// });

// // LOGIN
// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username });

//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     return res.status(401).send("Invalid username or password");
//   }

//   const token = jwt.encode({ id: user._id, iat: Date.now() }, SECRET_KEY);
  
//   // Save the new token as the only "Active" one
//   user.activeToken = token;
//   await user.save();

//   res.json({ token });
// });

// // LOGOUT
// router.post('/logout', authenticate, async (req, res) => {
//   req.user.activeToken = null;
//   await req.user.save();
//   res.send("Successfully logged out");
// });


// module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'ABCDE_SECRET';

// POST /users: Create a new user (Signup)
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

// POST /users/login: Generate token, store in record, return it
// VALIDATION: Block login if token exists (Single-device rule)
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

// POST /users/logout: Clear the token field in the User record
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