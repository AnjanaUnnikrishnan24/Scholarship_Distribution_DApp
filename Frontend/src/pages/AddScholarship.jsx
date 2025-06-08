import React, { useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../assets/ScholarDist.json';
import deployedAddresses from '../assets/deployed_addresses.json';
import Navbar from '../components/Navbar';
 
const AddScholarship = () => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    minScore: '',
    totalSeats: '',
    requiredAttendance: '',
    requiredAcademic: ''
  });

  const [txStatus, setTxStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddScholarship = async (e) => {
    e.preventDefault();
    setTxStatus('Processing...');

    try {
      if (!window.ethereum) throw new Error("MetaMask not found");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        deployedAddresses["ScholarModule#ScholarDist"],
        contractABI.abi,
        signer
      );

      const tx = await contract.addScholarship(
        formData.name,
        ethers.parseEther(formData.amount),
        parseInt(formData.minScore),
        parseInt(formData.totalSeats),
        parseInt(formData.requiredAttendance),
        parseInt(formData.requiredAcademic)
      );

      await tx.wait();
      setTxStatus('Scholarship added successfully!');
      setFormData({
        name: '',
        amount: '',
        minScore: '',
        totalSeats: '',
        requiredAttendance: '',
        requiredAcademic: ''
      });
    } catch (err) {
      setTxStatus(`Error: ${err.message}`);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Scholarship</h2>
      <form onSubmit={handleAddScholarship} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Scholarship Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-xl"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount (in ETH)"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          min="0"
          required
          className="w-full p-3 border border-gray-300 rounded-xl"
        />
        <input
          type="number"
          name="minScore"
          placeholder="Minimum Score"
          value={formData.minScore}
          onChange={handleChange}
          min="0"
          max="200"
          required
          className="w-full p-3 border border-gray-300 rounded-xl"
        />
        <input
          type="number"
          name="totalSeats"
          placeholder="Total Seats"
          value={formData.totalSeats}
          onChange={handleChange}
          min="1"
          required
          className="w-full p-3 border border-gray-300 rounded-xl"
        />
        <input
          type="number"
          name="requiredAttendance"
          placeholder="Required Attendance %"
          value={formData.requiredAttendance}
          onChange={handleChange}
          min="0"
          max="100"
          required
          className="w-full p-3 border border-gray-300 rounded-xl"
        />
        <input
          type="number"
          name="requiredAcademic"
          placeholder="Required Academic %"
          value={formData.requiredAcademic}
          onChange={handleChange}
          min="0"
          max="100"
          required
          className="w-full p-3 border border-gray-300 rounded-xl"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Add Scholarship
        </button>
      </form>
      {txStatus && (
        <div className="mt-4 text-center text-sm text-gray-600">{txStatus}</div>
      )}
    </div>
    </>
  );
};

export default AddScholarship;
