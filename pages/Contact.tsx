
import React, { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Hologram from '../components/Hologram';

const Contact: React.FC = () => {
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="min-h-screen pt-32 px-6 md:px-24 pb-24 grid lg:grid-cols-2 gap-24">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-12">Contact</h1>
        
        <div className="space-y-12">
          <div>
            <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-blue-500 mb-4">Location</h3>
            <p className="text-xl text-slate-300">Tokyo, Shibuya / Remote World</p>
          </div>
          
          <div>
            <h3 className="text-xs font-bold tracking-[0.4em] uppercase text-blue-500 mb-4">Email</h3>
            <p className="text-xl text-slate-300 hover:text-blue-400 transition-colors cursor-pointer">hello@nexus-labs.design</p>
          </div>

          <div className="pt-8 relative group">
             <div className="w-full max-w-[400px] aspect-square relative rounded-full border border-blue-500/10 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <Suspense fallback={<div className="w-full h-full bg-slate-900/50" />}>
                        <Hologram />
                    </Suspense>
                </div>
                <div className="relative z-10 text-center p-8 bg-black/40 backdrop-blur-xl rounded-full border border-white/5 scale-90 group-hover:scale-100 transition-transform duration-700">
                    <span className="block text-4xl mb-4">⚡️</span>
                    <span className="text-[10px] font-bold tracking-widest uppercase block mb-1">Agent Status</span>
                    <span className="text-xs text-blue-400 font-bold uppercase tracking-widest">Available for hire</span>
                </div>
             </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="bg-white/[0.03] backdrop-blur-3xl border border-white/5 p-8 md:p-16 rounded-[40px] self-start shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[100px]" />
        
        <h2 className="text-2xl font-bold mb-8 flex items-center">
            Send a Message <span className="ml-4 h-px flex-1 bg-white/10" />
        </h2>
        
        {isSent ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 text-center"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Message Received!</h3>
            <p className="text-slate-400 text-sm">Thank you for reaching out. I'll get back to you shortly.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-700"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-700"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-2">Your Message</label>
              <textarea 
                rows={5}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-all resize-none placeholder:text-slate-700"
                placeholder="Tell us about your project..."
              ></textarea>
            </div>
            <button 
              type="submit"
              className="group w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-[0.2em] uppercase rounded-xl transition-all duration-500 transform active:scale-[0.98] shadow-lg shadow-blue-600/20"
            >
              Dispatch Inquiry <span className="inline-block transition-transform group-hover:translate-x-2">&rarr;</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Contact;
