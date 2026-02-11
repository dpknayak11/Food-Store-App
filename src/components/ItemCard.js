"use client";

import { useMemo } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { addToCart } from "@/redux/slices/cartSlice";

function ItemCard({ data = [] }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart?.items || []);

  // 🔍 Find quantity of item already in cart
  const getItemQty = (id) =>
    cartItems.find((item) => item._id === id)?.qty || 0;

  const handleAddToCart = (item) => {
    if (!token) {
      alert("Please login to add items to cart");
      router.push("/login");
      return;
    }
    dispatch(addToCart(item));
  };

  return (
    <Row className="g-4 mt-2">
      {data.map((item) => {
        const qty = getItemQty(item._id);

        return (
          <Col key={item._id} xs={12} sm={6} md={4} lg={3}>
            <Card
              className="h-100 shadow-sm border-0"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(6px)",
              }}
            >
              <Card.Img
                variant="top"
                src={item.image}
                style={{ height: "200px", objectFit: "cover" }}
              />

              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-semibold">{item.name}</Card.Title>

                <Card.Text
                  className="text-muted"
                  style={{ fontSize: "0.9rem", minHeight: "2.5rem" }}
                >
                  {item.description}
                </Card.Text>

                <div className="mt-auto">
                  <h5 className="text-success fw-bold">₹ {item.price}</h5>

                  <Button
                    variant={qty > 0 ? "success" : "primary"}
                    className="w-100 position-relative"
                    onClick={() => handleAddToCart(item)}
                  >
                    🛒 {qty > 0 ? `Added (${qty})` : "Add to Cart"}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}

export default ItemCard;
