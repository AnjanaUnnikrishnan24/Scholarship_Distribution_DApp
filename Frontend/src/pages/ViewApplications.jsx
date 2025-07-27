import React, { useState } from 'react';
import { ethers } from 'ethers';
import abi from '../assets/ScholarDis.json';
import deployedAddresses from '../assets/deployed_addresses.json';
import Navbar from '../components/Navbar';

const contractAddress = deployedAddresses["ScholarModule#ScholarDist"];

const ViewApplications = () => {
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchApplications = async () => {
    setStatus("Loading applications...");
    try {
      if (!window.ethereum) throw new Error("MetaMask not found");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      const contract = new ethers.Contract(contractAddress, abi.abi, signer);
      const adminAddress = await contract.admin();

      setIsAdmin(userAddress.toLowerCase() === adminAddress.toLowerCase());

      const apps = await contract.getApplications();
      setApplications(apps);
      setStatus('');
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  const handleSelectTop = async () => {
    setStatus("Processing selection...");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, signer);

      const tx = await contract.selectTopApplicants();
      await tx.wait();

      setStatus("Top applicants selected and disbursed!");
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <>
    <Navbar/>
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">All Applications</h2>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={fetchApplications}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Load Applications
        </button>

        {isAdmin && (
          <button
            onClick={handleSelectTop}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            Select Top Applicants
          </button>
        )}
      </div>

      {status && <p className="mb-4 text-center text-gray-700">{status}</p>}

      {applications.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Reg No</th>
                <th className="px-4 py-2">College</th>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Attendance %</th>
                <th className="px-4 py-2">Academic %</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Received</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr key={index} className="text-center border-t">
                  <td className="px-4 py-2">{app.studentName}</td>
                  <td className="px-4 py-2">{app.regNumber}</td>
                  <td className="px-4 py-2">{app.college}</td>
                  <td className="px-4 py-2">{app.course}</td>
                  <td className="px-4 py-2">{Number(app.attendancePercent)}</td>
                  <td className="px-4 py-2">{Number(app.academicMark)}</td>
                  <td className="px-4 py-2 font-semibold">{Number(app.score)}</td>
                  <td className="px-4 py-2">{app.received ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !status && (
        <p className="text-center text-gray-500">No applications available.</p>
      )}
    </div>
    </>
  );
};

export default ViewApplications;
