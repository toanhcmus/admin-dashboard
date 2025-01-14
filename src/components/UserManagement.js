import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";
import "./UserManagement.css";

const API_HOST = process.env.REACT_APP_API_HOST;
const API_PORT = process.env.REACT_APP_API_PORT;

const UserManagement = ({ accessToken }) => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${API_HOST}:${API_PORT}/unauthen/getAllAccounts`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch accounts.");
    }
  };
  
  // Gọi API khi component được render
  useEffect(() => {
    fetchAccounts();
  }, [accessToken]);
  

  const handleToggleStatus = async (user) => {
    try {
      const apiUrl = user.partner
        ? `${API_HOST}:${API_PORT}/admin/update/partner/${user.id}`
        : `${API_HOST}:${API_PORT}/admin/update/user/${user.id}`;

      const updatedStatus = !user.disabled;
      console.log(updatedStatus);

      await axios.post(
        apiUrl,
        { disabled: updatedStatus },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setUsers(
        users.map((u) =>
          u.id === user.id ? { ...u, disabled: updatedStatus } : u
        )
      );
      setSuccess(`Account ${updatedStatus ? "disabled" : "enabled"} successfully.`);
    } catch (err) {
      setError("Failed to toggle account status.");
    }
  };

  // Handle adding a new user or partner
  const handleAdd = (isPartner) => {
    setIsPartner(isPartner);
    setCurrentUser(
      isPartner
        ? {
            username: "",
            password: "",
            companyName: "",
            avatar: null,
            field: "",
            address: "",
            gpsLat: "",
            gpsLong: "",
            status: "Verified",
          }
        : {
            username: "",
            password: "",
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            facebook: "",
            avatar: "",
          }
    );
    setIsEditing(false);
    setShowModal(true);
  };

  // Handle editing a user or partner
  const handleEdit = (user, isPartner) => {
    setIsPartner(isPartner);
    
    if (isPartner && user.partner) {
      // Đổ dữ liệu vào state nếu là Partner
      setCurrentUser({
        username: user.username,
        password: "", // Không hiển thị mật khẩu
        companyName: user.partner.companyName,
        avatar: user.partner.avatar,
        field: user.partner.field,
        address: user.partner.address,
        gpsLat: user.partner.gpsLat,
        gpsLong: user.partner.gpsLong,
        status: user.partner.status,
      });
    } else if (!isPartner && user.user) {
      // Đổ dữ liệu vào state nếu là User
      setCurrentUser({
        username: user.username,
        password: "", // Không hiển thị mật khẩu
        firstName: user.user.firstName,
        lastName: user.user.lastName,
        avatar: user.user.avatar,
        phone: user.user.phone,
        email: user.user.email,
        facebook: user.user.facebook,
      });
    } else {
      // Trường hợp thiếu thông tin (nếu user không có user.partner hoặc user.user)
      setCurrentUser({
        username: user.username,
        password: "",
      });
    }
    setIsEditing(true);
    setShowModal(true);
  };

  // Handle saving a user or partner
  const handleSave = async () => {
    setError("");
    setSuccess("");
    console.log(accessToken);
    try {
      if (isEditing) {
        const apiUrl = isPartner
          ? `${API_HOST}:${API_PORT}/admin/update/partner/${currentUser.partner?.id}`
          : `${API_HOST}:${API_PORT}/admin/update/user/${currentUser.id}`;
        if (isPartner) {
          currentUser.gpsLat = parseFloat(currentUser.gpsLat) || 0;
          currentUser.gpsLong = parseFloat(currentUser.gpsLong) || 0;
        }
        await axios.post(apiUrl, currentUser, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setSuccess(isPartner ? "Partner updated successfully." : "User updated successfully.");
      } else {
        console.log("Create");
        const apiUrl = isPartner
          ? `${API_HOST}:${API_PORT}/admin/create/partner`
          : `${API_HOST}:${API_PORT}/admin/create/user`;
        console.log(currentUser);
        if (isPartner) {
          currentUser.gpsLat = parseFloat(currentUser.gpsLat) || 0;
          currentUser.gpsLong = parseFloat(currentUser.gpsLong) || 0;
        }
        await axios.post(apiUrl, currentUser, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setSuccess(isPartner ? "Partner created successfully." : "User created successfully.");
      }
      setShowModal(false);
      // Gọi lại API để refresh dữ liệu
      fetchAccounts();
    } catch (err) {
      console.log(err);
      setError("Failed to save.");
    }
  };

  // Other actions: delete, toggle status...
  const handleDelete = async (userId, role) => {
    // console.log(userId, role);
    console.log(accessToken);
    if (role === "ADMIN") {
      setError("Admin accounts cannot be deleted.");
      return;
    }
    try {
      await axios.delete(
        `${API_HOST}:${API_PORT}/admin/removeAccount`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: { userId },
        }
      );
      setUsers(users.filter((user) => user.id !== userId));
      setSuccess("Account deleted successfully.");
    } catch (err) {
      setError("Failed to delete.");
    }
  };
  
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "All" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });
  
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 10000); // 30 giây
  
      // Dọn dẹp bộ đếm thời gian khi component unmount hoặc giá trị thay đổi
      return () => clearTimeout(timer);
    }
  }, [error, success]);
  

  return (
    <div>
      <h2>User Management</h2>
      <div className="mb-3 d-flex justify-content-between">
        {/* Thanh tìm kiếm */}
        <input
          type="text"
          className="form-control"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px" }}
        />
        {/* Bộ lọc Role */}
        <select
          className="form-select"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{ width: "200px" }}
        >
          <option value="All">All Roles</option>
          <option value="USER">User</option>
          <option value="PARTNER">Partner</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>


      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <div className="mb-3">
        <Button variant="primary" onClick={() => handleAdd(false)} className="me-2">
          Add User
        </Button>
        <Button variant="success" onClick={() => handleAdd(true)}>
          Add Partner
        </Button>
      </div>
      <Table striped bordered hover responsive className="table-highlight shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Created Date</th>
            <th>Status</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{new Date(user.createdDate).toLocaleDateString()}</td>
              <td>
                <span className={`badge ${user.disabled ? "bg-danger" : "bg-success"}`}>
                  {user.disabled ? "Inactive" : "Active"}
                </span>
              </td>
              <td>{user.role}</td>
              <td>
                {/* Nút kích hoạt/khoá tài khoản */}
                <Button
                  variant={user.disabled ? "success" : "secondary"}
                  size="sm"
                  className="me-2"
                  onClick={() => handleToggleStatus(user)}
                >
                  <i className={user.disabled ? "fas fa-check" : "fas fa-ban"}></i>
                </Button>

                {/* Nút Edit: Chỉ hiển thị nếu không phải Admin */}
                {user.role !== "ADMIN" && (
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(user, !!user.partner)}
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                )}

                {/* Nút Delete: Chỉ hiển thị nếu không phải Admin */}
                {user.role !== "ADMIN" && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(user.id, user.role)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                )}
              </td>

            </tr>
          ))}
        </tbody>

      </Table>

      {/* Modal for Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing
              ? isPartner
                ? "Edit Partner"
                : "Edit User"
              : isPartner
              ? "Add Partner"
              : "Add User"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
          {/* Trường Username và Password bắt buộc */}
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={currentUser?.username || ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, username: e.target.value })
              }
              required
              placeholder="Enter username"
            />
          </Form.Group>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={currentUser?.password || ""}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, password: e.target.value })
              }
              required
              placeholder="Enter password"
            />
          </Form.Group>

          {/* Nếu là Partner */}
          {isPartner ? (
            <>
              <Form.Group controlId="avatar" className="mb-3">
                <Form.Label>Avatar</Form.Label>
                <Form.Control
                  type="text"
                  value={currentUser?.avatar || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, avatar: e.target.value })
                  }
                  required
                  placeholder="Enter avatar"
                />
              </Form.Group>
              <Form.Group controlId="companyName" className="mb-3">
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  value={currentUser?.companyName || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, companyName: e.target.value })
                  }
                  required
                  placeholder="Enter company name"
                />
              </Form.Group>
              <Form.Group controlId="field" className="mb-3">
                <Form.Label>Field</Form.Label>
                <Form.Control
                  type="text"
                  value={currentUser?.field || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, field: e.target.value })
                  }
                  required
                  placeholder="Enter field of business"
                />
              </Form.Group>
              <Form.Group controlId="address" className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  value={currentUser?.address || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, address: e.target.value })
                  }
                  required
                  placeholder="Enter address"
                />
              </Form.Group>
              <Form.Group controlId="gpsLat" className="mb-3">
                <Form.Label>Latitude</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  value={currentUser?.gpsLat || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, gpsLat: parseFloat(e.target.value) || 0 })
                  }
                  required
                  placeholder="Enter latitude"
                />
              </Form.Group>
              <Form.Group controlId="gpsLong" className="mb-3">
                <Form.Label>Longitude</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  value={currentUser?.gpsLong || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, gpsLong: parseFloat(e.target.value) || 0 })
                  }
                  required
                  placeholder="Enter longitude"
                />
              </Form.Group>
              <Form.Group controlId="status" className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  type="text"
                  value={currentUser?.status || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, status: e.target.value })
                  }
                  required
                  placeholder="Enter status"
                />
              </Form.Group>
            </>
          ) : (
            // Nếu là User
            <>
              <Form.Group controlId="firstName" className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={currentUser?.firstName || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, firstName: e.target.value })
                  }
                  required
                  placeholder="Enter first name"
                />
              </Form.Group>
              <Form.Group controlId="lastName" className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={currentUser?.lastName || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, lastName: e.target.value })
                  }
                  required
                  placeholder="Enter last name"
                />
              </Form.Group>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={currentUser?.email || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, email: e.target.value })
                  }
                  required
                  placeholder="Enter email"
                />
              </Form.Group>
              <Form.Group controlId="phone" className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={currentUser?.phone || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, phone: e.target.value })
                  }
                  required
                  placeholder="Enter phone number"
                />
              </Form.Group>
              <Form.Group controlId="facebook" className="mb-3">
                <Form.Label>Facebook</Form.Label>
                <Form.Control
                  type="text"
                  value={currentUser?.facebook || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, facebook: e.target.value })
                  }
                  required
                  placeholder="Enter Facebook profile"
                />
              </Form.Group>
              <Form.Group controlId="avatar" className="mb-3">
                <Form.Label>Avatar</Form.Label>
                <Form.Control
                  type="text"
                  value={currentUser?.avatar || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, avatar: e.target.value })
                  }
                  required
                  placeholder="Enter avatar URL"
                />
              </Form.Group>
            </>
          )}
        </Form>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
