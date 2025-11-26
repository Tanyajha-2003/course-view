import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../models/User.js";
import dotenv from "dotenv";
import Payment from "../models/Payment.js";

dotenv.config();
const router = express.Router();

// Razorpay Instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Payment Order (₹500)
router.post("/create-order", async (req, res) => {
    try {
        const options = {
            amount: 500*100,
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (err) {
        console.error("ORDER ERROR:", err);
        res.status(500).json({ msg: "Order creation failed", error: err.message });
    }
});


// Verify Payment & Grant Course Access
router.post("/verify", async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            userId,
            courseId
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        if (expectedSign !== razorpay_signature) {
            return res.status(400).json({ msg: "Payment verification failed" });
        }

        // STORE PAYMENT IN DATABASE
        await Payment.create({
            userId,
            courseId,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            amount: 500 * 100,
            currency: "INR",
            status: "SUCCESS"
        });

        // Grant user course access
        await User.findByIdAndUpdate(userId, {
            $addToSet: { purchasedCourses: courseId }
        });

        return res.json({ msg: "Payment Successful & Stored" });

    } catch (err) {
        console.error("VERIFY ERROR:", err);
        res.status(500).json({ msg: "Verification failed", error: err.message });
    }
});

export default router;
