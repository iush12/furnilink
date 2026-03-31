const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
