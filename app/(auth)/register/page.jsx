'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff, ArrowRight, Github, Linkedin, Building, ShieldCheck } from 'lucide-react';
import { register } from '@/lib/actions/auth';

const SignupPage = () => {
  const [role, setRole] = useState('student'); // 'student' | 'employer' | 'admin'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    adminCode: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (role === 'employer' && !formData.companyName) {
      setError('Company Name is required for employer registration');
      return;
    }

    if (role === 'admin' && formData.adminCode !== 'ADMIN2026') {
      setError('Invalid Administrative Access Key (try: ADMIN2026)');
      return;
    }

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
        role: role
      };
      
      const result = await register(payload);
      
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred during registration.');
      console.error(err);
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <Zap size={12} className="text-sky-400" fill="currentColor" />
            Access Authorization
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.85] mb-6">
            Register <br />
            <span className="text-sky-500 italic">Account.</span>
          </h1>

          {/* Role Swapper Tabs */}
          <div className="grid grid-cols-3 border-[3px] border-black p-1 mb-8 gap-1 bg-slate-50">
            <button 
              type="button" 
              onClick={() => { setRole('student'); setError(''); }}
              className={`py-2 text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
                role === 'student' ? 'bg-black text-white' : 'hover:bg-slate-200 text-slate-500'
              }`}
            >
              Job Seeker
            </button>
            <button 
              type="button" 
              onClick={() => { setRole('employer'); setError(''); }}
              className={`py-2 text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
                role === 'employer' ? 'bg-black text-white' : 'hover:bg-slate-200 text-slate-500'
              }`}
            >
              Employer
            </button>
            <button 
              type="button" 
              onClick={() => { setRole('admin'); setError(''); }}
              className={`py-2 text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
                role === 'admin' ? 'bg-black text-white' : 'hover:bg-slate-200 text-slate-500'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border-2 border-red-500 text-red-700 text-xs font-black uppercase tracking-wider"
            >
              {typeof error === 'string' ? error : JSON.stringify(error)}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            {/* Name Input */}
            <div className="relative group">
              <input 
                type="text" 
                required
                placeholder=" "
                className="w-full bg-transparent border-b-[3px] border-black py-3 font-black uppercase text-sm focus:outline-none focus:border-sky-500 transition-colors peer"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <label className="absolute left-0 top-3 text-slate-300 font-black uppercase text-xs tracking-widest transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-sky-500 peer-[:not(:placeholder-shown)]:-top-4">
                Full Name / Identity
              </label>
            </div>

            {/* Email Input */}
            <div className="relative group">
              <input 
                type="email" 
                required
                placeholder=" "
                className="w-full bg-transparent border-b-[3px] border-black py-3 font-black uppercase text-sm focus:outline-none focus:border-sky-500 transition-colors peer"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <label className="absolute left-0 top-3 text-slate-300 font-black uppercase text-xs tracking-widest transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-sky-500 peer-[:not(:placeholder-shown)]:-top-4">
                Email Address
              </label>
            </div>

            {/* Role Specific Field: Company Name */}
            {role === 'employer' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="relative group"
              >
                <input 
                  type="text" 
                  required
                  placeholder=" "
                  className="w-full bg-transparent border-b-[3px] border-black py-3 pr-8 font-black uppercase text-sm focus:outline-none focus:border-sky-500 transition-colors peer"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                />
                <label className="absolute left-0 top-3 text-slate-300 font-black uppercase text-xs tracking-widest transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-sky-500 peer-[:not(:placeholder-shown)]:-top-4">
                  Company / Organization
                </label>
                <Building size={16} className="absolute right-2 top-3 text-slate-300" />
              </motion.div>
            )}

            {/* Role Specific Field: Admin Authorization Key */}
            {role === 'admin' && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="relative group"
              >
                <input 
                  type="text" 
                  required
                  placeholder=" "
                  className="w-full bg-transparent border-b-[3px] border-black py-3 pr-8 font-black uppercase text-sm focus:outline-none focus:border-sky-500 transition-colors peer"
                  value={formData.adminCode}
                  onChange={(e) => setFormData({...formData, adminCode: e.target.value})}
                />
                <label className="absolute left-0 top-3 text-slate-300 font-black uppercase text-xs tracking-widest transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-sky-500 peer-[:not(:placeholder-shown)]:-top-4">
                  Admin Access Key (use: ADMIN2026)
                </label>
                <ShieldCheck size={16} className="absolute right-2 top-3 text-slate-300" />
              </motion.div>
            )}

            {/* Password Input */}
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                required
                placeholder=" "
                className="w-full bg-transparent border-b-[3px] border-black py-3 pr-10 font-black uppercase text-sm focus:outline-none focus:border-sky-500 transition-colors peer"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <label className="absolute left-0 top-3 text-slate-300 font-black uppercase text-xs tracking-widest transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-sky-500 peer-[:not(:placeholder-shown)]:-top-4">
                Password
              </label>
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-3 text-slate-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Confirm Password Input */}
            <div className="relative group">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                required
                placeholder=" "
                className="w-full bg-transparent border-b-[3px] border-black py-3 pr-10 font-black uppercase text-sm focus:outline-none focus:border-sky-500 transition-colors peer"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
              <label className="absolute left-0 top-3 text-slate-300 font-black uppercase text-xs tracking-widest transition-all pointer-events-none peer-focus:-top-4 peer-focus:text-sky-500 peer-[:not(:placeholder-shown)]:-top-4">
                Confirm Password
              </label>
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-3 text-slate-400 hover:text-black transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 font-black uppercase text-xs tracking-[0.25em] hover:bg-sky-500 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none"
            >
              Register Account <ArrowRight size={14} />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t-2 border-slate-100"></div>
            <span className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Or Register With</span>
            <div className="flex-grow border-t-2 border-slate-100"></div>
          </div>

          {/* Social Signups */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {/* Google */}
            <button 
              type="button"
              className="border-2 border-black p-3 flex items-center justify-center hover:bg-sky-50 active:bg-sky-100 transition-colors"
              title="Google"
            >
              <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C18.155 1.8 15.437.95 12.24.95 6.082.95 1.1 5.932 1.1 12s4.982 11.05 11.14 11.05c6.427 0 10.7-4.498 10.7-10.874 0-.733-.078-1.293-.174-1.89H12.24z"/>
              </svg>
            </button>

            {/* LinkedIn */}
            <button 
              type="button"
              className="border-2 border-black p-3 flex items-center justify-center hover:bg-sky-50 active:bg-sky-100 transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-black" />
            </button>

            {/* GitHub */}
            <button 
              type="button"
              className="border-2 border-black p-3 flex items-center justify-center hover:bg-sky-50 active:bg-sky-100 transition-colors"
              title="GitHub"
            >
              <Github className="w-5 h-5 text-black" />
            </button>
          </div>

          {/* Footer Navigation */}
          <div className="text-center pt-4 border-t-2 border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-400">
            Already registered?{" "}
            <a 
              href="/login" 
              className="text-black hover:text-sky-500 transition-colors underline decoration-2 decoration-sky-500 underline-offset-4"
            >
              Sign In
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
