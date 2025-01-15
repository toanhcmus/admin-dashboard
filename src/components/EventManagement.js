import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Alert } from "react-bootstrap";
import axios from "axios";
import './EventManagement.css';

const EventManagement = ({ accessToken }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventGames, setEventGames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL_EVENT}/unauth/event/all`);
      setEvents(response.data);
    } catch (err) {
      setError("Failed to fetch games.");
    }
  };

  // Lấy danh sách sự kiện
  useEffect(() => {
    fetchEvents();
  }, []);

  // Duyệt hoặc từ chối sự kiện
  const handleApprove = async (eventId, isApproved) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_URL_EVENT}/admin/validate`,
        {
          eventId: String(eventId),
          isApproved: String(isApproved),
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
  
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { ...event, eventStatus: isApproved === "true" ? "APPROVED" : "REJECTED" }
            : event
        )
      );
      setSuccess(`Event ${isApproved === "true" ? "approved" : "rejected"} successfully.`);
      setShowModal(false); // Đóng modal
      fetchEvents();
    } catch {
      setError("Failed to update event status.");
    }
  };
  

  // Xem chi tiết sự kiện
  const handleViewDetails = async (eventId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL_GAME}/game-event/unauth/query?eventId=${eventId}`
      );
      setEventGames(response.data);
      const selectedEvent = events.find((event) => event.id === eventId);
      setSelectedEvent(selectedEvent);
      setShowModal(true);
    } catch {
      setError("Failed to fetch event details.");
    }
  };

  return (
    <div>
      <h2>Quản lý sự kiện</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Table striped bordered hover responsive className="table-highlight shadow-sm">
      <thead className="table-dark">
        <tr>
          <th style={{ width: "10%" }}>Hình ảnh</th>
          <th style={{ width: "15%" }}>ID</th>
          <th style={{ width: "20%" }}>Tên sự kiện</th>
          <th style={{ width: "20%" }}>Mô tả</th>
          <th style={{ width: "15%" }}>Ngày bắt đầu</th>
          <th style={{ width: "10%" }}>Trạng thái</th>
          <th style={{ width: "15%" }}>Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <tr key={event.id}>
            <td>
              <img
                src={event.image}
                alt={event.name}
                style={{ width: "80px", height: "50px", objectFit: "cover" }}
              />
            </td>
            <td>{event.id}</td>
            <td>{event.name}</td>
            <td>{event.description}</td>
            <td>{new Date(event.startDate).toLocaleString()}</td>
            <td>
              <span
                className={`badge ${
                  event.eventStatus === "PENDING"
                    ? "bg-warning"
                    : event.eventStatus === "STARTED"
                    ? "bg-primary"
                    : event.eventStatus === "UPCOMING"
                    ? "bg-info"
                    : event.eventStatus === "ENDED"
                    ? "bg-dark"
                    : "bg-secondary"
                }`}
              >
                {event.eventStatus}
              </span>
            </td>

            <td>
              <Button
                variant="info"
                size="sm"
                onClick={() => handleViewDetails(event.id)}
              >
                <i className="fas fa-eye"></i>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>

      </Table>

      {/* Modal chi tiết sự kiện */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết sự kiện</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              <h5>{selectedEvent.name}</h5>
              <p>{selectedEvent.description}</p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(selectedEvent.startDate).toLocaleString()}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                <span
                  className={`badge ${
                    selectedEvent.eventStatus === "PENDING"
                      ? "bg-warning"
                      : selectedEvent.eventStatus === "STARTED"
                      ? "bg-primary"
                      : selectedEvent.eventStatus === "UPCOMING"
                      ? "bg-info"
                      : selectedEvent.eventStatus === "ENDED"
                      ? "bg-dark"
                      : "bg-secondary"
                  }`}
                >
                  {selectedEvent.eventStatus}
                </span>
              </p>
              
              {/* <Table striped bordered hover>
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>Image</th>
                    <th style={{ width: "20%" }}>ID</th>
                    <th style={{ width: "25%" }}>Game Name</th>
                    <th style={{ width: "45%" }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {eventGames.map((game) => (
                    <tr key={game.id}>
                      <td>
                        <img
                          src={game.image}
                          alt={game.name}
                          style={{ width: "80px", height: "50px", objectFit: "cover" }}
                        />
                      </td>
                      <td>{game.id}</td>
                      <td>{game.name}</td>
                      <td>{game.description}</td>
                    </tr>
                  ))}
                </tbody>
              </Table> */}

              {eventGames.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th style={{ width: "10%" }}>Image</th>
                      <th style={{ width: "20%" }}>ID</th>
                      <th style={{ width: "25%" }}>Game Name</th>
                      <th style={{ width: "45%" }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventGames.map((game) => (
                      <tr key={game.id}>
                        <td>
                          <img
                            src={game.image}
                            alt={game.name}
                            style={{ width: "80px", height: "50px", objectFit: "cover" }}
                          />
                        </td>
                        <td>{game.id}</td>
                        <td>{game.name}</td>
                        <td>{game.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <strong>Không có trò chơi cho sự kiện này</strong>
              )}


            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedEvent && selectedEvent.eventStatus === "PENDING" && (
            <>
              <Button
                variant="success"
                onClick={() => handleApprove(selectedEvent.id, "true")}
              >
                Chấp nhận
              </Button>
              <Button
                variant="danger"
                onClick={() => handleApprove(selectedEvent.id, "false")}
              >
                Từ chối
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>

      </Modal>
    </div>
  );
};

export default EventManagement;
