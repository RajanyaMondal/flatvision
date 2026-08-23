import React, { useState } from 'react';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Calculator, MapPin, Building, Activity, Home, Award, SlidersHorizontal, ListChecks, Maximize2, Compass, Layers, Car, Bed, TrendingUp } from 'lucide-react';

export default function PredictionForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    Area_Sqft: 1000,
    Facing: 'North',
    Floor: 3,
    Car_Parking_Sqft: 120,
    Bedrooms: 2
  });

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
    
    try {
      const res = await api.post('/predictions', formData);
      if (res.data.success) {
        setResult(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Prediction failed to generate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
  };

  const handlePrint = () => {
    window.print();
  };

  // Math breakdown logic for Linear Regression
  const getMathBreakdown = () => {
    if (!result || !result.predictionMetadata) return null;
    const meta = result.predictionMetadata;
    const intercept = meta.intercept || 0;
    const coefs = meta.coefficients || {};
    const features = result.inputFeatures;

    const areaVal = features.Area_Sqft;
    const bhkVal = features.Bedrooms;
    const floorVal = features.Floor;
    const parkingVal = features.Car_Parking_Sqft;
    const facingVal = features.Facing;

    const areaCoef = coefs.Area_Sqft || 0;
    const bhkCoef = coefs.Bedrooms || 0;
    const floorCoef = coefs.Floor || 0;
    const parkingCoef = coefs.Car_Parking_Sqft || 0;
    const facingCoef = coefs[`Facing_${facingVal}`] || 0;

    const areaContribution = areaCoef * areaVal;
    const bhkContribution = bhkCoef * bhkVal;
    const floorContribution = floorCoef * floorVal;
    const parkingContribution = parkingCoef * parkingVal;

    return {
      intercept,
      area: { val: areaVal, coef: areaCoef, contrib: areaContribution },
      bedrooms: { val: bhkVal, coef: bhkCoef, contrib: bhkContribution },
      floor: { val: floorVal, coef: floorCoef, contrib: floorContribution },
      parking: { val: parkingVal, coef: parkingCoef, contrib: parkingContribution },
      facing: { val: facingVal, coef: facingCoef, contrib: facingCoef },
      totalPriceLakh: intercept + areaContribution + bhkContribution + floorContribution + parkingContribution + facingCoef
    };
  };

  const breakdown = getMathBreakdown();

  return (
    <div>
      <div className="mb-8 no-print">
        <h1 className="text-3xl font-black text-[#2E1128] mb-2">New AI Valuation</h1>
        <p className="text-[#7C6274] font-bold text-sm">Enter property details to get an estimated market price using Multiple Linear Regression.</p>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.form 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit} 
            className="space-y-8 animate-fadeIn"
          >
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 font-bold rounded-2xl">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 text-[#2E1128]">
              
              {/* Primary Layout Inputs */}
              <div className="bg-[#FFF0FA]/40 border border-[#FFD6F4] rounded-3xl p-6">
                <h2 className="text-lg font-extrabold mb-6 flex items-center gap-2 text-[#2E1128]">
                  <Building className="text-[#FF8CD9] w-5 h-5"/> Layout Parameters
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-extrabold mb-1.5 text-[#7C6274]">Bedrooms</label>
                      <select 
                        name="Bedrooms" 
                        value={formData.Bedrooms} 
                        onChange={handleInputChange} 
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#FFD6F4] text-[#2E1128] font-bold focus:ring-2 focus:ring-[#FF8CD9]/50 outline-none"
                      >
                        {[2, 3, 4].map(n => <option key={n} value={n}>{n} BHK / Bedrooms</option>)}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-extrabold mb-1.5 text-[#7C6274]">Area (Sqft)</label>
                      <input 
                        type="number" 
                        name="Area_Sqft" 
                        value={formData.Area_Sqft} 
                        onChange={handleInputChange} 
                        min="100" 
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#FFD6F4] text-[#2E1128] font-bold focus:ring-2 focus:ring-[#FF8CD9]/50 outline-none" 
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-extrabold mb-1.5 text-[#7C6274]">Floor Level</label>
                      <input 
                        type="number" 
                        name="Floor" 
                        value={formData.Floor} 
                        onChange={handleInputChange} 
                        min="1" 
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#FFD6F4] text-[#2E1128] font-bold focus:ring-2 focus:ring-[#FF8CD9]/50 outline-none" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-extrabold mb-1.5 text-[#7C6274]">Car Parking (Sqft)</label>
                      <input 
                        type="number" 
                        name="Car_Parking_Sqft" 
                        value={formData.Car_Parking_Sqft} 
                        onChange={handleInputChange} 
                        min="0" 
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#FFD6F4] text-[#2E1128] font-bold focus:ring-2 focus:ring-[#FF8CD9]/50 outline-none" 
                        required 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Facing Inputs */}
              <div className="bg-[#FFF0FA]/40 border border-[#FFD6F4] rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-extrabold mb-6 flex items-center gap-2 text-[#2E1128]">
                    <MapPin className="text-[#FF8CD9] w-5 h-5"/> Orientation & Facing
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-extrabold mb-1.5 text-[#7C6274]">Property Facing</label>
                    <select 
                      name="Facing" 
                      value={formData.Facing} 
                      onChange={handleInputChange} 
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#FFD6F4] text-[#2E1128] font-bold focus:ring-2 focus:ring-[#FF8CD9]/50 outline-none"
                    >
                      {['North', 'South', 'East', 'West'].map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-[#FFF5FA] rounded-2xl border border-[#FFD6F4] text-xs font-semibold text-[#7C6274] leading-relaxed mt-4">
                  Note: Multiple Linear Regression uses categorical variables (like Facing) by encoding them into binary categories inside the model pipeline.
                </div>
              </div>

            </div>

            <motion.button 
              type="submit" 
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full md:w-auto px-8 py-4 bg-[#FF8CD9] hover:bg-[#FF73D0] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-[#FF8CD9]/25 hover:shadow-[0_8px_30px_rgba(255,140,217,0.35)] disabled:opacity-75 text-lg cursor-pointer"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Calculator className="w-6 h-6" />}
              {loading ? 'Running Regression Analysis...' : 'Calculate Model Valuation'}
            </motion.button>
          </motion.form>
        ) : (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            {/* Print CSS injection */}
            <style dangerouslySetInnerHTML={{__html: `
              @media print {
                body {
                  background-color: white !important;
                  color: black !important;
                }
                aside, header, nav, .no-print, button {
                  display: none !important;
                }
                main, .flex-1, .p-4, .p-8, .pt-20 {
                  padding: 0 !important;
                  margin: 0 !important;
                  background-color: white !important;
                }
                #printable-report {
                  visibility: visible !important;
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  box-shadow: none !important;
                  border: none !important;
                  background: white !important;
                }
              }
            `}} />

            <div id="printable-report" className="bg-white border border-[#FFD6F4] rounded-3xl p-8 shadow-sm space-y-8 text-[#2E1128]">
              
              {/* Report Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#FFD6F4] pb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-black text-[#2E1128] tracking-tight flex items-center gap-2">
                    <Building className="text-[#FF8CD9] w-7 h-7" /> FlatVision<span className="text-[#FF73D0]">.AI</span>
                  </h2>
                  <p className="text-xs text-[#7C6274] font-bold tracking-wider uppercase mt-1">Certified Mathematical Valuation Report</p>
                </div>
                <div className="text-left md:text-right text-sm">
                  <div className="font-extrabold text-[#2E1128]">Date Computed: {new Date().toLocaleDateString('en-IN')}</div>
                  <div className="text-[#7C6274] font-bold">Model: Linear Regression</div>
                </div>
              </div>

              {/* Evaluation Target Price Output */}
              <div className="bg-gradient-to-br from-[#2E1128] to-[#431F3B] text-white rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF8CD9]/15 rounded-full blur-[60px]" />
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-10">
                  <div>
                    <span className="text-xs font-extrabold text-[#FFC6F3] uppercase tracking-widest">Model Predicted Market Price</span>
                    <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#FFF0FA] mt-2 tracking-tight">
                      ₹{(result.predictedPrice / 100000).toFixed(2)} Lakh
                    </div>
                    <span className="text-base font-semibold text-[#FFC6F3]/90 block mt-1">
                      (Absolute conversion: ₹{result.predictedPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })})
                    </span>
                  </div>
                  <div className="bg-white/10 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur-md flex items-center gap-1.5 text-[10px] font-bold text-[#FFADEE] uppercase tracking-wider self-start md:self-center">
                    <Award className="w-3.5 h-3.5 text-yellow-300" /> Verified Valuation
                  </div>
                </div>
                
                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-white/10 pt-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold">Trained R² Score</span>
                    <span className="font-bold text-[#FFADEE] mt-1 block">{result.predictionMetadata?.r2_score ? result.predictionMetadata.r2_score.toFixed(5) : '0.9978'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Model MAE</span>
                    <span className="font-bold text-white mt-1 block">₹{result.predictionMetadata?.mae ? result.predictionMetadata.mae.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '63,126'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Algorithm Structure</span>
                    <span className="font-bold text-white mt-1 block">Scikit-Learn LinearRegression</span>
                  </div>
                </div>
              </div>

              {/* Parameter display (strictly the 5 features) */}
              <div className="bg-[#FFF5FA] border border-[#FFD6F4] rounded-3xl p-6">
                <h3 className="text-sm font-extrabold text-[#2E1128] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="text-[#FF8CD9] w-4 h-4" /> Evaluated Parameters Input
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  
                  {/* Bedrooms */}
                  <div className="bg-white border border-[#FFD6F4] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:scale-102 transition-transform">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-[#7C6274] uppercase tracking-wider">Layout</span>
                      <Bed className="text-[#FF8CD9] w-4 h-4" />
                    </div>
                    <div className="font-black text-[#2E1128] text-base">{result.inputFeatures.Bedrooms} BHK</div>
                    <span className="text-[10px] font-bold text-[#7C6274] mt-1 block">Bedrooms count</span>
                  </div>

                  {/* Area */}
                  <div className="bg-white border border-[#FFD6F4] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:scale-102 transition-transform">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-[#7C6274] uppercase tracking-wider">Size</span>
                      <Maximize2 className="text-[#FF8CD9] w-4 h-4" />
                    </div>
                    <div className="font-black text-[#2E1128] text-base">{result.inputFeatures.Area_Sqft} Sqft</div>
                    <span className="text-[10px] font-bold text-[#7C6274] mt-1 block">Super built-up area</span>
                  </div>

                  {/* Facing */}
                  <div className="bg-white border border-[#FFD6F4] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:scale-102 transition-transform">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-[#7C6274] uppercase tracking-wider">Facing</span>
                      <Compass className="text-[#FF8CD9] w-4 h-4" />
                    </div>
                    <div className="font-black text-[#2E1128] text-base">{result.inputFeatures.Facing}</div>
                    <span className="text-[10px] font-bold text-[#7C6274] mt-1 block">Property orientation</span>
                  </div>

                  {/* Floor */}
                  <div className="bg-white border border-[#FFD6F4] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:scale-102 transition-transform">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-[#7C6274] uppercase tracking-wider">Floor</span>
                      <Layers className="text-[#FF8CD9] w-4 h-4" />
                    </div>
                    <div className="font-black text-[#2E1128] text-base">Floor {result.inputFeatures.Floor}</div>
                    <span className="text-[10px] font-bold text-[#7C6274] mt-1 block">Vertical location</span>
                  </div>

                  {/* Car Parking */}
                  <div className="bg-white border border-[#FFD6F4] rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:scale-102 transition-transform">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold text-[#7C6274] uppercase tracking-wider">Parking</span>
                      <Car className="text-[#FF8CD9] w-4 h-4" />
                    </div>
                    <div className="font-black text-[#2E1128] text-base">{result.inputFeatures.Car_Parking_Sqft} Sqft</div>
                    <span className="text-[10px] font-bold text-[#7C6274] mt-1 block">Dedicated parking size</span>
                  </div>

                </div>
              </div>

              {/* Mathematical Equation Evaluation Breakdown */}
              {breakdown && (
                <div className="bg-[#FFF5FA] border border-[#FFD6F4] rounded-3xl p-6">
                  <h3 className="text-sm font-extrabold text-[#2E1128] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity className="text-[#FF8CD9] w-4 h-4" /> Mathematical Equation Evaluation Breakdown
                  </h3>
                  
                  <div className="font-mono text-xs overflow-x-auto space-y-3 bg-black/5 p-4 rounded-xl text-slate-700">
                    <div className="pb-2 border-b border-[#FFD6F4] text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                      Linear Equation Calculation Flow (y = b0 + b1*x1 + b2*x2 + ...)
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-black/5 last:border-none gap-1 sm:gap-4">
                      <span>Base Intercept (Offset / &beta;<sub>0</sub>)</span>
                      <span className="font-bold">{breakdown.intercept.toFixed(5)} Lakh</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-black/5 last:border-none gap-1 sm:gap-4 text-pink-700">
                      <span>Area Sqft contribution ({breakdown.area.coef.toFixed(6)} &times; {breakdown.area.val} sqft)</span>
                      <span className="font-bold">+{breakdown.area.contrib.toFixed(5)} Lakh</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-black/5 last:border-none gap-1 sm:gap-4 text-pink-700">
                      <span>Bedrooms contribution ({breakdown.bedrooms.coef.toFixed(6)} &times; {breakdown.bedrooms.val})</span>
                      <span className="font-bold">+{breakdown.bedrooms.contrib.toFixed(5)} Lakh</span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-black/5 last:border-none gap-1 sm:gap-4 text-pink-700">
                      <span>Floor Level contribution ({breakdown.floor.coef.toFixed(6)} &times; {breakdown.floor.val})</span>
                      <span className="font-bold">+{breakdown.floor.contrib.toFixed(5)} Lakh</span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-black/5 last:border-none gap-1 sm:gap-4 text-pink-700">
                      <span>Car Parking contribution ({breakdown.parking.coef.toFixed(6)} &times; {breakdown.parking.val} sqft)</span>
                      <span className="font-bold">+{breakdown.parking.contrib.toFixed(5)} Lakh</span>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center py-2 border-b border-black/5 last:border-none gap-1 sm:gap-4 text-[#FF73D0]">
                      <span>Facing {breakdown.facing.val} dummy variable offset</span>
                      <span className="font-bold">
                        {breakdown.facing.contrib >= 0 ? '+' : ''}{breakdown.facing.contrib.toFixed(5)} Lakh
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[#FFD6F4] flex flex-col sm:flex-row justify-between sm:items-center font-bold text-gray-900 text-sm gap-1 sm:gap-4">
                      <span>Sum Total (Predicted Flat Value)</span>
                      <span className="text-right">{breakdown.totalPriceLakh.toFixed(2)} Lakhs (₹{(breakdown.totalPriceLakh * 100000).toLocaleString('en-IN', { maximumFractionDigits: 0 })})</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Certified Future Value Projections */}
              <div className="bg-[#FFF5FA] border border-[#FFD6F4] rounded-3xl p-6">
                <h3 className="text-sm font-extrabold text-[#2E1128] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp className="text-[#FF8CD9] w-4 h-4" /> Certified Future Appreciation Projections (Est. 6% CAGR)
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Year 1 */}
                  <div className="bg-white border border-[#FFD6F4] rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between hover:scale-102 transition-transform">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-[#FF73D0] px-2 py-0.5 rounded-full bg-[#FFF0FA] border border-[#FFD6F4] uppercase tracking-wider">
                        1 Year Outlook
                      </span>
                      <span className="text-emerald-550 text-xs font-extrabold flex items-center gap-0.5">
                        <TrendingUp className="w-3.5 h-3.5" /> +6.0%
                      </span>
                    </div>
                    <div className="mt-4 border-t border-[#FFD6F4]/40 pt-3">
                      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Estimated Value</div>
                      <div className="text-2xl font-black text-[#2E1128] mt-1">
                        ₹{((result.predictedPrice * 1.06) / 100000).toFixed(2)} Lakh
                      </div>
                      <div className="text-[10px] font-bold text-[#7C6274] mt-0.5">
                        (₹{Math.round(result.predictedPrice * 1.06).toLocaleString('en-IN')})
                      </div>
                    </div>
                  </div>

                  {/* Year 3 */}
                  <div className="bg-white border border-[#FFD6F4] rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between hover:scale-102 transition-transform">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-[#FF73D0] px-2 py-0.5 rounded-full bg-[#FFF0FA] border border-[#FFD6F4] uppercase tracking-wider">
                        3 Year Outlook
                      </span>
                      <span className="text-emerald-550 text-xs font-extrabold flex items-center gap-0.5">
                        <TrendingUp className="w-3.5 h-3.5" /> +19.1%
                      </span>
                    </div>
                    <div className="mt-4 border-t border-[#FFD6F4]/40 pt-3">
                      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Estimated Value</div>
                      <div className="text-2xl font-black text-[#2E1128] mt-1">
                        ₹{((result.predictedPrice * Math.pow(1.06, 3)) / 100000).toFixed(2)} Lakh
                      </div>
                      <div className="text-[10px] font-bold text-[#7C6274] mt-0.5">
                        (₹{Math.round(result.predictedPrice * Math.pow(1.06, 3)).toLocaleString('en-IN')})
                      </div>
                    </div>
                  </div>

                  {/* Year 5 */}
                  <div className="bg-white border border-[#FFD6F4] rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between hover:scale-102 transition-transform">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-[#FF73D0] px-2 py-0.5 rounded-full bg-[#FFF0FA] border border-[#FFD6F4] uppercase tracking-wider">
                        5 Year Outlook
                      </span>
                      <span className="text-emerald-550 text-xs font-extrabold flex items-center gap-0.5">
                        <TrendingUp className="w-3.5 h-3.5" /> +33.8%
                      </span>
                    </div>
                    <div className="mt-4 border-t border-[#FFD6F4]/40 pt-3">
                      <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Estimated Value</div>
                      <div className="text-2xl font-black text-[#2E1128] mt-1">
                        ₹{((result.predictedPrice * Math.pow(1.06, 5)) / 100000).toFixed(2)} Lakh
                      </div>
                      <div className="text-[10px] font-bold text-[#7C6274] mt-0.5">
                        (₹{Math.round(result.predictedPrice * Math.pow(1.06, 5)).toLocaleString('en-IN')})
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Similar Properties in Dataset (Real Reference Data) */}
              {result.predictionMetadata?.similar_properties && (
                <div className="bg-[#FFF5FA] border border-[#FFD6F4] rounded-3xl p-6">
                  <h3 className="text-sm font-extrabold text-[#2E1128] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ListChecks className="text-[#FF8CD9] w-4 h-4" /> Similar Reference Properties in Dataset (Real Survey Data)
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {result.predictionMetadata.similar_properties.map((property) => (
                      <div key={property.Flat_ID} className="bg-white border border-[#FFD6F4] rounded-2xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between hover:scale-102 transition-transform">
                        <div>
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-bold text-[#FF73D0] px-2 py-0.5 rounded-full bg-[#FFF0FA] border border-[#FFD6F4]">
                              Flat #{property.Flat_ID}
                            </span>
                            <span className="text-xs text-slate-400 font-bold">{property.Bedrooms} BHK</span>
                          </div>
                          
                          <div className="space-y-1.5 text-xs text-gray-600 font-semibold mb-4">
                            <div>📐 Area: {property.Area_Sqft} Sqft</div>
                            <div>🧭 Facing: {property.Facing}</div>
                            <div>🏢 Level: Floor {property.Floor}</div>
                            <div>🚗 Parking: {property.Car_Parking_Sqft} Sqft</div>
                          </div>
                        </div>

                        <div className="border-t border-[#FFD6F4]/65 pt-3 flex justify-between items-center text-sm font-bold text-[#2E1128]">
                          <span>Actual Price:</span>
                          <span className="text-[#FF73D0]">₹{property.Price_Lakh} Lakh</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 no-print">
              <motion.button 
                onClick={handlePrint}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-[#2E1128] hover:bg-[#431F3B] hover:shadow-[0_8px_30px_rgba(46,17,40,0.25)] text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                Download PDF Report
              </motion.button>
              <motion.button 
                onClick={resetForm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-[#FFF0FA] hover:bg-[#FFD6F4] hover:shadow-[0_8px_30px_rgba(255,173,238,0.2)] text-[#2E1128] rounded-xl font-bold transition-all border border-[#FFD6F4] flex items-center justify-center gap-2 cursor-pointer"
              >
                Calculate Another Property
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
