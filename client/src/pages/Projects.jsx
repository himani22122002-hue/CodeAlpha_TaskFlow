import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaSearch, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import api from '../api/api';
import LoadingSkeleton from '../components/LoadingSkeleton';

const ProjectModal = ({ isOpen, onClose, onSave, project }) => {
  const [formData, setFormData] = useState(project || { name: '', description: '' });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{project ? 'Edit Project' : 'Create Project'}</h2>
          <button onClick={onClose}><FaTimes /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold">Save</button>
        </form>
      </div>
    </div>
  );
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleSave = async (data) => {
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, data);
        toast.success('Project updated');
      } else {
        await api.post('/projects', data);
        toast.success('Project created');
      }
      setIsModalOpen(false);
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/projects/${id}`);
        toast.success('Project deleted');
        fetchProjects();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        <button onClick={() => { setEditingProject(null); setIsModalOpen(true); }} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all">
          <FaPlus className="mr-2" /> Create Project
        </button>
      </div>

      <div className="mb-8 relative">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
      </div>

      {loading ? <LoadingSkeleton count={3} /> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <div key={project._id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{project.name}</h3>
                <div className="flex space-x-2 text-gray-400">
                  <button onClick={() => { setEditingProject(project); setIsModalOpen(true); }} className="hover:text-blue-600"><FaEdit /></button>
                  <button onClick={() => handleDelete(project._id)} className="hover:text-red-600"><FaTrash /></button>
                </div>
              </div>
              <p className="text-gray-500 mb-4 text-sm">{project.description || 'No description'}</p>
            </div>
          ))}
        </div>
      )}
      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} project={editingProject} />
    </div>
  );
}
