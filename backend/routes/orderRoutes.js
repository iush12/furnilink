const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getSalesReport, downloadReceipt } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/report').get(protect, admin, getSalesReport);
router.route('/:id/receipt').get(protect, downloadReceipt);
module.exports = router;
