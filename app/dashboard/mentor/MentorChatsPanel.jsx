"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Loader2, User } from 'lucide-react';
import { getMentorChats, sendMessage } from '../../../lib/actions/mentors';

export default function MentorChatsPanel({ user }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStudent, setActiveStudent] = useState(null);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchChats() {
      try {
        const data = await getMentorChats(user.id);
        setMessages(data || []);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchChats();
  }, [user.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeStudent]);

  // Aggregate students the mentor has chatted with
  const studentsMap = new Map();
  messages.forEach(msg => {
    if (msg.sender_id !== user.id) {
      studentsMap.set(msg.sender_id, msg.sender);
    }
    if (msg.receiver_id !== user.id && msg.receiver) {
      studentsMap.set(msg.receiver_id, msg.receiver);
    }
  });
  const studentsList = Array.from(studentsMap.entries()).map(([id, profile]) => ({ id, ...profile }));

  const activeMessages = messages.filter(
    msg => (msg.sender_id === activeStudent?.id && msg.receiver_id === user.id) ||
           (msg.sender_id === user.id && msg.receiver_id === activeStudent?.id)
  );

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeStudent) return;
    
    setSending(true);
    try {
      await sendMessage(activeStudent.id, inputText.trim());
      
      // Optimistically append message
      const newMsg = {
        id: Math.random().toString(),
        sender_id: user.id,
        receiver_id: activeStudent.id,
        content: inputText.trim(),
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, newMsg]);
      setInputText('');
    } catch (error) {
      console.error("Failed to send message:", error);
    }
    setSending(false);
  };

  if (loading) {
    return (
      <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12 flex justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col" style={{ height: '600px' }}>
      
      {/* Header */}
      <div className="p-4 border-b-4 border-black bg-slate-50 flex items-center gap-2 shrink-0">
        <MessageCircle size={24} className="text-emerald-500" />
        <h3 className="text-xl font-black uppercase tracking-tighter">Student Comms</h3>
      </div>
      
      <div className="flex flex-1 min-h-0 overflow-hidden">
        
        {/* Sidebar: Student List */}
        <div className="w-1/3 border-r-4 border-black bg-white overflow-y-auto">
          {studentsList.length === 0 ? (
            <div className="p-6 text-center text-slate-400 font-bold text-xs uppercase">
              No active conversations.
            </div>
          ) : (
            studentsList.map((student) => (
              <button
                key={student.id}
                onClick={() => setActiveStudent(student)}
                className={`w-full text-left p-4 border-b-2 border-black transition-colors flex items-center gap-3 ${activeStudent?.id === student.id ? 'bg-emerald-100 border-l-4 border-l-emerald-500' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
              >
                <div className="w-8 h-8 bg-slate-200 border-2 border-black flex items-center justify-center rounded-full shrink-0">
                  <User size={16} />
                </div>
                <div className="overflow-hidden">
                  <p className="font-black text-sm uppercase truncate">{student.full_name || 'Unknown'}</p>
                  <p className="text-[10px] text-slate-500 font-bold truncate">{student.email}</p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Chat Area */}
        <div className="w-2/3 bg-slate-50 flex flex-col relative">
          {!activeStudent ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <MessageCircle size={48} className="mb-4 opacity-50" />
              <p className="font-black uppercase tracking-widest text-sm">Select a conversation</p>
            </div>
          ) : (
            <>
              {/* Active Chat Header */}
              <div className="p-3 bg-white border-b-2 border-black font-black uppercase text-sm tracking-widest shrink-0 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> 
                {activeStudent.full_name}
              </div>
              
              {/* Messages Container */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeMessages.length === 0 ? (
                  <p className="text-center text-xs font-bold text-slate-400 mt-4 uppercase">Start the conversation</p>
                ) : (
                  activeMessages.map((msg) => {
                    const isMe = msg.sender_id === user.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] p-3 border-2 border-black ${isMe ? 'bg-emerald-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
                          <p className="text-sm font-medium">{msg.content}</p>
                          <p className="text-[9px] font-black uppercase text-black/60 tracking-widest mt-2 text-right">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              {/* Input Area */}
              <form onSubmit={handleSend} className="p-4 bg-white border-t-4 border-black shrink-0 flex gap-2">
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-slate-50 border-2 border-black px-4 py-2 text-sm font-bold focus:outline-none focus:bg-white"
                />
                <button 
                  type="submit"
                  disabled={sending || !inputText.trim()}
                  className="bg-black text-white p-2 border-2 border-black hover:bg-emerald-500 hover:text-black transition-colors disabled:opacity-50 shrink-0"
                >
                  <Send size={20} />
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
