import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const ProjectModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  const [formData, setFormData] = useState({ title: '', description: '', status: 'Active' });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ title: '', description: '', status: 'Active' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{initialData ? 'Edit Project' : 'Create Project'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors"><FaTimes /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Project Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border rounded-xl" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 border rounded-xl">
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all disabled:opacity-50">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
