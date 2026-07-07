import React from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';

const projects = [
  { id: 1, name: 'Website Redesign', status: 'Active', tasks: 12 },
  { id: 2, name: 'Mobile App', status: 'In Progress', tasks: 8 },
  { id: 3, name: 'Marketing Campaign', status: 'Completed', tasks: 5 },
];

export default function Projects() {
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all">
          <FaPlus className="mr-2" /> Create Project
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative">
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search projects..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">{project.name}</h3>
              <div className="flex space-x-2 text-gray-400">
                <button className="hover:text-blue-600"><FaEdit /></button>
                <button className="hover:text-red-600"><FaTrash /></button>
              </div>
            </div>
            <p className="text-gray-500 mb-4">Status: {project.status}</p>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
