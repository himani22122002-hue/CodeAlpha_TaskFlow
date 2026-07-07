import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 sticky top-0 flex items-center justify-end px-8 z-10 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="text-gray-600">Himani</div>
        <FaUserCircle className="text-3xl text-gray-400" />
      </div>
    </div>
  );
};

export default Navbar;
