"use client";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";

export default function RNavbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, token } = useSelector((state) => state.auth);


  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <Navbar expand="lg" className="px-3 py-2 navbar">
      <Container fluid>
        {/* Left - App Name */}
        <Navbar.Brand as={Link} href="/" className="navbar-brand">
          🍔 FoodApp
        </Navbar.Brand>
        

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="align-items-center gap-3">
            {user ? (
              <>
                <Nav.Item className="text-dark d-flex align-items-center gap-2">
                  <PersonCircle size={22} />
                  <span className="fw-500">{user.name}</span>
                </Nav.Item>

                <Button variant="primary" size="sm" onClick={handleLogout} className="">
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
