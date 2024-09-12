import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Authenication/Login';
import Register from './components/Authenication/Register';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer'; // Import the Footer
import KnowledgeBase from './components/KnowledgeBase';
import Home from './components/Home'; // Home component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Navbar at the top */}
        <Navbar setIsLoggedIn={setIsLoggedIn} />

        {/* Main content area */}
        <div style={{ flex: '1' }}>
          <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />}/>
          </Routes>
        </div>

        {/* Footer at the bottom */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
