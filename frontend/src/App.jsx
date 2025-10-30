import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';   // ✅ import this

import LoginPage from './components/Login.jsx';
import SignupPage from './components/Signup.jsx';
import DashboardPage from './components/Dashboard.jsx';
import AddLeadPage from './components/AddLead.jsx';
import LeadPage from './components/Lead.jsx';
import Layout from './components/Layout.jsx';
import AddBulkLeadPage from './components/AddBulkLead.jsx';
import Workflows from "../src/components/Workflows.jsx";
import Campaigns from './components/camping.jsx';
import LandingPage from './components/landingpage.jsx';
import LandingPublic from "./components/LandingPublic.jsx";
import MarketInsight from './components/MarketInsight.jsx';


// Helper component for private routes
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
        !!(localStorage.getItem('token') || sessionStorage.getItem('token'))
    );

  return (
    <div className="bg-[#121212] min-h-screen text-white font-sans">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage onLogin={setIsAuthenticated} />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/landing/:shareId" element={<LandingPublic />} />

          {/* Protected Routes with a common layout */}
          <Route path="/" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="leads" element={<LeadPage />} />
            <Route path="add-lead" element={<AddLeadPage />} />
            <Route path="add-bulk-lead" element={<AddBulkLeadPage />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/landing-page" element={<LandingPage />} />

            <Route path="/market-insights" element={<MarketInsight />} />
          </Route>

          {/* Catch-all route for unmatched paths */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
   {/* ✅ Add the global Toaster here */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e', // green
              secondary: '#111',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444', // red
              secondary: '#111',
            },
          },
        }}
      />
    </div>
  );
};

export default App;
