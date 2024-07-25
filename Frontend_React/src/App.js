import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Make sure to include Navigate here

import Login from './LoginReg/Login.js'; //Vanessa
import SignUp from './LoginReg/SignUp.js'; //Vanessa
import Dashboard from './Dashboard.js'; 
import AdminHome from './Admin/adminHome'
import ManageUser from './Admin/ManageUser';
import ManagePosts from './Admin/ManagePosts'; 

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");


  return (
    <Router>
      <div className='App'>
        
            <Routes>
              <Route exact path='/' element= {isLoggedIn === "true" ? <Navigate replace to="/dashboard" /> : <Login />} />
              <Route path='/sign-in' element={isLoggedIn ? <Navigate replace to="/dashboard" /> : <Login />} />
              <Route path='/sign-up' element={isLoggedIn ? <Navigate replace to="/dashboard" /> : <SignUp />} />
              <Route path='/dashboard' element={isLoggedIn ? <Dashboard /> : <Navigate replace to="/sign-in" />} />
              <Route path="/adminhome" element={<AdminHome />} />
              <Route path="/manage-user" element={<ManageUser />} />
              <Route path="/manage-posts" element={<ManagePosts />} />
            </Routes>
          </div>
        
    </Router>
  );
}

export default App;