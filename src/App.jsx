import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages import kar rahe hain (path check kar lena)
import LandingPage from './pages/LandingPage';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Jab koi website khole (/) toh Landing Page dikhe */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Jab koi /admin khole toh Admin Panel dikhe */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;