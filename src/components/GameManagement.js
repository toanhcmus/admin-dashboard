import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";
import './GameManagement.css';

const GameManagement = ({ accessToken }) => {
  const [games, setGames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Lấy danh sách trò chơi từ API
  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL_GAME}/unauth/all`);
      setGames(response.data);
    } catch (err) {
      setError("Failed to fetch games.");
    }
  };

  const handleEditGame = (game) => {
    setCurrentGame(game);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAddGame = () => {
    setCurrentGame({ name: "", description: "", status: "ACTIVE" });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSaveGame = async () => {
    setError("");
    setSuccess("");
  
    try {
      if (isEditing) {
        // Cập nhật trò chơi
        await axios.post(
          `${process.env.REACT_APP_URL_GAME}/admin/update`,
          {
            id: currentGame.id,
            name: currentGame.name,
            description: currentGame.description,
            status: currentGame.status,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
  
        setGames((prevGames) =>
          prevGames.map((game) =>
            game.id === currentGame.id ? currentGame : game
          )
        );
        fetchGames();
        setSuccess("Game updated successfully.");
      } else {
        // Tạo trò chơi mới
        const response = await axios.post(
          `${process.env.REACT_APP_URL_GAME}/admin/create`,
          {
            name: currentGame.name,
            description: currentGame.description,
            status: currentGame.status,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
  
        // setGames([...games, response.data]);
        fetchGames();
        setSuccess("Game added successfully.");
      }
      setShowModal(false);
    } catch (err) {
      setError("Failed to save game.");
    }
  };
  
  const handleDeleteGame = async (gameId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_URL_GAME}/admin/delete`,
        { id: gameId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
  
      // setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
      fetchGames();
      setSuccess("Game deleted successfully.");
    } catch (err) {
      setError("Failed to delete game.");
    }
  };  
  return (
    <div>
      <h2>Game Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Button variant="primary" className="mb-3" onClick={handleAddGame}>
        Add Game
      </Button>
      <Table striped bordered hover responsive className="table-highlight shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Game Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id}>
              <td>{game.id}</td>
              <td>{game.name}</td>
              <td>{game.description}</td>
              <td>
                <span className={`badge ${game.status === "ACTIVE" ? "bg-success" : "bg-danger"}`}>
                  {game.status}
                </span>
              </td>
              <td>
                {/* Nút kích hoạt/khoá
                <Button
                  variant={game.status === "ACTIVE" ? "secondary" : "success"}
                  size="sm"
                  className="me-2"
                  onClick={() => handleToggleStatus(game)}
                >
                  <i className={game.status === "ACTIVE" ? "fas fa-check" : "fas fa-ban"}></i>
                </Button> */}
                {/* Nút Edit */}
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditGame(game)}
                >
                  <i className="fas fa-edit"></i>
                </Button>
                {/* Nút Delete */}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteGame(game.id)}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>


      {/* Modal thêm/sửa trò chơi */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Game" : "Add Game"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Game Name</Form.Label>
              <Form.Control
                type="text"
                value={currentGame?.name || ""}
                onChange={(e) =>
                  setCurrentGame({ ...currentGame, name: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentGame?.description || ""}
                onChange={(e) =>
                  setCurrentGame({ ...currentGame, description: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={currentGame?.status || ""}
                onChange={(e) =>
                  setCurrentGame({ ...currentGame, status: e.target.value })
                }
                required
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveGame}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GameManagement;
