import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaComments, FaCheckSquare, FaTasks } from 'react-icons/fa';
import api from '../api/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ConfirmationModal from '../components/ConfirmationModal';

const Comments = ({ taskId, setDeleteCommentConfirm }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const fetchComments = () => {
        api.get(`/comments/task/${taskId}`).then(res => setComments(res.data)).catch(() => toast.error('Failed to load comments'));
    };

    useEffect(() => { fetchComments(); }, [taskId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            await api.post('/comments', { task: taskId, text: newComment });
            setNewComment('');
            fetchComments();
            toast.success('Comment added successfully');
        } catch { toast.error('Failed to add comment'); }
    };

    return (
        <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h4 className="font-semibold mb-3">Comments</h4>
            <div className="space-y-3 mb-4">
                {comments.length > 0 ? comments.map(c => (
                    <div key={c._id} className="text-sm p-3 bg-white rounded-lg border border-gray-100 shadow-sm flex justify-between items-start">
                        <div>
                            <div className="font-bold text-gray-700">{c.user?.name} <span className="text-xs text-gray-400 font-normal ml-2">{new Date(c.createdAt).toLocaleDateString()}</span></div>
                            <div className="text-gray-600 mt-1">{c.text}</div>
                        </div>
                        <button onClick={() => setDeleteCommentConfirm({ isOpen: true, id: c._id, fetchComments })} className="text-red-400 hover:text-red-600"><FaTrash size={12} /></button>
                    </div>
                )) : <p className="text-gray-500 italic text-sm">No comments yet.</p>}
            </div>
            <div className="flex gap-2">
                <input value={newComment} onChange={e => setNewComment(e.target.value)} className="flex-grow p-2 rounded-lg border border-gray-200" placeholder="Write a comment..." />
                <button onClick={handleAddComment} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all">Post</button>
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
  
  const [deleteTaskConfirm, setDeleteTaskConfirm] = useState({ isOpen: false, id: null });
  const [deleteCommentConfirm, setDeleteCommentConfirm] = useState({ isOpen: false, id: null, fetchComments: null });

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
      toast.success('Task saved successfully');
      setIsModalOpen(false);
      setEditingTask(null);
      fetchData();
    } catch (err) { toast.error('Failed to save task'); }
  };

  const handleConfirmDeleteTask = async () => {
    try {
        await api.delete(`/tasks/${deleteTaskConfirm.id}`);
        toast.success('Task deleted successfully');
        fetchData();
    } catch (err) { toast.error('Failed to delete task'); }
    finally { setDeleteTaskConfirm({ isOpen: false, id: null }); }
  };

  const handleConfirmDeleteComment = async () => {
    try {
        await api.delete(`/comments/${deleteCommentConfirm.id}`);
        toast.success('Comment deleted successfully');
        deleteCommentConfirm.fetchComments();
    } catch (err) { toast.error('Failed to delete comment'); }
    finally { setDeleteCommentConfirm({ isOpen: false, id: null, fetchComments: null }); }
  };

  if (loading) return <LoadingSkeleton count={3} />;
  if (!project) return <div>Project not found.</div>;

  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800">{project.title}</h1>
        <p className="text-gray-500 mt-2 mb-6">{project.description}</p>
        <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            <span>{tasks.length} Total Tasks</span>
            <span>{completedTasks} Completed</span>
            <span>{tasks.length - completedTasks} Pending</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-blue-600 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-right text-sm font-semibold mt-2">{Math.round(progress)}% Complete</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center"><FaCheckSquare className="mr-2 text-blue-600" /> Tasks</h2>
            <button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all hover:scale-105"><FaPlus /> Add Task</button>
        </div>
        
        {tasks.length > 0 ? (
          <table className="w-full">
            <tbody className="divide-y divide-gray-100">
              {tasks.map(task => (
                <React.Fragment key={task._id}>
                    <tr className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)}>
                        <td className="p-4 font-medium">{task.title}</td>
                        <td className="p-4"><span className={`text-xs px-2 py-1 rounded-md ${task.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{task.priority}</span></td>
                        <td className="p-4"><span className={`text-xs px-2 py-1 rounded-md ${task.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{task.status}</span></td>
                        <td className="p-4 text-right">
                            <button onClick={(e) => { e.stopPropagation(); setExpandedTask(expandedTask === task._id ? null : task._id); }} className="text-gray-400 hover:text-blue-600 mr-2 transition-transform hover:scale-110"><FaComments /></button>
                            <button onClick={(e) => { e.stopPropagation(); setEditingTask(task); setIsModalOpen(true); }} className="text-gray-400 hover:text-blue-600 mr-2 transition-transform hover:scale-110"><FaEdit /></button>
                            <button onClick={(e) => { e.stopPropagation(); setDeleteTaskConfirm({ isOpen: true, id: task._id }); }} className="text-gray-400 hover:text-red-600 transition-transform hover:scale-110"><FaTrash /></button>
                        </td>
                    </tr>
                    {expandedTask === task._id && <tr><td colSpan="4"><Comments taskId={task._id} setDeleteCommentConfirm={setDeleteCommentConfirm} /></td></tr>}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center transition-all">
                <FaTasks className="text-4xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800 mb-1">No Tasks Found</h3>
                <p className="text-gray-500 mb-4">Add a new task to get started.</p>
                <button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all hover:scale-105">Add Task</button>
            </div>
        )}
      </div>
      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} task={editingTask} projectId={id} />
      <ConfirmationModal isOpen={deleteTaskConfirm.isOpen} title="Delete Task" message="Are you sure you want to delete this task?" onConfirm={handleConfirmDeleteTask} onCancel={() => setDeleteTaskConfirm({ isOpen: false, id: null })} />
      <ConfirmationModal isOpen={deleteCommentConfirm.isOpen} title="Delete Comment" message="Are you sure you want to delete this comment?" onConfirm={handleConfirmDeleteComment} onCancel={() => setDeleteCommentConfirm({ isOpen: false, id: null, fetchComments: null })} />
    </div>
  );
}
