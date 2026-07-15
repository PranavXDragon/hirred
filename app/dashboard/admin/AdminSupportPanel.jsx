"use client";

import React, { useState, useEffect } from 'react';
import { Mail, Check, Trash2, ShieldAlert } from 'lucide-react';
import { getAllContactMessages, updateContactMessageStatus, deleteContactMessage } from '../../../lib/actions/admin';

export default function AdminSupportPanel({ showAlert }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const data = await getAllContactMessages();
      setMessages(data || []);
    } catch (error) {
      console.error("Failed to fetch support messages:", error);
      if (showAlert) showAlert("Error fetching messages.");
    }
    setIsLoading(false);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setActionId(id);
    try {
      await updateContactMessageStatus(id, newStatus);
      setMessages(messages.map(msg => msg.id === id ? { ...msg, status: newStatus } : msg));
      if (showAlert) showAlert(`Message marked as ${newStatus}.`);
    } catch (error) {
      if (showAlert) showAlert("Failed to update status.");
    }
    setActionId(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    setActionId(id);
    try {
      await deleteContactMessage(id);
      setMessages(messages.filter(msg => msg.id !== id));
      if (showAlert) showAlert("Message deleted successfully.");
    } catch (error) {
      if (showAlert) showAlert("Failed to delete message.");
    }
    setActionId(null);
  };

  return (
    <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
      <div className="p-6 border-b-4 border-black bg-slate-50 flex items-center justify-between">
        <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
          <Mail size={24} className="text-emerald-500" /> Contact Requests
        </h3>
        <span className="text-xs font-black uppercase tracking-widest bg-black text-white px-3 py-1">
          {messages.length} Messages
        </span>
      </div>
      
      <div className="p-6">
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="py-16 text-center border-4 border-dashed border-slate-300">
            <ShieldAlert size={48} className="mx-auto text-slate-300 mb-4" />
            <h4 className="text-xl font-black uppercase text-slate-400">No Pending Inquiries</h4>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inbox is clear.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`border-4 border-black p-5 relative transition-all
                ${msg.status === 'resolved' ? 'bg-slate-50 opacity-75' : 'bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'}`}>
                
                {/* Status Badge */}
                <div className="absolute top-0 right-5 -translate-y-1/2">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-black
                    ${msg.status === 'resolved' ? 'bg-emerald-400 text-black' : 'bg-rose-500 text-white'}`}>
                    {msg.status || 'pending'}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-4">
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Requester Identity</p>
                    <h4 className="font-black uppercase tracking-tight text-lg leading-tight">{msg.name}</h4>
                    <a href={`mailto:${msg.email}`} className="text-sky-600 hover:underline text-xs font-bold tracking-widest">{msg.email}</a>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Timestamp</p>
                    <p className="text-xs font-bold text-black uppercase tracking-widest">{new Date(msg.created_at).toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-slate-100 p-4 border-2 border-black mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Message Body</p>
                  <p className="font-medium text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t-2 border-slate-200">
                  {msg.status !== 'resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(msg.id, 'resolved')}
                      disabled={actionId === msg.id}
                      className="flex items-center gap-2 bg-black text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all border-2 border-black disabled:opacity-50"
                    >
                      <Check size={14} /> Resolve Ticket
                    </button>
                  )}
                  {msg.status === 'resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(msg.id, 'pending')}
                      disabled={actionId === msg.id}
                      className="flex items-center gap-2 bg-white text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all border-2 border-black disabled:opacity-50"
                    >
                      Reopen Ticket
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(msg.id)}
                    disabled={actionId === msg.id}
                    className="flex items-center gap-2 bg-white text-rose-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all border-2 border-black ml-auto disabled:opacity-50"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
