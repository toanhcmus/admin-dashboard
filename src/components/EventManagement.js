import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";

const EventManagement = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/events")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the events!", error);
      });
  }, []);

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
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.name}</td>
              <td>{event.partner_id}</td>
              <td>{event.start_date}</td>
              <td>{event.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default EventManagement;
