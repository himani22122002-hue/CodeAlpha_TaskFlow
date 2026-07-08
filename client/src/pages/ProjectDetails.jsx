import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaComments, FaCheckSquare, FaClock, FaPaperPlane } from 'react-icons/fa';
import api from '../api/api';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Comments = ({ taskId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        api.get(`/comments/task/${taskId}`).then(res => setComments(res.data)).catch(() => toast.error('Failed to load comments'));
    }, [taskId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            await api.post('/comments', { task: taskId, text: newComment });
            setNewComment('');
            api.get(`/comments/task/${taskId}`).then(res => setComments(res.data));
            toast.success('Comment added');
        } catch { toast.error('Failed to add comment'); }
    };

    return (
        <div className="mt-4 bg-gray-50 p-4 rounded-xl">
            <h4 className="font-semibold mb-2">Comments</h4>
            {comments.map(c => (
                <div key={c._id} className="text-sm mb-2 p-2 bg-white rounded-md border border-gray-100 flex justify-between">
                    <div><span className="font-bold">{c.user?.name}:</span> {c.text}</div>
                </div>
            ))}
            <div className="flex gap-2 mt-2">
                <input value={newComment} onChange={e => setNewComment(e.target.value)} className="flex-grow p-2 rounded-md border" placeholder="Write a comment..." />
                <button onClick={handleAddComment} className="bg-blue-600 text-white p-2 rounded-md"><FaPaperPlane /></button>
            </div>
        </div>
    );
};

const TaskModal = ({ isOpen, onClose, onSave, task, projectId }) => {
  const [formData, setFormData] = useState(task || { title: '', description: '', project: projectId, priority: 'Medium', status: 'To Do', dueDate: '' });

  useEffect(() => {
    if (task) setFormData({
        ...task,
        project: task.project?._id || projectId,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    else setFormData({ title: '', description: '', project: projectId, priority: 'Medium', status: 'To Do', dueDate: '' });
  }, [task, isOpen, projectId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-6">{task ? 'Edit Task' : 'Create Task'}</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="px-4 py-2 border rounded-xl">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="px-4 py-2 border rounded-xl">
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold">Save</button>
        </form>
      </div>
    </div>
  );
};

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projRes, tasksRes] = await Promise.all([api.get(`/projects/${id}`), api.get('/tasks')]);
      setProject(projRes.data);
      setTasks(tasksRes.data.filter(t => t.project?._id === id));
    } catch (err) {
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleSave = async (data) => {
    try {
      if (editingTask) await api.put(`/tasks/${editingTask._id}`, data);
      else await api.post('/tasks', data);
      toast.success('Task saved');
      setIsModalOpen(false);
      setEditingTask(null);
      fetchData();
    } catch (err) { toast.error('Failed to save task'); }
  };

  const handleDelete = async (tid) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/tasks/${tid}`);
        toast.success('Task deleted');
        fetchData();
      } catch (err) { toast.error('Failed to delete'); }
    }
  };

  if (loading) return <LoadingSkeleton count={3} />;
  if (!project) return <div>Project not found.</div>;

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800">{project.title}</h1>
        <p className="text-gray-500 mt-2 mb-6">{project.description}</p>
        <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            <span>{tasks.length} Total Tasks</span>
            <span>{completedTasks} Completed</span>
            <span>{tasks.length - completedTasks} Pending</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-right text-sm font-semibold mt-2">{Math.round(progress)}% Complete</p>
      </div>

      {/* Task List */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center"><FaCheckSquare className="mr-2 text-blue-600" /> Tasks</h2>
            <button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"><FaPlus /> Add Task</button>
        </div>
        
        {tasks.length > 0 ? (
          <table className="w-full">
            <tbody className="divide-y divide-gray-100">
              {tasks.map(task => (
                <React.Fragment key={task._id}>
                    <tr className="cursor-pointer hover:bg-gray-50" onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)}>
                        <td className="p-4 font-medium">{task.title}</td>
                        <td className="p-4"><span className={`text-xs px-2 py-1 rounded-md ${task.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{task.priority}</span></td>
                        <td className="p-4"><span className={`text-xs px-2 py-1 rounded-md ${task.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{task.status}</span></td>
                        <td className="p-4 text-right">
                            <button onClick={(e) => { e.stopPropagation(); setEditingTask(task); setIsModalOpen(true); }} className="text-gray-400 hover:text-blue-600 mr-2"><FaEdit /></button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete(task._id); }} className="text-gray-400 hover:text-red-600"><FaTrash /></button>
                        </td>
                    </tr>
                    {expandedTask === task._id && <tr><td colSpan="4"><Comments taskId={task._id} /></td></tr>}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
            <div className="text-center py-10 text-gray-500">No tasks found.</div>
        )}
      </div>
      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} task={editingTask} projectId={id} />
    </div>
  );
}
