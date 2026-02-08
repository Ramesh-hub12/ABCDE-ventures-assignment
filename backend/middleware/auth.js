const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const requestToken = authHeader && authHeader.split(' ')[1];

    if (!requestToken) return res.status(401).send('Access Denied: No Token Provided');

    try {
        const decoded = jwt.verify(requestToken, process.env.JWT_SECRET || 'ABCDE_SECRET');
        const user = await User.findById(decoded.id);

        
        if (!user || user.token !== requestToken) {
            return res.status(403).send('Session invalid: Logged in elsewhere');
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).send('Invalid Token');
    }
};