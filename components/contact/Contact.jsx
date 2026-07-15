import React, { useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail, ArrowRight, Linkedin, Twitter, Instagram, Clock } from 'lucide-react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const fullMessage = subject ? `Subject: ${subject}\n\n${message}` : message;
      
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          { name, email, message: fullMessage }
        ]);
        
      if (error) throw error;
      
      toast.success('Message sent successfully!');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <section className="py-24 bg-white text-slate-800 selection:bg-sky-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* TOP HEADER */}
        <div className="max-w-3xl mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-sky-500 font-bold text-xs uppercase tracking-widest mb-4"
          >
            <span className="w-8 h-px bg-sky-500"></span> Contact Us
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-semibold tracking-tighter text-slate-900 leading-none"
          >
            Let's create something <br />
            <span className="text-sky-500">remarkable.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* LEFT: MINIMALIST FORM SECTION */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-6 order-2 lg:order-1"
          >
            <div className="bg-[#fcfdfe] border border-slate-100 p-8 lg:p-12 rounded-3xl shadow-sm">
              <h3 className="text-2xl font-semibold text-slate-900 mb-8">Send a Message</h3>
              
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Your Name *</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Pranav navghare" className="w-full bg-white border border-slate-200 px-5 py-4 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-50 focus:outline-none transition-all placeholder:text-slate-300 font-medium" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Email Address *</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Support@hirrd.tech" className="w-full bg-white border border-slate-200 px-5 py-4 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-50 focus:outline-none transition-all placeholder:text-slate-300 font-medium" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Subject</label>
                  <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Project Inquiry" className="w-full bg-white border border-slate-200 px-5 py-4 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-50 focus:outline-none transition-all placeholder:text-slate-300 font-medium" />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">Message *</label>
                  <textarea rows="4" value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="How can we help you?" className="w-full bg-white border border-slate-200 px-5 py-4 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-50 focus:outline-none transition-all placeholder:text-slate-300 font-medium resize-none"></textarea>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white py-5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-sky-600 transition-all shadow-lg shadow-slate-200 hover:shadow-sky-100 disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'} <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </motion.div>

          {/* RIGHT: CONTACT INFO & MAP */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 space-y-10 order-1 lg:order-2"
          >
            {/* GOOGLE MAPS INTEGRATION */}
            <div className="w-full h-[320px] rounded-3xl overflow-hidden border border-slate-100 shadow-sm relative group">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119066.41724498305!2d78.99010795!3d21.16122595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a5a31faf13%3A0x19b37d06d0bb3e2b!2sNagpur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[0.4] group-hover:grayscale-0 transition-all duration-700"
              ></iframe>
            </div>

            {/* CONTACT DETAILS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4 p-2">
                <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 shrink-0">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tighter">Location</h4>
                  <p className="text-slate-500 text-[15px] font-medium leading-relaxed">Dharampeth, Nagpur, <br />India, 440010</p>
                </div>
              </div>

              <div className="flex gap-4 p-2">
                <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 shrink-0">
                  <Mail size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tighter">Support</h4>
                  <p className="text-slate-500 text-[15px] font-medium leading-relaxed">Support@hirrd.tech<br />24/7 Response Time</p>
                </div>
              </div>

              <div className="flex gap-4 p-2">
                <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 shrink-0">
                  <Phone size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tighter">Call</h4>
                  <p className="text-slate-500 text-[15px] font-medium leading-relaxed">9356671329<br />Mon - Fri, 10am - 7pm</p>
                </div>
              </div>

              <div className="flex gap-4 p-2">
                <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500 shrink-0">
                  <Clock size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tighter">Availability</h4>
                  <p className="text-sky-600 text-[15px] font-bold leading-relaxed flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Open for Projects
                  </p>
                </div>
              </div>
            </div>

            {/* SOCIALS */}
            <div className="pt-8 border-t border-slate-100 flex items-center gap-6">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Follow us:</span>
              <div className="flex gap-4">
                {[
                  { Icon: Linkedin, url: 'https://www.linkedin.com/company/hirrdtech' },
                  { Icon: Twitter, url: 'https://x.com/hirrdhq' },
                  { Icon: Instagram, url: 'https://www.instagram.com/hirrd.tech/' }
                ].map((social, i) => (
                  <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-sky-500 hover:border-sky-100 transition-all">
                    <social.Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
