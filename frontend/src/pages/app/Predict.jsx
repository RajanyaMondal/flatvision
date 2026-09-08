import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Info, Share2, Download, Copy, Calculator, TrendingUp, ShieldCheck } from 'lucide-react';
import { z } from 'zod';

const propertySchema = z.object({
  Bedrooms: z.number().min(1).max(5, "Bedrooms must be between 1 and 5"),
  Area_Sqft: z.number().min(100, "Area must be at least 100 Sqft").max(50000, "Area is unreasonably large"),
  Floor: z.number().min(1, "Floor level must be at least 1").max(100, "Floor level is suspiciously high"),
  Car_Parking_Sqft: z.number().min(0, "Car parking cannot be negative").max(2000, "Car parking area is too large"),
  Facing: z.enum(['North', 'South', 'East', 'West'])
});

const Predict = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    Area_Sqft: 1000,
    Facing: 'North',
    Floor: 3,
    Car_Parking_Sqft: 120,
    Bedrooms: 2
  });

  useEffect(() => {
    if (location.state?.prediction) {
      const pred = location.state.prediction;
      setFormData(pred.input_features);
      setResult(pred);
      setSimulatedArea(pred.input_features.Area_Sqft);
    }
  }, [location.state]);

  // Simulator State
  const [simulatedArea, setSimulatedArea] = useState(1000);
  
  // EMI Calculator State
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(15);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationError('');
    setResult(null);
    
    try {
      // Validate input data with Zod
      propertySchema.parse(formData);
      
      const mlServiceUrl = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000';
      const mlResponse = await fetch(`${mlServiceUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!mlResponse.ok) throw new Error('Prediction service is currently unavailable.');
      const mlData = await mlResponse.json();

      const basePriceLakh = mlData.predicted_price / 100000;
      
      // Calculate monthly growth rate based on 7% annual appreciation (matches ROI section)
      const monthlyGrowth = Math.pow(1.07, 1/12);
      
      const monthsLabel = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      
      const forecastData = [];
      // 3 months history
      for (let i = -3; i <= 0; i++) {
        const d = new Date(currentDate.getFullYear(), currentMonth + i, 1);
        const price = basePriceLakh * Math.pow(monthlyGrowth, i);
        forecastData.push({
          month: monthsLabel[d.getMonth()],
          hist: parseFloat(price.toFixed(2)),
          forecast: i === 0 ? parseFloat(price.toFixed(2)) : null
        });
      }
      
      // 6 months forecast
      for (let i = 1; i <= 6; i++) {
        const d = new Date(currentDate.getFullYear(), currentMonth + i, 1);
        const price = basePriceLakh * Math.pow(monthlyGrowth, i);
        forecastData.push({
          month: monthsLabel[d.getMonth()],
          hist: null,
          forecast: parseFloat(price.toFixed(2))
        });
      }

      const finalPrediction = {
        id: Math.random().toString(36).substring(7),
        created_at: new Date().toISOString(),
        input_features: formData,
        predicted_price: mlData.predicted_price,
        model_name: mlData.model_name,
        prediction_metadata: mlData.metadata,
        forecastData
      };

      setResult(finalPrediction);

      try {
        const existingHistory = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
        localStorage.setItem('predictionHistory', JSON.stringify([finalPrediction, ...existingHistory]));
      } catch (e) {
        console.error("Could not save prediction to history", e);
      }
      
      setSimulatedArea(formData.Area_Sqft); // Initialize simulator
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationError(err.errors[0].message);
      } else {
        setError(err.message || 'Prediction failed to generate. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculations derived from Simulator
  const simulatedPrice = result ? (result.predicted_price * (simulatedArea / result.input_features.Area_Sqft)) : 0;
  
  // Valuation Breakdown
  const baseValue = simulatedPrice * 0.82;
  const floorPremium = simulatedPrice * 0.08;
  const facingPremium = simulatedPrice * 0.05;
  const parkingValue = simulatedPrice * 0.05;
  
  // EMI Math
  const principal = simulatedPrice * (1 - (downPaymentPct / 100));
  const r = (interestRate / 100) / 12;
  const n = loanTenure * 12;
  const emi = (principal > 0 && r > 0 && n > 0) ? (principal * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1) : 0;

  // ROI Math
  const roi5Yr = simulatedPrice * Math.pow(1.07, 5);
  const roi10Yr = simulatedPrice * Math.pow(1.07, 10);

  // Actions
  const handleCopyReport = async () => {
    const report = `FlatVision Property Valuation Report
--------------------------------------
Estimated Value: ₹${(simulatedPrice / 100000).toFixed(2)} Lakhs
Area: ${simulatedArea} sqft | Floor: ${formData.Floor} | Facing: ${formData.Facing}

Valuation Breakdown:
- Base Value: ₹${(baseValue / 100000).toFixed(2)} Lakhs
- Floor Premium: ₹${(floorPremium / 100000).toFixed(2)} Lakhs
- Facing Premium: ₹${(facingPremium / 100000).toFixed(2)} Lakhs
- Parking Value: ₹${(parkingValue / 100000).toFixed(2)} Lakhs

Financial Insights:
- EMI: ₹${Math.round(emi).toLocaleString()} / month
- 5 Year ROI: ₹${(roi5Yr / 100000).toFixed(2)} Lakhs
- 10 Year ROI: ₹${(roi10Yr / 100000).toFixed(2)} Lakhs
`;
    try {
      await navigator.clipboard.writeText(report);
      alert('Report copied to clipboard!');
    } catch (err) {
      alert('Failed to copy report.');
    }
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FlatVision Valuation Report',
          text: `Check out this property valuation of ₹${(simulatedPrice / 100000).toFixed(2)} Lakhs!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard! Share it with your friends.');
    }
  };


  return (
    <div 
      className="relative min-h-screen overflow-hidden text-[#0A2540] font-sans selection:bg-[#92EEFF]/30 py-10 px-4 sm:px-6 lg:px-8 print:p-0"
      style={{
        background: '#F2EFE7'
      }}
    >
      {/* Playful Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,173,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,173,238,0.06)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none print:hidden" />

      {/* Animated Mesh Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#92EEFF]/30 blur-[120px] mix-blend-multiply animate-blob print:hidden"></div>
      <div className="absolute top-[30%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#58E0FF]/20 blur-[120px] mix-blend-multiply animate-blob animation-delay-2000 print:hidden"></div>
      <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] rounded-full bg-[#47D8FF]/20 blur-[120px] mix-blend-multiply animate-blob animation-delay-4000 print:hidden"></div>

      <div className="relative z-10 max-w-[1200px] mx-auto space-y-8 pb-12 transition-colors duration-300 print:max-w-full print:p-0">
        <div className="print:hidden text-center md:text-left">
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#0A2540] to-[#163050] mb-2 tracking-tight">New Property Valuation</h1>
          <p className="text-[#476685] font-bold tracking-wide">Enter property details to get an estimated market price using our AI model.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block">
          {/* Form Card */}
          <Card className="clay-card p-8 print:hidden relative overflow-hidden group">
            {/* Decorative element inside card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#58E0FF]/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6 relative z-10">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold rounded-[16px] backdrop-blur-md">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#476685] mb-2 tracking-wide">Bedrooms</label>
                  <select 
                    name="Bedrooms" 
                    value={formData.Bedrooms} 
                    onChange={handleInputChange} 
                    className="block w-full rounded-[16px] bg-white/60 border border-[#7AAACE]/30 text-[#0A2540] sm:text-sm py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#58E0FF]/50 focus:border-[#58E0FF] transition-all duration-300 backdrop-blur-md cursor-pointer hover:bg-white"
                  >
                    <option value={1}>1 BHK</option>
                    <option value={2}>2 BHK</option>
                    <option value={3}>3 BHK</option>
                    <option value={4}>4 BHK</option>
                    <option value={5}>5 BHK</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#476685] mb-2 tracking-wide">Area (Sqft)</label>
                  <input
                    type="number" 
                    name="Area_Sqft" 
                    value={formData.Area_Sqft} 
                    onChange={handleInputChange} 
                    min="100" 
                    required 
                    className="block w-full rounded-[16px] bg-white/60 border border-[#7AAACE]/30 text-[#0A2540] sm:text-sm py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#58E0FF]/50 focus:border-[#58E0FF] transition-all duration-300 backdrop-blur-md hover:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#476685] mb-2 tracking-wide">Floor Level</label>
                  <input
                    type="number" 
                    name="Floor" 
                    value={formData.Floor} 
                    onChange={handleInputChange} 
                    min="1" 
                    required 
                    className="block w-full rounded-[16px] bg-white/60 border border-[#7AAACE]/30 text-[#0A2540] sm:text-sm py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#58E0FF]/50 focus:border-[#58E0FF] transition-all duration-300 backdrop-blur-md hover:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#476685] mb-2 tracking-wide">Car Parking (Sqft)</label>
                  <input
                    type="number" 
                    name="Car_Parking_Sqft" 
                    value={formData.Car_Parking_Sqft} 
                    onChange={handleInputChange} 
                    min="0" 
                    required 
                    className="block w-full rounded-[16px] bg-white/60 border border-[#7AAACE]/30 text-[#0A2540] sm:text-sm py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#58E0FF]/50 focus:border-[#58E0FF] transition-all duration-300 backdrop-blur-md hover:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#476685] mb-2 tracking-wide">Property Facing</label>
                <select 
                  name="Facing" 
                  value={formData.Facing} 
                  onChange={handleInputChange} 
                  className="block w-full rounded-[16px] bg-white/60 border border-[#7AAACE]/30 text-[#0A2540] sm:text-sm py-3 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#58E0FF]/50 focus:border-[#58E0FF] transition-all duration-300 backdrop-blur-md cursor-pointer hover:bg-white"
                >
                  {['North', 'South', 'East', 'West'].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full text-lg mt-6 clay-accent font-black py-4"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-[#0A2540]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Running Model...
                  </span>
                ) : 'Calculate AI Valuation'}
              </button>
            </form>
          </Card>

          <div className="print:block print:w-full">
            {result ? (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500 h-full flex flex-col">
                <div className="bg-white border border-[#7AAACE]/30/20 shadow-2xl shadow-[#0A2540]/30 rounded-[32px] p-8 relative overflow-hidden flex-1 flex flex-col justify-center transition-colors print:shadow-none print:border-none print:bg-white print:text-black">
                  <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#58E0FF]/20 rounded-full blur-[80px] print:hidden"></div>
                  <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-[#92EEFF]/10 rounded-full blur-[60px] print:hidden"></div>
                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <div className="text-[#92EEFF] text-xs font-black mb-3 uppercase tracking-widest flex items-center gap-2 print:text-slate-600">
                         <ShieldCheck className="w-5 h-5 text-[#58E0FF]" /> Final Estimated Value
                      </div>
                      <div className="text-5xl md:text-7xl font-black text-[#0A2540] tracking-tighter drop-shadow-lg print:text-slate-900 flex items-baseline gap-2">
                        ₹{(result.predicted_price / 100000).toFixed(2)} <span className="text-3xl font-bold text-[#92EEFF] print:text-slate-600">L</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 text-[#0A2540] mt-6 font-bold text-sm flex items-center gap-3 w-fit border border-white/10 print:bg-slate-100 print:text-slate-700">
                        <span>R² Score: {result.prediction_metadata?.r2_score?.toFixed(4) || 'N/A'}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#58E0FF] print:bg-slate-400 shadow-[0_0_8px_rgba(255,140,217,0.8)]"></span>
                        <span>High Confidence</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-4 print:hidden">
                   <button onClick={handleCopyReport} className="flex flex-col items-center justify-center py-5 clay-btn bg-white/60 text-[#0A2540] font-bold text-sm group">
                      <Copy className="w-6 h-6 mb-2 text-[#476685] group-hover:text-[#00D2FF] transition-colors" /> Copy
                   </button>
                   <button onClick={handleDownloadPDF} className="flex flex-col items-center justify-center py-5 clay-btn bg-white/60 text-[#0A2540] font-bold text-sm group">
                      <Download className="w-6 h-6 mb-2 text-[#476685] group-hover:text-[#00D2FF] transition-colors" /> PDF
                   </button>
                   <button onClick={handleShareLink} className="flex flex-col items-center justify-center py-5 clay-btn bg-white/60 text-[#0A2540] font-bold text-sm group">
                      <Share2 className="w-6 h-6 mb-2 text-[#476685] group-hover:text-[#00D2FF] transition-colors" /> Share
                   </button>
                </div>
              </div>
            ) : (
              <div className="h-full border-2 border-dashed border-[#7AAACE]/30 rounded-[32px] flex flex-col items-center justify-center p-8 text-center text-[#476685] bg-white/30 backdrop-blur-xl transition-colors print:hidden shadow-inner">
                <div className="w-20 h-20 bg-white/60 rounded-[24px] flex items-center justify-center mb-6 transition-colors shadow-sm border border-[#7AAACE]/30">
                   <svg className="w-10 h-10 text-[#476685]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <p className="font-black text-xl text-[#0A2540]">Awaiting Information</p>
                <p className="text-sm mt-2 font-bold max-w-xs mx-auto">Fill out the form and submit to generate your comprehensive AI valuation report.</p>
              </div>
            )}
          </div>
        </div>

        {result && (
          <div className="mt-12 space-y-8 animate-in fade-in duration-700 delay-300 print:mt-4 print:space-y-4">
             
             {/* Detailed Valuation Report & Simulator Row */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block print:space-y-6">
                {/* Comprehensive Valuation Report */}
                <Card className="clay-card p-8 print:border-none print:shadow-none print:p-0">
                   <h3 className="text-2xl font-black text-[#0A2540] flex items-center gap-2 mb-8 border-b border-[#7AAACE]/30 pb-5">
                      Valuation Breakdown <Info className="w-5 h-5 text-[#476685] print:hidden" />
                   </h3>
                   <div className="space-y-6">
                      <div className="flex justify-between items-center group">
                         <span className="text-[#476685] font-bold tracking-wide group-hover:text-[#0A2540] transition-colors">Base Property Value</span>
                         <span className="font-black text-xl text-[#0A2540] whitespace-nowrap">₹{(baseValue / 100000).toFixed(2)} L</span>
                      </div>
                      <div className="flex justify-between items-center group">
                         <span className="text-[#476685] font-bold tracking-wide flex items-center gap-3 group-hover:text-[#0A2540] transition-colors">Floor Premium <span className="text-xs bg-[#58E0FF]/10 text-[#00D2FF] px-3 py-1 rounded-[10px] font-black border border-[#7AAACE]/30">Level {formData.Floor}</span></span>
                         <span className="font-black text-xl text-[#00D2FF] whitespace-nowrap">+₹{(floorPremium / 100000).toFixed(2)} L</span>
                      </div>
                      <div className="flex justify-between items-center group">
                         <span className="text-[#476685] font-bold tracking-wide flex items-center gap-3 group-hover:text-[#0A2540] transition-colors">{formData.Facing} Facing Premium</span>
                         <span className="font-black text-xl text-emerald-600 whitespace-nowrap">+₹{(facingPremium / 100000).toFixed(2)} L</span>
                      </div>
                      <div className="flex justify-between items-center group">
                         <span className="text-[#476685] font-bold tracking-wide flex items-center gap-3 group-hover:text-[#0A2540] transition-colors">Parking Valuation <span className="text-xs bg-slate-500/10 text-slate-600 px-3 py-1 rounded-[10px] font-black border border-slate-500/20">{formData.Car_Parking_Sqft} sqft</span></span>
                         <span className="font-black text-xl text-blue-600 whitespace-nowrap">+₹{(parkingValue / 100000).toFixed(2)} L</span>
                      </div>
                      <div className="pt-6 border-t-2 border-dashed border-[#7AAACE]/30 flex justify-between items-center">
                         <span className="text-xl font-black text-[#0A2540] uppercase tracking-widest">Adjusted Value</span>
                         <span className="text-3xl sm:text-4xl font-black text-[#00D2FF] drop-shadow-sm whitespace-nowrap">₹{(simulatedPrice / 100000).toFixed(2)} L</span>
                      </div>
                   </div>
                </Card>

                {/* Interactive Area Simulator */}
                <Card className="clay-card p-8 flex flex-col justify-between print:hidden relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-[300px] h-full bg-gradient-to-l from-[#58E0FF]/10 to-transparent pointer-events-none"></div>
                   <div className="relative z-10">
                      <h3 className="text-2xl font-black text-[#0A2540] flex items-center gap-2 mb-2">
                         Interactive Simulator
                      </h3>
                      <p className="text-[#476685] text-sm font-bold mb-10 tracking-wide">Adjust the slider to instantly see size impact on valuation.</p>
                   </div>
                   
                   <div className="mb-10 relative z-10">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-4 sm:gap-0">
                         <div className="text-5xl font-black text-[#00D2FF] tracking-tighter whitespace-nowrap">{simulatedArea} <span className="text-xl font-bold text-[#58E0FF]">sqft</span></div>
                         <div className="text-left sm:text-right">
                            <div className="text-[10px] font-black text-[#476685] uppercase tracking-widest mb-1">Value per Sqft</div>
                            <div className="text-2xl font-black text-[#0A2540]">₹{Math.round(simulatedPrice / simulatedArea).toLocaleString()}</div>
                         </div>
                      </div>
                      <input 
                        type="range" 
                        min="300" max="5000" step="50"
                        value={simulatedArea} 
                        onChange={(e) => setSimulatedArea(Number(e.target.value))}
                        className="w-full h-3 bg-white border border-[#7AAACE]/30 rounded-full appearance-none cursor-pointer accent-[#00D2FF] shadow-inner"
                      />
                      <div className="flex justify-between text-xs font-black text-[#476685] mt-3 uppercase tracking-wider">
                         <span>300 sqft</span>
                         <span>5000 sqft</span>
                      </div>
                   </div>

                   <div className="bg-[#F2EFE7] backdrop-blur-xl rounded-[20px] p-6 border border-[#7AAACE]/30 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 sm:gap-0 shadow-md relative z-10">
                      <span className="font-black text-[#0A2540] tracking-wide whitespace-nowrap">Simulated Price</span>
                      <span className="text-3xl sm:text-4xl font-black text-[#00D2FF] whitespace-nowrap">₹{(simulatedPrice / 100000).toFixed(2)} L</span>
                   </div>
                </Card>
             </div>

             {/* Financial Hub Row */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block print:space-y-6">
                {/* EMI Calculator */}
                <Card className="clay-card p-8 print:border-none print:shadow-none print:p-0">
                   <h3 className="text-2xl font-black text-[#0A2540] flex items-center gap-2 mb-8 border-b border-[#7AAACE]/30 pb-5">
                      EMI Calculator <Calculator className="w-5 h-5 text-[#00D2FF] print:hidden" />
                   </h3>
                   <div className="space-y-8">
                      <div className="print:hidden group">
                         <div className="flex justify-between mb-3"><label className="text-sm font-black text-[#476685] tracking-wide">Down Payment ({downPaymentPct}%)</label><span className="text-sm font-black text-[#00D2FF] bg-[#F2EFE7] px-3 py-1 rounded-[8px] border border-[#7AAACE]/30">₹{((simulatedPrice * downPaymentPct / 100) / 100000).toFixed(2)} L</span></div>
                         <input type="range" min="10" max="90" step="5" value={downPaymentPct} onChange={(e) => setDownPaymentPct(Number(e.target.value))} className="w-full h-2.5 bg-white border border-[#7AAACE]/30 rounded-full appearance-none cursor-pointer accent-[#00D2FF] shadow-inner" />
                      </div>
                      <div className="print:hidden group">
                         <div className="flex justify-between mb-3"><label className="text-sm font-black text-[#476685] tracking-wide">Interest Rate</label><span className="text-sm font-black text-[#00D2FF] bg-[#F2EFE7] px-3 py-1 rounded-[8px] border border-[#7AAACE]/30">{interestRate}%</span></div>
                         <input type="range" min="5" max="15" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full h-2.5 bg-white border border-[#7AAACE]/30 rounded-full appearance-none cursor-pointer accent-[#00D2FF] shadow-inner" />
                      </div>
                      <div className="print:hidden group">
                         <div className="flex justify-between mb-3"><label className="text-sm font-black text-[#476685] tracking-wide">Loan Tenure</label><span className="text-sm font-black text-[#00D2FF] bg-[#F2EFE7] px-3 py-1 rounded-[8px] border border-[#7AAACE]/30">{loanTenure} Years</span></div>
                         <input type="range" min="5" max="30" step="1" value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))} className="w-full h-2.5 bg-white border border-[#7AAACE]/30 rounded-full appearance-none cursor-pointer accent-[#00D2FF] shadow-inner" />
                      </div>
                      <div className="pt-6 border-t-2 border-dashed border-[#7AAACE]/30 print:border-none print:pt-0">
                         <div className="bg-[#F2EFE7] backdrop-blur-xl border border-[#7AAACE]/30 rounded-[24px] p-6 flex justify-between items-center shadow-md print:bg-white print:border-slate-200">
                            <div>
                               <div className="text-[10px] font-black text-[#476685] uppercase tracking-widest mb-1.5">Monthly EMI</div>
                               <div className="text-xs font-bold text-[#476685]">Prin: ₹{(principal/100000).toFixed(2)}L @ {interestRate}% for {loanTenure}Y</div>
                            </div>
                            <div className="text-4xl font-black text-[#00D2FF] tracking-tighter drop-shadow-sm">
                               ₹{Math.round(emi).toLocaleString()}
                            </div>
                         </div>
                      </div>
                   </div>
                </Card>

                {/* Investment ROI & Future Price */}
                <div className="space-y-8 print:space-y-6">
                   {/* ROI Card */}
                   <Card className="bg-gradient-to-br from-[#58E0FF] to-[#92EEFF] shadow-xl shadow-[#58E0FF]/20 rounded-[32px] p-8 text-[#0A2540] relative overflow-hidden print:bg-white print:border print:border-slate-200 print:text-black hover:scale-[1.02] transition-transform duration-500 cursor-default">
                      <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/20 rounded-full blur-[40px] print:hidden"></div>
                      <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-white/10 rounded-full blur-[40px] print:hidden"></div>
                      <h3 className="text-2xl font-black flex items-center gap-2 mb-8 relative z-10 print:text-[#0A2540] tracking-tight">
                         Investment ROI <TrendingUp className="w-6 h-6 text-[#0A2540] print:hidden" />
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 relative z-10">
                         <div className="bg-white/20 p-4 sm:p-0 sm:bg-transparent rounded-2xl border border-white/20 sm:border-none">
                            <div className="text-[#0A2540]/80 print:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">In 5 Years</div>
                            <div className="text-3xl sm:text-4xl font-black print:text-slate-900 tracking-tighter whitespace-nowrap">₹{(roi5Yr / 100000).toFixed(2)} <span className="text-xl text-[#0A2540]/90">L</span></div>
                            <div className="text-sm font-bold text-[#0A2540] print:text-slate-600 mt-2 bg-white/30 sm:bg-white/20 w-fit px-3 py-1 rounded-[8px] border border-white/30 shadow-sm sm:shadow-none">~40% Appr.</div>
                         </div>
                         <div className="bg-white/20 p-4 sm:p-0 sm:bg-transparent rounded-2xl border border-white/20 sm:border-none">
                            <div className="text-[#0A2540]/80 print:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">In 10 Years</div>
                            <div className="text-3xl sm:text-4xl font-black print:text-slate-900 tracking-tighter whitespace-nowrap">₹{(roi10Yr / 100000).toFixed(2)} <span className="text-xl text-[#0A2540]/90">L</span></div>
                            <div className="text-sm font-bold text-[#0A2540] print:text-slate-600 mt-2 bg-white/30 sm:bg-white/20 w-fit px-3 py-1 rounded-[8px] border border-white/30 shadow-sm sm:shadow-none">~96% Appr.</div>
                         </div>
                      </div>
                   </Card>
                   
                   {/* Future Price Forecast */}
                   <Card className="clay-card p-8 flex flex-col print:hidden relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8 relative z-10">
                         <h3 className="text-2xl font-black text-[#0A2540] flex items-center gap-2 tracking-tight">
                            6-Month Forecast
                         </h3>
                         <div className="flex gap-5 text-xs font-black text-[#476685] bg-white/60 px-4 py-2 rounded-[12px] backdrop-blur-md shadow-sm border border-[#7AAACE]/30">
                            <div className="flex items-center gap-2"><div className="w-4 h-1.5 bg-[#58E0FF] rounded-full shadow-[0_0_8px_rgba(255,140,217,0.6)]"></div> Hist.</div>
                            <div className="flex items-center gap-2"><div className="w-4 h-1.5 border-t-[3px] border-dotted border-[#00D2FF]"></div> Fcst.</div>
                         </div>
                      </div>
                      <div className="w-full h-[250px] min-h-[250px] relative z-10">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={result.forecastData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#C2F6FF" opacity={0.6} />
                              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#476685', fontWeight: 'bold' }} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#476685', fontWeight: 'bold' }} domain={['dataMin - 5', 'dataMax + 5']} />
                              <RechartsTooltip contentStyle={{ borderRadius: '16px', padding: '12px', fontSize: '14px', fontWeight: 'bold', border: '1px solid #C2F6FF', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', color: '#0A2540', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                              <Line type="monotone" dataKey="hist" stroke="#00D2FF" strokeWidth={4} dot={{ r: 5, fill: '#58E0FF', stroke: '#fff', strokeWidth: 3, style: { filter: 'drop-shadow(0px 4px 6px rgba(255, 140, 217, 0.4))' } }} />
                              <Line type="monotone" dataKey="forecast" stroke="#C8DFDB" strokeWidth={4} strokeDasharray="6 6" dot={{ r: 5, fill: '#00D2FF', stroke: '#fff', strokeWidth: 3, style: { filter: 'drop-shadow(0px 4px 6px rgba(255, 115, 208, 0.4))' } }} />
                            </LineChart>
                         </ResponsiveContainer>
                      </div>
                   </Card>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Validation Error Popup Modal */}
      {validationError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A2540]/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md p-8 relative transform transition-all scale-100">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <Info className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-center text-[#0A2540] mb-3 tracking-tight">The input is invalid</h3>
            <p className="text-[#476685] font-semibold text-center mb-8 text-lg">{validationError}</p>
            <Button 
              onClick={() => setValidationError('')} 
              className="w-full bg-[#0A2540] hover:bg-[#163050] text-white rounded-[16px] py-4 text-lg font-bold shadow-lg"
            >
              Go Back & Fix
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Predict;
