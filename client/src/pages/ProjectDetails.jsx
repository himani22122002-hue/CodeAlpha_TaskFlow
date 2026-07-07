import React from 'react';
import { FaUser, FaComments, FaCheckSquare } from 'react-icons/fa';

export default function ProjectDetails() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800">Website Redesign</h1>
        <p className="text-gray-500 mt-2">Comprehensive overhaul of the main corporate website.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Info & Tasks */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center"><FaCheckSquare className="mr-2 text-blue-600" /> Tasks</h2>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <span>Task {i}</span>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md">In Progress</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Members & Comments */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center"><FaUser className="mr-2 text-blue-600" /> Members</h2>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-blue-200 border-2 border-white"></div>)}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center"><FaComments className="mr-2 text-blue-600" /> Comments</h2>
            <p className="text-gray-500 italic">No comments yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
