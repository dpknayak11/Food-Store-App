"use client";
import { useState, useEffect } from "react";
import { Container, Card, Badge, Row, Col } from "react-bootstrap";
import { httpGet } from "@/services/api";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import GrowSpinner from "@/components/GrowSpinner";
import "./order.css";
import data from "./data.json";

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
      setOrders(data || []);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

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
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.received;
              return (
                <Col md={6} key={order._id} className="order-card-animate">
                  <Card className="h-100 border-0 shadow-sm">
                    {/* Header */}
                    <Card.Header className="bg-white">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <p className="mb-0 small text-muted">
                            Order #{order.orderId}
                          </p>
                          <small className="text-muted">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              { month: "short", day: "numeric" }
                            )}
                          </small>
                        </div>
                        <Badge bg={status.color} className="fs-6">
                          <span className={`status-emoji status-${order.status}`}>
                            {status.emoji}
                          </span>{" "}
                          {status.label}
                        </Badge>
                      </div>
                    </Card.Header>

                    {/* Body */}
                    <Card.Body>
                      {/* Delivery Info */}
                      <div className="mb-3 p-2 bg-light rounded">
                        <small className="fw-bold">📍 {order.deliveryInfo?.name}</small>
                        <br />
                        <small className="text-muted">
                          {order.deliveryInfo?.address}
                        </small>
                      </div>

                      {/* Items Summary */}
                      <div className="mb-3">
                        <small className="fw-bold d-block mb-2">🍽️ Items ({order.items?.length || 0})</small>
                        {order.items?.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="d-flex justify-content-between small mb-1">
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
                          <span className="text-primary">₹{order.total?.toFixed(2)}</span>
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
