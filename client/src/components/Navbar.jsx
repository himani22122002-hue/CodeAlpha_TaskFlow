import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          TaskFlow
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="hover:text-gray-300">Dashboard</Link>
          <Link to="/projects" className="hover:text-gray-300">Projects</Link>
          <Link to="/tasks" className="hover:text-gray-300">Tasks</Link>
        </div>

        {/* User Info / Logout */}
        <div className="hidden md:flex items-center space-x-4">
          <span>{user?.name || "User"}</span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          Menu
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <Link to="/" className="block hover:text-gray-300">Dashboard</Link>
          <Link to="/projects" className="block hover:text-gray-300">Projects</Link>
          <Link to="/tasks" className="block hover:text-gray-300">Tasks</Link>
          <div className="border-t border-gray-700 pt-2 mt-2">
            <span>{user?.name || "User"}</span>
            <button onClick={logout} className="block w-full text-left text-red-400 mt-2">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
