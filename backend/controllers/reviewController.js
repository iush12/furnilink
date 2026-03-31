const Review = require('../models/Review');
const Product = require('../models/Product');

const createProductReview = async (req, res) => {
    const { rating, comment, productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) { res.status(404); throw new Error('Product not found'); }

    const review = new Review({ name: req.user.name, rating: Number(rating), comment, user: req.user._id, product: productId });
    await review.save();

    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added' });
};

module.exports = { createProductReview };
