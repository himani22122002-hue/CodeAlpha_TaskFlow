import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="flex-1 md:ml-64">
        <Navbar />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
