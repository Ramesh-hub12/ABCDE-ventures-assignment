const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: verified._id, token: token });

        if (!user) throw new Error();

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(401).send('Invalid or Expired Session');
    }
};

module.exports = auth;