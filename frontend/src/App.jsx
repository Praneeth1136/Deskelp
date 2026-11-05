import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { EmployeeDashboard } from './pages/EmployeeDashboard';
import { CreateTicketPage } from './pages/CreateTicketPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { TicketDetailsPage } from './pages/TicketDetailsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AgentDashboardPage } from './pages/AgentDashboardPage';

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Employee Routes */}
          <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE']} />}>
            <Route path="/dashboard" element={<EmployeeDashboard />} />
            <Route path="/create-ticket" element={<CreateTicketPage />} />
            <Route path="/my-tickets" element={<MyTicketsPage />} />
          </Route>

          {/* Shared Ticket Details (Employee, Agent, Admin) */}
          <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE', 'AGENT', 'ADMIN']} />}>
            <Route path="/tickets/:id" element={<TicketDetailsPage />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>

          {/* Protected Agent Routes */}
          <Route element={<ProtectedRoute allowedRoles={['AGENT']} />}>
            <Route path="/agent" element={<AgentDashboardPage />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
