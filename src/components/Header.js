import React, { useState, useEffect } from "react";
import { Menu, MenuItem, IconButton, Badge } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import './Header.css';

const Header = ({ accessToken }) => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    console.log(accessToken);
    console.log("hello");
    // Kết nối WebSocket
    const ws = new WebSocket(`ws://localhost:3005?token=${accessToken}`);
    console.log(ws);
    ws.addEventListener('open', () => {
      console.log('WebSocket connection established');
    });

    // Lắng nghe thông báo từ server
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      const newNotify = [message, ...notifications]
      console.log('message:', message);
      console.log('notify:', notifications);
      console.log('new:', newNotify);
      setNotifications(prevNotifications => [message, ...prevNotifications]); // Thêm thông báo mới vào danh sách
    });

    // Lắng nghe lỗi trong kết nối WebSocket
    ws.addEventListener('error', (error) => {
      console.log('WebSocket error:', error);
    });

  }, [accessToken]);
  
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
    const ws = new WebSocket(`ws://localhost:3005?token=${accessToken}`);
    ws.close();
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
              Quản lý người dùng
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/games"
              className={location.pathname === "/games" ? "active-link" : ""}
            >
              Quản lý trò chơi
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/events"
              className={location.pathname === "/events" ? "active-link" : ""}
            >
              Quản lý sự kiện
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/reports"
              className={location.pathname === "/reports" ? "active-link" : ""}
            >
              Báo cáo thống kê
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
              <strong>Thông báo</strong>
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
                <div>
                  <strong>{notif.title}</strong>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#555" }}>
                    {notif.content}
                  </p>
                </div>
              </MenuItem>
            ))}
          </Menu>

          <Button variant="outline-light" onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
