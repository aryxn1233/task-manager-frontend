import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TasksPage from "./pages/TasksPage";

import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import AuthContext from "./context/AuthContext";

// Firebase helpers
import { requestForToken, onMessageListener } from "./services/firebase";
import api from "./services/api"; // Axios instance with JWT

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    // Only send token if user is authenticated
    if (isAuthenticated) {
      requestForToken().then((token) => {
        console.log("User FCM Token:", token);
        // Send token to backend if exists
        if (token) {
          api.post(
            "/notifications/save-token",
            { token }
            // Axios headers include JWT automatically via interceptor
          ).catch((err) => console.error("Error saving FCM token from App.js:", err));
        }
      });
    }

    // Listen for notifications in foreground
    onMessageListener()
      .then((payload) => {
        console.log("Notification received in foreground:", payload);
        alert(`${payload.notification.title}: ${payload.notification.body}`);
      })
      .catch((err) => console.log("Notification listener error: ", err));
  }, [isAuthenticated]);

  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <TasksPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/tasks" replace />} />
          </Routes>
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
