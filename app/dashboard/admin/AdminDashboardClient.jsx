"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Users, Briefcase, Trash2, LogOut, Check, ShieldAlert, Award } from 'lucide-react';
import { deleteUserProfile } from '../../../lib/actions/admin';
import { logout } from '../../../lib/actions/auth';

const AdminDashboardClient = ({ user, initialStats, initialUsers }) => {
  const [users, setUsers] = useState(initialUsers);
  const [stats, setStats] = useState(initialStats);
  const [alertMessage, setAlertMessage] = useState('');
  const [loadingId, setLoadingId] = useState(null);

  const handleLogout = async () => {
    await logout();
  };

  const handleDeleteUser = async (userId, userEmail) => {
    setLoadingId(userId);
    try {
      await deleteUserProfile(userId);
      setUsers(users.filter(u => u.id !== userId));
      
      // Optimistically update stats
      const deletedUser = users.find(u => u.id === userId);
      if (deletedUser) {
        setStats(prev => ({
          ...prev,
          totalUsers: prev.totalUsers - 1,
          students: deletedUser.role === 'student' ? prev.students - 1 : prev.students,
          employers: deletedUser.role === 'employer' ? prev.employers - 1 : prev.employers
        }));
      }

      setAlertMessage(`User record terminated for: ${userEmail}`);
    } catch (error) {
      setAlertMessage(`Error: ${error.message}`);
    }
    setLoadingId(null);
    setTimeout(() => setAlertMessage(''), 3000);
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <header className="mb-12 border-b-4 border-black pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-500 flex items-center justify-center border-2 border-black">
                <ShieldAlert size={16} className="text-white" />
              </div>
              <span className="font-black uppercase tracking-[0.3em] text-[10px] text-red-500">Global Admin Override</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2">
              System <span className="text-red-500 italic">Control.</span>
            </h1>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest max-w-lg">
              Welcome back, Commander {user?.full_name || 'Admin'}. Maintain the network.
            </p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="bg-black text-white px-6 py-3 font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-black transition-all border-2 border-black flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] active:translate-y-1 active:shadow-none self-start md:self-end cursor-pointer"
          >
            <LogOut size={14} /> System Logout
          </button>
        </header>

        {alertMessage && (
          <div className="bg-red-500 text-white font-black uppercase tracking-widest text-xs p-4 mb-8 border-4 border-black flex items-center justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <span className="flex items-center gap-2"><Check size={16} /> {alertMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Stats Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-black text-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(239,68,68,1)]">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2 border-b-2 border-red-500 pb-2">
                <Zap size={20} className="text-red-500" /> Platform Metrics
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Network Users</p>
                  <p className="text-4xl font-black">{stats.totalUsers}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Job Seekers</p>
                  <p className="text-2xl font-bold text-sky-400">{stats.students}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Employers</p>
                  <p className="text-2xl font-bold text-emerald-400">{stats.employers}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Admins</p>
                  <p className="text-2xl font-bold text-rose-400">{stats.admins}</p>
                </div>
                <div className="pt-4 border-t-2 border-slate-800">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Job Protocols</p>
                  <p className="text-3xl font-black text-yellow-400">{stats.jobsPosted}</p>
                </div>
              </div>
            </div>
          </aside>

          {/* User Management */}
          <main className="lg:col-span-3">
            <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="p-6 border-b-4 border-black bg-slate-50 flex items-center justify-between">
                <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                  <Users size={24} className="text-sky-500" /> User Registry
                </h3>
                <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-3 py-1">
                  {users.length} Records
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black text-white text-[10px] font-black uppercase tracking-wider divide-x-2 divide-slate-800">
                      <th className="p-4">UUID / Email</th>
                      <th className="p-4">Name</th>
                      <th className="p-4 text-center">Role</th>
                      <th className="p-4 text-center">Joined</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-4 divide-black font-bold text-sm">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors divide-x-2 divide-black">
                        <td className="p-4">
                          <div className="font-black truncate w-48 text-black" title={u.email}>{u.email}</div>
                          <div className="text-[8px] uppercase tracking-widest text-slate-400 truncate w-48">{u.id}</div>
                        </td>
                        <td className="p-4 uppercase tracking-tighter font-black">
                          {u.full_name || 'UNKNOWN'}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest border-2 border-black inline-block
                            ${u.role === 'admin' ? 'bg-red-200 text-red-900' : ''}
                            ${u.role === 'employer' ? 'bg-emerald-200 text-emerald-900' : ''}
                            ${u.role === 'student' ? 'bg-sky-200 text-sky-900' : ''}
                            ${!u.role ? 'bg-slate-200' : ''}
                          `}>
                            {u.role || 'Unassigned'}
                          </span>
                        </td>
                        <td className="p-4 text-center text-[10px] font-black text-slate-500 uppercase">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            disabled={loadingId === u.id || u.role === 'admin'}
                            className={`p-2 border-2 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none cursor-pointer inline-flex items-center justify-center
                              ${u.role === 'admin' 
                                ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed opacity-50' 
                                : 'bg-white border-black hover:bg-red-500 hover:text-white text-black'
                              }
                            `}
                            title={u.role === 'admin' ? 'Cannot delete admin' : 'Terminate User'}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-12 text-center text-slate-400 font-black uppercase tracking-widest">
                          No Records Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboardClient;
