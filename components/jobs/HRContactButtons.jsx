import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

const HRContactButtons = ({ phone = "+91 9876543210" }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full">
      <a 
        href={`tel:${phone.replace(/\s+/g, '')}`}
        className="flex-1 bg-white border-[3px] border-black text-black py-4 font-black uppercase tracking-widest text-[10px] hover:bg-emerald-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
      >
        <Phone size={16} /> Call HR
      </a>
      <a 
        href={`https://wa.me/${phone.replace(/\D/g, '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 bg-white border-[3px] border-black text-black py-4 font-black uppercase tracking-widest text-[10px] hover:bg-green-400 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
      >
        <MessageCircle size={16} /> WhatsApp HR
      </a>
    </div>
  );
};

export default HRContactButtons;
