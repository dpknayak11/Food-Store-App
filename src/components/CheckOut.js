"use client";

const checkoutHandler = async () => {
  try {
    setLoading(true); // start loader

    // 1️⃣ Create Razorpay order from backend
    const checkoutRes = await httpPost("/user/checkout", {
      amount: showTotal,
    });

    if (!checkoutRes.success) {
      setLoading(false);
      message.error("Unable to initiate payment");
      return;
    }

    const order = checkoutRes.data;

    // 2️⃣ Razorpay options
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      order_id: order.id,

      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.phone || "",
      },

      handler: async function (response) {
        try {
          // 3️⃣ Verify payment on backend
          const verifyRes = await httpPost(
            "/user/paymentverification",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: selectedOrder,
            }
          );

          if (verifyRes.success) {
            message.success("Payment successful!");
            localStorage.removeItem("cart");
            navigate("/order");
          } else {
            message.error(verifyRes.message || "Payment verification failed");
          }
        } catch (err) {
          message.error("Payment verification error");
        } finally {
          setLoading(false);
        }
      },

      modal: {
        ondismiss: function () {
          setLoading(false);
          message.warning("Payment cancelled");
        },
      },

      theme: {
        color: "#0d6efd",
      },
    };

    // 4️⃣ Open Razorpay
    const razor = new window.Razorpay(options);
    razor.open();

  } catch (error) {
    console.error("Checkout Error:", error);
    message.error("Payment failed to start");
    setLoading(false);
  }
};
