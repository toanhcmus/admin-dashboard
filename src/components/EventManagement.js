import React from "react";
import { Table, Button } from "react-bootstrap";
import { mockEvents } from "../data/mockData";

const EventManagement = () => {
  return (
    <div>
      <h2>Quản lý Sự Kiện</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên sự kiện</th>
            <th>Đối tác</th>
            <th>Thời gian bắt đầu</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {mockEvents.map((event) => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.name}</td>
              <td>{event.partner}</td>
              <td>{event.start_date}</td>
              <td
                className={event.status === "Đã kết thúc" ? "status-negative" : "status-positive"}
              >
                {event.status}
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

export default EventManagement;
