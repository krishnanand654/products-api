const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image_id: { type: mongoose.Schema.Types.ObjectId }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
