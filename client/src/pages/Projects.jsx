import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import api from '../api/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ProjectCard from '../components/ProjectCard';

const ProjectModal = ({ isOpen, onClose, onSave, project }) => {
  const [formData, setFormData] = useState(project || { title: '', description: '' });

  useEffect(() => {
    if (project) setFormData(project);
    else setFormData({ title: '', description: '' });
  }, [project, isOpen]);

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
            <label className="block text-sm font-medium mb-1">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required />
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
  const [filter, setFilter] = useState('All');
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

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'All' || p.status === filter)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        <button onClick={() => { setEditingProject(null); setIsModalOpen(true); }} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all">
          <FaPlus className="mr-2" /> Create Project
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
        </div>
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          {['All', 'Active', 'Completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-6 py-2 rounded-xl font-medium transition-all ${filter === f ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSkeleton count={3} /> : (
        filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project._id} project={project} onEdit={p => { setEditingProject(p); setIsModalOpen(true); }} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">No projects found.</div>
        )
      )}
      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} project={editingProject} />
    </div>
  );
}
