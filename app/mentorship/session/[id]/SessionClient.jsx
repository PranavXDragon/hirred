"use client";

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, MonitorUp, MessageSquare, PhoneOff, Settings, Users, Expand } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SessionClient({ sessionId }) {
  const [micOn, setMicOn] = useState(false); // Default off before joining
  const [videoOn, setVideoOn] = useState(false);
  const [joined, setJoined] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Time simulation
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval;
    if (joined) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [joined]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col font-mono text-white selection:bg-sky-500 selection:text-black">
      
      {/* Header */}
      <header className="bg-black border-b-[3px] border-slate-800 p-4 flex justify-between items-center shrink-0 z-10 relative shadow-[0px_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <div className="bg-sky-500 text-black font-black uppercase text-[10px] px-2 py-1 tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div> Live
          </div>
          <h1 className="font-black uppercase tracking-tight text-sm md:text-base truncate">Protocol Session: {sessionId}</h1>
        </div>
        <div className="flex gap-3">
          <button className="p-2 border border-slate-700 hover:bg-slate-800 transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        
        {/* Waiting Room / Setup */}
        {!joined ? (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-md z-20">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-black border-[4px] border-sky-500 p-8 max-w-lg w-full shadow-[16px_16px_0px_0px_rgba(14,165,233,0.5)]"
            >
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Ready to Connect?</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">hirrd Space Native Room</p>
              
              <div className="aspect-video bg-slate-900 border-2 border-slate-700 mb-8 flex items-center justify-center relative overflow-hidden">
                {!videoOn ? (
                  <div className="text-center">
                    <VideoOff size={40} className="mx-auto text-slate-600 mb-3" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Camera is off</span>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                     {/* Simulated local video feed placeholder */}
                     <span className="text-xs uppercase font-black tracking-widest text-slate-400">Local Video Feed</span>
                  </div>
                )}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
                  <button 
                    onClick={() => setMicOn(!micOn)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors border-2 ${micOn ? 'bg-slate-800 border-slate-600 text-white' : 'bg-red-500 border-red-500 text-white'}`}
                  >
                    {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                  </button>
                  <button 
                    onClick={() => setVideoOn(!videoOn)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors border-2 ${videoOn ? 'bg-slate-800 border-slate-600 text-white' : 'bg-red-500 border-red-500 text-white'}`}
                  >
                    {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setJoined(true)}
                className="w-full bg-sky-500 text-black hover:bg-white transition-colors border-2 border-transparent hover:border-black py-4 font-black uppercase tracking-[0.2em] text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
              >
                Join Protocol Session
              </button>
            </motion.div>
          </div>
        ) : (
          
          /* Live Session Room */
          <div className="flex-1 flex w-full relative">
            
            {/* Video Grid */}
            <div className={`flex-1 flex flex-col md:flex-row p-4 gap-4 transition-all duration-300 ${showChat ? 'md:pr-80' : ''}`}>
              
              {/* Remote Peer (Mentor) */}
              <div className="flex-1 bg-slate-800 border-[3px] border-slate-700 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] overflow-hidden group">
                <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                  <div className="w-32 h-32 bg-black rounded-full border-[4px] border-emerald-500 flex items-center justify-center animate-pulse shadow-[0px_0px_30px_rgba(16,185,129,0.3)]">
                    <span className="text-5xl font-black text-emerald-500">M</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1.5 border border-slate-700 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Mentor</span>
                </div>
              </div>

              {/* Local Peer (User) */}
              <div className="w-full md:w-1/3 aspect-video md:aspect-auto bg-slate-800 border-[3px] border-slate-700 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] overflow-hidden">
                {videoOn ? (
                  <div className="absolute inset-0 bg-slate-700 flex items-center justify-center">
                    <span className="text-xs uppercase font-black tracking-widest text-slate-400">You</span>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center">
                    <VideoOff size={32} className="text-slate-600 mb-2" />
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black/80 px-3 py-1.5 border border-slate-700 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">You {micOn ? '' : '(Muted)'}</span>
                </div>
              </div>

            </div>

            {/* In-Session Chat Sidebar */}
            <AnimatePresence>
              {showChat && (
                <motion.div 
                  initial={{ x: 320 }}
                  animate={{ x: 0 }}
                  exit={{ x: 320 }}
                  className="absolute right-0 top-0 bottom-0 w-80 bg-black border-l-[3px] border-slate-800 flex flex-col z-10"
                >
                  <div className="p-4 border-b-[3px] border-slate-800 flex justify-between items-center bg-slate-900">
                    <h3 className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
                      <MessageSquare size={14} className="text-sky-500" /> Session Chat
                    </h3>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    <p className="text-[10px] font-bold text-slate-500 text-center uppercase border-b border-slate-800 pb-2">Chat is end-to-end encrypted</p>
                    {/* Simulated messages */}
                  </div>
                  <div className="p-4 border-t-[3px] border-slate-800 bg-slate-900">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="w-full bg-black border-2 border-slate-700 p-3 text-xs font-bold focus:outline-none focus:border-sky-500 transition-colors placeholder-slate-600 text-white"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Control Bar (Only when joined) */}
      {joined && (
        <footer className="bg-black border-t-[3px] border-slate-800 p-4 z-20 shadow-[0px_-4px_20px_rgba(0,0,0,0.5)]">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            
            <div className="hidden sm:flex text-xs font-black tracking-widest uppercase text-emerald-500">
              {formatTime(elapsedTime)}
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMicOn(!micOn)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border-[3px] ${micOn ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-white' : 'bg-red-500 border-red-600 text-white hover:bg-red-600'}`}
              >
                {micOn ? <Mic size={24} /> : <MicOff size={24} />}
              </button>
              
              <button 
                onClick={() => setVideoOn(!videoOn)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border-[3px] ${videoOn ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-white' : 'bg-red-500 border-red-600 text-white hover:bg-red-600'}`}
              >
                {videoOn ? <Video size={24} /> : <VideoOff size={24} />}
              </button>

              <button className="w-14 h-14 rounded-full flex items-center justify-center bg-slate-800 border-[3px] border-slate-700 hover:bg-slate-700 transition-all text-white hidden sm:flex">
                <MonitorUp size={24} />
              </button>

              <button 
                onClick={() => window.location.href = '/mentorship'}
                className="w-16 h-14 px-8 rounded-full flex items-center justify-center bg-red-600 border-[3px] border-red-700 hover:bg-red-700 transition-all text-white ml-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none"
              >
                <PhoneOff size={24} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-white transition-colors relative hidden sm:block">
                <Users size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-black"></span>
              </button>
              <button 
                onClick={() => setShowChat(!showChat)}
                className={`transition-colors p-2 rounded ${showChat ? 'bg-sky-500 text-black' : 'text-slate-400 hover:text-white'}`}
              >
                <MessageSquare size={20} />
              </button>
            </div>
            
          </div>
        </footer>
      )}
    </div>
  );
}
