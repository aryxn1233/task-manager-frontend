import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './styles/global.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// 🔥 Firebase imports
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";

// ✅ Your Firebase config (same as in firebaseConfig.js)
const firebaseConfig = {
  apiKey: "AIzaSyBVzU1sYj0JWLhxN3ZGCuk0dstRBoLgjgI",
  authDomain: "task-manager-abc20.firebaseapp.com",
  projectId: "task-manager-abc20",
  storageBucket: "task-manager-abc20.firebasestorage.app",
  messagingSenderId: "779603659104",
  appId: "1:779603659104:web:ce53dc32aa912654fb3605",
  measurementId: "G-LZ9FTLEW8E"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔔 Setup Firebase Cloud Messaging (FCM)
if ("Notification" in window && navigator.serviceWorker) {
  const messaging = getMessaging(app);

  // Listen for foreground messages
  onMessage(messaging, (payload) => {
    console.log("📩 Message received: ", payload);

    if (Notification.permission === "granted") {
      new Notification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/firebase-logo.png", // optional, put your app logo in /public
      });
    }
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
