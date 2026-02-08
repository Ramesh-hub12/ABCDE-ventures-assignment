const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    cart_id: { 
        type: String, 
        required: true 
    },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }
        }
    ],
    status: { 
        type: String, 
        default: 'Completed' 
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Order', orderSchema);