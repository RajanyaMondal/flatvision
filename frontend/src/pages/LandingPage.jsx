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
    <div className="min-h-screen text-[#0A2540] font-sans selection:bg-[#92EEFF]/30 overflow-x-hidden relative flex flex-col scroll-smooth">
      {/* STANDARD NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 border-b border-[#7AAACE]/30 bg-[#F2EFE7]/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 font-bold text-xl tracking-tight hover:scale-105 transition-transform duration-200">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#A7D1C4] via-[#C8DFDB] to-[#F2EFE7] flex items-center justify-center text-[#163050] shadow-sm">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-[#163050] text-2xl tracking-tighter font-black flex items-center gap-1">
              FlatPredict
            </span>
          </Link>
          
          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8 font-bold text-sm text-[#476685]">
            <Link to="/" className="hover:text-[#10B981] transition-all flex items-center gap-2">
              <span className="text-[#10B981]">Home</span>
            </Link>
            <Link to="/predict" className="hover:text-[#10B981] transition-all flex items-center gap-2">
              <span>Predict Price</span>
            </Link>
            <Link to="/dashboard" className="hover:text-[#10B981] transition-all flex items-center gap-2">
              <span>Dashboard</span>
            </Link>
            <Link to="/history" className="hover:text-[#10B981] transition-all flex items-center gap-2">
              <span>History</span>
            </Link>
            <Link to="/model-works" className="hover:text-[#10B981] transition-all flex items-center gap-2">
              <span>How It Works</span>
            </Link>
          </div>
 
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <MotionLink 
                  to="/dashboard" 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden cursor-pointer"
                >
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                </MotionLink>
              </>
            ) : (
              <>
                <Link to="/auth?mode=login" className="px-5 py-2.5 text-sm font-bold text-[#476685] hover:text-[#10B981] transition-colors hover:scale-105">Log In</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-40 pb-20 relative z-10 flex-1 flex flex-col justify-center items-center">
        {/* Hero */}
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-5xl sm:text-7xl md:text-[110px] font-black tracking-tight text-[#163050] leading-[1.1] relative z-10"
          >
            Predict Flat Prices <br />
            <span className="text-4xl sm:text-6xl md:text-[80px] text-[#163050]">with</span> <br />
            <div className="relative inline-block mt-4">
               <div className="absolute inset-0 bg-[#10B981]/40 blur-[80px]"></div>
               <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[#A7D1C4] via-[#4ADE80] to-[#059669]">
                 Machine Learning
               </span>
            </div>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-6 mt-16 relative z-10"
          >
          </motion.div>
        </div>
      </main>
    </div>
  );
}
