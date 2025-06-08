import React from "react";
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import MainPage from './pages/MainPage'
import ApplyScholarship from "./pages/ApplyScholarship.jsx";
import AddScholarship from "./pages/AddScholarship";
import AdminDashboard from "./pages/AdminDashboard";
import ViewApplications from "./pages/ViewApplications.jsx";
import SelectedApplicants from "./pages/SelectedApplicants.jsx";

const  App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/apply' element={<ApplyScholarship />}/>
        <Route path='/add' element={<AddScholarship />}/>
        <Route path='/admin' element={<AdminDashboard />}/>
        <Route path='/view' element={<ViewApplications/>}/>
        <Route path='/selected' element={<SelectedApplicants/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;

