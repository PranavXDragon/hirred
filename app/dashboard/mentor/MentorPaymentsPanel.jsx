"use client";

import React, { useMemo } from 'react';
import { DollarSign, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MentorPaymentsPanel({ bookings, stats }) {
  // Derive completed bookings
  const completedBookings = useMemo(() => {
    return bookings.filter(b => b.status === 'completed');
  }, [bookings]);

  const totalEarnings = completedBookings.length * (stats.rate || 0);

  return (
    <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      <div className="p-6 border-b-4 border-black bg-slate-50 flex items-center justify-between">
        <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
          <DollarSign size={24} className="text-yellow-500" /> Revenue & Payments
        </h3>
      </div>
      
      <div className="p-6 space-y-6">
        
        {/* Earnings Summary Widget */}
        <div className="bg-yellow-100 border-4 border-yellow-500 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-yellow-700 mb-1">Total Career Earnings</p>
            <h2 className="text-5xl font-black text-black">₹{totalEarnings.toLocaleString()}</h2>
          </div>
          <div className="bg-white border-2 border-black px-4 py-3 flex gap-4">
             <div className="text-center">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Rate</p>
               <p className="text-lg font-black uppercase text-yellow-600">₹{stats.rate || 0}</p>
             </div>
             <div className="w-0.5 bg-black"></div>
             <div className="text-center">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Paid Sessions</p>
               <p className="text-lg font-black uppercase text-emerald-600">{completedBookings.length}</p>
             </div>
          </div>
        </div>

        {/* Transactions List */}
        <div>
          <h4 className="font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2 border-b-2 border-black pb-2">
            <CheckCircle size={16} /> Transaction History
          </h4>

          {completedBookings.length === 0 ? (
            <div className="py-12 text-center border-4 border-dashed border-slate-300">
              <Clock size={32} className="mx-auto text-slate-300 mb-3" />
              <h5 className="font-black uppercase tracking-widest text-slate-400">No Revenue Yet</h5>
              <p className="text-xs font-bold text-slate-400">Complete sessions to generate earnings.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {completedBookings.map((booking) => (
                <motion.div 
                  key={booking.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white border-2 border-black p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-slate-50 transition-colors"
                >
                  <div className="mb-2 sm:mb-0">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">
                      {new Date(booking.booking_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="font-bold text-sm">Session w/ {booking.student?.full_name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-1 text-[10px] font-black uppercase tracking-widest border border-emerald-500">
                      Settled
                    </span>
                    <span className="font-black text-xl text-yellow-600">+₹{stats.rate}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
