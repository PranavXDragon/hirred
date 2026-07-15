import React from 'react';
import EmployerSidebar from './EmployerSidebar';

export default function EmployerDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <EmployerSidebar />
      {children}
    </div>
  );
}
