import React, { createContext, useReducer, useEffect } from 'react';
import api from '../services/api';
import { requestForToken } from '../firebase'; // <-- import firebase util

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, isAuthenticated: true, user: action.payload.user };
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      dispatch({ type: 'LOGIN', payload: { user: JSON.parse(user) } });
    }
  }, []);

  const saveFcmToken = async (jwtToken) => {
    const fcmToken = await requestForToken();
    if (fcmToken) {
      try {
        await api.post(
          '/api/auth/save-fcm-token',
          { token: fcmToken },
          { headers: { Authorization: `Bearer ${jwtToken}` } }
        );
      } catch (err) {
        console.error("Error saving FCM token:", err);
      }
    }
  };

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    dispatch({ type: 'LOGIN', payload: { user: data.user } });

    // save FCM token after login
    await saveFcmToken(data.token);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    dispatch({ type: 'LOGIN', payload: { user: data.user } });

    // save FCM token after register
    await saveFcmToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
