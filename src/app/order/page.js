"use client";
import { useState, useEffect } from "react";
import { Container, Card, Badge, Row, Col } from "react-bootstrap";
import { httpGet } from "@/services/api";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import GrowSpinner from "@/components/GrowSpinner";
import "./order.css";
import moment from "moment-timezone";

const STATUS_CONFIG = {
  received: { label: "Order Received", emoji: "📦", color: "primary" },
  preparing: { label: "Preparing", emoji: "👨‍🍳", color: "warning" },
  out_for_delivery: { label: "Out for Delivery", emoji: "🚚", color: "info" },
  delivered: { label: "Delivered", emoji: "✅", color: "success" },
  cancelled: { label: "Cancelled", emoji: "❌", color: "danger" },
};

export default function OrderPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await httpGet("/order");
      setOrders(res.data || []);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  // ⏱ Check if order is within last 30 mins using createdTime
  const isRecentOrder = (createdTime) => {
    if (!createdTime) return false;
    const orderTime = moment.tz(createdTime, "M/D/YYYY, h:mm A", "Asia/Kolkata");
    const now = moment().tz("Asia/Kolkata");
    return now.diff(orderTime, "minutes") <= 30;
  };

  // // 🔄 Auto refresh active recent orders every 2 mins
  // useEffect(() => {
  //   if (!orders.length) return;

  //   const activeStatuses = [
  //     "received",
  //     "preparing",
  //     "out_for_delivery",
  //     "delivered",
  //   ];

  //   const shouldAutoRefresh = orders.some(
  //     (order) =>
  //       activeStatuses.includes(order.status) &&
  //       isRecentOrder(order.createdTime)
  //   );

  //   if (!shouldAutoRefresh) return;

  //   const interval = setInterval(() => {
  //     fetchOrders();
  //   }, 2 * 60 * 1000);

  //   return () => clearInterval(interval);
  // }, [orders]);

  // 🔄 Auto refresh active recent orders every 2 mins
useEffect(() => {
  const activeStatuses = [
    "received",
    "preparing",
    "out_for_delivery",
    "delivered",
  ];

  const interval = setInterval(() => {
    const shouldAutoRefresh = orders.some(
      (order) =>
        activeStatuses.includes(order.status) &&
        isRecentOrder(order.createdTime)
    );

    if (shouldAutoRefresh) {
      fetchOrders();
    }
  }, 2 * 60 * 1000); // 2 min

  return () => clearInterval(interval);
}, []); // ❗ empty dependency


  // ⏳ ETA calculator
  const getETA = (createdTime, status) => {
    const orderTime = moment.tz(createdTime, "M/D/YYYY, h:mm A", "Asia/Kolkata");
    const now = moment().tz("Asia/Kolkata");
    const minutesPassed = now.diff(orderTime, "minutes");

    let totalTime = 15;
    if (status === "preparing") totalTime = 10;
    if (status === "out_for_delivery") totalTime = 5;
    if (status === "delivered") return "Delivered";

    const remaining = totalTime - minutesPassed;
    return remaining > 0 ? `${remaining} min away` : "Arriving...";
  };

  const steps = ["received", "preparing", "out_for_delivery", "delivered"];

  return (
    <ProtectedRoute>
      <Navbar />
      <Container className="py-4">
        <h2 className="mb-4 fw-bold">📋 My Orders</h2>

        {isLoading ? (
          <div className="text-center py-5">
            <GrowSpinner />
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-5 border-0">
            <h5 className="text-muted">🛒 No Orders Yet</h5>
          </Card>
        ) : (
          <Row className="g-3">
            {orders.map((order) => {
              const status =
                STATUS_CONFIG[order.status] || STATUS_CONFIG.received;
              const currentStep = steps.indexOf(order.status);

              return (
                <Col md={6} key={order._id} className="order-card-animate">
                  <Card className="h-100 border-0 shadow-sm">
                    <Card.Header className="bg-white">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="mb-0 small text-muted">
                            Order #{order._id.slice(-6).toUpperCase()}
                          </p>
                          <small className="text-muted">
                            {order.createdTime}
                            {/* {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              { month: "short", day: "numeric",  }
                            )} */}
                          </small>
                        </div>
                        <Badge bg={status.color} className="fs-6">
                          <span
                            className={`status-emoji status-${order.status}`}
                          >
                            {status.emoji}
                          </span>{" "}
                          {status.label}
                        </Badge>
                      </div>
                    </Card.Header>

                    <Card.Body>
                      {/* 🚦 Order Tracker */}
                      <div className="order-tracker">
                        {steps.map((step, i) => {
                          const icons = {
                            received: "📦",
                            preparing: "👨‍🍳",
                            out_for_delivery: "🏍️",
                            delivered: "✅",
                          };

                          return (
                            <div
                              key={step}
                              className={`tracker-step ${
                                i <= currentStep ? "active" : ""
                              }`}
                            >
                              <div className="tracker-icon">
                                {icons[step]}
                              </div>
                              {i < 3 && (
                                <div
                                  className={`tracker-line ${
                                    i < currentStep ? "active" : ""
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* ETA */}
                      {order.status !== "delivered" && (
                        <div className="eta-box">
                          ⏳ {getETA(order.createdTime, order.status)}
                        </div>
                      )}

                      {/* Delivery Info */}
                      <div className="mb-3 p-2 bg-light rounded">
                        <small className="fw-bold">
                          📍 {order.deliveryInfo?.name}
                        </small>
                        <br />
                        <small className="text-muted">
                          {order.deliveryInfo?.address}
                        </small>
                      </div>

                      {/* Items */}
                      <div className="mb-3">
                        <small className="fw-bold d-block mb-2">
                          🍽️ Items ({order.items?.length || 0})
                        </small>
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <div
                            key={idx}
                            className="d-flex justify-content-between small mb-1"
                          >
                            <span>{item.name}</span>
                            <span className="text-muted">x{item.quantity}</span>
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <small className="text-muted">
                            +{order.items.length - 2} more items
                          </small>
                        )}
                      </div>

                      {/* Price */}
                      <div className="border-top pt-2">
                        <div className="d-flex justify-content-between mb-1">
                          <small>Subtotal</small>
                          <small>₹{order.subtotal?.toFixed(2)}</small>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                          <small>Delivery</small>
                          <small>₹{order.deliveryFee?.toFixed(2)}</small>
                        </div>
                        <div className="d-flex justify-content-between fw-bold">
                          <span>Total</span>
                          <span className="text-primary">
                            ₹{order.total?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </ProtectedRoute>
  );
}
