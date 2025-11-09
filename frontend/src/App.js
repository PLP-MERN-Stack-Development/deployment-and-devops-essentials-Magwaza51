import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || '/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending'
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      await axios.post(`${API_URL}/tasks`, newTask);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending'
      });
      fetchTasks();
      setError('');
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/tasks/${id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="app-header">
          <h1>📝 MERN Task Manager</h1>
          <p>Full-Stack Task Management Application</p>
        </header>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="task-form-container">
          <h2>Create New Task</h2>
          <form onSubmit={handleSubmit} className="task-form">
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={newTask.title}
              onChange={handleInputChange}
              className="form-input"
              required
            />
            <textarea
              name="description"
              placeholder="Task Description"
              value={newTask.description}
              onChange={handleInputChange}
              className="form-input"
              rows="3"
            />
            <select
              name="priority"
              value={newTask.priority}
              onChange={handleInputChange}
              className="form-input"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </form>
        </div>

        <div className="tasks-container">
          <h2>Tasks ({tasks.length})</h2>
          {loading ? (
            <div className="loading">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="no-tasks">
              No tasks yet. Create your first task above!
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map(task => (
                <div key={task._id} className={`task-card priority-${task.priority}`}>
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <span className={`badge badge-${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  <div className="task-footer">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="btn btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="task-date">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
