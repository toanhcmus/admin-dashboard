import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import UserManagement from "./components/UserManagement";
import GameManagement from "./components/GameManagement";
import EventManagement from "./components/EventManagement";
import Reports from "./components/Reports";
import Login from "./components/Login";
import './components/Login.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "@fortawesome/fontawesome-free/css/all.min.css";


function App() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || "");
  const PrivateRoute = ({ children }) => {
    return accessToken ? children : <Navigate to="/" />;
  };
  
  return (
    <Router>
    {accessToken !== "" && <Header />}
    <div className="container mt-4">
      <Routes>
        {/* Trang Login */}
        {!accessToken ? (
          <Route path="/" element={<Login setAccessToken={setAccessToken} />} />
        ) : (
          <>
            {/* Bảo vệ các route khác */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <UserManagement accessToken={accessToken} />
                </PrivateRoute>
              }
            />
            <Route
              path="/games"
              element={
                <PrivateRoute>
                  <GameManagement accessToken={accessToken} />
                </PrivateRoute>
              }
            />
            <Route
              path="/events"
              element={
                <PrivateRoute>
                  <EventManagement accessToken={accessToken}/>
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              }
            />
          </>
        )}
      </Routes>
    </div>
  </Router>

  );
}

export default App;
