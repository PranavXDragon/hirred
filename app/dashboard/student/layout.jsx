"use client";

import React from 'react';

export default function StudentDashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}
