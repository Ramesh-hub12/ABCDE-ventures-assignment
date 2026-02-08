const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, default: "" }, 
    status: { type: String, default: 'active' }
}, { collection: 'shopping_cart_db' });

module.exports = mongoose.model('Item', itemSchema);