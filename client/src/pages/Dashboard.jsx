import React from 'react';
import { FaFolder, FaTasks, FaCheckCircle, FaPlus } from 'react-icons/fa';

const StatCard = ({ title, count, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-5xl font-bold mt-2">{count}</h3>
      </div>
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <Icon className="text-2xl text-white" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Good Morning, Himani 👋</h1>
          <p className="text-blue-100">Here's what's happening with your projects today.</p>
          <button className="mt-6 bg-white text-blue-700 px-6 py-2 rounded-xl font-semibold hover:bg-blue-50 transition-all">
            Create Project
          </button>
        </div>
        <div className="hidden md:block text-8xl opacity-20">🚀</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Projects" count="5" icon={FaFolder} colorClass="bg-blue-500" />
        <StatCard title="Active Tasks" count="12" icon={FaTasks} colorClass="bg-orange-500" />
        <StatCard title="Completed Tasks" count="28" icon={FaCheckCircle} colorClass="bg-green-500" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-103">
          <FaPlus className="mr-2 text-blue-600" /> New Project
        </button>
        <button className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-103">
          <FaPlus className="mr-2 text-blue-600" /> Add Task
        </button>
        <button className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-103">
          <FaTasks className="mr-2 text-blue-600" /> View Tasks
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="text-gray-500">No recent activity</div>
      </div>
    </div>
  );
}
