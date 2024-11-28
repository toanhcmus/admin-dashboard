import React from "react";
import { Table, Button } from "react-bootstrap";
import { mockUsers } from "../data/mockData";

const UserManagement = () => {
  return (
    <div>
      <h2>Quản lý Tài Khoản Người Dùng</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Loại tài khoản</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.type}</td>
              <td
                className={user.status === "Khóa" ? "status-negative" : "status-positive"}
              >
                {user.status}
              </td>
              <td>
                <Button variant="info" size="sm">Sửa</Button> 
                <Button variant="danger" size="sm" className="ml-2">Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserManagement;
