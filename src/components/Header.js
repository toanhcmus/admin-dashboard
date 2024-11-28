import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Header = () => {
  const [active, setActive] = useState("dashboard");

  const handleNavClick = (key) => {
    setActive(key);
  };

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand href="#home" className="navbar-brand">
          Admin Dashboard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link
              as={Link}
              to="/dashboard"
              onClick={() => handleNavClick("dashboard")}
              active={active === "dashboard"}
              className="nav-link-custom"
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/users"
              onClick={() => handleNavClick("users")}
              active={active === "users"}
              className="nav-link-custom"
            >
              Quản lý Người Dùng
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/games"
              onClick={() => handleNavClick("games")}
              active={active === "games"}
              className="nav-link-custom"
            >
              Quản lý Trò Chơi
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/events"
              onClick={() => handleNavClick("events")}
              active={active === "events"}
              className="nav-link-custom"
            >
              Quản lý Sự Kiện
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/reports"
              onClick={() => handleNavClick("reports")}
              active={active === "reports"}
              className="nav-link-custom"
            >
              Báo Cáo
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
