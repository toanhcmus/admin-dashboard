import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js"; // Import Chart và registerables
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import axios from "axios";

// Đăng ký các thành phần cần thiết
Chart.register(...registerables);

const ReportPage = () => {
  const [eventStats, setEventStats] = useState([]);
  const [topEvents, setTopEvents] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [newPartners, setNewPartners] = useState([]);
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-01-14");
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchEventStats();
    fetchTopEvents();
    fetchNewAccounts("USER");
    fetchNewAccounts("PARTNER");
  }, []);

  const fetchEventStats = async () => {
    try {
      const response = await axios.get(
        `http://localhost:1001/event-unauth/stats/events-by-day?start=${startDate}&end=${endDate}`
      );
      console.log(response.data);
      setEventStats(response.data);
    } catch (error) {
      console.error("Error fetching event stats", error);
    }
  };

  const fetchTopEvents = async () => {
    try {
      const response = await axios.get(
        `http://localhost:1001/event-unauth/stats/top-joined-events?top=3`
      );
      console.log(response.data);
      setTopEvents(response.data);
    } catch (error) {
      console.error("Error fetching top events", error);
    }
  };

  const fetchNewAccounts = async (role) => {
    try {
      const response = await axios.post(
        `http://localhost:3002/auth/unauthen/statistic/getNewlyRegisteredAccounts`,
        { role, days: 30 }
      );
      console.log(response.data);
      if (role === "USER") setNewUsers(response.data);
      else setNewPartners(response.data);
    } catch (error) {
      console.error(`Error fetching ${role} accounts`, error);
    }
  };

  const handleDateChange = () => {
    fetchEventStats();
  };

  const eventStatsData = {
    labels: eventStats.map((stat) => new Date(stat.day).toLocaleDateString()),
    datasets: [
      {
        label: "Events Per Day",
        data: eventStats.map((stat) => stat.count),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };

  const calculateTotalAccounts = (data) => {
    return data.reduce((sum, record) => sum + record.count, 0);
  };

  const newAccountsData = {
    labels: newUsers.map((stat) => stat.date),
    datasets: [
      {
        label: "New Users",
        data: newUsers.map((stat) => stat.count),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
      {
        label: "New Partners",
        data: newPartners.map((stat) => stat.count),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <Container fluid>
      <h2 className="my-4">Reports</h2>
      {/* Bộ lọc ngày */}
      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row>
              <Col md={5}>
                <Form.Group controlId="startDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group controlId="endDate">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button variant="primary" onClick={handleDateChange}>
                  Filter
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Biểu đồ sự kiện theo ngày */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <h5>Events Per Day</h5>
              <Line data={eventStatsData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ tài khoản mới */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h5>Newly Registered Accounts</h5>

              {/* Dropdown chọn số ngày */}
              <Form.Group className="mb-3" controlId="daysSelect">
                <Form.Label>Days to Display</Form.Label>
                <Form.Select
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value, 10))}
                >
                  <option value={7}>Last 7 Days</option>
                  <option value={14}>Last 14 Days</option>
                  <option value={30}>Last 30 Days</option>
                </Form.Select>
              </Form.Group>

              {/* Hiển thị tổng số tài khoản mới */}
              <Row className="mb-3">
                <Col>
                  <Card>
                    <Card.Body>
                      <h6>Total New Users</h6>
                      <h4>{calculateTotalAccounts(newUsers)}</h4>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Body>
                      <h6>Total New Partners</h6>
                      <h4>{calculateTotalAccounts(newPartners)}</h4>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Line data={newAccountsData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportPage;
