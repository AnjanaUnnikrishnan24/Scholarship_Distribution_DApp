import React from "react";
import { Link } from "react-router-dom";
import sslogo from '../assets/sslogo.png'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src={sslogo}  alt="Logo" className="h-8 w-8 " />
          <span className="text-2xl font-bold text-blue-600">SmartScholar</span>
        </Link>

        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

