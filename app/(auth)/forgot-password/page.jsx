'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowLeft, Send } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const { resetPassword } = await import('@/lib/actions/auth');
      const result = await resetPassword(email);
      
      if (result?.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-16 relative overflow-hidden flex items-center justify-center">
      
      {/* --- Global Grid Background --- */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <div className="max-w-md w-full mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white border-[4px] border-black p-8 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(14,165,233,1)] transition-all duration-300"
        >
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <Zap size={12} className="text-sky-400" fill="currentColor" />
            Security Override
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.85] mb-6">
            Forgot <br />
            <span className="text-sky-500 italic">Password.</span>
          </h1>

          {!submitted ? (
            <>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-8">
                Request a secure credential override token link.
              </p>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-50 border-2 border-red-500 text-red-700 text-xs font-black uppercase tracking-wider"
                >
                  {error}
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-8 mb-8">
                {/* Email Input */}
                <div className="relative group">
                  <input 
                    type="email" 
                    required
                    placeholder=" "
                    className="w-full bg-transparent border-b-[3px] border-black py-3 font-black uppercase text-sm focus:outline-none focus:border-sky-500 transition-colors peer"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label className="absolute left-0 top-3 text-slate-300 font-black uppercase text-xs tracking-widest transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-sky-500 peer-[:not(:placeholder-shown)]:-top-4">
                    Email Address
                  </label>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 font-black uppercase text-xs tracking-[0.25em] hover:bg-sky-500 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none"
                >
                  Send Reset Link <Send size={14} />
                </button>
              </form>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 mb-8 text-left"
            >
              <div className="p-4 bg-sky-50 border-2 border-sky-500 text-slate-700 text-xs font-bold uppercase tracking-wider leading-relaxed">
                <span className="text-sky-500 font-black block mb-2">Protocol Dispatched!</span>
                An override link has been sent to your identity registry email (<span className="text-black font-black">{email}</span>) if it exists.
              </div>
            </motion.div>
          )}

          {/* Footer Navigation */}
          <div className="text-center pt-4 border-t-2 border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-400">
            <a 
              href="/login" 
              className="text-black hover:text-sky-500 transition-colors inline-flex items-center gap-2 underline decoration-2 decoration-sky-500 underline-offset-4"
            >
              <ArrowLeft size={12} /> Return to Sign In
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
