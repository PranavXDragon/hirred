'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Eye, EyeOff, ArrowRight, Github, Linkedin, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { login } from '@/lib/actions/auth';

const SigninPage = () => {
  const { signInWithOAuth } = useAuth();
  const [role, setRole] = useState('student'); // 'student' | 'employer' | 'admin'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [oauthLoading, setOauthLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOAuthLogin = async (provider) => {
    try {
      setOauthLoading(true);
      setError('');
      await signInWithOAuth(provider, role);
    } catch (err) {
      setError(err.message || 'OAuth login failed');
      setOauthLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Call the server action directly (passed via import, but wait, server actions in Next.js 14+ can be imported)
    // Actually we need to import the login action. Let's make sure it's imported at the top.
    
    try {
      const result = await login({ email: formData.email, password: formData.password });
      
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      if (err?.message?.includes('NEXT_REDIRECT')) {
        throw err;
      }
      setError('An error occurred during sign in.');
      console.error(err);
    } finally {
      setIsLoading(false);
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
            Security Verification
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-[0.85] mb-6">
            Welcome <br />
            <span className="text-sky-500 italic">Back.</span>
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
              onClick={() => { setRole('mentor'); setError(''); }}
              className={`py-2 text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
                role === 'mentor' ? 'bg-black text-white' : 'hover:bg-slate-200 text-slate-500'
              }`}
            >
              Mentor
            </button>
          </div>

          {/* Error Banner */}
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
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
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

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <a 
                href="/forgot-password" 
                className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-500 transition-colors underline decoration-2 decoration-transparent hover:decoration-sky-500 underline-offset-4"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col gap-3">
              <button 
                type="submit"
                disabled={isLoading || oauthLoading}
                className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 font-black uppercase text-xs tracking-[0.25em] hover:bg-sky-500 hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>Authenticating <Loader2 size={14} className="animate-spin" /></>
                ) : (
                  <>Verify Session <ArrowRight size={14} /></>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t-2 border-slate-100"></div>
            <span className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Or Sign In With</span>
            <div className="flex-grow border-t-2 border-slate-100"></div>
          </div>

          {/* Social Signins */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            {/* Google */}
            <button 
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={oauthLoading}
              className="border-2 border-black p-3 flex items-center justify-center hover:bg-sky-50 active:bg-sky-100 transition-colors disabled:opacity-50"
              title="Google"
            >
              <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C18.155 1.8 15.437.95 12.24.95 6.082.95 1.1 5.932 1.1 12s4.982 11.05 11.14 11.05c6.427 0 10.7-4.498 10.7-10.874 0-.733-.078-1.293-.174-1.89H12.24z"/>
              </svg>
            </button>

            {/* LinkedIn */}
            <button 
              type="button"
              onClick={() => handleOAuthLogin('linkedin_oidc')}
              disabled={oauthLoading}
              className="border-2 border-black p-3 flex items-center justify-center hover:bg-sky-50 active:bg-sky-100 transition-colors disabled:opacity-50"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-black" />
            </button>

            {/* GitHub */}
            <button 
              type="button"
              onClick={() => handleOAuthLogin('github')}
              disabled={oauthLoading}
              className="border-2 border-black p-3 flex items-center justify-center hover:bg-sky-50 active:bg-sky-100 transition-colors disabled:opacity-50"
              title="GitHub"
            >
              <Github className="w-5 h-5 text-black" />
            </button>
          </div>

          {/* Footer Navigation */}
          <div className="text-center pt-4 border-t-2 border-slate-100 text-[11px] font-black uppercase tracking-widest text-slate-400">
            Need clearance?{" "}
            <a 
              href="/register" 
              className="text-black hover:text-sky-500 transition-colors underline decoration-2 decoration-sky-500 underline-offset-4"
            >
              Sign Up
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SigninPage;
