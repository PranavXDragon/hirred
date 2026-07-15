"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, MoreVertical, Compass, ShieldCheck } from 'lucide-react';
import { createClient } from '../../../../lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function ChatClient({ initialUser, mentor }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();

    // Subscribe to realtime messages
    const channel = supabase
      .channel('realtime:messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `sender_id=eq.${mentor.id}`,
      }, (payload) => {
        if (payload.new.receiver_id === initialUser.id) {
          setMessages(prev => [...prev, payload.new]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    // Fetch conversation between this user and the mentor
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${initialUser.id},receiver_id.eq.${mentor.id}),and(sender_id.eq.${mentor.id},receiver_id.eq.${initialUser.id})`)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msgText = newMessage.trim();
    setNewMessage(''); // optimistic clear

    // Optimistic UI update
    const optimisticMsg = {
      id: Math.random().toString(),
      sender_id: initialUser.id,
      receiver_id: mentor.id,
      content: msgText,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);

    const { error } = await supabase
      .from('messages')
      .insert([{
        sender_id: initialUser.id,
        receiver_id: mentor.id,
        content: msgText
      }]);

    if (error) {
      console.error("Error sending message:", error);
      // In a real app we'd handle failure here
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-10">
      <div className="max-w-4xl mx-auto px-6">
        
        <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-sky-500 transition-colors mb-6">
          <ArrowLeft size={14} /> Back to Directory
        </button>

        <div className="bg-white border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col h-[75vh]">
          
          {/* Chat Header */}
          <div className="bg-emerald-50 border-b-[4px] border-black p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-200 border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="font-black text-emerald-800 text-lg">{mentor.name.charAt(0)}</span>
              </div>
              <div>
                <h2 className="font-black uppercase tracking-tight text-lg flex items-center gap-2">
                  {mentor.name} 
                  <ShieldCheck size={16} className="text-emerald-500" />
                </h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{mentor.role} @ {mentor.company}</p>
              </div>
            </div>
            <div className="hidden sm:flex gap-2">
              <span className="bg-black text-white px-3 py-1 text-[9px] font-black uppercase tracking-widest border border-black">Rate: {mentor.rate}/Session</span>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
            <div className="text-center">
              <span className="bg-slate-200 text-slate-500 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full">
                Conversation Started
              </span>
            </div>

            {loading ? (
              <div className="text-center text-xs font-bold uppercase text-slate-400 py-10">Syncing secure connection...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-20">
                <Compass size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-2">No messages yet</p>
                <p className="text-[10px] font-bold text-slate-400 max-w-xs mx-auto">Send a message to discuss availability or ask preliminary questions before booking your 1-on-1 session.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === initialUser.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isMe ? 'bg-sky-50 rounded-tl-xl rounded-tr-xl rounded-bl-xl' : 'bg-white rounded-tl-xl rounded-tr-xl rounded-br-xl'}`}>
                      <p className="text-sm font-bold leading-relaxed">{msg.content}</p>
                      <p className="text-[9px] font-black text-slate-400 mt-2 text-right uppercase tracking-wider">
                        {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t-[4px] border-black p-4 bg-white shrink-0">
            <form onSubmit={handleSend} className="flex gap-4">
              <input 
                type="text" 
                placeholder="Type your message..." 
                className="flex-1 bg-slate-50 border-[3px] border-black p-4 font-bold text-sm focus:outline-none focus:bg-white transition-colors"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-black text-white px-8 font-black uppercase tracking-widest flex items-center gap-2 hover:bg-sky-500 hover:text-black transition-all border-2 border-black disabled:opacity-50 shadow-[4px_4px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none cursor-pointer"
              >
                Send <Send size={16} />
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
