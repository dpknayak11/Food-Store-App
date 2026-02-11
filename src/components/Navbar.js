"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import {
  Cart,
  PersonCircle,
  BoxSeam,
  BoxArrowRight,
} from "react-bootstrap-icons";
import { refresh } from "next/cache";
import { useEffect, useRef } from "react";
import { httpGet } from "@/services/api";
import { clearAddress, setAddress } from "@/redux/slices/addressSlice";

export default function RNavbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart?.items);

  const handleLogout = async() => {
   await dispatch(logout());
    router.push("/login");
    setTimeout(() => {
      // router.refresh();
      window.location.reload();
    }, 200);
  };

  const address = useSelector((state) => state.address?.address || []);
  const fetchRef = useRef(false);

  const fetchAddresses = async () => {
    try {
      const res = await httpGet("/address");
      if (!res.error) {
        dispatch(clearAddress()); // old cache clear
        dispatch(setAddress(res.data || [])); // fresh store + session save
      }
    } catch (err) {
      // error handling
    }
  };

  useEffect(() => {
    // Check sessionStorage for cached data first
    const cached = sessionStorage.getItem("address");
    if (cached) {
      dispatch(setAddress(JSON.parse(cached)));
    }

    // Only fetch once when token is set and we haven't fetched yet
    if (token && !fetchRef.current && address.length === 0) {
      fetchRef.current = true;
      fetchAddresses();
    }
  }, [token, dispatch]);

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
                {/* Profile */}
                <Nav.Item
                  className="d-flex align-items-center gap-2 px-3 py-2 rounded text-dark bg-light bg-opacity-0 hover-bg"
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push("/profile")}
                >
                  <PersonCircle size={20} />
                  <span>{user?.name}</span>
                </Nav.Item>

                {/* Orders */}
                <Nav.Item
                  className="d-flex align-items-center gap-2 px-3 py-2 rounded text-dark bg-light bg-opacity-0"
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push("/order")}
                >
                  <BoxSeam size={18} />
                  <span>Orders</span>
                </Nav.Item>

                {/* Logout */}
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="d-flex align-items-center gap-2 rounded-pill px-3"
                  onClick={handleLogout}
                >
                  <BoxArrowRight size={18} />
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
