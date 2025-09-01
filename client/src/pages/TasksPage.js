import React, { useEffect, useContext } from 'react';
import TaskContext from '../context/TaskContext';
import AuthContext from '../context/AuthContext';
import AddTask from '../components/AddTask';

const TasksPage = () => {
  const { tasks, getTasks, deleteTask, updateTask } = useContext(TaskContext);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h2>Tasks</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
      <AddTask />
      <ul>
        {tasks.map((task) => (
          <li key={task._id} className={task.status === 'completed' ? 'completed' : ''}>
            <span>
              {task.title}
            </span>
            <div className="task-buttons">
              <button
                className={task.status === 'pending' ? 'complete-btn' : 'undo-btn'}
                onClick={() =>
                  updateTask(task._id, {
                    status: task.status === 'pending' ? 'completed' : 'pending',
                  })
                }
              >
                {task.status === 'pending' ? 'Complete' : 'Undo'}
              </button>
              <button className="delete-btn" onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksPage;
