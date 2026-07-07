import React from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';

const tasks = [
  { id: 1, title: 'Fix navigation bug', status: 'In Progress', priority: 'High' },
  { id: 2, title: 'Update dependencies', status: 'Pending', priority: 'Medium' },
  { id: 3, title: 'Design landing page', status: 'Completed', priority: 'Low' },
];

export default function Tasks() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all">
          <FaPlus className="mr-2" /> Create Task
        </button>
      </div>

      <div className="mb-8 relative">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Filter tasks..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-gray-600 text-left">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{task.title}</td>
                <td className="p-4"><span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md">{task.status}</span></td>
                <td className="p-4"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">{task.priority}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
