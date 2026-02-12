"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { httpGet, httpPost } from "@/services/api";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { Trash2, PlusLg, DashLg } from "react-bootstrap-icons";
import {
  addToCart,
  clearCart,
  decreaseQty,
  removeFromCart,
} from "@/redux/slices/cartSlice";
import ProtectedRoute from "@/components/ProtectedRoute";


export default function CartPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart?.items);
  const [cartState, setCartState] = useState(cart || []);
  const { address = [] } = useSelector((state) => state.address);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCOD, setIsCOD] = useState(false);
  
  // Dynamically load Razorpay script if not already loaded
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
  

  useEffect(() => {
    // if (!cart || cart.length === 0) {
    //   toast.info("Your cart is empty. Redirecting to home page...");
    //   setTimeout(() => {
    //     router.push("/");
    //   }, 3000);
    // }
    setCartState(cart || []);
  }, [cart, router]);

  useEffect(() => {
    if (address.length > 0) {
      setSelectedAddressId(address[0]._id); // default first (already sorted)
    }
  }, [address]);


  const selectedAddress = address?.find((a) => a._id === selectedAddressId);

  //Quantity change handler (increase/decrease)
  const handleQuantityChange = (itemId, newQty) => {
    // Find item from Redux cart
    const item = cart.find((i) => i._id === itemId);
    if (!item) return;

    //If new quantity is higher → add one more
    if (newQty > item.qty) {
      dispatch(addToCart(item)); // increase qty
      //  If new quantity is lower → decrease quantity
    } else if (newQty < item.qty) {
      dispatch(decreaseQty(itemId)); // decrease qty
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
    toast.success("Item removed from cart");
  };

  // const checkout = async () => {
  //   if (!selectedAddress) {
  //     toast.error("Please select a delivery address before checkout.");
  //     return;
  //   }

  //   try {
  //     setIsLoading(true);
  //     const subtotal = calculateTotal();
  //     const deliveryFee = subtotal >= 500 ? 0 : 40; // Free delivery for orders above ₹500
  //     const total = subtotal + deliveryFee;

  //     const payload = {
  //       items: cart.map((item) => ({
  //         menuItem: item._id,
  //         name: item.name,
  //         price: item.price,
  //         quantity: item.qty,
  //         ...(item.notes && { notes: item.notes }),
  //       })),
  //       deliveryInfo: {
  //         name: user?.name || selectedAddress.name || "Guest",
  //         phone: selectedAddress.phone,
  //         address: selectedAddress.fullAddress,
  //         ...(selectedAddress.notes && { notes: selectedAddress.notes }),
  //       },
  //       subtotal,
  //       deliveryFee,
  //       total,
  //       meta: {},
  //     };

  //     const res = await httpPost("/order/create", payload);

  //     if (res.success || !res.error) {
  //       toast.success("Order placed successfully!");
  //       dispatch(clearCart());
  //       setTimeout(() => {
  //         router.push("/order");
  //       }, 1000);
  //     } else {
  //       toast.error(res.message || "Failed to place order. Please try again.");
  //     }
  //   } catch (error) {
  //     toast.error("An error occurred during checkout. Please try again.");
  //     console.error("Checkout error:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


  const checkout = async () => {
  if (!selectedAddress) {
    toast.error("Please select a delivery address before checkout.");
    return;
  }

  try {
    setIsLoading(true);

    // 🔹 Calculate totals
    const subtotal = calculateTotal();
    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const total = subtotal + deliveryFee;

    // 🔹 Common Order Payload
    const orderPayload = {
      items: cart.map((item) => ({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity: item.qty,
        ...(item.notes && { notes: item.notes }),
      })),
      deliveryInfo: {
        name: user?.name || selectedAddress.name || "Guest",
        phone: selectedAddress.phone,
        address: selectedAddress.fullAddress,
        ...(selectedAddress.notes && { notes: selectedAddress.notes }),
      },
      subtotal,
      deliveryFee,
      total,
    };

    // =====================================================
    // 🟢 COD FLOW
    // =====================================================
    if (isCOD) {
      const res = await httpPost("/order/create", orderPayload);
      if (res.success) {
        toast.success("Order placed successfully!");
        dispatch(clearCart());
        router.push("/order");
      } else {
        toast.error(res.message || "Failed to place order.");
      }

      setIsLoading(false);
      return;
    }

    // =====================================================
    // 🔵 ONLINE PAYMENT FLOW
    // =====================================================

    // 1️⃣ Create Razorpay Order
    const checkoutRes = await httpPost("/order/checkout", {
      amount: total,
    });

    if (!checkoutRes?.success) {
      toast.error("Unable to initiate payment");
      setIsLoading(false);
      return;
    }
    const keyValue = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const razorpayOrder = checkoutRes.data;
    const options = {
      key: keyValue,
      // key: "rzp_test_tBdulQSfLPItgo",
      amount: razorpayOrder.amount,
      currency: "INR",
      order_id: razorpayOrder.id,
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
        contact: user?.phone || selectedAddress.phone || "",
      },
      handler: async function (response) {
        try {
          const verifyRes = await httpPost("/order/paymentverification", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderData: orderPayload,
          });
          if (verifyRes?.success) {
            toast.success("Payment successful!");
            dispatch(clearCart());
            router.push("/order");
          } else {
            toast.error(
              verifyRes?.message || "Payment verification failed"
            );
          }
        } catch (err) {
          toast.error("Payment verification error");
        } finally {
          setIsLoading(false);
        }
      },
      modal: {
        ondismiss: () => {
          setIsLoading(false);
          toast.info("Payment cancelled");
        },
      },
      theme: {
        color: "#0d6efd",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();

  } catch (error) {
    console.error("Checkout Error:", error);
    toast.error("Checkout failed. Please try again.");
    setIsLoading(false);
  }
};

  if (!cart || cart.length === 0) {
    return (
      <ProtectedRoute>
        <Navbar />
        <Container className="mt-5 text-center">
          <div
            style={{
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>
              <h3 className="mb-3" style={{ color: "#E74C3C" }}>
                🛒 Your Cart is Empty
              </h3>
              <p className="text-muted mb-4">
                Add some delicious items to get started!
              </p>
              <Button
                variant="primary"
                onClick={() => router.push("/")}
                size="lg"
              >
                🏠 Continue Shopping
              </Button>
            </div>
          </div>
        </Container>
     </ProtectedRoute>

    );
  }

  const totalPrice = calculateTotal();

  return (
      <ProtectedRoute>

      <Navbar />
      <Container className="mt-5 mb-5">
        <h2 className="mb-4" style={{ color: "#1C1C1C", fontWeight: "700" }}>
          🛒 Your Cart ({cartState?.length})
        </h2>

        <Row className="g-4">
          {/* Cart Items */}
          <Col lg={8}>
            <div className="d-flex flex-column gap-3">
              {cartState?.map((item) => (
                <Card
                  key={item._id}
                  className="cart-item-card"
                  style={{
                    border: "1px solid #E8E8E8",
                    borderRadius: "12px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: "1rem" }}
                    className="p-3 p-md-4"
                  >
                    {/* Item Image */}
                    <div style={{ flex: "0 0 140px" }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "140px",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    </div>

                    {/* Item Details */}
                    <div
                      style={{
                        flex: "1",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div className="mb-2">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <h5
                            className="mb-0"
                            style={{ color: "#1C1C1C", fontWeight: "600" }}
                          >
                            {item.name}
                          </h5>
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#E74C3C",
                              fontSize: "1.3rem",
                            }}
                            title="Remove item"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>

                        <span
                          style={{
                            display: "inline-block",
                            backgroundColor: "#FEF5F5",
                            color: "#E74C3C",
                            padding: "0.35rem 0.75rem",
                            borderRadius: "6px",
                            fontSize: "0.85rem",
                            fontWeight: "600",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {item.category}
                        </span>

                        <p
                          className="text-muted mb-0"
                          style={{ fontSize: "0.95rem", lineHeight: "1.5" }}
                        >
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-auto d-flex align-items-center justify-content-between">
                        {/* Quantity Controls */}
                        <div
                          className="d-flex align-items-center"
                          style={{
                            backgroundColor: "#F5F5F5",
                            borderRadius: "8px",
                            padding: "0.5rem",
                            gap: "0.5rem",
                          }}
                        >
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.qty - 1)
                            }
                            style={{
                              background: "white",
                              border: "1px solid #E8E8E8",
                              borderRadius: "6px",
                              width: "32px",
                              height: "32px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s",
                            }}
                            className="qty-btn"
                          >
                            <DashLg size={16} />
                          </button>

                          <span
                            style={{
                              minWidth: "30px",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#1C1C1C",
                            }}
                          >
                            {item.qty}
                          </span>

                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.qty + 1)
                            }
                            style={{
                              background: "white",
                              border: "1px solid #E8E8E8",
                              borderRadius: "6px",
                              width: "32px",
                              height: "32px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s",
                            }}
                            className="qty-btn"
                          >
                            <PlusLg size={16} />
                          </button>
                        </div>

                        {/* Price */}
                        <div style={{ textAlign: "right" }}>
                          <div
                            style={{
                              fontSize: "1.3rem",
                              fontWeight: "700",
                              color: "#27AE60",
                            }}
                          >
                            ₹ {(item.price * item.qty).toFixed(2)}
                          </div>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "#696969",
                            }}
                          >
                            ₹ {item.price} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Col>

          <Col lg={4}>
            {address.length > 0 ? (
              <div className="mb-4">
                <h5 className="mb-3">Delivery Address</h5>

                {/* Dropdown Select */}
                <Form.Select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="mb-3"
                >
                  {address.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.fullAddress.substring(0, 40)}...
                      {item.isDefault ? " (Default)" : ""}
                    </option>
                  ))}
                </Form.Select>

                {/* Selected Address Card */}
                {selectedAddress && (
                  <div className="border rounded p-3 bg-light">
                    <strong>Address:</strong> {selectedAddress.fullAddress}
                    <br />
                    <strong>Phone:</strong> {selectedAddress.phone}
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-4 text-center">
                <h5 className="mb-3">No Address Available</h5>
                <Button
                  variant="danger"
                  onClick={() => router.push("/profile")}
                >
                  + Add Address
                </Button>
              </div>
            )}
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <Card
              style={{
                position: "sticky",
                top: "20px",
                border: "1px solid #E8E8E8",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              }}
            >
              <Card.Body className="p-4">
                <h5
                  className="mb-4"
                  style={{
                    fontWeight: "700",
                    color: "#1C1C1C",
                  }}
                >
                  💰 Order Summary
                </h5>

                <div style={{ marginBottom: "1.5rem" }}>
                  {cartState?.map((item) => (
                    <div
                      key={item._id}
                      className="d-flex justify-content-between align-items-center mb-3"
                      style={{
                        paddingBottom: "1rem",
                        borderBottom: "1px solid #F5F5F5",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "0.95rem",
                            fontWeight: "600",
                            color: "#1C1C1C",
                          }}
                        >
                          {item.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.85rem",
                            color: "#696969",
                          }}
                        >
                          x {item.qty}
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "1rem",
                          fontWeight: "700",
                          color: "#27AE60",
                        }}
                      >
                        ₹ {(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Breakdown */}
                <div
                  style={{
                    backgroundColor: "#FEF5F5",
                    padding: "1.25rem",
                    borderRadius: "10px",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ color: "#696969" }}>Subtotal</span>
                    <span style={{ fontWeight: "600", color: "#1C1C1C" }}>
                      ₹ {totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span style={{ color: "#696969" }}>Delivery Fee</span>
                    <span style={{ fontWeight: "600", color: "#27AE60" }}>
                     {totalPrice >= 500 ? "FREE" : "₹ 40"}
                    </span>
                  </div>
                  <div
                    style={{
                      borderTop: "2px solid #E8E8E8",
                      paddingTop: "1rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        color: "#1C1C1C",
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: "700",
                        color: "#E74C3C",
                      }}
                    >
                      {/* ₹ {totalPrice.toFixed(2)} */}
                      ₹ {(totalPrice >= 500 ? totalPrice : totalPrice + 40).toFixed(2)}

                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  variant="primary"
                  className="w-100"
                  size="lg"
                  style={{
                    borderRadius: "8px",
                    fontWeight: "700",
                    padding: "0.75rem",
                    marginBottom: "0.75rem",
                  }}
                  onClick={() => checkout()}
                  disabled={isLoading || !selectedAddress}
                >
                  {isLoading ? "⏳ Processing..." : "🛍️ Proceed to Checkout"}
                </Button>

                <Button
                  variant="outline-primary"
                  className="w-100"
                  onClick={() => router.push("/")}
                  style={{
                    borderRadius: "8px",
                    fontWeight: "600",
                  }}
                >
                  ← Continue Shopping
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .qty-btn:hover {
          background-color: #FEF5F5 !important;
          border-color: #E74C3C !important;
        }

        .cart-item-card:hover {
          box-shadow: 0 6px 16px rgba(231, 76, 60, 0.1);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .cart-item-card > div {
            flex-direction: column;
            gap: 1rem;
          }

          .cart-item-card img {
            width: 100%;
            height: auto;
          }
        }
      `}</style>
    </ProtectedRoute>
  );
}
