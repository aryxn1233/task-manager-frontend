// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBVzU1sYj0JWLhxN3ZGCuk0dstRBoLgjgI",
  authDomain: "task-manager-abc20.firebaseapp.com",
  projectId: "task-manager-abc20",
  storageBucket: "task-manager-abc20.firebasestorage.app",
  messagingSenderId: "779603659104",
  appId: "1:779603659104:web:ce53dc32aa912654fb3605",
  measurementId: "G-LZ9FTLEW8E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Messaging service
const messaging = getMessaging(app);

export const requestForToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BFD_9vAjeE3A3jNILPAIP7JmNyjQMeg2i4SQDr6CMnG49JMAAw_N9ZG-5weNvE3ur-sGnb7Uo_FYVLFx3YzDpII"
    });
    if (currentToken) {
      console.log("FCM Token:", currentToken);
      // TODO: Send this token to backend to save per user
    } else {
      console.log("No registration token available.");
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
