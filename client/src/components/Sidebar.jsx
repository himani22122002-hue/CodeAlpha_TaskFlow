import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartLine, FaFolder, FaTasks, FaCog, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const menuItems = [
    { path: '/', name: 'Dashboard', icon: FaChartLine },
    { path: '/projects', name: 'Projects', icon: FaFolder },
    { path: '/tasks', name: 'Tasks', icon: FaTasks },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 hidden md:flex flex-col">
      <div className="p-6 font-bold text-2xl text-blue-600">TaskFlow</div>
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                isActive ? 'border-r-4 border-blue-600 bg-blue-50 text-blue-600' : ''
              }`
            }
          >
            <item.icon className="mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-6 border-t border-gray-200">
        <button className="flex items-center text-gray-600 hover:text-red-600">
          <FaSignOutAlt className="mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
