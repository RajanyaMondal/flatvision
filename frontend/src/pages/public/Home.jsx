import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Calculator, TrendingUp, ShieldCheck, FileText, 
  PlayCircle, ArrowRight, Home, BrainCircuit, BarChart3, 
  MapPin, CheckCircle2, Lock, Sparkles
} from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#F2EFE7] font-sans selection:bg-[#00D2FF]/30 selection:text-[#0A2540]">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
         {/* Premium Ambient Glows */}
         <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00D2FF]/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#0A2540]/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
         
         <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0 xl:mr-10">
               {/* Premium Badge */}
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full clay-card border border-[#7AAACE]/30 mb-8 text-sm font-black text-[#0A2540] shadow-sm uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 text-[#00D2FF]" />
                  AI-Powered Precision
               </div>
               
               {/* Heading */}
               <h1 className="text-4xl sm:text-5xl lg:text-[72px] font-extrabold text-[#0A2540] leading-[1.05] mb-6 tracking-tight">
                  Make Smarter<br/>
                  Property Decisions<br/>
                  with <span className="text-[#00D2FF] drop-shadow-sm">Confidence.</span>
               </h1>
               
               {/* Subtitle */}
               <p className="text-base sm:text-lg lg:text-xl text-[#476685] mb-8 sm:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-bold">
                  Get ultra-accurate valuations, predictive ROI insights, and instant EMI estimates — all driven by state-of-the-art machine learning.
               </p>
               
               {/* Buttons */}
               <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start mb-14">
                  <Link to="/app/predict" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0A2540] hover:bg-[#0A2540]/90 text-white font-black shadow-[0_10px_30px_rgba(10,37,64,0.4)] transition-all flex items-center justify-center gap-2 text-lg hover:-translate-y-1">
                     Start Prediction <ArrowRight className="w-5 h-5 text-[#00D2FF]" />
                  </Link>
                  <button className="w-full sm:w-auto px-8 py-4 rounded-2xl clay-card border border-[#7AAACE]/30 hover:border-[#00D2FF]/50 text-[#0A2540] font-black transition-all flex items-center justify-center gap-2 text-lg hover:-translate-y-1 group">
                     <PlayCircle className="w-6 h-6 text-[#00D2FF] group-hover:scale-110 transition-transform" /> Watch Demo
                  </button>
               </div>
               
               {/* Trust Indicators */}
               <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-4">
                  <div className="flex items-center gap-3 clay-card px-4 py-2 rounded-xl border border-[#7AAACE]/20">
                     <ShieldCheck className="w-4 h-4 text-[#00D2FF]" />
                     <div className="text-xs font-black text-[#0A2540]">98.4% Accuracy</div>
                  </div>
                  <div className="flex items-center gap-3 clay-card px-4 py-2 rounded-xl border border-[#7AAACE]/20">
                     <BarChart3 className="w-4 h-4 text-[#00D2FF]" />
                     <div className="text-xs font-black text-[#0A2540]">Millions of Datapoints</div>
                  </div>
                  <div className="flex items-center gap-3 clay-card px-4 py-2 rounded-xl border border-[#7AAACE]/20">
                     <Lock className="w-4 h-4 text-[#00D2FF]" />
                     <div className="text-xs font-black text-[#0A2540]">Bank-Grade Security</div>
                  </div>
               </div>
            </div>
            
            {/* Right Content (Real Image) */}
            <div className="flex-1 relative w-full max-w-2xl mx-auto lg:max-w-none mt-16 lg:mt-0 perspective-[2000px]">
               <div className="relative z-10 transform lg:rotate-y-[-5deg] lg:rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-1000 ease-out">
                  
                  {/* Premium Ambient Glow */}
                  <div className="absolute inset-0 bg-[#00D2FF]/30 blur-[80px] rounded-[40px] -z-10 transform scale-105"></div>
                  
                  {/* Unique Image Frame */}
                  <div className="relative w-full aspect-[4/3] clay-card p-3 sm:p-4 rounded-[40px] border border-[#7AAACE]/40 shadow-[0_30px_60px_rgba(10,37,64,0.3)] group">
                     <div className="absolute top-8 left-8 w-16 h-16 bg-white/20 blur-2xl rounded-full z-20 pointer-events-none"></div>
                     <div className="relative w-full h-full rounded-[28px] overflow-hidden shadow-inner bg-slate-100 border border-[#7AAACE]/10">
                        <img src="/hero-apartment.jpg" alt="Modern Apartment Building" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] ease-out" />
                        {/* Inner glass overlay to make it look premium */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/30 via-transparent to-transparent opacity-60"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- FEATURES BOTTOM BANNER --- */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pb-20">
         <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[32px] p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {/* Feature 1 */}
               <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/80 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-[#E8F6F8] flex items-center justify-center shrink-0 border border-white">
                     <Home className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                     <h4 className="font-bold text-[#112338] mb-1">Price Prediction</h4>
                     <p className="text-sm text-[#5A738E] leading-relaxed">Know the true value before you buy.</p>
                  </div>
               </div>
               
               {/* Feature 2 */}
               <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/80 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-white">
                     <Calculator className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                     <h4 className="font-bold text-[#112338] mb-1">EMI Estimator</h4>
                     <p className="text-sm text-[#5A738E] leading-relaxed">Plan your finances with ease.</p>
                  </div>
               </div>

               {/* Feature 3 */}
               <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/80 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-white">
                     <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                     <h4 className="font-bold text-[#112338] mb-1">Market Insights</h4>
                     <p className="text-sm text-[#5A738E] leading-relaxed">Data-driven trends and investment potential.</p>
                  </div>
               </div>

               {/* Feature 4 */}
               <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/80 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border border-white">
                     <ShieldCheck className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                     <h4 className="font-bold text-[#112338] mb-1">Trusted Data</h4>
                     <p className="text-sm text-[#5A738E] leading-relaxed">Accurate, secure and regularly updated.</p>
                  </div>
               </div>
            </div>
         </div>
         
         {/* Handwritten bottom left */}
         <div className="absolute -bottom-10 left-10 hidden lg:block text-slate-400 font-handwriting rotate-[-5deg] text-xl">
            Better Homes.<br/>Brighter<br/>Tomorrows.
         </div>
      </section>

      {/* --- CORE CAPABILITIES BENTO GRID --- */}
      <section className="py-24 relative overflow-hidden">
         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <div className="text-center mb-16">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-[#7AAACE]/20 mb-6 text-xs font-black text-[#00D2FF] tracking-widest uppercase">
                  Core Capabilities
               </div>
               <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A2540] mb-4 tracking-tight">
                  Powered by <span className="text-[#00D2FF]">Next-Gen Intelligence</span>
               </h2>
               <p className="text-[#476685] font-bold text-lg max-w-2xl mx-auto">
                  Everything you need to make confident, data-driven real estate decisions, packed into one powerful platform.
               </p>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
               
               {/* Large Feature: Valuation (Spans 2 cols) */}
               <div className="lg:col-span-2 clay-card p-8 lg:p-12 relative flex flex-col md:flex-row items-center gap-8 group overflow-hidden">
                  <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-white/40 rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
                  
                  <div className="flex-1 relative z-10">
                     <div className="w-14 h-14 rounded-2xl bg-white border border-[#7AAACE]/30 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <BrainCircuit className="w-7 h-7 text-[#00D2FF]" />
                     </div>
                     <h3 className="text-3xl font-black text-[#0A2540] mb-4 tracking-tight">Predictive AI Valuation</h3>
                     <p className="text-[#476685] text-lg leading-relaxed font-bold mb-6">
                        Stop guessing. Our proprietary XGBoost model evaluates millions of historical sales, structural data, and macroeconomic trends to pinpoint the exact market value of any property with sub-second latency.
                     </p>
                     <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm font-bold text-[#0A2540]"><CheckCircle2 className="w-5 h-5 text-[#00D2FF]" /> 98.4% Proven Accuracy</li>
                        <li className="flex items-center gap-3 text-sm font-bold text-[#0A2540]"><CheckCircle2 className="w-5 h-5 text-[#00D2FF]" /> Sub-meter geo-spatial processing</li>
                        <li className="flex items-center gap-3 text-sm font-bold text-[#0A2540]"><CheckCircle2 className="w-5 h-5 text-[#00D2FF]" /> Real-time market adjustments</li>
                     </ul>
                  </div>

                  <div className="w-full md:w-[45%] shrink-0 relative z-10 mt-6 md:mt-0">
                     <div className="bg-[#F2EFE7] rounded-[32px] p-6 shadow-inner border border-[#7AAACE]/30 w-full group-hover:border-[#00D2FF]/40 transition-colors">
                        <div className="bg-white rounded-2xl shadow-md border border-[#7AAACE]/20 p-6 relative overflow-hidden">
                           <div className="text-[11px] text-[#476685] font-extrabold uppercase tracking-widest mb-2">Live Price Trajectory</div>
                           <div className="text-3xl sm:text-4xl font-black text-[#0A2540] mb-2">₹1.24 Cr</div>
                           <div className="flex items-center gap-1.5 text-sm text-emerald-500 font-bold mb-8">
                              <TrendingUp className="w-4 h-4" /> 8.7% <span className="text-[#476685] font-semibold ml-1">YoY Growth</span>
                           </div>
                           <div className="absolute w-full h-24 bottom-0 left-0">
                              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                                 <path d="M0,35 Q15,30 30,25 T50,15 T70,20 T90,5 T100,0" fill="none" stroke="#00D2FF" strokeWidth="4" strokeLinecap="round"/>
                              </svg>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right Column Stack */}
               <div className="flex flex-col gap-6 lg:gap-8">
                  
                  {/* Feature 2: Deep Analytics */}
                  <div className="flex-1 clay-accent p-8 relative flex flex-col group overflow-hidden justify-between">
                     <div className="absolute bottom-[-20%] right-[-10%] w-[200px] h-[200px] bg-white/60 rounded-full blur-[60px] pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>
                     <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-white/60 backdrop-blur-md border border-white/40 flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300">
                           <BarChart3 className="w-6 h-6 text-[#0A2540]" />
                        </div>
                        <h3 className="text-xl font-black text-[#0A2540] mb-3 tracking-tight">Investment ROI</h3>
                        <p className="text-[#0A2540]/80 text-sm leading-relaxed font-bold mb-6">
                           Calculate potential rental yields, cash-flow projections, and long-term appreciation rates effortlessly.
                        </p>
                     </div>
                     <div className="bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/50 relative z-10">
                        <div className="flex justify-between items-center mb-3">
                           <span className="text-xs font-bold text-[#0A2540]">Rental Yield</span>
                           <span className="text-sm font-black text-[#00D2FF]">4.8%</span>
                        </div>
                        <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
                           <div className="w-[60%] h-full bg-[#00D2FF] rounded-full"></div>
                        </div>
                     </div>
                  </div>

                  {/* Feature 3: Smart Search */}
                  <div className="flex-1 clay-card p-8 relative flex flex-col group overflow-hidden justify-between">
                     <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-white border border-[#7AAACE]/30 flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300">
                           <MapPin className="w-6 h-6 text-[#00D2FF]" />
                        </div>
                        <h3 className="text-xl font-black text-[#0A2540] mb-3 tracking-tight">Hyper-Local Context</h3>
                        <p className="text-[#476685] text-sm leading-relaxed font-bold">
                           Our engine factor in proximity to metros, schools, and local development projects to refine valuations.
                        </p>
                     </div>
                  </div>

               </div>

            </div>
         </div>
      </section>

      {/* --- PROFESSIONAL METRICS SECTION --- */}
      <section className="py-20 relative z-10">
         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="clay-card p-8 sm:p-10 flex flex-col items-center md:items-start text-center md:text-left group hover:-translate-y-2 transition-transform duration-300">
                  <div className="text-4xl sm:text-5xl font-black text-[#0A2540] mb-3 tracking-tighter">98.4%</div>
                  <div className="text-[#00D2FF] font-extrabold text-lg mb-3 tracking-wide uppercase">Prediction Accuracy</div>
                  <p className="text-[#476685] text-sm leading-relaxed font-bold">Powered by state-of-the-art XGBoost algorithms trained on verified property registrations.</p>
               </div>
               <div className="clay-card p-8 sm:p-10 flex flex-col items-center md:items-start text-center md:text-left group hover:-translate-y-2 transition-transform duration-300">
                  <div className="text-4xl sm:text-5xl font-black text-[#0A2540] mb-3 tracking-tighter">2.5M+</div>
                  <div className="text-[#00D2FF] font-extrabold text-lg mb-3 tracking-wide uppercase">Data Points Analyzed</div>
                  <p className="text-[#476685] text-sm leading-relaxed font-bold">Continuous ingestion of real-time market trends, local infrastructure, and historical sales.</p>
               </div>
               <div className="clay-card p-8 sm:p-10 flex flex-col items-center md:items-start text-center md:text-left group hover:-translate-y-2 transition-transform duration-300">
                  <div className="text-4xl sm:text-5xl font-black text-[#0A2540] mb-3 tracking-tighter">Enterprise</div>
                  <div className="text-[#00D2FF] font-extrabold text-lg mb-3 tracking-wide uppercase">Grade Architecture</div>
                  <p className="text-[#476685] text-sm leading-relaxed font-bold">Built with a scalable FastAPI backend, delivering sub-second prediction latency worldwide.</p>
               </div>
            </div>
         </div>
      </section>


      {/* --- FOOTER CTA & FOOTER --- */}
      <footer className="relative pt-10">
         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* CTA Banner */}
            <div className="w-full clay-accent p-10 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-8 mb-16 relative overflow-hidden group">
               {/* Decorative background shapes */}
               <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-white/40 rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
               <div className="absolute bottom-[-50%] left-[-10%] w-[300px] h-[300px] bg-[#00D2FF]/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
               
               <div className="flex items-center gap-6 relative z-10 text-center md:text-left flex-col md:flex-row">
                  <div className="w-20 h-20 rounded-[24px] bg-white border border-[#7AAACE]/30 flex items-center justify-center shadow-md">
                     <Building2 className="w-10 h-10 text-[#00D2FF]" />
                  </div>
                  <div>
                     <h3 className="text-2xl sm:text-3xl font-black text-[#0A2540] mb-2 tracking-tight">Ready to discover your property's true value?</h3>
                     <p className="text-[#476685] font-bold text-lg">Join thousands of smart property seekers today.</p>
                  </div>
               </div>
               
               <div className="relative z-10 w-full md:w-auto shrink-0 mt-6 md:mt-0">
                  <Link to="/app/predict" className="w-full md:w-auto px-10 py-5 rounded-2xl bg-[#0A2540] hover:bg-[#163050] text-white font-black shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 text-lg hover:-translate-y-1">
                     Start Now <ArrowRight className="w-5 h-5" />
                  </Link>
               </div>
            </div>

            {/* Main Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between border-t border-[#7AAACE]/30 py-8 gap-6">
               
               {/* Logo & Brand */}
               <div className="flex flex-col items-center gap-1 md:items-start">
                  <div className="flex items-center mb-6">
                    <img src="/new-logo.png" alt="FlatVision Logo" className="h-20 md:h-24 -ml-2 mix-blend-multiply dark:mix-blend-normal no-invert" />
                  </div>
               </div>

               {/* Links */}
               <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-black text-[#476685] tracking-wide uppercase">
                  <Link to="/" className="hover:text-[#0A2540] transition-colors">Home</Link>
                  <Link to="/app/predict" className="hover:text-[#0A2540] transition-colors">Start Prediction</Link>
                  <Link to="/how-it-works" className="hover:text-[#0A2540] transition-colors">How It Works</Link>
               </div>

               {/* Copyright */}
               <div className="text-xs font-bold text-[#476685]/60 uppercase tracking-widest">
                  © 2025 FlatVision. All rights reserved.
               </div>
               
            </div>
         </div>
      </footer>

      {/* Global CSS for Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

export default HomePage;
