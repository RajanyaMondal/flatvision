import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Calculator, TrendingUp, ShieldCheck, FileText, 
  PlayCircle, ArrowRight, Home, BrainCircuit, BarChart3, 
  MapPin, CheckCircle2, Lock, Sparkles
} from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF9F5] via-[#E5F5F8] to-[#FAF8F0] font-sans selection:bg-[#C8DFDB]/50 selection:text-[#163050]">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
         {/* Background Glows */}
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#C8DFDB]/40 rounded-full blur-[100px] -z-10"></div>
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#E0F2FE]/50 rounded-full blur-[100px] -z-10"></div>
         
         <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0 xl:mr-10">
               {/* Badge */}
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50/50 backdrop-blur-sm border border-white mb-8 text-sm font-semibold text-[#3B82F6] shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#3B82F6]" />
                  AI-Powered Property Insights
               </div>
               
               {/* Heading */}
               <h1 className="text-[44px] sm:text-5xl lg:text-[72px] font-extrabold text-[#112338] leading-[1.05] mb-6 tracking-tight">
                  Make Smarter<br/>
                  Property Decisions<br/>
                  with <span className="text-[#3B82F6]">Confidence.</span>
               </h1>
               
               {/* Subtitle */}
               <p className="text-lg lg:text-xl text-[#5A738E] mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  Get accurate price predictions, EMI estimates, investment insights and more — all in one place.
               </p>
               
               {/* Buttons */}
               <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
                  <Link to="/app/predict" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#163050] hover:bg-[#0E2038] text-white font-bold shadow-[0_8px_30px_rgb(22,48,80,0.3)] transition-all flex items-center justify-center gap-2 text-lg">
                     Start Prediction <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/80 backdrop-blur-md border border-white hover:bg-white text-[#163050] font-bold transition-all flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-lg">
                     <PlayCircle className="w-6 h-6 text-[#163050]" /> Watch Demo
                  </button>
               </div>
               
               {/* Trust Indicators */}
               <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-10 gap-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                        <ShieldCheck className="w-5 h-5 text-blue-600" />
                     </div>
                     <div className="text-sm font-bold text-[#163050] leading-snug">Accurate<br/><span className="font-medium text-[#5A738E]">AI Predictions</span></div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                        <BarChart3 className="w-5 h-5 text-indigo-600" />
                     </div>
                     <div className="text-sm font-bold text-[#163050] leading-snug">Trusted<br/><span className="font-medium text-[#5A738E]">Data Insights</span></div>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                        <Lock className="w-5 h-5 text-emerald-600" />
                     </div>
                     <div className="text-sm font-bold text-[#163050] leading-snug">Secure<br/><span className="font-medium text-[#5A738E]">& Private</span></div>
                  </div>
               </div>
            </div>
            
            {/* Right Content (Real Image Mockup) */}
            <div className="flex-1 relative w-full max-w-2xl lg:max-w-none mt-16 lg:mt-0 perspective-[1200px]">
               <div className="relative">
                  {/* Main Image */}
                  <div className="relative w-full aspect-[4/3] rounded-[40px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-8 border-white/60">
                     <img src="/hero-apartment.jpg" alt="Modern Apartment Building" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000 ease-out" />
                  </div>

                  {/* Handwritten arrow */}
                  <div className="absolute top-1/4 -left-20 hidden xl:block text-slate-500 font-handwriting rotate-[-10deg]">
                     <div className="text-lg leading-tight mb-1 text-[#5A738E]">Smarter<br/>Insights for a<br/>Brighter Tomorrow</div>
                     <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="ml-16 mt-2 text-[#5A738E]">
                        <path d="M10 30 Q 20 10 35 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        <path d="M25 10 L 36 14 L 32 25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                     </svg>
                  </div>
                  
                  {/* Floating Card 1: Predicted Price (Top Left) */}
                  <div className="absolute -top-6 -left-6 sm:-top-8 sm:-left-12 bg-white/95 backdrop-blur-xl p-5 rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.06)] border border-white w-48 sm:w-56 animate-[float_4s_ease-in-out_infinite] z-20">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-md bg-[#E8F6F8] flex items-center justify-center"><Home className="w-3.5 h-3.5 text-teal-600" /></div>
                        <span className="text-xs font-semibold text-[#5A738E]">Predicted Price</span>
                     </div>
                     <div className="text-2xl sm:text-3xl font-black text-[#112338]">₹78.5 L</div>
                     <div className="flex items-center gap-1.5 mt-2 text-emerald-500 text-xs font-bold">
                        <TrendingUp className="w-3.5 h-3.5" /> 4.2% <span className="text-[#5A738E] font-medium ml-1">vs last month</span>
                     </div>
                  </div>
                  
                  {/* Floating Card 2: EMI (Top Right) */}
                  <div className="absolute top-12 -right-4 sm:-right-12 bg-white/95 backdrop-blur-xl p-5 rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.06)] border border-white w-40 sm:w-48 animate-[float_5s_ease-in-out_infinite_reverse] z-20 delay-150">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center"><Calculator className="w-3.5 h-3.5 text-blue-600" /></div>
                        <span className="text-xs font-semibold text-[#5A738E]">EMI (20 yrs)</span>
                     </div>
                     <div className="text-xl sm:text-2xl font-black text-[#112338]">₹35,823</div>
                     <div className="text-xs text-[#5A738E] font-medium mt-1">/month</div>
                  </div>
                  
                  {/* Floating Card 3: Investment ROI (Bottom Right) */}
                  <div className="absolute bottom-20 -right-4 sm:-right-12 bg-white/95 backdrop-blur-xl p-5 rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.06)] border border-white w-40 sm:w-48 animate-[float_4.5s_ease-in-out_infinite] z-20 delay-300">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center"><TrendingUp className="w-3.5 h-3.5 text-emerald-600" /></div>
                        <span className="text-xs font-semibold text-[#5A738E]">Investment Potential</span>
                     </div>
                     <div className="text-xl sm:text-2xl font-black text-[#112338]">6.1% <span className="text-xs text-[#5A738E] font-medium">CAGR</span></div>
                     <div className="mt-3 w-full h-8 relative">
                        <svg className="absolute w-full h-full bottom-0" preserveAspectRatio="none" viewBox="0 0 100 20">
                           <path d="M0,20 Q10,15 20,18 T40,10 T60,12 T80,5 T100,2" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                     </div>
                  </div>

                  {/* Floating Card 4: Location (Bottom Left) */}
                  <div className="absolute -bottom-6 left-10 sm:left-16 bg-white/95 backdrop-blur-xl px-5 py-4 rounded-3xl shadow-[0_15px_35px_rgba(0,0,0,0.06)] border border-white flex items-center gap-4 animate-[float_5.5s_ease-in-out_infinite_reverse] z-20">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-[#112338]" />
                     </div>
                     <div>
                        <div className="text-sm font-bold text-[#112338]">Bangalore, KA</div>
                        <div className="text-xs font-medium text-[#5A738E]">High Growth Area <ArrowRight className="w-3 h-3 inline ml-1" /></div>
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

      {/* --- HOW FLATVISION WORKS --- */}
      <section className="py-24 relative overflow-hidden">
         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Handwritten top right */}
            <div className="absolute -top-10 right-10 hidden lg:block text-slate-400 font-handwriting rotate-[-5deg] text-xl opacity-60">
               Smarter<br/>Homes.<br/>Brighter<br/>Tomorrows.
            </div>

            {/* Handwritten bottom left with house outline */}
            <div className="absolute -bottom-16 -left-10 hidden lg:flex items-end gap-2 text-slate-400 font-handwriting rotate-[-5deg] text-xl opacity-60">
               <Home className="w-16 h-16 stroke-1 absolute -top-8 -left-8 opacity-20" />
               Better<br/>Homes.<br/>Brighter<br/>Tomorrows.
            </div>

            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100/80 border border-slate-200 mb-6 text-xs font-bold text-slate-500 tracking-widest shadow-sm">
               SIMPLE • SMART • SEAMLESS
            </div>
            
            {/* Heading */}
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#112338] mb-4">
               How <span className="text-[#3B82F6]">FlatVision</span> Works
            </h2>
            <p className="text-[#5A738E] font-medium text-lg mb-16">Get property insights in just 3 simple steps</p>
            
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 relative">
               
               {/* Connecting Arrows (Desktop) */}
               <div className="hidden lg:flex absolute top-[35%] left-0 w-full justify-between px-[22%] -translate-y-1/2 -z-10 pointer-events-none">
                  <div className="flex items-center text-[#5A738E]/30">
                     <div className="w-16 border-t-2 border-dashed border-[#5A738E]/30"></div>
                     <ArrowRight className="w-5 h-5 -ml-1" />
                  </div>
                  <div className="flex items-center text-[#5A738E]/30">
                     <div className="w-16 border-t-2 border-dashed border-[#5A738E]/30"></div>
                     <ArrowRight className="w-5 h-5 -ml-1" />
                  </div>
               </div>

               {/* Step 1 */}
               <div className="w-full max-w-[320px] bg-white/95 backdrop-blur-xl p-6 lg:p-8 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative text-left flex flex-col min-h-[520px] group hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-full bg-blue-100/50 text-blue-600 font-bold flex items-center justify-center mb-6 text-sm">01</div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                     <Home className="w-7 h-7 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[#112338] mb-3">Enter Details</h3>
                  <p className="text-[#5A738E] text-sm leading-relaxed mb-6">Add location, property type,<br/>area and other basics.</p>
                  
                  {/* Mockup UI */}
                  <div className="mt-auto bg-slate-50/60 rounded-[24px] p-5 border border-slate-100/60 w-full">
                     <div className="space-y-3">
                        <div className="flex gap-2">
                           <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0"><MapPin className="w-4 h-4 text-slate-400" /></div>
                           <div className="flex-1 h-9 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center px-4 text-[11px] text-slate-300">Location</div>
                        </div>
                        <div className="flex gap-2">
                           <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0"><Home className="w-4 h-4 text-slate-400" /></div>
                           <div className="flex-1 h-9 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center px-4 text-[11px] text-slate-300">Property Type</div>
                        </div>
                        <div className="mt-5 pt-2">
                           <div className="w-full h-11 bg-[#3B82F6] rounded-xl flex items-center justify-center text-white text-sm font-bold gap-1.5 shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors cursor-pointer">Next <ArrowRight className="w-4 h-4"/></div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Step 2 */}
               <div className="w-full max-w-[320px] bg-white/95 backdrop-blur-xl p-6 lg:p-8 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative text-left flex flex-col min-h-[520px] group hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-full bg-indigo-100/50 text-indigo-600 font-bold flex items-center justify-center mb-6 text-sm">02</div>
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                     <BrainCircuit className="w-7 h-7 text-indigo-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[#112338] mb-3">AI Analyzes</h3>
                  <p className="text-[#5A738E] text-sm leading-relaxed mb-6">Our AI analyzes market<br/>data in real-time.</p>
                  
                  {/* Mockup UI */}
                  <div className="mt-auto bg-slate-50/60 rounded-[24px] p-5 border border-slate-100/60 relative w-full">
                     <div className="w-full h-24 bg-white rounded-xl shadow-sm border border-slate-100 mb-5 relative overflow-hidden flex items-end">
                        <svg className="w-full h-20" preserveAspectRatio="none" viewBox="0 0 100 40">
                           <path d="M0,35 L20,30 L40,32 L60,18 L80,22 L100,5" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                           <circle cx="100" cy="5" r="2.5" fill="#6366f1" />
                        </svg>
                     </div>
                     <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-full shadow-md border border-slate-100 text-[10px] font-bold text-indigo-600 flex items-center gap-1 z-10">
                        <Sparkles className="w-3 h-3" /> Analyzing...
                     </div>
                     <div className="space-y-3">
                        <div className="flex items-center gap-2.5 text-[11px] font-medium text-slate-600"><BarChart3 className="w-4 h-4 text-[#6366f1]" /> Market Trends</div>
                        <div className="flex items-center gap-2.5 text-[11px] font-medium text-slate-600"><FileText className="w-4 h-4 text-[#6366f1]" /> Comparative Analysis</div>
                        <div className="flex items-center gap-2.5 text-[11px] font-medium text-slate-600"><ShieldCheck className="w-4 h-4 text-[#6366f1]" /> Smart Algorithms</div>
                     </div>
                  </div>
               </div>

               {/* Step 3 */}
               <div className="w-full max-w-[320px] bg-white/95 backdrop-blur-xl p-6 lg:p-8 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white relative text-left flex flex-col min-h-[520px] group hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-10 h-10 rounded-full bg-emerald-100/50 text-emerald-600 font-bold flex items-center justify-center mb-6 text-sm">03</div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6">
                     <TrendingUp className="w-7 h-7 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-[#112338] mb-3">Get Insights</h3>
                  <p className="text-[#5A738E] text-sm leading-relaxed mb-6">View predictions, EMI,<br/>ROI and more instantly.</p>
                  
                  {/* Mockup UI */}
                  <div className="mt-auto bg-slate-50/60 rounded-[24px] p-5 border border-slate-100/60 w-full">
                     <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-5 relative overflow-hidden">
                        <div className="text-[10px] text-slate-400 font-medium mb-1">Estimated Price</div>
                        <div className="text-2xl font-black text-[#112338] mb-1">₹75.38 L</div>
                        <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold mb-4">
                           <TrendingUp className="w-3 h-3" /> 4.2% <span className="text-slate-400 font-normal">vs last month</span>
                        </div>
                        <div className="absolute w-full h-10 bottom-0 left-0">
                           <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                              <path d="M0,20 Q15,15 30,17 T50,12 T70,10 T90,2 T100,0" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round"/>
                           </svg>
                        </div>
                     </div>
                     <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2.5 text-[11px] font-medium text-slate-600"><FileText className="w-4 h-4 text-[#10b981]" /> Price Predictions</div>
                        <div className="flex items-center gap-2.5 text-[11px] font-medium text-slate-600"><TrendingUp className="w-4 h-4 text-[#10b981]" /> ROI & Investment Insights</div>
                     </div>
                  </div>
               </div>
               
            </div>
            
            {/* Bottom Pill */}
            <div className="mt-16 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-sm border border-slate-100 text-sm font-bold text-[#5A738E] hover:text-blue-600 hover:shadow-md transition-all cursor-pointer">
               Data Today. A Brighter Tomorrow. <ArrowRight className="w-4 h-4 text-blue-500" />
            </div>
         </div>
      </section>

      {/* --- PROFESSIONAL METRICS SECTION --- */}
      <section className="py-20 bg-white border-y border-slate-100 relative">
         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">
               <div className="text-center md:text-left px-6 py-4">
                  <div className="text-4xl font-extrabold text-[#112338] mb-2 tracking-tight">98.4%</div>
                  <div className="text-[#3B82F6] font-bold text-lg mb-2">Prediction Accuracy</div>
                  <p className="text-[#5A738E] text-sm leading-relaxed">Powered by state-of-the-art XGBoost algorithms trained on verified property registrations.</p>
               </div>
               <div className="text-center md:text-left px-6 py-4">
                  <div className="text-4xl font-extrabold text-[#112338] mb-2 tracking-tight">2.5M+</div>
                  <div className="text-[#10B981] font-bold text-lg mb-2">Data Points Analyzed</div>
                  <p className="text-[#5A738E] text-sm leading-relaxed">Continuous ingestion of real-time market trends, local infrastructure, and historical sales.</p>
               </div>
               <div className="text-center md:text-left px-6 py-4">
                  <div className="text-4xl font-extrabold text-[#112338] mb-2 tracking-tight">Enterprise</div>
                  <div className="text-[#6366F1] font-bold text-lg mb-2">Grade Architecture</div>
                  <p className="text-[#5A738E] text-sm leading-relaxed">Built with a scalable FastAPI backend, delivering sub-second prediction latency worldwide.</p>
               </div>
            </div>
         </div>
      </section>


      {/* --- FOOTER CTA & FOOTER --- */}
      <footer className="bg-[#F4F8F4]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* CTA Banner */}
            <div className="w-full rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 p-8 lg:p-12 text-[#0A2540] flex flex-col md:flex-row items-center justify-between gap-8 mb-16 shadow-[14px_14px_28px_rgba(180,200,195,0.4),-14px_-14px_28px_rgba(255,255,255,0.8)] shadow-indigo-500/20 relative overflow-hidden">
               {/* Decorative background shapes */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-[#F4F8F4]/10 rounded-full blur-3xl"></div>
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>
               
               <div className="flex items-center gap-6 relative z-10 text-center md:text-left flex-col md:flex-row">
                  <div className="w-16 h-16 rounded-2xl bg-[#F4F8F4]/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/30">
                     <Building2 className="w-8 h-8 text-[#0A2540]" />
                  </div>
                  <div>
                     <h3 className="text-2xl font-bold mb-2">Ready to discover your property's true value?</h3>
                     <p className="text-indigo-100 font-medium">Join thousands of smart property seekers today.</p>
                  </div>
               </div>
               
               <div className="relative z-10 w-full md:w-auto">
                  <Link to="/app/predict" className="w-full md:w-auto px-8 py-4 rounded-xl bg-[#F4F8F4] hover:bg-slate-50 text-[#059669] font-bold shadow-[10px_10px_20px_rgba(180,200,195,0.4),-10px_-10px_20px_rgba(255,255,255,0.8)] transition-colors flex items-center justify-center gap-2">
                     Start Now <ArrowRight className="w-5 h-5" />
                  </Link>
               </div>
            </div>

            {/* Main Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-100 py-8 gap-6">
               
               {/* Logo & Brand */}
               <div className="flex flex-col items-center gap-1 md:items-start">
                  <div className="flex items-center mb-6">
                    <img src="/new-logo.png" alt="FlatVision Logo" className="h-16 md:h-20 -ml-2 mix-blend-multiply" />
                  </div>
               </div>

               {/* Links */}
               <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-semibold text-[#476685]">
                  <Link to="/" className="hover:text-[#059669] transition-colors">Home</Link>
                  <Link to="/app/predict" className="hover:text-[#059669] transition-colors">Start Prediction</Link>
                  <Link to="/how-it-works" className="hover:text-[#059669] transition-colors">How It Works</Link>
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
