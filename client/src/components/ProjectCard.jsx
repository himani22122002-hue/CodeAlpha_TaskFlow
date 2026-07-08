import React from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${project.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
          {project.status}
        </span>
      </div>
      <p className="text-gray-500 mb-4 text-sm h-10 overflow-hidden">{project.description || 'No description'}</p>
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{project.members.length} Members</span>
        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
        <Link to={`/projects/${project._id}`} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
          <FaEye />
        </Link>
        <button onClick={() => onEdit(project)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
          <FaEdit />
        </button>
        <button onClick={() => onDelete(project._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
