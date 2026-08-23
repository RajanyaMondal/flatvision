import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, ArrowRight, BrainCircuit, Activity, SlidersHorizontal, Search, ArrowUpDown, Mail, Database, Landmark, Layers, Layout } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const MotionLink = motion(Link);

export default function LandingPage() {
  const { user } = useContext(AuthContext);

  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        const mlServiceUrl = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000';
        const res = await fetch(`${mlServiceUrl}/dataset-data`);
        if (!res.ok) throw new Error('Failed to load dataset');
        const data = await res.json();
        setDataset(data);
      } catch (err) {
        console.error("Failed to load dataset:", err);
        setError('Failed to fetch dataset information.');
      } finally {
        setLoading(false);
      }
    };
    fetchDataset();
  }, []);

  const stats = useMemo(() => {
    if (dataset.length === 0) return null;
    const avgPrice = dataset.reduce((acc, row) => acc + row.Price_Lakh, 0) / dataset.length;
    const avgArea = dataset.reduce((acc, row) => acc + row.Area_Sqft, 0) / dataset.length;
    const countBHK = dataset.reduce((acc, row) => {
      acc[row.Bedrooms] = (acc[row.Bedrooms] || 0) + 1;
      return acc;
    }, {});
    return { avgPrice, avgArea, countBHK };
  }, [dataset]);

  return (
    <div 
      className="min-h-screen text-[#2E1128] font-sans selection:bg-[#FFADEE]/30 overflow-x-hidden relative flex flex-col scroll-smooth"
      style={{
        background: 'radial-gradient(circle at 80% 80%, rgba(255, 245, 246, 0.95) 0%, transparent 80%), linear-gradient(135deg, #FFA4BD 0%, #FFCAD6 50%, #FFF5F6 100%)'
      }}
    >
      {/* Playful Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,173,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,173,238,0.06)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* STANDARD NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 border-b border-[#FFD6F4] bg-[#FFF5FA]/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 font-bold text-xl tracking-tight hover:scale-105 transition-transform duration-200">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF8CD9] via-[#FFADEE] to-[#FFC6F3] flex items-center justify-center text-white shadow-md shadow-[#FFADEE]/20">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-[#2E1128] text-2xl tracking-tighter font-black flex items-center gap-1">
              FlatVision<span className="text-[#FF73D0]">.AI</span>
            </span>
          </Link>
          
          {/* Center Links */}
          <div className="hidden md:flex items-center gap-6 font-bold text-sm text-[#7C6274]">
            <a href="#features" className="hover:text-[#FF73D0] hover:bg-[#FF8CD9]/5 px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#FF8CD9]" />
              <span>Features</span>
            </a>
            <Link to="/model-works" className="hover:text-[#FF73D0] hover:bg-[#FF8CD9]/5 px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[#FF8CD9]" />
              <span>How Model Works</span>
            </Link>
            <a href="#contact" className="hover:text-[#FF73D0] hover:bg-[#FF8CD9]/5 px-3 py-2 rounded-xl transition-all duration-200 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FF8CD9]" />
              <span>Contact</span>
            </a>
          </div>
 
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden sm:inline text-sm font-bold text-[#7C6274]">Hello, {user.name}</span>
                <MotionLink 
                  to="/dashboard" 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 text-sm font-bold bg-[#FF8CD9] hover:bg-[#FF73D0] text-white rounded-xl shadow-md shadow-[#FF8CD9]/20 hover:shadow-[0_6px_20px_rgba(255,140,217,0.35)] transition-all cursor-pointer"
                >
                  Go to Dashboard
                </MotionLink>
              </>
            ) : (
              <>
                <Link to="/auth?mode=login" className="px-5 py-2.5 text-sm font-bold text-[#7C6274] hover:text-[#FF73D0] transition-colors hover:scale-105">Log In</Link>
                <MotionLink 
                  to="/auth?mode=register" 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-2.5 text-sm font-bold bg-[#2E1128] hover:bg-[#431F3B] text-white rounded-xl shadow-sm hover:shadow-[0_6px_20px_rgba(46,17,40,0.2)] transition-all cursor-pointer"
                >
                  Get Started
                </MotionLink>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-40 pb-32 relative z-10 flex-1 flex flex-col justify-center">
        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFADEE]/15 border border-[#FFADEE]/30 text-[#FF73D0] text-sm font-bold mb-8 shadow-sm"
          >
            <BrainCircuit className="w-4 h-4 text-[#FF8CD9]" /> AI-Powered Flat Pricing Valuations
          </motion.div>
 
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tight text-[#2E1128] mb-8 leading-none"
          >
            Predict Flat Prices <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF73D0] via-[#FF8CD9] to-[#E888D3] drop-shadow-sm">
              With Advanced AI Precision
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-2xl text-[#7C6274] mb-12 max-w-3xl mx-auto leading-relaxed font-semibold"
          >
            Our Multiple Linear Regression model parses area size, orientation facing, floor level, parking area, and bedroom counts to evaluate flat market values instantly.
          </motion.p>
 
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <MotionLink 
              to="/dashboard"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold bg-[#FF8CD9] hover:bg-[#FF73D0] text-white rounded-2xl hover:shadow-[0_8px_30px_rgba(255,140,217,0.4)] transition-all shadow-md shadow-[#FF8CD9]/25 cursor-pointer"
            >
              Initialize Prediction
              <ArrowRight className="w-5 h-5" />
            </MotionLink>
            <MotionLink 
              to="/robot-architecture" 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold bg-white border border-[#FFD6F4] text-[#2E1128] rounded-2xl hover:bg-[#FFF0FA] hover:shadow-[0_8px_30px_rgba(255,173,238,0.2)] transition-all shadow-sm cursor-pointer"
            >
              Explore Robot Architecture
              <ArrowRight className="w-5 h-5" />
            </MotionLink>
          </motion.div>
        </div>
 
        {/* Features Section - Replaced with Reference Dataset Explorer */}
        <section id="features" className="pt-24 border-t border-[#FFD6F4]/60 scroll-mt-24 mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#2E1128] tracking-tight mb-4 flex items-center justify-center gap-3">
              <SlidersHorizontal className="text-[#FF73D0] w-8 h-8" /> Reference Dataset Explorer
            </h2>
            <p className="text-sm font-bold text-[#7C6274]">
              This educational platform trains a Multiple Linear Regression model using the exact 100 survey records listed below.
            </p>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-[#FFD6F4] border-t-[#FF8CD9] animate-spin" />
              <span className="text-[#7C6274] font-bold">Loading educational dataset records...</span>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-200 text-red-600 rounded-3xl font-bold text-center">
              {error}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Dataset Summary Cards - GLASSMORPHIC, UNIQUE & REALISTIC */}
              {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  
                  {/* Card 1 */}
                  <div className="bg-white/40 backdrop-blur-xl border border-[#FFD6F4] rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between items-center text-center relative overflow-hidden group">
                    <span className="absolute top-0 right-0 bg-[#FF8CD9] text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                      100% Surveyed
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF0FA] border border-[#FFD6F4] flex items-center justify-center text-[#FF73D0] mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Database className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-extrabold text-[#7C6274] uppercase tracking-wider block mb-1">Dataset Volume</span>
                    <div className="text-4xl md:text-5xl font-black text-[#2E1128] mt-2 mb-2">100 Records</div>
                    <p className="text-xs font-bold text-[#7C6274]/90 leading-snug border-t border-[#FFD6F4]/40 pt-3 mt-3 w-full">
                      Ported from Flat_Price_Multiple_Linear_Regression_100.xlsx
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white/40 backdrop-blur-xl border border-[#FFD6F4] rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between items-center text-center relative overflow-hidden group">
                    <span className="absolute top-0 right-0 bg-[#FF8CD9] text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                      Market Base
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF0FA] border border-[#FFD6F4] flex items-center justify-center text-[#FF73D0] mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Landmark className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-extrabold text-[#7C6274] uppercase tracking-wider block mb-1">Average Price</span>
                    <div className="text-4xl md:text-5xl font-black text-[#2E1128] mt-2 mb-2">₹{stats.avgPrice.toFixed(2)} Lakh</div>
                    <p className="text-xs font-bold text-[#7C6274]/90 leading-snug border-t border-[#FFD6F4]/40 pt-3 mt-3 w-full">
                      Mean valuation parameter of listings surveyed.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white/40 backdrop-blur-xl border border-[#FFD6F4] rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between items-center text-center relative overflow-hidden group">
                    <span className="absolute top-0 right-0 bg-[#FF8CD9] text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                      Standard Space
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF0FA] border border-[#FFD6F4] flex items-center justify-center text-[#FF73D0] mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Layers className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-extrabold text-[#7C6274] uppercase tracking-wider block mb-1">Average Area</span>
                    <div className="text-4xl md:text-5xl font-black text-[#2E1128] mt-2 mb-2">{stats.avgArea.toFixed(1)} Sqft</div>
                    <p className="text-xs font-bold text-[#7C6274]/90 leading-snug border-t border-[#FFD6F4]/40 pt-3 mt-3 w-full">
                      Mean flat built space footprint across records.
                    </p>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-white/40 backdrop-blur-xl border border-[#FFD6F4] rounded-3xl p-8 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between items-center text-center relative overflow-hidden group">
                    <span className="absolute top-0 right-0 bg-[#FF8CD9] text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                      Layout Mix
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF0FA] border border-[#FFD6F4] flex items-center justify-center text-[#FF73D0] mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Layout className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-extrabold text-[#7C6274] uppercase tracking-wider block mb-1">BHK Layouts</span>
                    <div className="flex justify-center gap-2 mt-4 mb-4 flex-wrap">
                      {Object.entries(stats.countBHK).map(([bhk, count]) => (
                        <span key={bhk} className="px-2.5 py-1 bg-white border border-[#FFD6F4] rounded-xl text-xs font-bold text-[#FF73D0] shadow-sm">{bhk} BHK</span>
                      ))}
                    </div>
                    <p className="text-xs font-bold text-[#7C6274]/90 leading-snug border-t border-[#FFD6F4]/40 pt-3 mt-3 w-full">
                      Residential unit configuration distributions.
                    </p>
                  </div>

                </div>
              )}

              {/* Call to Action: Explore full dataset in dashboard */}
              <div className="bg-gradient-to-r from-[#FF73D0] via-[#FFADEE] to-[#FF9EE2] rounded-3xl p-8 md:p-12 text-white shadow-lg text-center relative overflow-hidden mt-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
                <h3 className="text-2xl md:text-3xl font-black mb-4 flex items-center justify-center gap-2">
                  Explore Property Records Matrix Inside Dashboard
                </h3>
                <p className="text-base text-pink-50 max-w-2xl mx-auto mb-8 font-semibold">
                  Log in to your account to search, filter, and inspect all 100 property records of our reference dataset alongside live ML accuracy evaluations.
                </p>
                <MotionLink 
                  to="/dashboard"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#FF73D0] hover:text-[#FF66CD] hover:shadow-[0_8px_30px_rgba(255,255,255,0.45)] font-bold rounded-2xl transition-all shadow-md text-lg cursor-pointer"
                >
                  Open Dashboard Dataset Matrix
                  <ArrowRight className="w-5 h-5" />
                </MotionLink>
              </div>
            </div>
          )}
        </section>

        {/* Contact & Footer Section */}
        <section id="contact" className="pt-24 border-t border-[#FFD6F4]/60 scroll-mt-24 pb-16">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* Left: Brand & Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF8CD9] via-[#FFADEE] to-[#FFC6F3] flex items-center justify-center text-white shadow-md shadow-[#FFADEE]/10">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[#2E1128] text-2xl tracking-tighter font-black">
                  FlatVision<span className="text-[#FF73D0]">.AI</span>
                </span>
              </div>
              <p className="text-[#7C6274] text-sm leading-relaxed max-w-sm font-semibold">
                Predict flat prices instantly with our Multiple Linear Regression model trained on real survey data. Built for educational analytics, buyers, and sellers.
              </p>
              
              <div className="space-y-3 text-sm text-[#7C6274] font-bold">
                <div>Backend & DB: Supabase (Auth & PostgreSQL)</div>
                <div>AI Engine: Python / FastAPI Microservice</div>
                <div>Frontend: React, Vite, Framer Motion</div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="bg-[#FFF0FA]/50 border border-[#FFD6F4] rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-black text-[#2E1128] mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#FF8CD9]" /> Get in Touch
              </h3>
              <p className="text-xs text-[#7C6274] font-bold mb-6">Have questions about model parameters or deployment? Send us a message!</p>
              
              <form onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }} className="space-y-4 text-sm text-[#2E1128]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#7C6274] uppercase mb-1">Your Name</label>
                    <input type="text" required className="w-full bg-white border border-[#FFD6F4] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#FFADEE]/50 transition-all font-semibold" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#7C6274] uppercase mb-1">Email Address</label>
                    <input type="email" required className="w-full bg-white border border-[#FFD6F4] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#FFADEE]/50 transition-all font-semibold" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#7C6274] uppercase mb-1">Message</label>
                  <textarea required rows="4" className="w-full bg-white border border-[#FFD6F4] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#FFADEE]/50 transition-all font-semibold resize-none" placeholder="How does the model handle custom localities?"></textarea>
                </div>
                <motion.button 
                  type="submit" 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#FF8CD9] hover:bg-[#FF73D0] text-white font-bold py-3 rounded-xl hover:shadow-[0_6px_20px_rgba(255,140,217,0.35)] transition-all shadow-md shadow-[#FF8CD9]/20 cursor-pointer"
                >
                  Send Message
                </motion.button>
              </form>
            </div>

          </div>

          <div className="border-t border-[#FFD6F4]/60 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#7C6274] font-bold">
            <div>© {new Date().getFullYear()} FlatVision.AI. All rights reserved. Made for AI</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#2E1128] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#2E1128] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#2E1128] transition-colors">Appraisal License</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
