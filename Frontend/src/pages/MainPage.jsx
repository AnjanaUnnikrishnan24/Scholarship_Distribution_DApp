import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainPage = () => {
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-16 text-gray-800 font-sans text-center">
        <header className="mb-4">
          <h1 className="text-5xl font-extrabold mb-4 text-green-700">
            Welcome to SmartScholar
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            A Blockchain-Based Scholarship Distribution Platform
          </h2>
          <p className="text-lg text-gray-600">
            Empowering deserving students by ensuring transparent, scholarship disbursement using Ethereum blockchain.
          </p>
        </header>

        <section className="bg-gray-100 p-6 rounded-lg shadow-lg text-left mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">How It Works</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700">
            <li>Students apply by providing their academic details; the system calculates their eligibility score automatically.</li>
            <li>Disbursement is done securely on-chain to selected applicants using smart contracts.</li>
            <li>All operations are transparent and verifiable on the Ethereum blockchain.</li>
            <li>Required Minimum Attendence percentage to apply for the scholarship is 80%</li>
            <li>Required Minimum Academic percentage to apply for the scholarship is 80%</li>
          </ul>
        </section>

        <section className="flex flex-col md:flex-row justify-center gap-6">
          <button
            onClick={() => window.location.href = '/apply'}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-10 rounded-lg shadow-md transition-colors"
          >
            Apply for Scholarship
          </button>

          <button
            onClick={() => window.location.href = '/admin'}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 rounded-lg shadow-md transition-colors"
          >
            Admin Dashboard
          </button>

          <button
            onClick={() => window.location.href = '/selected'}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-10 rounded-lg shadow-md transition-colors"
          >
            View Selected Applicants
          </button>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default MainPage;
