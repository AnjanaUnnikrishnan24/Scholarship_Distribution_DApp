import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from '../assets/ScholarDis.json';
import deployedAddresses from '../assets/deployed_addresses.json';
import Navbar from '../components/Navbar';

const contractAddress = deployedAddresses["ScholarModule#ScholarDis"];

const SelectedApplicants = () => {
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [scholarshipId, setScholarshipId] = useState('');
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  useEffect(() => {
    const loadScholarships = async () => {
      try {
        if (!window.ethereum) throw new Error("MetaMask not found");

        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi.abi, provider);
        const count = await contract.scholarshipCounter();

        const list = [];
        for (let i = 1; i <= count; i++) {
          const s = await contract.scholarships(i);
          list.push({ id: s.id.toString(), name: s.name });
        }

        setScholarships(list);
      } catch (err) {
        console.error("Error loading scholarships:", err.message);
      }
    };

    loadScholarships();
  }, []);

  const fetchSelectedApplicants = async () => {
    setLoading(true);
    setError('');
    setSelectedApplicants([]);

    try {
      if (!window.ethereum) throw new Error("MetaMask not found");

      if (!scholarshipId) {
        throw new Error("Please select a scholarship ID");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi.abi, signer);

      const applicants = await contract.getSelectedApplicants(Number(scholarshipId));
      setSelectedApplicants(applicants);
    } catch (err) {
      console.error(err);
      setError(`Error: ${err.message}`);
    }

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Selected Applicants</h2>

        <div className="mb-4 flex items-center space-x-4">
          <select
            value={scholarshipId}
            onChange={(e) => setScholarshipId(e.target.value)}
            className="border px-3 py-2 rounded w-72"
          >
            <option value="">-- Select Scholarship --</option>
            {scholarships.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (ID: {s.id})
              </option>
            ))}
          </select>
          <button
            onClick={fetchSelectedApplicants}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
          >
            View
          </button>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {loading && <p className="text-gray-600 mb-4">Loading...</p>}

        {selectedApplicants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Register No</th>
                  <th className="px-4 py-2">College</th>
                  <th className="px-4 py-2">Course</th>
                  <th className="px-4 py-2">Attendance %</th>
                  <th className="px-4 py-2">Academic %</th>
                  <th className="px-4 py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {selectedApplicants.map((applicant, index) => (
                  <tr key={index} className="text-center border-t">
                    <td className="px-4 py-2">{applicant.studentName}</td>
                    <td className="px-4 py-2">{applicant.regNumber}</td>
                    <td className="px-4 py-2">{applicant.college}</td>
                    <td className="px-4 py-2">{applicant.course}</td>
                    <td className="px-4 py-2">{Number(applicant.attendancePercent)}</td>
                    <td className="px-4 py-2">{Number(applicant.academicMark)}</td>
                    <td className="px-4 py-2 font-semibold">{Number(applicant.score)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !loading && (
          <p className="text-center text-gray-500">No selected applicants yet.</p>
        )}
      </div>
    </>
  );
};

export default SelectedApplicants;
