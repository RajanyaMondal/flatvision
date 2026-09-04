import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Calculator, TrendingUp, ShieldCheck, FileText, 
  PlayCircle, ArrowRight, Home, BrainCircuit, BarChart3, 
  MapPin, CheckCircle2, Lock, Sparkles
} from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
         {/* Background Glows */}
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[100px] opacity-70 -z-10 translate-x-1/3 -translate-y-1/3"></div>
         <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-[80px] opacity-50 -z-10 -translate-x-1/2 -translate-y-1/2"></div>
         
         <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
               {/* Badge */}
               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 mb-6 text-sm font-semibold text-indigo-600 shadow-sm">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  AI-Powered Property Insights
               </div>
               
               {/* Heading */}
               <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                  Make Smarter<br/>
                  Property Decisions<br/>
                  with <span className="text-blue-600 relative inline-block">
                    Confidence.
                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-indigo-400 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/></svg>
                  </span>
               </h1>
               
               {/* Subtitle */}
               <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  Get accurate price predictions, EMI estimates, investment insights and more — all in one place.
               </p>
               
               {/* Buttons */}
               <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
                  <Link to="/app/predict" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center gap-2">
                     Start Prediction <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold transition-all flex items-center justify-center gap-2 shadow-sm">
                     <PlayCircle className="w-5 h-5 text-blue-600" /> Watch Demo
                  </button>
               </div>
               
               {/* Feature Mini-list */}
               <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                     </div>
                     <div className="text-sm font-semibold text-slate-700 leading-tight">Accurate<br/><span className="font-normal text-slate-500">AI Predictions</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                     </div>
                     <div className="text-sm font-semibold text-slate-700 leading-tight">Trusted<br/><span className="font-normal text-slate-500">Data Insights</span></div>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-slate-600" />
                     </div>
                     <div className="text-sm font-semibold text-slate-700 leading-tight">Secure<br/><span className="font-normal text-slate-500">& Private</span></div>
                  </div>
               </div>
            </div>
            
            {/* Right Content (Real Image Mockup) */}
            <div className="flex-1 relative w-full max-w-lg lg:max-w-none aspect-square lg:aspect-auto lg:h-[600px] perspective-[1000px]">
               <div className="absolute inset-0 flex items-center justify-center transform lg:translate-x-12">
                  <div className="relative w-72 md:w-96 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/20 border-4 border-white">
                     <img src="/hero-apartment.jpg" alt="Modern Apartment Building" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 ease-out" />
                     <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent pointer-events-none"></div>
                  </div>
                  
                  {/* Floating Card 1: Price */}
                  <div className="absolute top-10 -left-20 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 w-48 animate-[float_4s_ease-in-out_infinite]">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center"><Home className="w-3 h-3 text-blue-600" /></div>
                        <span className="text-xs font-semibold text-slate-500">Predicted Price</span>
                     </div>
                     <div className="text-2xl font-black text-slate-900">₹78.5 L</div>
                     <div className="flex items-center gap-1 mt-1 text-emerald-500 text-xs font-bold">
                        <TrendingUp className="w-3 h-3" /> 4.2% <span className="ml-2 w-10 h-1 bg-gradient-to-r from-emerald-100 to-emerald-400 rounded-full"></span>
                     </div>
                  </div>
                  
                  {/* Floating Card 2: EMI */}
                  <div className="absolute top-20 -right-16 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 w-44 animate-[float_5s_ease-in-out_infinite_reverse]">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-md bg-indigo-100 flex items-center justify-center"><Calculator className="w-3 h-3 text-indigo-600" /></div>
                        <span className="text-xs font-semibold text-slate-500">EMI (20 yrs)</span>
                     </div>
                     <div className="text-xl font-black text-slate-900">₹35,823</div>
                     <div className="text-[10px] text-slate-400 font-medium">/month</div>
                  </div>
                  
                  {/* Floating Card 3: ROI */}
                  <div className="absolute bottom-32 -right-24 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 w-48 animate-[float_4.5s_ease-in-out_infinite]">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center"><Lock className="w-3 h-3 text-emerald-600" /></div>
                        <span className="text-xs font-semibold text-slate-500">Investment ROI</span>
                     </div>
                     <div className="text-xl font-black text-slate-900">6.1% <span className="text-xs text-slate-400 font-medium">CAGR</span></div>
                     <div className="mt-2 w-full h-6 border-b border-l border-slate-100 relative">
                        <svg className="absolute w-full h-full bottom-0" preserveAspectRatio="none" viewBox="0 0 100 20"><polyline points="0,20 20,15 40,18 60,10 80,12 100,5" fill="none" stroke="#10b981" strokeWidth="2"/></svg>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- STATS BANNER --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-10">
         <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-10 flex flex-wrap items-center justify-center gap-8 md:gap-16 lg:justify-between">
            <div className="flex items-center gap-4 min-w-[200px]">
               <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center"><Home className="w-7 h-7 text-blue-600" /></div>
               <div>
                  <div className="text-2xl font-black text-slate-900">10K+</div>
                  <div className="text-sm font-medium text-slate-500">Properties Analyzed</div>
               </div>
            </div>
            <div className="flex items-center gap-4 min-w-[200px]">
               <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center"><BarChart3 className="w-7 h-7 text-emerald-500" /></div>
               <div>
                  <div className="text-2xl font-black text-slate-900">95%</div>
                  <div className="text-sm font-medium text-slate-500">Prediction Accuracy</div>
               </div>
            </div>
            <div className="flex items-center gap-4 min-w-[200px]">
               <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center"><div className="flex -space-x-2"><div className="w-5 h-5 rounded-full bg-indigo-300"></div><div className="w-5 h-5 rounded-full bg-indigo-400"></div><div className="w-5 h-5 rounded-full bg-indigo-500"></div></div></div>
               <div>
                  <div className="text-2xl font-black text-slate-900">5K+</div>
                  <div className="text-sm font-medium text-slate-500">Happy Users</div>
               </div>
            </div>
            <div className="flex items-center gap-4 min-w-[200px]">
               <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center"><ShieldCheck className="w-7 h-7 text-purple-600" /></div>
               <div>
                  <div className="text-2xl font-black text-slate-900">100%</div>
                  <div className="text-sm font-medium text-slate-500">Trusted & Secure</div>
               </div>
            </div>
         </div>
      </section>

      {/* --- HOW FLATVISION WORKS --- */}
      <section className="py-24 bg-[#F8FAFC]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-4 mb-3">
               <div className="h-[1px] w-8 bg-blue-200"></div>
               <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">How FlatVision Works</h2>
               <div className="h-[1px] w-8 bg-blue-200"></div>
            </div>
            <p className="text-slate-500 font-medium text-lg mb-16">Get property insights in just 3 simple steps</p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative">
               {/* Connecting Dashed Line */}
               <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-indigo-100 -z-10 border-t-2 border-dashed border-indigo-200"></div>
               
               {/* Step 1 */}
               <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 w-full max-w-sm relative group hover:shadow-md transition-shadow">
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center shadow-lg shadow-blue-500/30">1</div>
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Home className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Enter Details</h3>
                  <p className="text-slate-500 font-medium">Add location, type,<br/>area and other basics.</p>
                  <div className="hidden md:block absolute top-1/2 -right-6 text-indigo-300 bg-[#F8FAFC] px-1"><ArrowRight className="w-6 h-6" /></div>
               </div>

               {/* Step 2 */}
               <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 w-full max-w-sm relative group hover:shadow-md transition-shadow">
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center shadow-lg shadow-indigo-500/30">2</div>
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <BrainCircuit className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">AI Analyzes</h3>
                  <p className="text-slate-500 font-medium">Our AI analyzes market<br/>data in real-time.</p>
                  <div className="hidden md:block absolute top-1/2 -right-6 text-indigo-300 bg-[#F8FAFC] px-1"><ArrowRight className="w-6 h-6" /></div>
               </div>

               {/* Step 3 */}
               <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 w-full max-w-sm relative group hover:shadow-md transition-shadow">
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shadow-lg shadow-emerald-500/30">3</div>
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <BarChart3 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Get Insights</h3>
                  <p className="text-slate-500 font-medium">View predictions, EMI,<br/>ROI and more instantly.</p>
               </div>
            </div>
         </div>
      </section>

      {/* --- EVERYTHING YOU NEED SECTION --- */}
      <section className="py-24 bg-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#F8FAFC] rounded-[40px] border border-slate-100 flex flex-col lg:flex-row items-center p-8 lg:p-16 gap-12 lg:gap-8">
               
               {/* Left: Checklist */}
               <div className="flex-1 max-w-xl">
                  <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-8 leading-tight">Everything You Need,<br/>All in One Place</h2>
                  <div className="space-y-4 mb-10">
                     {[
                        "Price Prediction & Trends",
                        "EMI Calculator",
                        "Investment ROI",
                        "Valuation Report (Downloadable)",
                        "Easy & Interactive Experience"
                     ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                           </div>
                           <span className="text-slate-700 font-semibold">{item}</span>
                        </div>
                     ))}
                  </div>
                  <Link to="/app" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                     Explore Now <ArrowRight className="w-4 h-4" />
                  </Link>
               </div>

               {/* Right: Laptop Mockup */}
               <div className="flex-1 relative w-full perspective-[1000px]">
                  {/* Potted Plant */}
                  <div className="absolute -right-8 bottom-0 w-24 h-32 z-20">
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-12 bg-white rounded-b-xl border border-slate-200"></div>
                     <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-4 h-16 bg-green-700 rounded-full origin-bottom rotate-[-20deg]"></div>
                     <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-4 h-12 bg-green-600 rounded-full origin-bottom rotate-[20deg]"></div>
                     <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-4 h-20 bg-green-500 rounded-full origin-bottom"></div>
                  </div>

                  {/* Laptop Body */}
                  <div className="relative w-full max-w-[600px] mx-auto z-10 transform rotate-y-[-5deg] rotate-x-[2deg]">
                     {/* Screen */}
                     <div className="bg-slate-900 rounded-t-3xl p-3 pb-4 shadow-2xl">
                        <div className="bg-white rounded-xl h-[340px] overflow-hidden flex relative">
                           {/* Fake Dashboard Layout inside screen */}
                           <div className="w-40 border-r border-slate-100 p-4 pt-6 hidden sm:block">
                              <div className="flex items-center gap-2 mb-8">
                                 <div className="w-5 h-5 bg-indigo-600 rounded-md"></div>
                                 <span className="text-xs font-bold">FlatVision</span>
                              </div>
                              <div className="space-y-4">
                                 <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium"><Home className="w-3 h-3"/> Dashboard</div>
                                 <div className="flex items-center gap-2 text-[10px] text-indigo-600 font-bold bg-indigo-50 p-2 rounded-md"><PlayCircle className="w-3 h-3"/> Start Prediction</div>
                                 <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium"><FileText className="w-3 h-3"/> History</div>
                              </div>
                           </div>
                           <div className="flex-1 p-4 bg-slate-50 relative">
                              <div className="flex justify-between items-start mb-4">
                                 <div>
                                    <h4 className="font-bold text-sm text-slate-900">Property Insights</h4>
                                    <p className="text-[8px] text-slate-400 mt-0.5">New Alipore, Kolkata • 3 BHK • 1250 sq.ft</p>
                                 </div>
                                 <div className="w-5 h-5 rounded-full bg-slate-200"></div>
                              </div>
                              
                              <div className="flex gap-2 mb-4">
                                 <div className="flex-1 bg-white p-2 rounded-lg border border-slate-100">
                                    <div className="text-[8px] text-slate-400 mb-1">Predicted Price</div>
                                    <div className="font-bold text-xs">₹78.5 L</div>
                                    <div className="text-[7px] text-emerald-500 font-bold">↑ 4.2%</div>
                                 </div>
                                 <div className="flex-1 bg-white p-2 rounded-lg border border-slate-100">
                                    <div className="text-[8px] text-slate-400 mb-1">EMI (20 yrs)</div>
                                    <div className="font-bold text-xs">₹35,823<span className="text-[7px] font-normal text-slate-400">/mo</span></div>
                                 </div>
                                 <div className="flex-1 bg-white p-2 rounded-lg border border-slate-100">
                                    <div className="text-[8px] text-slate-400 mb-1">ROI</div>
                                    <div className="font-bold text-xs">6.1% <span className="text-[7px] font-normal text-slate-400">CAGR</span></div>
                                    <div className="text-[7px] text-emerald-500 font-bold">↑ 0.8%</div>
                                 </div>
                              </div>
                              
                              <div className="flex gap-2">
                                 <div className="flex-[2] bg-white border border-slate-100 rounded-lg p-2 h-24">
                                    <div className="text-[8px] font-bold text-slate-700 mb-2">Price Trend</div>
                                    {/* Mock chart */}
                                    <div className="w-full h-12 relative border-b border-l border-slate-100">
                                       <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20"><path d="M0,20 L20,15 L40,12 L60,8 L80,5 L100,2" fill="none" stroke="#4f46e5" strokeWidth="2"/></svg>
                                    </div>
                                 </div>
                                 <div className="flex-1 bg-white border border-slate-100 rounded-lg p-2 h-24 flex flex-col justify-between">
                                    <div className="text-[8px] font-bold text-slate-700">Valuation Report</div>
                                    <div className="w-full h-10 bg-slate-100 rounded overflow-hidden">
                                       <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="prop" className="w-full h-full object-cover" />
                                    </div>
                                    <button className="w-full py-1 bg-indigo-600 text-white rounded text-[7px] font-bold">Download PDF</button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     {/* Base */}
                     <div className="w-[110%] -ml-[5%] h-4 bg-slate-300 rounded-b-xl relative z-20 flex justify-center items-start border-t border-slate-400">
                        <div className="w-20 h-1 bg-slate-400 rounded-b-md"></div>
                     </div>
                     {/* Shadow */}
                     <div className="w-[115%] -ml-[7.5%] h-6 bg-black/10 blur-md rounded-full mt-2"></div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* --- FOOTER CTA & FOOTER --- */}
      <footer className="bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* CTA Banner */}
            <div className="w-full rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 p-8 lg:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 mb-16 shadow-xl shadow-indigo-500/20 relative overflow-hidden">
               {/* Decorative background shapes */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
               
               <div className="flex items-center gap-6 relative z-10 text-center md:text-left flex-col md:flex-row">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/30">
                     <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold mb-2">Ready to discover your property's true value?</h3>
                     <p className="text-indigo-100 font-medium">Join thousands of smart property seekers today.</p>
                  </div>
               </div>
               
               <div className="relative z-10 w-full md:w-auto">
                  <Link to="/app/predict" className="w-full md:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-50 text-indigo-600 font-bold shadow-lg transition-colors flex items-center justify-center gap-2">
                     Start Now <ArrowRight className="w-5 h-5" />
                  </Link>
               </div>
            </div>

            {/* Main Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-100 py-8 gap-6">
               
               {/* Logo & Brand */}
               <div className="flex flex-col items-center gap-1 md:items-start">
                  <div className="flex items-center justify-center">
                    <img src="/flatvision-logo.png" alt="FlatVision Logo" className="h-16 md:h-20 mix-blend-multiply" />
                  </div>
               </div>

               {/* Links */}
               <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-semibold text-slate-500">
                  <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                  <Link to="/app/predict" className="hover:text-indigo-600 transition-colors">Start Prediction</Link>
                  <Link to="/how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</Link>
               </div>

               {/* Copyright */}
               <div className="text-xs font-medium text-slate-400">
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
