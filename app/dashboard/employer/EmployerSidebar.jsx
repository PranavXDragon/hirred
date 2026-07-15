"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building, Rocket, Briefcase, Users, Settings } from 'lucide-react';

const navItems = [
  { href: '/dashboard/employer', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/employer/company', label: 'Organization', icon: Building },
  { href: '/dashboard/employer/post-job', label: 'Post a Job', icon: Rocket },
  { href: '/dashboard/employer/manage-jobs', label: 'Manage Jobs', icon: Briefcase },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function EmployerSidebar() {
  const pathname = usePathname();

  if (pathname === '/dashboard/employer') return null;

  return (
    <div className="fixed top-24 left-0 bottom-0 w-56 bg-white border-r-4 border-black z-20 overflow-y-auto hidden lg:block">
      <div className="p-4 border-b-4 border-black">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Employer Commands</p>
      </div>
      <nav className="p-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-[10px] font-black uppercase tracking-wider border-2 transition-all ${
                isActive
                  ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(244,63,94,1)]'
                  : 'border-transparent text-slate-500 hover:border-black hover:text-black'
              }`}
            >
              <Icon size={14} className={isActive ? 'text-rose-400' : ''} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
