import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ChatWindow from "./components/Chat/ChatWindow";
import LandingPage from "./components/Landing/LandingPage";
import "./App.css";

// Protected route wrapper
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <div className="app">
            <Routes>
              {/* Landing page */}
              <Route path="/" element={<LandingPage />} />

              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected chat route */}
              <Route
                path="/chat"
                element={
                  <PrivateRoute>
                    <ChatWindow />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
