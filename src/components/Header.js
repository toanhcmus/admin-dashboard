import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import './Header.css';

const Header = ({ setAccessToken }) => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New user registered", read: false },
    { id: 2, title: "Event pending approval", read: false },
    { id: 3, title: "System maintenance scheduled", read: true },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  };

  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand as={Link} to="/reports" className="navbar-brand">
          Admin Dashboard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link
              as={Link}
              to="/users"
              className={location.pathname === "/users" ? "active-link" : ""}
            >
              User Management
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/games"
              className={location.pathname === "/games" ? "active-link" : ""}
            >
              Game Management
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/events"
              className={location.pathname === "/events" ? "active-link" : ""}
            >
              Event Management
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/reports"
              className={location.pathname === "/reports" ? "active-link" : ""}
            >
              Reports
            </Nav.Link>
          </Nav>

          {/* Biểu tượng thông báo */}
          <IconButton color="inherit" onClick={handleOpen} style={{ marginRight: "1rem" }}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Dropdown thông báo */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            keepMounted
          >
            <MenuItem disabled>
              <strong>Notifications</strong>
            </MenuItem>
            {notifications.map((notif) => (
              <MenuItem
                key={notif.id}
                onClick={() => handleMarkAsRead(notif.id)}
                style={{
                  fontWeight: notif.read ? "normal" : "bold",
                  whiteSpace: "normal",
                }}
              >
                {notif.title}
              </MenuItem>
            ))}
          </Menu>

          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
