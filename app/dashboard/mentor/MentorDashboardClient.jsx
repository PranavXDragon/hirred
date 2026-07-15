"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Clock, Check, X, LogOut, Video, Settings, DollarSign, MessageCircle } from 'lucide-react';
import { logout } from '../../../lib/actions/auth';
import { updateBookingStatus } from '../../../lib/actions/mentors';
import MentorPaymentsPanel from './MentorPaymentsPanel';
import MentorChatsPanel from './MentorChatsPanel';

const MentorDashboardClient = ({ user, initialStats, initialBookings }) => {
  const [activeTab, setActiveTab] = useState('sessions');
  const [stats, setStats] = useState(initialStats);
  const [bookings, setBookings] = useState(initialBookings);
  const [loadingId, setLoadingId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [meetLinkInput, setMeetLinkInput] = useState('');
  const [showMeetInputFor, setShowMeetInputFor] = useState(null);

  const handleLogout = async () => {
    await logout();
  };

  const handleUpdateStatus = async (bookingId, status) => {
    let meetLink = null;
    
    if (status === 'confirmed') {
      if (!meetLinkInput.trim()) {
        setAlertMessage('Error: Meet link is required to confirm.');
        setTimeout(() => setAlertMessage(''), 3000);
        return;
      }
      meetLink = meetLinkInput.trim();
    }

    setLoadingId(bookingId);
    try {
      await updateBookingStatus(bookingId, status, meetLink);
      
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status, meet_link: meetLink || b.meet_link } : b
      ));

      if (status === 'confirmed') {
        setStats(prev => ({ ...prev, pendingRequests: Math.max(0, prev.pendingRequests - 1) }));
        setAlertMessage('Session Confirmed!');
      } else {
        setStats(prev => ({ ...prev, pendingRequests: Math.max(0, prev.pendingRequests - 1) }));
        setAlertMessage('Session Cancelled.');
      }
      
      setShowMeetInputFor(null);
      setMeetLinkInput('');
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
              <div className="w-8 h-8 bg-purple-500 flex items-center justify-center border-2 border-black">
                <Star size={16} className="text-white" />
              </div>
              <span className="font-black uppercase tracking-[0.3em] text-[10px] text-purple-500">Mentor HQ</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2">
              Mentor <span className="text-purple-500 italic">Terminal.</span>
            </h1>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest max-w-lg">
              Welcome back, {user?.full_name || 'Mentor'}. Review requests and guide the next generation.
            </p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="bg-black text-white px-6 py-3 font-black uppercase tracking-widest text-[10px] hover:bg-purple-500 hover:text-black transition-all border-2 border-black flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(168,85,247,1)] active:translate-y-1 active:shadow-none self-start md:self-end cursor-pointer"
          >
            <LogOut size={14} /> System Logout
          </button>
        </header>

        {alertMessage && (
          <div className={`text-white font-black uppercase tracking-widest text-xs p-4 mb-8 border-4 border-black flex items-center justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${alertMessage.includes('Error') ? 'bg-red-500' : 'bg-emerald-500'}`}>
            <span className="flex items-center gap-2">
              {alertMessage.includes('Error') ? <X size={16} /> : <Check size={16} />} 
              {alertMessage}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Stats Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2 border-b-4 border-black pb-4">
                <Star size={20} className="text-purple-500" /> My Impact
              </h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Average Rating</p>
                  <p className="text-4xl font-black text-purple-500">{stats.rating.toFixed(1)}</p>
                </div>
                <div className="pt-4 border-t-2 border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Sessions</p>
                  <p className="text-3xl font-black text-black">{stats.totalSessions}</p>
                </div>
                <div className="pt-4 border-t-2 border-slate-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Pending Requests</p>
                  <p className="text-3xl font-black text-amber-500">{stats.pendingRequests}</p>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab('sessions')}
                className={`flex items-center gap-2 p-3 font-black uppercase tracking-widest text-[10px] border-2 border-black transition-all text-left ${activeTab === 'sessions' ? 'bg-sky-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' : 'bg-white text-black hover:bg-slate-100'}`}
              >
                <Calendar size={16} /> Time & Sessions
              </button>
              <button 
                onClick={() => setActiveTab('chats')}
                className={`flex items-center gap-2 p-3 font-black uppercase tracking-widest text-[10px] border-2 border-black transition-all text-left ${activeTab === 'chats' ? 'bg-emerald-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' : 'bg-white text-black hover:bg-slate-100'}`}
              >
                <MessageCircle size={16} /> Chats
              </button>
              <button 
                onClick={() => setActiveTab('payments')}
                className={`flex items-center gap-2 p-3 font-black uppercase tracking-widest text-[10px] border-2 border-black transition-all text-left ${activeTab === 'payments' ? 'bg-yellow-500 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1' : 'bg-white text-black hover:bg-slate-100'}`}
              >
                <DollarSign size={16} /> Payment History
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">
            {activeTab === 'sessions' && (
            <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="p-6 border-b-4 border-black bg-slate-50 flex items-center justify-between">
                <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                  <Calendar size={24} className="text-sky-500" /> Session Queue
                </h3>
                <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-3 py-1">
                  {bookings.length} Bookings
                </span>
              </div>
              
              <div className="p-6">
                {bookings.length === 0 ? (
                  <div className="py-16 text-center border-4 border-dashed border-slate-300">
                    <Clock size={48} className="mx-auto text-slate-300 mb-4" />
                    <h4 className="text-xl font-black uppercase text-slate-400">No Bookings Yet</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your calendar is currently clear.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookings.map((booking) => (
                      <motion.div 
                        key={booking.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`border-4 border-black p-5 relative transition-all ${booking.status === 'cancelled' || booking.status === 'completed' ? 'opacity-70 bg-slate-50' : 'bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'}`}
                      >
                        {/* Status Badge */}
                        <div className="absolute top-0 right-5 -translate-y-1/2 flex gap-2">
                          <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-black
                            ${booking.status === 'pending' ? 'bg-amber-400 text-black' : ''}
                            ${booking.status === 'confirmed' ? 'bg-emerald-400 text-black' : ''}
                            ${booking.status === 'cancelled' ? 'bg-rose-500 text-white' : ''}
                            ${booking.status === 'completed' ? 'bg-sky-400 text-black' : ''}
                          `}>
                            {booking.status}
                          </span>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Student</p>
                            <h4 className="text-xl font-black tracking-tight uppercase leading-none mb-1">{booking.student?.full_name || 'Unknown User'}</h4>
                            <a href={`mailto:${booking.student?.email}`} className="text-sky-600 font-bold text-xs tracking-widest hover:underline">{booking.student?.email}</a>
                          </div>
                          <div className="md:text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Scheduled For</p>
                            <p className="text-lg font-black uppercase tracking-tighter">
                              {new Date(booking.booking_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          </div>
                        </div>

                        {booking.status === 'confirmed' && booking.meet_link && (
                          <div className="bg-sky-50 p-3 border-2 border-black flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 font-black uppercase tracking-tighter text-sky-900">
                              <Video size={16} /> Session Link Active
                            </div>
                            <a href={booking.meet_link.startsWith('http') ? booking.meet_link : `https://${booking.meet_link}`} target="_blank" rel="noopener noreferrer" className="bg-sky-500 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-black hover:bg-black transition-colors">
                              Join Call
                            </a>
                          </div>
                        )}

                        {booking.status === 'pending' && (
                          <div className="mt-6 pt-4 border-t-2 border-slate-200">
                            {showMeetInputFor === booking.id ? (
                              <div className="flex flex-col sm:flex-row gap-3">
                                <input 
                                  type="url" 
                                  placeholder="Paste Google Meet or Zoom link..."
                                  value={meetLinkInput}
                                  onChange={(e) => setMeetLinkInput(e.target.value)}
                                  className="flex-1 bg-white border-2 border-black px-4 py-2 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
                                />
                                <button 
                                  onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                  disabled={loadingId === booking.id}
                                  className="bg-emerald-500 text-black px-6 py-2 font-black uppercase tracking-widest text-[10px] border-2 border-black hover:bg-black hover:text-emerald-500 transition-colors disabled:opacity-50"
                                >
                                  {loadingId === booking.id ? 'Confirming...' : 'Confirm Session'}
                                </button>
                                <button 
                                  onClick={() => setShowMeetInputFor(null)}
                                  className="bg-slate-200 text-black px-4 py-2 font-black uppercase tracking-widest text-[10px] border-2 border-black hover:bg-slate-300 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-3">
                                <button 
                                  onClick={() => setShowMeetInputFor(booking.id)}
                                  className="flex items-center gap-2 bg-black text-white px-6 py-2 font-black uppercase tracking-widest text-[10px] border-2 border-black hover:bg-emerald-500 hover:text-black transition-colors"
                                >
                                  <Check size={14} /> Accept Request
                                </button>
                                <button 
                                  onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                  disabled={loadingId === booking.id}
                                  className="flex items-center gap-2 bg-white text-rose-600 px-6 py-2 font-black uppercase tracking-widest text-[10px] border-2 border-black hover:bg-rose-500 hover:text-white transition-colors disabled:opacity-50"
                                >
                                  <X size={14} /> Decline
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <div className="mt-4 pt-4 border-t-2 border-slate-200 flex justify-end">
                             <button 
                                onClick={() => handleUpdateStatus(booking.id, 'completed')}
                                disabled={loadingId === booking.id}
                                className="flex items-center gap-2 bg-white text-black px-4 py-2 font-black uppercase tracking-widest text-[10px] border-2 border-black hover:bg-sky-400 transition-colors disabled:opacity-50"
                              >
                                Mark as Completed
                              </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            )}

            {activeTab === 'chats' && (
              <MentorChatsPanel user={user} />
            )}

            {activeTab === 'payments' && (
              <MentorPaymentsPanel bookings={bookings} stats={stats} />
            )}
          </main>

        </div>
      </div>
    </div>
  );
};

export default MentorDashboardClient;
