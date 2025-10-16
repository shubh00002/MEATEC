import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, addTask } from '../features/taskSlice';
import { logout } from '../features/authSlice';
import TaskCard from '../components/TaskCard';

export default function Dashboard() {
  const [title, setTitle] = useState('');
  const [description, setDesc] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get data from Redux store
  const { items, loading } = useSelector(s => s.tasks);
  const { user } = useSelector(s => s.auth); // <-- User data is now available

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAdd = e => {
    e.preventDefault();
    if (!title) return;
    dispatch(addTask({ title, description }));
    setTitle('');
    setDesc('');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          {/* Use the username in the heading */}
          <h1 className="text-2xl font-bold text-purple-700">
            {user?.username}'s Tasks
          </h1>
          <button onClick={handleLogout} className="text-red-500 hover:underline">
            Logout
          </button>
        </div>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-6">
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input placeholder="Description" value={description} onChange={e => setDesc(e.target.value)} />
          <button className="bg-purple-600 text-white px-4 hover:bg-purple-700">Add</button>
        </form>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-2">{items.map(t => <TaskCard key={t.id} task={t} />)}</div>
        )}
      </div>
    </div>
  );
}