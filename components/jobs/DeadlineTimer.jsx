"use client";

import React, { useState, useEffect } from 'react';
import { Timer, AlertCircle } from 'lucide-react';

const DeadlineTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 30, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) days--;
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-amber-100 border-[3px] border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <Timer className="text-black" size={24} />
        <div>
          <h4 className="font-black text-sm uppercase tracking-widest text-black">Application Deadline</h4>
          <p className="text-[10px] font-bold text-slate-700 uppercase tracking-tight flex items-center gap-1">
            <AlertCircle size={10} /> Fast-track review ending soon
          </p>
        </div>
      </div>
      
      <div className="flex gap-2 text-center">
        <div className="bg-black text-white px-2 py-1 min-w-[40px]">
          <span className="block font-black text-lg leading-none">{timeLeft.days}</span>
          <span className="text-[8px] uppercase font-bold tracking-widest text-amber-400">Days</span>
        </div>
        <div className="bg-black text-white px-2 py-1 min-w-[40px]">
          <span className="block font-black text-lg leading-none">{timeLeft.hours}</span>
          <span className="text-[8px] uppercase font-bold tracking-widest text-amber-400">Hrs</span>
        </div>
        <div className="bg-black text-white px-2 py-1 min-w-[40px]">
          <span className="block font-black text-lg leading-none">{timeLeft.minutes}</span>
          <span className="text-[8px] uppercase font-bold tracking-widest text-amber-400">Min</span>
        </div>
        <div className="bg-black text-white px-2 py-1 min-w-[40px] hidden md:block">
          <span className="block font-black text-lg leading-none">{timeLeft.seconds}</span>
          <span className="text-[8px] uppercase font-bold tracking-widest text-amber-400">Sec</span>
        </div>
      </div>
    </div>
  );
};

export default DeadlineTimer;
