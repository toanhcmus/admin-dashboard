import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users!", error);
      });
  }, []);

  const handleToggleStatus = (userId) => {
    axios.put(`http://localhost:5000/api/users/${userId}/toggle-status`)
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? { ...user, status: user.status === "active" ? "inactive" : "active" }
              : user
          )
        );
      })
      .catch((error) => {
        console.error("Error toggling user status!", error);
      });
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleSaveUser = () => {
    axios.put(`http://localhost:5000/api/users/${currentUser.id}`, currentUser)
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === currentUser.id ? currentUser : user
          )
        );
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error updating user!", error);
      });
  };

  return (
    <div>
      <h2>Quản lý Tài Khoản Người Dùng</h2>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Form.Group>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Quyền hạn</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.filter(user => user.name.toLowerCase().includes(search.toLowerCase())).map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status === "active" ? "Hoạt động" : "Khóa"}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEditUser(user)}>Sửa</Button>
                <Button variant={user.status === "active" ? "danger" : "success"} size="sm" onClick={() => handleToggleStatus(user.id)}>
                  {user.status === "active" ? "Khóa" : "Kích hoạt"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal Sửa Tài Khoản */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sửa Tài Khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                value={currentUser?.name || ""}
                onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={currentUser?.email || ""}
                onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quyền hạn</Form.Label>
              <Form.Select
                value={currentUser?.role || ""}
                onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="partner">Đối tác</option>
                <option value="player">Người chơi</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleSaveUser}>Lưu</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
