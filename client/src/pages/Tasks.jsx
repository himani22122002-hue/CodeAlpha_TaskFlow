import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import api from '../api/api';
import LoadingSkeleton from '../components/LoadingSkeleton';

const TaskModal = ({ isOpen, onClose, onSave, task }) => {
  const [formData, setFormData] = useState(task || { title: '', status: 'Pending', priority: 'Medium' });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{task ? 'Edit Task' : 'Create Task'}</h2>
          <button onClick={onClose}><FaTimes /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 border rounded-xl">
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full px-4 py-2 border rounded-xl">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold">Save</button>
        </form>
      </div>
    </div>
  );
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSave = async (data) => {
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, data);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', data);
        toast.success('Task created');
      }
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/tasks/${id}`);
        toast.success('Task deleted');
        fetchTasks();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  const filteredTasks = tasks.filter(t => 
    (filterStatus === 'All' || t.status === filterStatus) &&
    (filterPriority === 'All' || t.priority === filterPriority) &&
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tasks</h1>
        <button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all">
          <FaPlus className="mr-2" /> Create Task
        </button>
      </div>

      <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="p-3 rounded-2xl border border-gray-200">
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="p-3 rounded-2xl border border-gray-200">
          <option value="All">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {loading ? <LoadingSkeleton count={5} /> : (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-600 text-left">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTasks.map(task => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium">{task.title}</td>
                  <td className="p-4"><span className={`text-xs px-2 py-1 rounded-md ${task.status === 'Completed' ? 'bg-green-100 text-green-600' : task.status === 'In Progress' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>{task.status}</span></td>
                  <td className="p-4"><span className={`text-xs px-2 py-1 rounded-md ${task.priority === 'High' ? 'bg-red-100 text-red-600' : task.priority === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{task.priority}</span></td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setEditingTask(task); setIsModalOpen(true); }} className="text-gray-400 hover:text-blue-600 mr-2"><FaEdit /></button>
                    <button onClick={() => handleDelete(task._id)} className="text-gray-400 hover:text-red-600"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} task={editingTask} />
    </div>
  );
}
