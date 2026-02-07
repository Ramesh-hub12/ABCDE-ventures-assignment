const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    status: { type: String, default: 'active' } 
});

module.exports = mongoose.model('Cart', cartSchema);