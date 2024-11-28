import React from "react";
import { Card, Row, Col } from "react-bootstrap";

const Dashboard = () => {
  return (
    <div>
      <h2>Bảng Điều Khiển</h2>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Header>Tổng số người dùng</Card.Header>
            <Card.Body>
              <h3>1200</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>Doanh thu tháng này</Card.Header>
            <Card.Body>
              <h3>4000 USD</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>Sự kiện đang diễn ra</Card.Header>
            <Card.Body>
              <h3>5</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
