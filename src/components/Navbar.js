"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Cart, PersonCircle } from "react-bootstrap-icons";
import { refresh } from "next/cache";

export default function RNavbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart?.items);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
    setTimeout(() => {
      router.refresh();
    }, 200);
  };

  return (
    <Navbar expand="lg" className="px-3 py-2 navbar">
      <Container fluid>
        {/* Left - App Name */}
        <Navbar.Brand as={Link} href="/" className="navbar-brand">
          🍔 FoodApp
        </Navbar.Brand>
        {token && (
          <Nav.Item className="ms-auto position-relative d-flex align-items-center">
            {/* Cart Icon */}
            <Cart
              size={24}
              color={cart?.length > 0 ? "#dc3545" : "#212529"} // red if items
              style={{ cursor: "pointer" }}
              onClick={() => router.push("/cart")}
            />
            {/* Cart Count Badge */}
            {cart?.length > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "0.65rem" }}
              >
                {cart.length}
              </span>
            )}
          </Nav.Item>
        )}

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="align-items-center gap-3">
            {user ? (
              <>
                <Nav.Item
                  className="text-dark d-flex align-items-center gap-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push("/profile")}
                  hovered
                  //  as={Link} href="/profile"
                >
                  <PersonCircle size={22} />
                  <span className="fw-500">{user.name}</span>
                </Nav.Item>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleLogout}
                  className=""
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                as={Link}
                href="/login"
                variant="outline-primary"
                size="sm"
              >
                🔐 Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
