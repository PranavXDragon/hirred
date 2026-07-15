"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Bookmark, Briefcase, Sparkles, Users, Receipt, Settings } from 'lucide-react';

const navItems = [
  { href: '/dashboard/student', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/student/applications', label: 'Applications', icon: FileText },
  { href: '/dashboard/student/saved-jobs', label: 'Saved Jobs', icon: Bookmark },
  { href: '/dashboard/student/resume-builder', label: 'Resume Builder', icon: Briefcase },
  { href: '/mentorship', label: 'Mentorship', icon: Users },
  { href: '/pro', label: 'Pro Plan', icon: Sparkles },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function StudentSidebar() {
  const pathname = usePathname();

  const isDashboard = pathname === '/dashboard/student';
  const isResumeBuilder = pathname.startsWith('/dashboard/student/resume-builder');
  if (isDashboard || isResumeBuilder) return null;

  return (
    <div className="fixed top-24 left-0 bottom-0 w-56 bg-white border-r-4 border-black z-20 overflow-y-auto hidden lg:block">
      <div className="p-4 border-b-4 border-black">
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Student Commands</p>
      </div>
      <nav className="p-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard/student' 
            ? pathname === item.href 
            : (pathname === item.href || pathname.startsWith(item.href + '/'));
          
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-wider transition-all ${
                isActive
                  ? 'text-black bg-slate-100 border-l-4 border-black'
                  : 'text-slate-500 hover:text-black hover:bg-slate-50 border-l-4 border-transparent'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-sky-500' : ''} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
