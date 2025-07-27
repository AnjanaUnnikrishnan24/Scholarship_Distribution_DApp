import React, { useState } from 'react';
import { ethers } from 'ethers';
import abi from '../assets/ScholarDis.json';
import deployedAddresses from '../assets/deployed_addresses.json';
import Navbar from '../components/Navbar';
 
const contractAddress = deployedAddresses["ScholarModule#ScholarDist"];

const ApplyScholarship = () => {
  const [form, setForm] = useState({
    studentName: '',
    regNumber: '',
    college: '',
    course: '',
    attendancePercent: '',
    academicMark: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Processing...');

    try {
      if (!window.ethereum) throw new Error('MetaMask not detected');

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, signer);

      const tx = await contract.applyForScholarship(
        form.studentName,
        form.regNumber,
        form.college,
        form.course,
        parseInt(form.attendancePercent),
        parseInt(form.academicMark)
      );

      await tx.wait();
      setStatus('Application submitted successfully!');
      setForm({
        studentName: '',
        regNumber: '',
        college: '',
        course: '',
        attendancePercent: '',
        academicMark: '',
      });
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <>
    <Navbar />
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Apply for Scholarship</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="studentName"
          placeholder="Student Name"
          value={form.studentName}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          name="regNumber"
          placeholder="Register Number"
          value={form.regNumber}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          name="college"
          placeholder="College Name"
          value={form.college}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />
        <input
          type="text"
          name="course"
          placeholder="Course Name"
          value={form.course}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded"
        />
        <input
          type="number"
          name="attendancePercent"
          placeholder="Attendance % (max 100)"
          value={form.attendancePercent}
          onChange={handleChange}
          min="0"
          max="100"
          required
          className="w-full p-3 border rounded"
        />
        <input
          type="number"
          name="academicMark"
          placeholder="Academic Mark % (max 100)"
          value={form.academicMark}
          onChange={handleChange}
          min="0"
          max="100"
          required
          className="w-full p-3 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Apply
        </button>
      </form>
      {status && <p className="mt-4 text-center text-sm text-gray-700">{status}</p>}
    </div>
    </>
  );
};

export default ApplyScholarship;
