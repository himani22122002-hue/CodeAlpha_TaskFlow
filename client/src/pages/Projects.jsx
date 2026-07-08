import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FaPlus, FaSearch, FaFolder } from 'react-icons/fa';
import api from '../api/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ProjectCard from '../components/ProjectCard';
import ConfirmationModal from '../components/ConfirmationModal';
import ProjectModal from '../components/ProjectModal';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null });

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
      setIsModalLoading(true);
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, data);
        toast.success('Project updated successfully');
      } else {
        await api.post('/projects', data);
        toast.success('Project created successfully');
      }
      setIsModalOpen(false);
      setEditingProject(null);
      fetchProjects();
    } catch (err) {
      toast.error('Operation failed');
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/projects/${deleteConfirm.id}`);
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (err) {
      toast.error('Failed to delete project');
    } finally {
      setDeleteConfirm({ isOpen: false, id: null });
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
        <button onClick={() => { setEditingProject(null); setIsModalOpen(true); }} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all hover:scale-105">
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
            <button key={f} onClick={() => setFilter(f)} className={`px-6 py-2 rounded-xl font-medium transition-all ${filter === f ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSkeleton count={3} /> : (
        filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <ProjectCard key={project._id} project={project} onEdit={p => { setEditingProject(p); setIsModalOpen(true); }} onDelete={(id) => setDeleteConfirm({ isOpen: true, id })} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center transition-all hover:shadow-md">
            <FaFolder className="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Projects Found</h3>
            <p className="text-gray-500 mb-6">Get started by creating a new project.</p>
            <button onClick={() => { setEditingProject(null); setIsModalOpen(true); }} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all hover:scale-105">Create Project</button>
          </div>
        )
      )}
      <ProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSave} initialData={editingProject} loading={isModalLoading} />
      <ConfirmationModal isOpen={deleteConfirm.isOpen} title="Delete Project" message="Are you sure you want to delete this project? This action cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteConfirm({ isOpen: false, id: null })} />
    </div>
  );
}
