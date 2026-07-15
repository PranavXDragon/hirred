import React from 'react';

export const metadata = {
  title: {
    template: '%s | HIRRD',
    default: 'Dashboard | HIRRD',
  },
};

export default function DashboardLayout({ children }) {
  return <>{children}</>;
}
