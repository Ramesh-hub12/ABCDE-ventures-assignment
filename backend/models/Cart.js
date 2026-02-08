// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
//     status: { type: String, default: 'active' },
//     created_at: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Cart', cartSchema);

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true, 
        unique: true 
    },
    // We define items as an array of objects so we can store the itemId explicitly
    items: [{
        itemId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Item',
            required: true 
        }
    }],
    created_at: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Cart', cartSchema);