const express = require('express');
const router = express.Router();
const { createProductReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createProductReview);
module.exports = router;
