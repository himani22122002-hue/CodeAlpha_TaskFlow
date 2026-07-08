import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaFolder, FaTasks, FaCheckCircle, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import LoadingSkeleton from '../components/LoadingSkeleton';

const StatCard = ({ title, count, icon: Icon, colorClass, loading }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        {loading ? (
          <div className="h-10 w-16 bg-gray-200 rounded animate-pulse mt-2"></div>
        ) : (
          <h3 className="text-5xl font-bold mt-2">{count}</h3>
        )}
      </div>
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <Icon className="text-2xl text-white" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, activeTasks: 0, completedTasks: 0, recentTasks: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks')
        ]);

        const projects = projectsRes.data;
        const tasks = tasksRes.data;

        // Sort tasks by createdAt desc
        const sortedTasks = [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setStats({
          projects: projects.length,
          activeTasks: tasks.filter(t => t.status !== 'Completed').length,
          completedTasks: tasks.filter(t => t.status === 'Completed').length,
          recentTasks: sortedTasks.slice(0, 5)
        });
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Good Morning, Himani 👋</h1>
          <p className="text-blue-100">Here's what's happening with your projects today.</p>
          <button onClick={() => navigate('/projects')} className="mt-6 bg-white text-blue-700 px-6 py-2 rounded-xl font-semibold hover:bg-blue-50 transition-all hover:scale-105">
            Create Project
          </button>
        </div>
        <div className="hidden md:block text-8xl opacity-20">🚀</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Projects" count={stats.projects} icon={FaFolder} colorClass="bg-blue-500" loading={loading} />
        <StatCard title="Active Tasks" count={stats.activeTasks} icon={FaTasks} colorClass="bg-orange-500" loading={loading} />
        <StatCard title="Completed Tasks" count={stats.completedTasks} icon={FaCheckCircle} colorClass="bg-green-500" loading={loading} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button onClick={() => navigate('/projects')} className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-103">
          <FaPlus className="mr-2 text-blue-600" /> New Project
        </button>
        <button className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-103">
          <FaPlus className="mr-2 text-blue-600" /> Add Task
        </button>
        <button onClick={() => navigate('/tasks')} className="flex items-center justify-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-103">
          <FaTasks className="mr-2 text-blue-600" /> View Tasks
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
        {loading ? (
          <LoadingSkeleton count={3} />
        ) : (
          <div className="space-y-4">
            {stats.recentTasks.length > 0 ? (
              stats.recentTasks.map(task => (
                <div key={task._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-semibold">{task.title}</p>
                    <p className="text-xs text-gray-500">{new Date(task.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-md ${task.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {task.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 border-2 border-dashed rounded-2xl">
                <p>No recent activity found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
