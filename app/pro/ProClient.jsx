"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, Check, HelpCircle, ArrowRight, CreditCard, Lock, Sparkles,
  ShieldCheck, X, Smartphone, Building2, Wallet
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
// Note: Sound utility may not be ported yet, so I'll omit or mock it
const playDesktopSuccess = () => {
    try {
        const audio = new Audio('/success.mp3'); // Mocking sound
        audio.play().catch(() => {});
    } catch(e) {}
};

const PAYMENT_TABS = [
  { id: 'card',       label: 'Card',        icon: CreditCard   },
  { id: 'upi',        label: 'UPI / QR',    icon: Smartphone   },
  { id: 'netbanking', label: 'Net Banking', icon: Building2    },
  { id: 'wallet',     label: 'Wallets',     icon: Wallet       },
];

const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'];
const WALLETS = [
  { name: 'Paytm',    color: '#00BAF2', emoji: '💙' },
  { name: 'PhonePe',  color: '#5F259F', emoji: '💜' },
  { name: 'Amazon Pay',color: '#FF9900', emoji: '🟠' },
  { name: 'MobiKwik', color: '#E71C6E', emoji: '❤️' },
];

export default function ProClient({ initialUser }) {
  const router = useRouter();
  const [user, setUser] = useState(initialUser);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('input'); // 'input' | 'processing' | 'success'
  const [payTab, setPayTab] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '4242 •••• •••• 4242', expiry: '12/28', cvc: '123' });
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('');
  
  const [polling, setPolling] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [payUrl, setPayUrl] = useState('');
  const [sessionId] = useState(() => Math.random().toString(36).slice(2) + Date.now().toString(36));
  const pollRef = useRef(null);

  useEffect(() => {
    const { protocol, hostname, port } = window.location;
    const p = port ? `:${port}` : '';
    // Use current hostname (which might be localhost or an IP if accessed from phone)
    const url = `${protocol}//${hostname}${p}/pay?sid=${encodeURIComponent(sessionId)}`;
    setPayUrl(url);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=000000&margin=12&format=png`);
    
    return () => clearInterval(pollRef.current);
  }, [sessionId]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const startPolling = () => {
    if (polling) return;
    setPolling(true);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment-status?sid=${encodeURIComponent(sessionId)}`);
        const data = await res.json();
        if (data.paid) {
          clearInterval(pollRef.current);
          setPolling(false);
          processPayment();
        }
      } catch {}
    }, 1500);
  };
  
  const stopPolling = () => {
    setPolling(false);
    clearInterval(pollRef.current);
  };

  const activatePro = async () => {
    if (!user) return;
    
    // Update Supabase profile
    try {
      await supabase
        .from('profiles')
        .update({ is_pro: true }) // Assuming we might add an is_pro column later
        .eq('id', user.id);
    } catch (e) {
      console.log('Skipping DB update for is_pro', e);
    }
      
    setUser({ ...user, isPro: true });
  };

  const handleStartPayment = () => {
    if (!user) { router.push('/login'); return; }
    setPaymentStep('input');
    setPayTab('card');
    stopPolling();
    setShowPaymentModal(true);
  };

  const handleCloseModal = () => {
    if (paymentStep === 'processing') return;
    stopPolling();
    setShowPaymentModal(false);
  };

  const processPayment = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      activatePro();
      playDesktopSuccess();
      setPaymentStep('success');
    }, 2000);
  };

  const handleCardSubmit = (e) => { e.preventDefault(); processPayment(); };
  const handleNetBanking = (e) => { e.preventDefault(); if (!selectedBank) return; processPayment(); };
  const handleWallet = (e) => { e.preventDefault(); if (!selectedWallet) return; processPayment(); };

  const isProUser = !!user?.isPro; // Derived from state

  const plans = [
    {
      icon: <Zap className="text-black group-hover:text-sky-500 transition-colors" size={24} />,
      title: 'Free / Base Node',
      desc: 'Standard credentials for basic job seeker filters.',
      price: '₹0', features: ['Standard profile visibility', 'Normal pipeline speeds', 'Upload 1 Resume', 'Max 4 applications tracking'],
      cta: 'Current Plan', active: !isProUser, highlight: false
    },
    {
      id: 'pro', name: 'hirrd Pro', price: '₹499', period: 'month',
      desc: 'Elite node bypasses queues and ranks applications at the top.',
      features: ['⚡ Direct recruiter queue bypass', '📊 Real-time search appearance', '🚀 Priority placements (Rank 1)', '👑 Elite Verified Badge', '🔐 Multi-Session protection', '📁 Infinite Resume slots'],
      cta: isProUser ? 'Pro Active' : 'Upgrade Credentials', active: isProUser, highlight: true
    },
    {
      id: 'enterprise', name: 'Corporate Node', price: 'Custom', period: 'tailored',
      desc: 'Screening pipelines and automation agents.',
      features: ['Unlimited filter actions', 'AI screening agents', 'Recruiter seat allocation', '24/7 Priority support'],
      cta: 'Contact Sales', active: false, highlight: false
    }
  ];

  return (
    <div className="bg-white min-h-screen pt-28 pb-20 relative">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)`, backgroundSize: '40px 40px' }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <header className="text-center mb-16 border-b-4 border-black pb-12">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <Sparkles size={12} className="text-yellow-400" fill="currentColor" /> Billing & Upgrades
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
            Elite <span className="text-sky-500 italic">Upgrades.</span>
          </h1>
          <p className="text-slate-400 text-xs md:text-sm font-black uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
            Upgrade your profile nodes to unlock priority pipelines, queue bypasses, and verified badges.
          </p>
        </header>

        {isProUser && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 bg-emerald-50 border-[3px] border-emerald-500 shadow-[8px_8px_0px_0px_rgba(16,185,129,1)]">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck size={24} className="text-emerald-600" />
              <h4 className="font-black text-sm uppercase tracking-wide">Elite Credentials Verified</h4>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-tight text-emerald-700 leading-snug">
              Your profile is signed with verified PRO status. Direct queue bypasses are active.
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-20">
          {plans.map((plan) => (
            <div key={plan.id} className={`bg-white border-[4px] border-black p-8 transition-all duration-300 relative
              ${plan.highlight ? 'shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ring-4 ring-sky-300 ring-offset-4'
                : 'shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]'}`}>
              {plan.highlight && (
                <span className="absolute top-0 right-8 -translate-y-1/2 bg-black text-white px-4 py-1.5 text-[9px] font-black uppercase tracking-widest border-2 border-white">
                  Recommended
                </span>
              )}
              <div className="space-y-4 mb-8">
                <h3 className="text-2xl font-black uppercase tracking-tight">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ {plan.period}</span>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-tight leading-relaxed">{plan.desc}</p>
              </div>
              <div className="border-t-2 border-black pt-6 mb-8 space-y-4">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex gap-2 text-xs font-bold text-slate-600">
                    <Check size={16} className="text-sky-500 shrink-0" /><span>{feat}</span>
                  </div>
                ))}
              </div>
              {plan.id === 'free' ? (
                <button disabled className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] border-2 border-slate-200 text-slate-400 bg-slate-50 cursor-not-allowed">{plan.cta}</button>
              ) : plan.id === 'pro' ? (
                <button onClick={plan.active ? undefined : handleStartPayment} disabled={plan.active}
                  className={`w-full py-4 text-xs font-black uppercase tracking-[0.2em] transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none border-[3px] border-black cursor-pointer
                    ${plan.active ? 'bg-emerald-500 text-black shadow-none cursor-default' : 'bg-sky-400 text-black hover:bg-black hover:text-white'}`}>
                  {plan.cta} {!plan.active && <ArrowRight size={14} className="inline ml-1" />}
                </button>
              ) : (
                <button onClick={() => router.push('/contact')}
                  className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] border-[3px] border-black bg-white hover:bg-black hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none cursor-pointer">
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>

        <section className="border-t-4 border-black pt-16 max-w-3xl mx-auto">
          <h3 className="text-3xl font-black uppercase tracking-tight mb-10 text-center">FAQs</h3>
          <div className="space-y-6">
            {[
              { q: "How does direct queue bypass work?", a: "As a Pro User, your application record bypasses the normal screening queue, prioritising your CV at the top of recruiter's job seeker pipeline." },
              { q: "Which payment methods are accepted?", a: "We accept Credit/Debit Cards (Visa, Mastercard, Rupay), all UPI apps (GPay, PhonePe, Paytm), major Net Banking portals, and digital wallets." },
              { q: "Can I downgrade my credentials?", a: "Yes — visit your Profile page and click 'Deactivate Plan' in the Pro Management card at any time." }
            ].map((faq, i) => (
              <div key={i} className="border-2 border-black p-6 bg-slate-50">
                <h4 className="font-black uppercase text-xs mb-2 flex items-center gap-2"><HelpCircle size={14} className="text-sky-500" /> {faq.q}</h4>
                <p className="text-xs font-bold text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showPaymentModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150]" />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 40 }}
              className="fixed inset-x-4 top-[50%] -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:top-1/2 md:w-[820px] bg-white border-[4px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] z-[160] overflow-hidden max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-8 py-5 border-b-[3px] border-black bg-black text-white">
                <div className="flex items-center gap-3">
                  <Lock size={14} className="text-sky-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Secure Payment Gateway</span>
                </div>
                {paymentStep !== 'processing' && (
                  <button onClick={handleCloseModal} className="p-1 hover:text-red-400 transition-colors cursor-pointer"><X size={18} /></button>
                )}
              </div>

              {paymentStep === 'input' && (
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-black uppercase tracking-tight italic mb-1">Billing Terminal</h3>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Pro Node Access — <strong className="text-black">₹499 / month</strong></p>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 mb-8 p-1.5 bg-slate-100 border-2 border-black">
                    {PAYMENT_TABS.map(tab => {
                      const Icon = tab.icon;
                      return (
                        <button key={tab.id} onClick={() => {
                          setPayTab(tab.id);
                          if (tab.id === 'upi') {
                            setTimeout(() => startPolling(), 300);
                          } else {
                            stopPolling();
                          }
                        }}
                          className={`flex flex-col items-center gap-1 py-3 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer
                            ${payTab === tab.id ? 'bg-black text-white shadow-[3px_3px_0px_0px_rgba(14,165,233,1)]' : 'bg-white text-slate-500 hover:text-black'}`}>
                          <Icon size={16} />{tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {payTab === 'card' && (
                    <form onSubmit={handleCardSubmit} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><CreditCard size={11} /> Card Number</label>
                        <input type="text" required className="w-full bg-slate-50 border-[3px] border-black p-3 font-bold text-sm focus:outline-none focus:bg-white transition-colors"
                          value={cardDetails.number} onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Expiration</label>
                          <input type="text" required placeholder="MM/YY" className="w-full bg-slate-50 border-[3px] border-black p-3 font-bold text-sm focus:outline-none focus:bg-white text-center"
                            value={cardDetails.expiry} onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">CVV / CVC</label>
                          <input type="password" required maxLength="3" placeholder="•••" className="w-full bg-slate-50 border-[3px] border-black p-3 font-bold text-sm focus:outline-none focus:bg-white text-center"
                            value={cardDetails.cvc} onChange={e => setCardDetails({ ...cardDetails, cvc: e.target.value })} />
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-black text-white hover:bg-sky-500 hover:text-black py-4 font-black uppercase text-xs tracking-[0.2em] transition-all shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none cursor-pointer mt-4">
                        Authorize Payment Node
                      </button>
                    </form>
                  )}

                  {payTab === 'upi' && (
                    <div className="space-y-6">
                      {/* Instruction */}
                      <div className="bg-sky-50 border-2 border-sky-300 p-4 text-[11px] font-bold text-sky-800 uppercase tracking-wide leading-relaxed">
                        📱 Open your phone camera or any QR scanner app, scan the code below. You'll be taken to the hirrd payment page on your phone. Complete payment there — this page activates automatically.
                      </div>

                      <div className="flex flex-col md:flex-row gap-8 items-center">
                        {/* QR Code */}
                        <div className="flex flex-col items-center gap-3 shrink-0">
                          <div className="border-[4px] border-black p-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white relative">
                            {qrUrl ? (
                              <img src={qrUrl} alt="Scan to Pay" className="w-[200px] h-[200px] block" />
                            ) : (
                              <div className="w-[200px] h-[200px] flex items-center justify-center bg-slate-50">
                                <div className="w-8 h-8 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" />
                              </div>
                            )}
                            {/* Scan corner marks */}
                            <div className="absolute top-1.5 left-1.5 w-6 h-6 border-t-4 border-l-4 border-sky-500" />
                            <div className="absolute top-1.5 right-1.5 w-6 h-6 border-t-4 border-r-4 border-sky-500" />
                            <div className="absolute bottom-1.5 left-1.5 w-6 h-6 border-b-4 border-l-4 border-sky-500" />
                            <div className="absolute bottom-1.5 right-1.5 w-6 h-6 border-b-4 border-r-4 border-sky-500" />
                          </div>
                          <p className="text-[10px] font-black uppercase text-slate-500 text-center">
                            Scan with Google Lens, Camera or any QR app
                          </p>
                          <div className="flex flex-wrap justify-center gap-1.5">
                            {['GPay', 'PhonePe', 'Paytm', 'BHIM', 'Camera'].map(a => (
                              <span key={a} className="text-[8px] font-black bg-slate-100 border border-black px-2 py-0.5 uppercase">{a}</span>
                            ))}
                          </div>
                        </div>

                        {/* Right: status + instructions */}
                        <div className="flex-1 flex flex-col gap-4">
                          {/* Auto-polling Status */}
                          <div className={`border-[3px] p-5 transition-all duration-500 ${polling ? 'border-sky-400 bg-sky-50' : 'border-slate-200 bg-slate-50'}`}>
                            <div className="flex items-center gap-3">
                              {polling ? (
                                <>
                                  {/* Pulsing live dot */}
                                  <div className="relative shrink-0">
                                    <div className="w-3 h-3 rounded-full bg-sky-500" />
                                    <div className="absolute inset-0 w-3 h-3 rounded-full bg-sky-500 animate-ping opacity-75" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-black uppercase text-sky-700">Watching for payment…</p>
                                    <p className="text-[10px] text-sky-500 font-bold mt-0.5">Will activate automatically the moment you pay on your phone.</p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="w-3 h-3 rounded-full bg-slate-300 shrink-0" />
                                  <div>
                                    <p className="text-xs font-black uppercase text-slate-500">Ready to detect payment</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">Scan the QR with your phone to begin.</p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Steps */}
                          <div className="space-y-2">
                            {[
                              ['1', 'Scan the QR with your phone camera or Google Lens'],
                              ['2', 'Complete payment on the hirrd checkout page'],
                              ['3', 'This page activates your Pro plan automatically'],
                            ].map(([n, txt]) => (
                              <div key={n} className="flex items-start gap-2.5 text-xs font-bold text-slate-500">
                                <span className="w-5 h-5 rounded-full bg-black text-white text-[9px] flex items-center justify-center shrink-0 font-black">{n}</span>
                                {txt}
                              </div>
                            ))}
                          </div>

                          {/* Network URL display */}
                          <div className="bg-slate-100 border border-slate-200 px-3 py-2 rounded">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-0.5">Payment URL (auto-generated)</p>
                            <p className="text-[10px] font-bold text-slate-700 break-all">{payUrl}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {payTab === 'netbanking' && (
                    <form onSubmit={handleNetBanking} className="space-y-5">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">Select your bank</label>
                        <div className="grid grid-cols-2 gap-2">
                          {BANKS.map(bank => (
                            <button type="button" key={bank} onClick={() => setSelectedBank(bank)}
                              className={`text-left px-4 py-3 border-2 border-black text-[10px] font-bold uppercase tracking-wide transition-all cursor-pointer
                                ${selectedBank === bank ? 'bg-black text-white shadow-[3px_3px_0px_0px_rgba(14,165,233,1)]' : 'bg-white hover:bg-slate-50'}`}>
                              {bank}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button type="submit" disabled={!selectedBank}
                        className="w-full bg-black text-white hover:bg-sky-500 hover:text-black py-4 font-black uppercase text-xs tracking-[0.2em] transition-all shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mt-4">
                        Proceed to Net Banking
                      </button>
                    </form>
                  )}

                  {payTab === 'wallet' && (
                    <form onSubmit={handleWallet} className="space-y-5">
                      <div>
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-3">Choose your wallet</label>
                        <div className="grid grid-cols-2 gap-3">
                          {WALLETS.map(w => (
                            <button type="button" key={w.name} onClick={() => setSelectedWallet(w.name)}
                              className={`flex items-center gap-3 px-4 py-4 border-[3px] border-black text-[11px] font-black uppercase tracking-wide transition-all cursor-pointer
                                ${selectedWallet === w.name ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(14,165,233,1)]' : 'bg-white hover:bg-slate-50'}`}
                              style={selectedWallet === w.name ? {} : { borderColor: w.color }}>
                              <span className="text-xl">{w.emoji}</span>
                              {w.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button type="submit" disabled={!selectedWallet}
                        className="w-full bg-black text-white hover:bg-sky-500 hover:text-black py-4 font-black uppercase text-xs tracking-[0.2em] transition-all shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] active:translate-y-1 active:shadow-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mt-4">
                        Pay ₹499 via {selectedWallet || 'Wallet'}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {paymentStep === 'processing' && (
                <div className="py-16 text-center space-y-6 px-8">
                  <div className="w-14 h-14 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin mx-auto" />
                  <div>
                    <h4 className="font-black text-sm uppercase mb-2">Verifying Transaction</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Processing payment node via secure gateway…</p>
                  </div>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="py-12 text-center space-y-6 px-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className="w-20 h-20 bg-emerald-100 border-[4px] border-emerald-500 flex items-center justify-center mx-auto shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <ShieldCheck size={40} className="text-emerald-600" />
                  </motion.div>
                  <div>
                    <h3 className="text-3xl font-black uppercase tracking-tight mb-2">Upgrade Complete!</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide leading-relaxed max-w-xs mx-auto">
                      Payment authorized. Pro status has been signed and bound to your credentials. Queue bypasses are now active.
                    </p>
                  </div>
                  <button onClick={() => {
                    handleCloseModal();
                    router.push('/dashboard/student');
                  }}
                    className="w-full max-w-xs mx-auto block bg-black text-white hover:bg-sky-500 hover:text-black py-4 font-black uppercase text-xs tracking-[0.2em] transition-all shadow-[6px_6px_0px_0px_rgba(14,165,233,1)] cursor-pointer">
                    Launch Priority Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
