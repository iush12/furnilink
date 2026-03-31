const express = require('express');
const router = express.Router();
const { getNearestShops, createShop } = require('../controllers/shopController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/nearest').post(getNearestShops);
router.route('/').post(protect, admin, createShop);
module.exports = router;
