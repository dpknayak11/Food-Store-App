"use client";
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

  const user = useSelector((state) => state.auth);
  // const cart = useSelector((state) => state.cart?.items);
  
  function handleClick(item) {
    if (!user?.token) {
      alert("Please login to add items to cart");
      router.push("/login");
      return;
    }
    dispatch(addToCart(item));
  }
  return (
    <Row className="g-4 mt-2">
      {data?.map((item) => (
        <Col key={item._id} xs={12} sm={6} md={4} lg={3} 
        // className="d-flex"
        >
          <Card
            className="h-100 card"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(6px)",
            }}
          >
            <Card.Img
              variant="top"
              src={item.image}
              className="card-img-top"
              style={{ height: "200px", objectFit: "cover" }}
            />
            <Card.Body className="d-flex flex-column">
              <Card.Title className="card-title">{item.name}</Card.Title>

              <Card.Text className="card-text text-muted" style={{ fontSize: "0.95rem", minHeight: "2.5rem" }}>
                {item.description}
              </Card.Text>

              <div className="mt-auto">
                <Card.Text className="card-text text-success">
                  ₹ {item.price}
                </Card.Text>

                <Button
                  variant="primary"
                  className="w-100"
                  onClick={() => handleClick(item)}
                >
                  🛒 Add to Cart
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default ItemCard;
