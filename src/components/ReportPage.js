import React, { useState, useEffect } from "react";
import { Line} from "react-chartjs-2";
import { Chart, registerables } from "chart.js"; // Import Chart và registerables
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import axios from "axios";

// Đăng ký các thành phần cần thiết
Chart.register(...registerables);

const ReportPage = () => {
  const [eventStats, setEventStats] = useState([]);
  const [newUsers, setNewUsers] = useState([]);
  const [newPartners, setNewPartners] = useState([]);
  const [startDate, setStartDate] = useState("2025-01-01");
  const [endDate, setEndDate] = useState("2025-01-14");
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchEventStats();
    fetchNewAccounts("USER");
    fetchNewAccounts("PARTNER");
  }, []);

  const fetchEventStats = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL_EVENT}/unauth/event/stats/events-by-day?start=${startDate}&end=${endDate}`
      );
      console.log(response.data);
      setEventStats(response.data);
    } catch (error) {
      console.error("Error fetching event stats", error);
    }
  };

  useEffect(() => {
    fetchNewAccounts("USER");
    fetchNewAccounts("PARTNER");
  }, [days]); // Thêm `days` làm phụ thuộc
  
  const fetchNewAccounts = async (role) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL_AUTH}/auth/unauthen/statistic/getNewlyRegisteredAccounts`,
        { role, days}
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
        label: "Số sự kiện theo ngày",
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
        label: "Người dùng mới",
        data: newUsers.map((stat) => stat.count),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
      {
        label: "Đối tác mới",
        data: newPartners.map((stat) => stat.count),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };

  return (
    <Container fluid>
      <h2 className="my-4">Báo cáo thống kê</h2>
      {/* Bộ lọc ngày */}
      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row>
              <Col md={5}>
                <Form.Group controlId="startDate">
                  <Form.Label>Ngày bắt đầu</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={5}>
                <Form.Group controlId="endDate">
                  <Form.Label>Ngày kết thúc</Form.Label>
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
              <h5>Số sự kiện theo ngày</h5>
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
              <h5>Số tài khoản mới</h5>

              {/* Dropdown chọn số ngày */}
              <Form.Group className="mb-3" controlId="daysSelect">
                <Form.Label>Chọn số ngày</Form.Label>
                <Form.Select
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value, 10))}
                >
                  <option value={7}>7 ngày gần nhất</option>
                  <option value={14}>14 ngày gần nhất</option>
                  <option value={30}>30 ngày gần nhất</option>
                </Form.Select>
              </Form.Group>

              {/* Hiển thị tổng số tài khoản mới */}
              <Row className="mb-3">
                <Col>
                  <Card>
                    <Card.Body>
                      <h6>Tổng số người dùng mới</h6>
                      <h4>{calculateTotalAccounts(newUsers)}</h4>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card>
                    <Card.Body>
                      <h6>Tổng số đối tác mới</h6>
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
