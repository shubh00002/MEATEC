import React from 'react';
import { useDispatch } from 'react-redux';
import { updateTask, deleteTask } from '../features/taskSlice';

export default function TaskCard({ task }) {
  const dispatch = useDispatch();
  return (
    <div className="border rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition">
      <div>
        <h2 className={`font-semibold ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </h2>
        {task.description && <p className="text-sm text-gray-600">{task.description}</p>}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => dispatch(updateTask({ id: task.id, updates: { status: task.status === 'pending' ? 'completed' : 'pending' } }))}
          className={`px-2 py-1 rounded text-white ${task.status === 'pending' ? 'bg-yellow-500' : 'bg-green-600'}`}
        >
          {task.status === 'pending' ? 'Complete' : 'Undo'}
        </button>
        <button
          onClick={() => dispatch(deleteTask(task.id))}
          className="px-2 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
