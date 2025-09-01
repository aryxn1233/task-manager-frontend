import React, { createContext, useReducer, useContext } from 'react';
import api from '../services/api';
import AuthContext from './AuthContext';

const TaskContext = createContext();

const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task._id === action.payload._id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.payload),
      };
    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [state, dispatch] = useReducer(taskReducer, { tasks: [] });

  const getTasks = async () => {
    if (isAuthenticated) {
      const { data } = await api.get('/tasks');
      dispatch({ type: 'SET_TASKS', payload: data.data });
    }
  };

  const addTask = async (task) => {
    const { data } = await api.post('/tasks', task);
    dispatch({ type: 'ADD_TASK', payload: data.data });
  };

  const updateTask = async (id, updates) => {
    const { data } = await api.put(`/tasks/${id}`, updates);
    dispatch({ type: 'UPDATE_TASK', payload: data.data });
  };

  const deleteTask = async (id) => {
    try {
      if (!id) {
        throw new Error('Task ID is required');
      }
      console.log('Deleting task with id:', id);
      await api.delete(`/tasks/${id}`);
      dispatch({ type: 'DELETE_TASK', payload: id });
    } catch (error) {
      console.error('Delete task error:', error.response?.data || error.message);
      throw error; // Re-throw to handle in UI if needed
    }
  };

  return (
    <TaskContext.Provider value={{ ...state, getTasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
