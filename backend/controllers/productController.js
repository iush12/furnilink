const Product = require('../models/Product');

const getProducts = async (req, res) => {
    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {};
    const products = await Product.find({ ...keyword });
    res.json(products);
};

const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) { res.json(product); } else { res.status(404); throw new Error('Product not found'); }
};

const createProduct = async (req, res) => {
    const product = new Product({
        name: req.body.name, price: req.body.price, user: req.user._id,
        image: req.body.image, brand: req.body.brand, category: req.body.category,
        countInStock: req.body.countInStock, numReviews: 0, description: req.body.description
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.deleteOne(); res.json({ message: 'Product removed' });
    } else {
        res.status(404); throw new Error('Product not found');
    }
};

const updateProduct = async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        product.name = name; product.price = price; product.description = description;
        product.image = image; product.brand = brand; product.category = category;
        product.countInStock = countInStock;
        const updatedProduct = await product.save(); res.json(updatedProduct);
    } else {
        res.status(404); throw new Error('Product not found');
    }
};

module.exports = { getProducts, getProductById, createProduct, deleteProduct, updateProduct };
