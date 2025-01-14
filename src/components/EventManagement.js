import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Alert } from "react-bootstrap";
import axios from "axios";
import './EventManagement.css';

const API_HOST = "http://localhost:1001";

const EventManagement = ({ accessToken }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventGames, setEventGames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_HOST}/event-unauth/all`);
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
        `${API_HOST}/event-admin/validate`,
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
    } catch {
      setError("Failed to update event status.");
    }
  };
  

  // Xem chi tiết sự kiện
  const handleViewDetails = async (eventId) => {
    try {
      const response = await axios.get(
        `${API_HOST}/game-event-unauth/query?eventId=${eventId}`
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
      <h2>Event Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Table striped bordered hover responsive className="table-highlight shadow-sm">
      <thead className="table-dark">
        <tr>
          <th style={{ width: "10%" }}>Image</th>
          <th style={{ width: "15%" }}>ID</th>
          <th style={{ width: "20%" }}>Event Name</th>
          <th style={{ width: "35%" }}>Description</th>
          <th style={{ width: "15%" }}>Start Date</th>
          <th style={{ width: "10%" }}>Status</th>
          <th style={{ width: "10%" }}>Actions</th>
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
                  event.eventStatus === "APPROVED"
                    ? "bg-success"
                    : event.eventStatus === "REJECTED"
                    ? "bg-danger"
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
          <Modal.Title>Event Details</Modal.Title>
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
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ${
                    selectedEvent.eventStatus === "APPROVED"
                      ? "bg-success"
                      : selectedEvent.eventStatus === "REJECTED"
                      ? "bg-danger"
                      : "bg-secondary"
                  }`}
                >
                  {selectedEvent.eventStatus}
                </span>
              </p>
              <h6>Games in Event:</h6>
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

            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={() =>
              handleApprove(selectedEvent.id, "true")
            }
          >
            Approve
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              handleApprove(selectedEvent.id, "false")
            }
          >
            Reject
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EventManagement;
