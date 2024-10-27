const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ข้อมูลคำสั่งซื้อจำลอง
const orders = [
    { orderId: "12345", amount: 100, status: "Pending" },
    { orderId: "67890", amount: 200, status: "Pending" }
];

// ใช้ body-parser และตั้งค่า Static Files สำหรับโฟลเดอร์ public
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route สำหรับหน้าเว็บหลัก
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inquiry URL: ตรวจสอบข้อมูลการชำระเงิน
app.post('/api/billpayment/inquiry', (req, res) => {
    const { orderId } = req.body;
    const order = orders.find(o => o.orderId === orderId);

    if (order) {
        res.json({
            status: "success",
            orderId: order.orderId,
            amount: order.amount,
            message: "Order found."
        });
    } else {
        res.status(404).json({
            status: "error",
            message: "Order not found."
        });
    }
});

// Payment URL: รับผลการชำระเงิน
app.post('/api/billpayment/payment', (req, res) => {
    const { orderId, paymentStatus } = req.body;
    const order = orders.find(o => o.orderId === orderId);

    if (order) {
        order.status = paymentStatus;
        res.json({
            status: "success",
            message: "Payment status updated."
        });
    } else {
        res.status(404).json({
            status: "error",
            message: "Order not found."
        });
    }
});

// API สำหรับเริ่มต้นการชำระเงิน (ตัวอย่าง)
app.post('/api/billpayment/initiate', (req, res) => {
    const { orderId, amount } = req.body;
    orders.push({ orderId, amount, status: "Pending" });
    res.json({
        status: "success",
        message: "Payment initiated."
    });
});

// เริ่มต้นเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
