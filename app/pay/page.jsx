'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Lock, ChevronRight, CheckCircle2, ArrowLeft, Smartphone } from 'lucide-react';

const AMOUNT = 499;
const MERCHANT = 'hirrd Pro';
const MERCHANT_VPA = 'hirrd@ybl';

// Extract session ID from URL — e.g. /pay?sid=abc123
const getSid = () => typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('sid') || '' : '';

// Signal desktop that payment is done
const signalPaymentDone = async (sid) => {
  if (!sid) return;
  try {
    const { protocol, hostname, port } = window.location;
    const p = port ? `:${port}` : '';
    await fetch(`${protocol}//${hostname}${p}/api/payment-done?sid=${encodeURIComponent(sid)}`, {
      method: 'POST',
    });
  } catch (e) {
    console.warn('Could not signal payment done:', e);
  }
};

const MobilePayPage = () => {
  const [step, setStep] = useState('home'); 
  // home | upi | card | processing | success
  const [upiId, setUpiId] = useState('');
  const [upiError, setUpiError] = useState('');
  const [pin, setPin] = useState('');
  const [pinStep, setPinStep] = useState(false); // show PIN pad
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [txnId] = useState(() => 'TXN' + Math.floor(Math.random() * 9000000 + 1000000));
  const [selectedApp, setSelectedApp] = useState(null);
  const [sid] = useState(getSid);

  // When payment succeeds, signal the desktop via the Vite server
  const markPaid = () => {
    signalPaymentDone(sid);
  };

  const simulate = () => {
    setStep('processing');
    setTimeout(() => { markPaid(); playPhoneSuccess(); setStep('success'); }, 2200);
  };

  const handleUpiContinue = (e) => {
    e.preventDefault();
    if (!upiId.includes('@')) { setUpiError('Enter a valid UPI ID (e.g. name@upi)'); return; }
    setUpiError('');
    setPinStep(true);
  };

  const handlePinKey = (k) => {
    if (k === 'back') { setPin(p => p.slice(0, -1)); return; }
    if (pin.length >= 6) return;
    const next = pin + k;
    setPin(next);
    if (next.length === 6) setTimeout(() => simulate(), 400);
  };

  const handleCardPay = (e) => {
    e.preventDefault();
    simulate();
  };

  const UpiApps = [
    { name: 'Google Pay',  color: '#1a73e8', icon: '🔵', shortName: 'GPay'    },
    { name: 'PhonePe',     color: '#5F259F', icon: '💜', shortName: 'PhonePe' },
    { name: 'Paytm',       color: '#00BAF2', icon: '💙', shortName: 'Paytm'   },
    { name: 'BHIM',        color: '#00529B', icon: '🏦', shortName: 'BHIM'    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col" style={{ fontFamily: "'Inter', sans-serif", maxWidth: 480, margin: '0 auto' }}>
      
      {/* ── Top Bar ── */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-sm">
        {step !== 'home' && step !== 'success' && (
          <button onClick={() => { setStep('home'); setPinStep(false); setPin(''); setSelectedApp(null); }}
            className="p-1 -ml-1 text-slate-500"><ArrowLeft size={20} /></button>
        )}
        <div className="flex-1">
          <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest leading-none">Checkout</p>
          <p className="text-sm font-black text-slate-900">{MERCHANT}</p>
        </div>
        <div className="flex items-center gap-1 text-emerald-600">
          <Lock size={12} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Secure</span>
        </div>
      </div>

      {/* ── Amount Banner ── */}
      {step !== 'success' && (
        <div className="bg-white mx-4 mt-4 rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold mb-0.5">Total Amount</p>
            <p className="text-3xl font-black text-slate-900">₹{AMOUNT}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">hirrd Pro · Monthly Plan</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center text-2xl shadow">⚡</div>
        </div>
      )}

      <div className="flex-1 px-4 pb-8">

        {/* ══════════════════ HOME ══════════════════ */}
        {step === 'home' && (
          <div className="mt-4 space-y-3">
            {/* UPI Apps */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-4 pt-4 pb-2">Pay via UPI App</p>
              {UpiApps.map((app, i) => (
                <button key={app.name} onClick={() => { setSelectedApp(app); setStep('upi'); }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors ${i < UpiApps.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <span className="text-2xl">{app.icon}</span>
                  <span className="flex-1 text-sm font-bold text-slate-800">{app.name}</span>
                  <ChevronRight size={16} className="text-slate-300" />
                </button>
              ))}
            </div>

            {/* UPI ID */}
            <button onClick={() => { setSelectedApp(null); setStep('upi'); }}
              className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-4 flex items-center gap-4 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left">
              <span className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-lg">📱</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">UPI ID / VPA</p>
                <p className="text-[11px] text-slate-400">Enter any UPI ID</p>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </button>

            {/* Card */}
            <button onClick={() => setStep('card')}
              className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-4 flex items-center gap-4 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left">
              <span className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-lg">💳</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">Credit / Debit Card</p>
                <p className="text-[11px] text-slate-400">Visa, Mastercard, RuPay</p>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </button>
          </div>
        )}

        {/* ══════════════════ UPI ══════════════════ */}
        {step === 'upi' && !pinStep && (
          <form onSubmit={handleUpiContinue} className="mt-4 space-y-4">
            {selectedApp && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-4 flex items-center gap-3">
                <span className="text-2xl">{selectedApp.icon}</span>
                <div>
                  <p className="text-sm font-black">{selectedApp.name}</p>
                  <p className="text-[11px] text-slate-400">Enter your {selectedApp.shortName} registered UPI ID</p>
                </div>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <label className="block px-4 pt-4 text-[11px] font-black uppercase text-slate-400 tracking-widest">UPI ID / VPA</label>
              <input
                type="text"
                autoFocus
                placeholder="yourname@upi"
                value={upiId}
                onChange={e => { setUpiId(e.target.value); setUpiError(''); }}
                className="w-full px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none bg-transparent placeholder-slate-300"
              />
              {upiError && <p className="px-4 pb-3 text-xs text-red-500 font-semibold">{upiError}</p>}
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              Paying to: <span className="font-bold text-slate-700">{MERCHANT_VPA}</span>
            </p>
            <button type="submit"
              className="w-full bg-sky-500 text-white rounded-2xl py-4 font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-transform">
              Verify &amp; Pay ₹{AMOUNT}
            </button>
          </form>
        )}

        {/* UPI PIN Pad */}
        {step === 'upi' && pinStep && (
          <div className="mt-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center mb-4">
              <p className="text-xs text-slate-400 font-semibold mb-1">Paying</p>
              <p className="text-2xl font-black mb-1">₹{AMOUNT}</p>
              <p className="text-[11px] text-slate-400">to {MERCHANT} • {upiId}</p>
              <div className="flex justify-center gap-3 mt-5">
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} className={`w-3 h-3 rounded-full transition-all ${i < pin.length ? 'bg-sky-500 scale-110' : 'bg-slate-200'}`} />
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-3">Enter your 6-digit UPI PIN</p>
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-3">
              {['1','2','3','4','5','6','7','8','9','','0','back'].map((k, i) => (
                <button key={i} onClick={() => k && handlePinKey(k)}
                  disabled={!k}
                  className={`h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all active:scale-90
                    ${k === 'back' ? 'bg-slate-200 text-slate-600 text-sm' : k ? 'bg-white shadow-sm border border-slate-100 text-slate-900 hover:bg-slate-50' : 'bg-transparent'}`}>
                  {k === 'back' ? '⌫' : k}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════ CARD ══════════════════ */}
        {step === 'card' && (
          <form onSubmit={handleCardPay} className="mt-4 space-y-3">
            {[
              { label: 'Cardholder Name', value: name, set: setName, type: 'text', ph: 'Full Name on Card' },
              { label: 'Card Number', value: cardNum, set: setCardNum, type: 'tel', ph: '1234 5678 9012 3456', max: 19 },
            ].map(f => (
              <div key={f.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <label className="block px-4 pt-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">{f.label}</label>
                <input type={f.type} required placeholder={f.ph} value={f.value}
                  onChange={e => f.set(e.target.value)} maxLength={f.max}
                  className="w-full px-4 py-2.5 pb-3 text-sm font-semibold text-slate-900 focus:outline-none bg-transparent placeholder-slate-300" />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Expiry', value: expiry, set: setExpiry, ph: 'MM / YY', max: 7 },
                { label: 'CVV', value: cvv, set: setCvv, ph: '•••', max: 3, type: 'password' },
              ].map(f => (
                <div key={f.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <label className="block px-3 pt-3 text-[10px] font-black uppercase text-slate-400 tracking-widest">{f.label}</label>
                  <input type={f.type || 'text'} required placeholder={f.ph} value={f.value}
                    onChange={e => f.set(e.target.value)} maxLength={f.max}
                    className="w-full px-3 py-2.5 pb-3 text-sm font-semibold text-slate-900 focus:outline-none bg-transparent placeholder-slate-300 text-center" />
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-3 py-2">
              {['Visa','Mastercard','RuPay','Amex'].map(b => (
                <span key={b} className="text-[10px] font-bold text-slate-400 border border-slate-200 px-2 py-0.5 rounded">{b}</span>
              ))}
            </div>
            <button type="submit"
              className="w-full bg-sky-500 text-white rounded-2xl py-4 font-black text-sm uppercase tracking-wider shadow-lg active:scale-95 transition-transform">
              Pay ₹{AMOUNT} Securely
            </button>
          </form>
        )}

        {/* ══════════════════ PROCESSING ══════════════════ */}
        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-20 gap-5">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin" />
            <div className="text-center">
              <p className="font-black text-slate-800 uppercase tracking-wide text-sm">Processing Payment</p>
              <p className="text-xs text-slate-400 mt-1">Please do not press back…</p>
            </div>
          </div>
        )}

        {/* ══════════════════ SUCCESS ══════════════════ */}
        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-10 gap-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center border-4 border-emerald-500">
              <CheckCircle2 size={48} className="text-emerald-600" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center">
              <p className="text-2xl font-black text-emerald-700 uppercase tracking-tight">Payment Successful!</p>
              <p className="text-sm text-slate-500 mt-1">₹{AMOUNT} paid to {MERCHANT}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3">
              {[
                ['Transaction ID', txnId],
                ['Amount',         `₹${AMOUNT}`],
                ['Merchant',       MERCHANT],
                ['Status',         '✅ Success'],
                ['Date',           new Date().toLocaleString('en-IN')],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between items-center text-sm">
                  <span className="text-slate-400 font-semibold">{k}</span>
                  <span className="font-black text-slate-800">{v}</span>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="w-full bg-sky-50 rounded-2xl border border-sky-200 p-4 text-center">
              <p className="text-xs text-sky-700 font-bold">
                ✅ Return to your desktop browser — your <strong>hirrd Pro</strong> plan is now being activated!
              </p>
            </motion.div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="py-4 text-center border-t border-slate-200 bg-white">
        <div className="flex items-center justify-center gap-1.5 text-slate-400">
          <Lock size={11} />
          <span className="text-[10px] font-bold">Secured by hirrd Pay · 256-bit SSL</span>
        </div>
      </div>
    </div>
  );
};

export default MobilePayPage;
