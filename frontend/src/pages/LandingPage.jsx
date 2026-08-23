import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, ArrowRight, BrainCircuit, Activity, SlidersHorizontal, Search, ArrowUpDown } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';

export default function LandingPage() {
  const { user } = useContext(AuthContext);

  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter state
  const [searchFacing, setSearchFacing] = useState('All');
  const [searchBedrooms, setSearchBedrooms] = useState('All');
  const [searchArea, setSearchArea] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('Flat_ID');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchDataset = async () => {
      try {
        const res = await api.get('/dataset-data');
        if (res.data && res.data.success) {
          setDataset(res.data.data);
        }
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

  const filteredDataset = useMemo(() => {
    return dataset
      .filter(row => {
        const matchFacing = searchFacing === 'All' || row.Facing.toLowerCase() === searchFacing.toLowerCase();
        const matchBedrooms = searchBedrooms === 'All' || row.Bedrooms.toString() === searchBedrooms;
        const matchArea = !searchArea || row.Area_Sqft >= Number(searchArea);
        return matchFacing && matchBedrooms && matchArea;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'string') {
          return sortOrder === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        } else {
          return sortOrder === 'asc' 
            ? valA - valB 
            : valB - valA;
        }
      });
  }, [dataset, searchFacing, searchBedrooms, searchArea, sortField, sortOrder]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredDataset.length / itemsPerPage);
  
  const paginatedDataset = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredDataset.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredDataset, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#F8F5FC] text-[#4A3E56] font-sans selection:bg-[#8B5CF6]/30 overflow-x-hidden relative flex flex-col scroll-smooth">
      {/* Playful Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      {/* Soft Cute Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#8B5CF6]/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#C084FC]/10 blur-[150px] pointer-events-none" />
      
      {/* STANDARD NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 border-b border-[#E9D5FF] bg-[#F8F5FC]/70 backdrop-blur-xl z-50">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#C084FC] flex items-center justify-center text-white shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-[#1E1B4B] text-2xl tracking-tighter font-extrabold flex items-center gap-1">
              FlatVision<span className="text-[#8B5CF6]">.AI</span> ✨
            </span>
          </Link>
          
          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8 font-bold text-sm text-[#6B5E78]">
            <a href="#features" className="hover:text-[#1E1B4B] transition-colors">Features</a>
            <Link to="/model-works" className="hover:text-[#1E1B4B] transition-colors flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-[#8B5CF6] animate-pulse" /> How Model Works
            </Link>
            <a href="#contact" className="hover:text-[#1E1B4B] transition-colors">Contact</a>
          </div>
 
          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm font-bold text-[#6B5E78]">Hello, {user.name} 🤖</span>
                <Link to="/dashboard" className="px-6 py-2.5 text-sm font-bold bg-[#8B5CF6] text-white rounded-full transition-all hover:bg-[#7C3AED] shadow-md shadow-[#8B5CF6]/10">
                  Go to Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth?mode=login" className="px-5 py-2.5 text-sm font-bold text-[#6B5E78] hover:text-[#1E1B4B] transition-colors">Log In</Link>
                <Link to="/auth?mode=register" className="relative group px-6 py-2.5 text-sm font-bold bg-[#1E1B4B] text-white rounded-full overflow-hidden transition-all hover:bg-[#312E81]">
                  <span className="relative z-10">Get Started ✨</span>
                </Link>
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] text-sm font-bold mb-8"
          >
            <BrainCircuit className="w-4 h-4 animate-bounce" /> Super Sparkly AI Valuation 🔮
          </motion.div>
 
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1] text-[#1E1B4B]"
          >
            Predict Real Estate
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] via-[#C084FC] to-[#818CF8]">
              With Magic AI Precision 🔮
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-2xl text-[#6B5E78] mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Our Multiple Linear Regression model parses area, facing, floor, car parking, and bedroom layout parameters to calculate estimates instantly! ✨
          </motion.p>
 
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-6"
          >
            <Link 
              to="/dashboard"
              className="relative group inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold bg-[#8B5CF6] text-white rounded-full hover:bg-[#7C3AED] transition-all shadow-md shadow-[#8B5CF6]/20"
            >
              Initialize Prediction 🔮
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/robot-architecture" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold bg-white border border-[#E9D5FF] text-[#1E1B4B] rounded-full hover:bg-[#F3E8FF] transition-all">
              Explore Robot Architecture 🤖
            </Link>
          </motion.div>
        </div>
 
        {/* Features Section - Replaced with Reference Dataset Explorer */}
        <section id="features" className="pt-24 border-t border-[#E9D5FF]/60 scroll-mt-24 mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[#1E1B4B] tracking-tight mb-4 flex items-center justify-center gap-3">
              <SlidersHorizontal className="text-[#8B5CF6] w-8 h-8" /> Reference Dataset Explorer 📊
            </h2>
            <p className="text-sm font-semibold text-[#6B5E78]">
              This educational platform trains a Multiple Linear Regression model using the exact 100 survey records listed below.
            </p>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-[#E9D5FF] border-t-[#8B5CF6] animate-spin" />
              <span className="text-[#6B5E78] font-bold">Loading educational dataset records...</span>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border border-red-200 text-red-600 rounded-3xl font-bold text-center">
              {error}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Dataset Summary Cards */}
              {stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-[#F3E8FF]/30 border border-[#E9D5FF] p-6 rounded-3xl shadow-sm text-center">
                    <span className="text-xs font-bold text-[#6B5E78] uppercase">Dataset Size</span>
                    <div className="text-3xl font-black text-[#1E1B4B] mt-2">100 Rows</div>
                  </div>
                  <div className="bg-[#F3E8FF]/30 border border-[#E9D5FF] p-6 rounded-3xl shadow-sm text-center">
                    <span className="text-xs font-bold text-[#6B5E78] uppercase">Average Price</span>
                    <div className="text-3xl font-black text-[#1E1B4B] mt-2">₹{stats.avgPrice.toFixed(2)} Lakh</div>
                  </div>
                  <div className="bg-[#F3E8FF]/30 border border-[#E9D5FF] p-6 rounded-3xl shadow-sm text-center">
                    <span className="text-xs font-bold text-[#6B5E78] uppercase">Average Area</span>
                    <div className="text-3xl font-black text-[#1E1B4B] mt-2">{stats.avgArea.toFixed(1)} Sqft</div>
                  </div>
                  <div className="bg-[#F3E8FF]/30 border border-[#E9D5FF] p-6 rounded-3xl shadow-sm text-center">
                    <span className="text-xs font-bold text-[#6B5E78] uppercase">BHK Distribution</span>
                    <div className="text-sm font-bold text-[#1E1B4B] mt-2 flex justify-center gap-4">
                      {Object.entries(stats.countBHK).map(([bhk, count]) => (
                        <span key={bhk}>{bhk} BHK: {count}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Call to Action: Explore full dataset in dashboard */}
              <div className="bg-gradient-to-r from-[#8B5CF6] via-[#C084FC] to-[#818CF8] rounded-3xl p-8 md:p-12 text-white shadow-lg text-center relative overflow-hidden mt-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
                <h3 className="text-2xl md:text-3xl font-black mb-4 flex items-center justify-center gap-2">
                  Explore Property Records Matrix Inside Dashboard 📊
                </h3>
                <p className="text-base text-purple-100 max-w-2xl mx-auto mb-8 font-semibold">
                  Log in to your account to search, filter, and inspect all 100 property records of our reference dataset alongside live ML accuracy evaluations.
                </p>
                <Link 
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#8B5CF6] hover:text-[#7C3AED] font-bold rounded-full transition-all shadow-md text-lg"
                >
                  Open Dashboard Dataset Matrix
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          )}
        </section>


        {/* Contact & Footer Section */}
        <section id="contact" className="pt-24 border-t border-[#E9D5FF]/60 scroll-mt-24 pb-16">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            
            {/* Left: Brand & Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#C084FC] flex items-center justify-center text-white shadow-md">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[#1E1B4B] text-2xl tracking-tighter font-extrabold">
                  FlatVision<span className="text-[#8B5CF6]">.AI</span> ✨
                </span>
              </div>
              <p className="text-[#6B5E78] text-sm leading-relaxed max-w-sm font-semibold">
                Predict flat prices instantly with our Multiple Linear Regression model trained on real survey data. Built for educational analytics, buyers, and sellers.
              </p>
              
              <div className="space-y-3 text-sm text-[#6B5E78] font-bold">
                <div>🤖 Core Node: Port 5000 (Express Router)</div>
                <div>🔮 AI Engine: Port 8000 (FastAPI Model)</div>
                <div>💾 Storage: MongoDB / Local Fallback cache</div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="bg-[#F3E8FF]/30 border border-[#E9D5FF] rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-extrabold text-[#1E1B4B] mb-2">Get in Touch ✉️</h3>
              <p className="text-xs text-[#6B5E78] font-bold mb-6">Have questions about model parameters or deployment? Send us a message!</p>
              
              <form onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully! 🤖'); }} className="space-y-4 text-sm text-[#1E1B4B]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6B5E78] uppercase mb-1">Your Name</label>
                    <input type="text" required className="w-full bg-white border border-[#E9D5FF] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all font-semibold" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6B5E78] uppercase mb-1">Email Address</label>
                    <input type="email" required className="w-full bg-white border border-[#E9D5FF] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all font-semibold" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#6B5E78] uppercase mb-1">Message</label>
                  <textarea required rows="4" className="w-full bg-white border border-[#E9D5FF] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all font-semibold resize-none" placeholder="How does the model handle custom localities?"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-[#8B5CF6]/20">
                  Send Message ✨
                </button>
              </form>
            </div>

          </div>

          <div className="border-t border-[#E9D5FF]/60 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#6B5E78] font-bold">
            <div>© {new Date().getFullYear()} FlatVision.AI. All rights reserved. Made with love for AI 🤖</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#1E1B4B] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#1E1B4B] transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-[#1E1B4B] transition-colors">Appraisal License</a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
