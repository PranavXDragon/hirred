'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, MapPin, Zap, ArrowRight, Globe, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const ContactPage = () => {
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const { error } = await supabase
      .from('contact_messages')
      .insert([
        { name: formData.name, email: formData.email, message: formData.message }
      ]);
      
    setIsSubmitting(false);
    if (!error) {
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } else {
      console.error("Failed to transmit:", error);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-20 relative overflow-hidden">
      
      {/* --- Global Grid Background --- */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-[1600px] mx-auto min-h-[calc(100vh-80px)] flex flex-col lg:flex-row relative z-10">
        
        {/* --- LEFT SIDE: THE FORM --- */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Zap size={12} className="text-sky-400" fill="currentColor" />
              Direct Transmission
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.85] mb-6">
              Get in <br />
              <span className="text-sky-500 italic">Touch.</span>
            </h1>
            
            <p className="text-slate-500 font-bold mb-12 max-w-md">
              Have a project in mind or looking to join our elite network in Nagpur? Drop a message below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Input Group */}
              <div className="relative group">
                <input 
                  type="text" 
                  required
                  placeholder=" "
                  value={formData.name}
                  className="w-full bg-transparent border-b-[3px] border-black py-4 font-black uppercase text-sm focus:outline-none focus:border-sky-500 transition-colors peer"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <label className="absolute left-0 top-4 text-slate-300 font-black uppercase text-xs tracking-widest transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-sky-500 peer-[:not(:placeholder-shown)]:-top-4">
                  Full Name / Identity
                </label>
              </div>

              <div className="relative group">
                <input 
                  type="email" 
                  required
                  placeholder=" "
                  value={formData.email}
                  className="w-full bg-transparent border-b-[3px] border-black py-4 font-black uppercase text-sm focus:outline-none focus:border-sky-500 transition-colors peer"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <label className="absolute left-0 top-4 text-slate-300 font-black uppercase text-xs tracking-widest transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-sky-500 peer-[:not(:placeholder-shown)]:-top-4">
                  Email Address
                </label>
              </div>

              <div className="relative group">
                <textarea 
                  required
                  placeholder=" "
                  rows="3"
                  value={formData.message}
                  className="w-full bg-transparent border-b-[3px] border-black py-4 font-black uppercase text-sm focus:outline-none focus:border-sky-500 transition-colors peer resize-none"
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
                <label className="absolute left-0 top-4 text-slate-300 font-black uppercase text-xs tracking-widest transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-sky-500 peer-[:not(:placeholder-shown)]:-top-4">
                  Project Details
                </label>
              </div>

              <div className="flex items-center gap-6">
                <button 
                  disabled={isSubmitting || isSuccess}
                  className="flex items-center gap-4 bg-black text-white px-12 py-5 font-black uppercase text-xs tracking-[0.3em] hover:bg-sky-500 hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? 'Transmitting...' : 'Submit Protocol'} <Send size={16} />
                </button>
                
                <AnimatePresence>
                  {isSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-2 text-sky-500 font-black text-xs uppercase tracking-widest"
                    >
                      <CheckCircle2 size={16} /> Protocol Accepted
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>

            {/* Quick Contact Info */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t-2 border-slate-100">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-sky-50">
                    <Mail size={18} />
                  </div>
                  <span className="font-black text-[10px] uppercase tracking-widest">Support@hirrd.tech</span>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-sky-50">
                    <MapPin size={18} />
                  </div>
                  <span className="font-black text-[10px] uppercase tracking-widest text-wrap">Nagpur, MH, India</span>
               </div>
            </div>
          </motion.div>
        </div>

        {/* --- RIGHT SIDE: THE MAP --- */}
        <div className="w-full lg:w-1/2 min-h-[500px] relative border-l-0 lg:border-l-[4px] border-black">
          {/* Map Overlay Info */}
          <div className="absolute top-10 left-10 z-20 bg-white border-[3px] border-black p-6 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hidden md:block">
             <h3 className="font-black uppercase italic mb-2">Operational Hub 01</h3>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Globe size={12} className="text-sky-500" /> Central India Grid
             </p>
          </div>

          {/* Google Map Iframe (Greyscale Styled) */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.41724498305!2d78.99010795!3d21.16122595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31faf13%3A0x19b37d06d0bb3e2b!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            className="w-full h-full grayscale contrast-125 brightness-100 border-none relative z-10 hover:grayscale-0 transition-all duration-700"
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          {/* Bottom Accent */}
          <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-white to-transparent z-20 pointer-events-none"></div>
          
          <div className="absolute bottom-10 right-10 z-30">
             <div className="w-16 h-16 bg-sky-500 border-4 border-black flex items-center justify-center rotate-45 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Zap size={30} className="-rotate-45" fill="currentColor" />
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
