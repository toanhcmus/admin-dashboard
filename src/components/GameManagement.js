import React, { useState, useEffect } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import axios from "axios";

const GameManagement = () => {
  const [games, setGames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Lấy danh sách trò chơi
  useEffect(() => {
    axios.get("http://localhost:5000/api/games")
      .then((response) => {
        setGames(response.data);
      })
      .catch((error) => {
        console.error("Error fetching games!", error);
      });
  }, []);

  const handleEditGame = (game) => {
    setCurrentGame(game);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddGame = () => {
    setCurrentGame({ name: "", type: "Trivia", status: "inactive", guide: "", exchangeable_items: false });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSaveGame = () => {
    if (isEditing) {
      // Cập nhật trò chơi
      axios.put(`http://localhost:5000/api/games/${currentGame.id}`, currentGame)
        .then(() => {
          setGames((prevGames) =>
            prevGames.map((game) =>
              game.id === currentGame.id ? currentGame : game
            )
          );
          setShowModal(false);
        })
        .catch((error) => {
          console.error("Error updating game!", error);
        });
    } else {
      // Thêm trò chơi mới
      axios.post("http://localhost:5000/api/games", currentGame)
        .then((response) => {
          setGames([...games, response.data]);
          setShowModal(false);
        })
        .catch((error) => {
          console.error("Error adding game!", error);
        });
    }
  };

  const handleDeleteGame = (gameId) => {
    axios.delete(`http://localhost:5000/api/games/${gameId}`)
      .then(() => {
        setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
      })
      .catch((error) => {
        console.error("Error deleting game!", error);
      });
  };

  const handleActivateGame = (gameId) => {
    axios.put(`http://localhost:5000/api/games/${gameId}/activate`)
      .then(() => {
        setGames((prevGames) =>
          prevGames.map((game) =>
            game.id === gameId ? { ...game, status: "active" } : game
          )
        );
        alert("Trò chơi đã được kích hoạt thành công!");
      })
      .catch((error) => {
        console.error("Error activating game!", error);
        alert("Có lỗi xảy ra khi kích hoạt trò chơi!");
      });
  };

  return (
    <div>
      <h2>Quản lý Trò Chơi</h2>
      <Button variant="primary" className="mb-3" onClick={handleAddGame}>
        Thêm Trò Chơi
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên trò chơi</th>
            <th>Loại trò chơi</th>
            <th>Trạng thái</th>
            <th>Cho phép trao đổi vật phẩm</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id}>
              <td>{game.id}</td>
              <td>{game.name}</td>
              <td>{game.type}</td>
              <td>{game.status === "active" ? "Hoạt động" : "Ẩn"}</td>
              <td>{game.exchangeable_items ? "Có" : "Không"}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEditGame(game)}>Sửa</Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleDeleteGame(game.id)}>Xóa</Button>{" "}
                {game.status !== "active" && (
                  <Button variant="success" size="sm" onClick={() => handleActivateGame(game.id)}>
                    Kích hoạt
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal thêm/sửa trò chơi */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Sửa Trò Chơi" : "Thêm Trò Chơi"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên trò chơi</Form.Label>
              <Form.Control
                type="text"
                value={currentGame?.name || ""}
                onChange={(e) => setCurrentGame({ ...currentGame, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loại trò chơi</Form.Label>
              <Form.Select
                value={currentGame?.type || ""}
                onChange={(e) => setCurrentGame({ ...currentGame, type: e.target.value })}
              >
                <option value="Trivia">Quiz</option>
                <option value="Casual">Shake</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hướng dẫn chơi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentGame?.guide || ""}
                onChange={(e) => setCurrentGame({ ...currentGame, guide: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Cho phép trao đổi vật phẩm"
                checked={currentGame?.exchangeable_items || false}
                onChange={(e) =>
                  setCurrentGame({ ...currentGame, exchangeable_items: e.target.checked })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={currentGame?.status || ""}
                onChange={(e) => setCurrentGame({ ...currentGame, status: e.target.value })}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Ẩn</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="primary" onClick={handleSaveGame}>Lưu</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GameManagement;
