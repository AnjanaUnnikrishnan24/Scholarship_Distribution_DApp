import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
 
const AdminDashboard = () => (
  <>
  <Navbar/>
  <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Admin Dashboard</h1>

      <div className="flex flex-col gap-4">
        <Link
          to="/add"
          className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition duration-200"
        >
          Add Scholarship
        </Link>

        <Link
          to="/view"
          className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold transition duration-200"
        >
          View Applications
        </Link>

        <Link
          to="/selected"
          className="w-full text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-semibold transition duration-200"
        >
          Selected Applicants
        </Link>
      </div>
    </div>
  </div>
   </>
  
  
);

export default AdminDashboard;
