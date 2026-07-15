'use client';
import React, { useState } from 'react';
import { Copy, Check, Linkedin, Twitter, Mail, Link } from 'lucide-react';
import Modal from '../../ui/Modal';

export default function ShareJob({ job, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!job) return null;

  const url = typeof window !== 'undefined' ? `${window.location.origin}/jobs/${job.slug}` : '';
  const text = `Check out this ${job.role} position at ${job.company}!`;

  const shareLinks = [
    {
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      action: () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      color: 'hover:bg-sky-50',
    },
    {
      name: 'WhatsApp',
      icon: Link,
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank'),
      color: 'hover:bg-emerald-50',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      action: () => window.open(`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank'),
      color: 'hover:bg-blue-50',
    },
    {
      name: 'X',
      icon: Twitter,
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank'),
      color: 'hover:bg-slate-50',
    },
    {
      name: 'Email',
      icon: Mail,
      action: () => window.open(`mailto:?subject=${encodeURIComponent(`Job Opportunity: ${job.role} at ${job.company}`)}&body=${encodeURIComponent(text + '\n\n' + url)}`),
      color: 'hover:bg-amber-50',
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share this Job" size="sm">
      <div className="space-y-3">
        <p className="text-xs font-bold text-slate-500 mb-4">
          Share <span className="text-black">{job.role}</span> at {job.company}
        </p>
        {shareLinks.map(({ name, icon: Icon, action, color }) => (
          <button
            key={name}
            onClick={action}
            className={`w-full flex items-center gap-3 px-4 py-3 border-2 border-black text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${color}`}
          >
            <Icon size={16} />
            {name}
          </button>
        ))}
      </div>
    </Modal>
  );
}
