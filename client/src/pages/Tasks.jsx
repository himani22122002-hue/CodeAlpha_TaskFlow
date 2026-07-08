import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTasks } from 'react-icons/fa';
import api from '../api/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ConfirmationModal from '../components/ConfirmationModal';
import TaskModal from '../components/TaskModal';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ project: 'All', status: 'All', priority: 'All' });
  const [sortBy, setSortBy] = useState('createdAt');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes] = await Promise.all([api.get('/tasks'), api.get('/projects')]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (data) => {
    try {
      setIsModalLoading(true);
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, data);
        toast.success('Task updated successfully');
      } else {
        await api.post('/tasks', data);
        toast.success('Task created successfully');
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchData();
    } catch (err) {
      toast.error('Operation failed');
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/tasks/${deleteConfirm.id}`);
      toast.success('Task deleted successfully');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete task');
    } finally {
      setDeleteConfirm({ isOpen: false, id: null });
    }
  };

  const filteredTasks = tasks
    .filter(t => 
      (filters.project === 'All' || t.project?._id === filters.project) &&
      (filters.status === 'All' || t.status === filters.status) &&
      (filters.priority === 'All' || t.priority === filters.priority) &&
      t.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'dueDate') return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      if (sortBy === 'priority') return ['High', 'Medium', 'Low'].indexOf(a.priority) - ['High', 'Medium', 'Low'].indexOf(b.priority);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
        <button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all hover:scale-105">
          <FaPlus className="mr-2" /> Create Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="relative lg:col-span-2">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <select value={filters.project} onChange={e => setFilters({...filters, project: e.target.value})} className="p-3 rounded-2xl border border-gray-200">
          <option value="All">All Projects</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
        </select>
        <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="p-3 rounded-2xl border border-gray-200">
          <option value="All">All Status</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select value={filters.priority} onChange={e => setFilters({...filters, priority: e.target.value})} className="p-3 rounded-2xl border border-gray-200">
          <option value="All">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {loading ? <LoadingSkeleton count={5} /> : (
        filteredTasks.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-gray-600 text-left">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Project</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTasks.map(task => (
                  <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium">
                      {task.title}
                      <p className="text-xs text-gray-500">{task.description}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{task.project?.title}</td>
                    <td className="p-4"><span className={`text-xs px-2 py-1 rounded-md ${task.priority === 'High' ? 'bg-red-100 text-red-600' : task.priority === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{task.priority}</span></td>
                    <td className="p-4"><span className={`text-xs px-2 py-1 rounded-md ${task.status === 'Completed' ? 'bg-green-100 text-green-600' : task.status === 'In Progress' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>{task.status}</span></td>
                    <td className="p-4 text-right">
                      <button onClick={() => { setEditingTask(task); setIsModalOpen(true); }} className="text-gray-400 hover:text-blue-600 mr-2 transition-transform hover:scale-110"><FaEdit /></button>
                      <button onClick={() => setDeleteConfirm({ isOpen: true, id: task._id })} className="text-gray-400 hover:text-red-600 transition-transform hover:scale-110"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center transition-all hover:shadow-md">
            <FaTasks className="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Tasks Found</h3>
            <p className="text-gray-500 mb-6">Create a new task to get started.</p>
            <button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all hover:scale-105">Create Task</button>
          </div>
        )
      )}
      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSave} initialData={editingTask} loading={isModalLoading} projects={projects} />
      <ConfirmationModal isOpen={deleteConfirm.isOpen} title="Delete Task" message="Are you sure you want to delete this task? This action cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteConfirm({ isOpen: false, id: null })} />
    </div>
  );
}
