import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import AuthContext from './context/AuthContext';

// Import Firebase helpers
import { requestForToken, onMessageListener } from './services/firebase';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = React.useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  useEffect(() => {
    // Ask for permission + get FCM token
    requestForToken().then((token) => {
      console.log("User FCM Token:", token);
      // 🔹 TODO: Send token to backend API to save with user
    });

    // Listen for foreground notifications
    onMessageListener()
      .then((payload) => {
        console.log("Notification received in foreground:", payload);
        alert(`${payload.notification.title}: ${payload.notification.body}`);
      })
      .catch((err) => console.log("Notification listener error: ", err));
  }, []);

  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/tasks"
              element={<PrivateRoute><TasksPage /></PrivateRoute>}
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
