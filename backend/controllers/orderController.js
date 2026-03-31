const Order = require('../models/Order');
const generatePdfReceipt = require('../utils/generatePdf');
const path = require('path');
const fs = require('fs');

const addOrderItems = async (req, res) => {
    try {
        const { orderItems, paymentMethod, totalPrice } = req.body;
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            orderItems, user: req.user._id, paymentMethod, totalPrice,
            isPaid: true, paidAt: Date.now(),
            paymentResult: { id: 'MOCK_PAYPAL_ID', status: 'COMPLETED', email_address: req.user.email }
        });
        const createdOrder = await order.save();

        // Generate PDF receipt — don't let a PDF failure block the order response
        const pdfPath = path.join(__dirname, '..', `receipt_${createdOrder._id}.pdf`);
        try {
            await generatePdfReceipt(createdOrder, req.user, pdfPath);
        } catch (pdfErr) {
            console.error('PDF generation failed (non-fatal):', pdfErr.message);
        }

        res.status(201).json({ order: createdOrder, receiptUrl: `/api/orders/${createdOrder._id}/receipt` });
    } catch (err) {
        console.error('Order creation error:', err.message);
        res.status(500).json({ message: err.message || 'Order creation failed' });
    }
};

const getMyOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

const downloadReceipt = async (req, res) => {
    const filePath = path.join(__dirname, '..', `receipt_${req.params.id}.pdf`);
    if(fs.existsSync(filePath)) { res.download(filePath); } else { res.status(404).json({message: 'Receipt not found'}); }
};

const getSalesReport = async (req, res) => {
    const orders = await Order.find({ isPaid: true });
    res.json({ title: "Sales Report", totalOrders: orders.length, orders });
};

module.exports = { addOrderItems, getMyOrders, getSalesReport, downloadReceipt };
