// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// module.exports = async (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ABCDE_SECRET_KEY_2026');
//         const user = await User.findById(decoded.id);

//         // REQUIREMENT: Single-device session check (403 Forbidden)
//         if (!user || user.activeToken !== token) {
//             return res.status(403).json({ message: 'Session active on another device' });
//         }

//         req.user = user;
//         next();
//     } catch (err) {
//         res.status(401).json({ message: 'Token is not valid' });
//     }
// };

// // const jwt = require('jwt-simple');
// // const User = require('../models/User');
// // const SECRET_KEY = "ABCDE_SECRET_TOKEN";

// // const authenticate = async (req, res, next) => {
// //   const token = req.headers.authorization?.split(' ')[1];
  
// //   if (!token) {
// //     return res.status(401).send("Access Denied: No token provided");
// //   }

// //   try {
// //     const decoded = jwt.decode(token, SECRET_KEY);
// //     const user = await User.findById(decoded.id);

// //     // REQUIREMENT: Single-device session check
// //     // If the token in the request doesn't match the one in DB, another login happened.
// //     if (!user || user.activeToken !== token) {
// //       return res.status(403).send("Session active on another device");
// //     }

// //     req.user = user;
// //     next();
// //   } catch (err) {
// //     res.status(401).send("Invalid or expired token");
// //   }
// // };

// // module.exports = authenticate;

const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const requestToken = authHeader && authHeader.split(' ')[1];

    if (!requestToken) return res.status(401).send('Access Denied: No Token Provided');

    try {
        const decoded = jwt.verify(requestToken, process.env.JWT_SECRET || 'ABCDE_SECRET');
        const user = await User.findById(decoded.id);

        // Verification: Ensure the token in the request matches the one stored in DB
        if (!user || user.token !== requestToken) {
            return res.status(403).send('Session invalid: Logged in elsewhere');
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).send('Invalid Token');
    }
};