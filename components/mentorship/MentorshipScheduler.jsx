"use client";

import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, ChevronRight, ArrowRight, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookMentorSession } from '../../lib/actions/mentors';

const MentorshipScheduler = ({ mentor, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [location, setLocation] = useState('native');

  if (!mentor) return null;

  // Mock available dates (next 3 days)
  const today = new Date();
  const dates = Array.from({ length: 3 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1); // tomorrow onwards
    return {
      dateObj: d,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  // Mock available times
  const times = ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'];

  const handleConfirm = async () => {
    setBookingLoading(true);
    setBookingError('');
    try {
      const res = await bookMentorSession(mentor.id, `${selectedDate.month} ${selectedDate.dayNum}`, selectedTime, location);
      if (res?.error) {
        setBookingError(res.error);
        if (res.error.toLowerCase().includes('unauthorized') || res.error.toLowerCase().includes('log in')) {
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
      } else {
        setMeetLink(res.meetLink);
        setStep(2);
        setIsBooked(true);
      }
    } catch (err) {
      const errorMsg = err.message || 'An unexpected error occurred';
      setBookingError(errorMsg);
      if (errorMsg.toLowerCase().includes('unauthorized') || errorMsg.toLowerCase().includes('log in')) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    }
    setBookingLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border-[4px] border-black w-full max-w-2xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b-[4px] border-black bg-emerald-50">
          <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
              Book Protocol.
            </h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mt-1">
              1-on-1 Session with {mentor.name}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-rose-500 transition-colors border-2 border-black shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 bg-slate-50 relative">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Date Selection */}
                <section>
                  <h3 className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
                    <Calendar size={16} className="text-emerald-500" /> Select Date
                  </h3>
                  <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                    {dates.map((d, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(d)}
                        className={`flex-shrink-0 w-24 h-24 border-2 flex flex-col items-center justify-center transition-all ${
                          selectedDate === d 
                            ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(16,185,129,1)] scale-105' 
                            : 'bg-white border-black text-slate-600 hover:bg-emerald-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest">{d.dayName}</span>
                        <span className="text-3xl font-black leading-none my-1">{d.dayNum}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">{d.month}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Time Selection */}
                <section className={!selectedDate ? 'opacity-30 pointer-events-none transition-opacity' : 'transition-opacity'}>
                  <h3 className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
                    <Clock size={16} className="text-emerald-500" /> Select Time
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {times.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedTime(t)}
                        className={`py-3 border-2 font-black text-xs uppercase tracking-widest transition-all ${
                          selectedTime === t 
                            ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(16,185,129,1)]' 
                            : 'bg-white border-black text-slate-600 hover:bg-emerald-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Location Selection */}
                <section className={!selectedTime ? 'opacity-30 pointer-events-none transition-opacity' : 'transition-opacity'}>
                  <h3 className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
                    <LinkIcon size={16} className="text-emerald-500" /> Session Location
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setLocation('meet')}
                      className={`py-3 border-2 font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                        location === 'meet' 
                          ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(16,185,129,1)]' 
                          : 'bg-white border-black text-slate-600 hover:bg-emerald-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      Google Meet
                    </button>
                    <button
                      onClick={() => setLocation('native')}
                      className={`py-3 border-2 font-black text-[10px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 leading-none ${
                        location === 'native' 
                          ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(16,185,129,1)]' 
                          : 'bg-white border-black text-slate-600 hover:bg-emerald-50 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      <span>hirrd Space</span>
                      <span className={`text-[7px] ${location === 'native' ? 'text-emerald-400' : 'text-slate-400'}`}>Native Video Room</span>
                    </button>
                  </div>
                </section>

                {/* Summary & Submit */}
                <div className="pt-6 border-t-2 border-black mt-8">
                  {bookingError && (
                      <div className="mb-4 p-4 border-2 border-rose-500 bg-rose-50 text-rose-600 font-bold text-xs uppercase flex items-center gap-2">
                        <AlertCircle size={16} /> {bookingError}
                      </div>
                  )}
                  <div className="flex justify-between items-center mb-6 p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Session Rate</span>
                      <span className="text-xl font-black text-emerald-600">{mentor.rate}</span>
                    </div>
                    <div className="text-right">
                       <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Duration</span>
                       <span className="font-black">45 MIN</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleConfirm}
                    disabled={!selectedDate || !selectedTime || bookingLoading}
                    className={`w-full py-5 font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-2 transition-all border-2 border-black ${
                      selectedDate && selectedTime 
                        ? 'bg-black text-white hover:bg-emerald-500 hover:text-black cursor-pointer shadow-[6px_6px_0px_0px_rgba(16,185,129,1)] active:translate-y-1 active:shadow-none' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {bookingLoading ? 'Processing...' : 'Confirm Booking'} <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8">
                  <CheckCircle2 size={48} className="text-white" />
                </div>
                <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">Protocol Secured.</h3>
                <p className="text-sm font-bold text-slate-600 max-w-sm mb-8 leading-relaxed">
                  Your session with <span className="text-black bg-emerald-200 px-1">{mentor.name}</span> has been confirmed for {selectedDate?.dayName}, {selectedDate?.month} {selectedDate?.dayNum} at {selectedTime}.
                </p>
                <div className="bg-white border-2 border-black p-4 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-full max-w-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                    {location === 'native' ? 'Native Session Link' : 'Google Meet Link'}
                  </p>
                  <a href={meetLink} className="font-bold text-xs truncate text-sky-500 cursor-pointer hover:underline block break-all">
                    {location === 'native' ? 'Join Native Room' : meetLink}
                  </a>
                </div>
                <button 
                  onClick={onClose}
                  className="bg-black text-white px-8 py-4 font-black uppercase text-xs tracking-widest hover:bg-emerald-500 hover:text-black transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(16,185,129,1)]"
                >
                  Return to Directory
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </motion.div>
    </div>
  );
};

export default MentorshipScheduler;
