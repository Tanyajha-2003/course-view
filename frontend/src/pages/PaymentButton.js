import React from "react";
import API from "../api";

export default function PaymentButton({ courseId, courseTitle, user, onSuccess }) {
const user = JSON.parse(localStorage.getItem("user"));
  const startPayment = async () => {
    try {
      // 1️⃣ Create order on backend
      const orderRes = await API.post("/payment/create-order");
      const order = orderRes.data;

      const options = {
        key: order.key,               
        amount: order.amount,
        currency: order.currency,
        name: "Imarticus LMS",
        description: `Payment for course: ${courseTitle}`,
        order_id: order.orderId,

        handler: async function (response) {
          await API.post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            courseId,
            userId: user._id,
          });

          alert("Payment Successful!");
          onSuccess();
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("PAYMENT ERROR:", err);
      alert("Payment failed");
    }
  };

  return (
    <button className="btn btn-success" onClick={startPayment}>
      Pay ₹500 to Unlock Course
    </button>
  );
}
