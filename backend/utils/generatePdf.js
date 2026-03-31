const PDFDocument = require('pdfkit');
const fs = require('fs');

const generatePdfReceipt = (order, user, filePath) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        doc.fontSize(20).text('COURTS Ecommerce - Receipt', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Order ID: ${order._id}`);
        doc.text(`Date: ${new Date(order.paidAt).toLocaleString()}`);
        doc.text(`Customer Name: ${user.name}`);
        doc.text(`Customer Email: ${user.email}`);
        doc.moveDown();
        
        doc.fontSize(14).text('Items Purchased:', { underline: true });
        doc.moveDown(0.5);
        order.orderItems.forEach(item => { doc.fontSize(12).text(`- ${item.name} x ${item.qty} = RM${item.price * item.qty}`); });
        doc.moveDown();
        
        doc.fontSize(16).text(`Total Paid: RM${order.totalPrice}`, { align: 'right' });
        doc.fontSize(12).text(`Payment Method: ${order.paymentMethod}`, { align: 'right' });
        
        doc.moveDown(2);
        doc.fontSize(10).text('Thank you for shopping with COURTS!', { align: 'center' });
        doc.end();
        
        stream.on('finish', resolve);
        stream.on('error', reject);
    });
};

module.exports = generatePdfReceipt;
