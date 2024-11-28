import React from "react";
import { Card, Row, Col, Table, Button } from "react-bootstrap";
import { mockReportData } from "../data/mockData";

// Optionally, you can import Chart.js to add a chart
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const chartData = {
  labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4'],
  datasets: [
    {
      label: 'Doanh thu',
      data: mockReportData.monthly_revenue,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }
  ]
};

const Reports = () => {
  return (
    <div>
      <h2>Báo Cáo Thống Kê</h2>

      {/* Tổng quan */}
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Header>Tổng số người dùng</Card.Header>
            <Card.Body>
              <h3>{mockReportData.total_users}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>Tổng số đối tác</Card.Header>
            <Card.Body>
              <h3>{mockReportData.total_partners}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>Tổng doanh thu</Card.Header>
            <Card.Body>
              <h3>{mockReportData.monthly_revenue.reduce((acc, curr) => acc + curr, 0)} USD</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ doanh thu */}
      <Row className="mb-4">
        <Col md={12}>
          <Card>
            <Card.Header>Doanh Thu Theo Tháng</Card.Header>
            <Card.Body>
              <div style={{ height: '300px', background: '#f1f1f1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Line data={chartData} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bảng thống kê chi tiết */}
      <Row>
        <Col md={12}>
          <Card>
            <Card.Header>Bảng Thống Kê Chi Tiết</Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Tháng</th>
                    <th>Doanh Thu (USD)</th>
                    <th>Số Người Dùng Mới</th>
                    <th>Số Đối Tác Mới</th>
                  </tr>
                </thead>
                <tbody>
                  {mockReportData.monthly_revenue.map((revenue, index) => (
                    <tr key={index}>
                      <td>{`Tháng ${index + 1}`}</td>
                      <td>{revenue}</td>
                      <td>{Math.floor(Math.random() * 100)}</td>
                      <td>{Math.floor(Math.random() * 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Nút xuất báo cáo */}
      <Row className="mt-4">
        <Col md={12} className="text-center">
          <Button variant="success">Xuất Báo Cáo</Button>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
