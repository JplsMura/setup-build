import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './components/layout/DashboardLayout';
import CommunityFeed from './pages/CommunityFeed';
import SetupBuilder from './pages/SetupBuilder';
import SetupDetails from './pages/SetupDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<CommunityFeed />} />
          <Route path="build" element={<SetupBuilder />} />
          <Route path="setup/:id" element={<SetupDetails />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
