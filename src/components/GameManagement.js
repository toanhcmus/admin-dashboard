import React from "react";
import { Table, Button } from "react-bootstrap";
import { mockGames } from "../data/mockData";

const GameManagement = () => {
  return (
    <div>
      <h2>Quản lý Trò Chơi</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên trò chơi</th>
            <th>Loại trò chơi</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {mockGames.map((game) => (
            <tr key={game.id}>
              <td>{game.id}</td>
              <td>{game.name}</td>
              <td>{game.type}</td>
              <td
                className={game.status === "Ẩn" ? "status-negative" : "status-positive"}
              >
                {game.status}
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

export default GameManagement;
