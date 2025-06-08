import { ethers } from 'ethers';
import {abi} from '../assets/ScholarDist.json';

const contractAddress = '0xc9261dfA3fd9a85Dd6eb67fEa996DB10E1b22DA2';

export const connectWallet = async (setWallet) => {
  const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
  setWallet(account);
};

const getContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contractAddress, abi.abi, signer);
};

export const addScholarship = async ({ name, amount, minScore, totalSeats }) => {
  const contract = getContract();
  await contract.addScholarship(name, amount, minScore, totalSeats);
};

export const getScholarships = async () => {
  const contract = getContract();
  return await contract.getScholarships();
};

export const applyForScholarship = async (data) => {
  const contract = getContract();
  await contract.applyForScholarship(
    data.scholarshipId,
    data.studentName,
    data.regNumber,
    data.college,
    data.course,
    data.attendancePercent,
    data.academicMark,
    data.score
  );
};

export const getApplications = async (id) => {
  const contract = getContract();
  return await contract.getApplications(id);
};

export const getSelectedApplicants = async (id) => {
  const contract = getContract();
  return await contract.getSelectedApplicants(id);
};

export const selectTopApplicants = async (id) => {
  const contract = getContract();
  await contract.selectTopApplicants(id);
};
