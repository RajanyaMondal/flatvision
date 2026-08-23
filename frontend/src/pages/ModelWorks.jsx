import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Building2, Cpu, ArrowLeft, ArrowRight, Activity, LineChart, ShieldAlert, Loader2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ScatterChart, Scatter, CartesianGrid } from 'recharts';

const MotionLink = motion(Link);

export default function ModelWorks() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const mlServiceUrl = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000';
        const res = await fetch(`${mlServiceUrl}/metrics`);
        if (!res.ok) throw new Error('Failed to load metrics');
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        console.error("Failed to load model metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const scatterData = useMemo(() => {
    if (!metrics || !metrics.test_predictions) return [];
    return metrics.test_predictions;
  }, [metrics]);

  const diagonalLineData = useMemo(() => {
    if (scatterData.length === 0) return [];
    const vals = scatterData.map(d => [d.actual, d.predicted]).flat();
    const minVal = Math.min(...vals);
    const maxVal = Math.max(...vals);
    return [
      { actual: minVal, predicted: minVal },
      { actual: maxVal, predicted: maxVal }
    ];
  }, [scatterData]);

  const featureWeights = useMemo(() => {
    if (!metrics || !metrics.coefficients) {
      return [
        { feature: 'Bedrooms', weight: 1.1564, details: 'Flat multiplier per room' },
        { feature: 'Facing_South', weight: 0.7381, details: 'Orientation bonus weight' },
        { feature: 'Floor', weight: 0.4375, details: 'Altitude increase per floor level' },
        { feature: 'Facing_North', weight: 0.3916, details: 'Facing adjustment offset' },
        { feature: 'Facing_East', weight: 0.2904, details: 'Facing adjustment offset' },
        { feature: 'Area_Sqft', weight: 0.0608, details: 'Value added per built sqft' },
        { feature: 'Facing_West', weight: 0.0561, details: 'Facing adjustment offset' },
        { feature: 'Car_Parking', weight: 0.0245, details: 'Value added per car park sqft' },
      ];
    }

    return Object.entries(metrics.coefficients).map(([feature, coef]) => {
      let details = '';
      if (feature === 'Area_Sqft') details = 'Value added per built sq.ft. (direct scale)';
      else if (feature === 'Bedrooms') details = 'Value added per bedroom room (layout configuration)';
      else if (feature === 'Floor') details = 'Value added per floor level (altitude pricing)';
      else if (feature === 'Car_Parking_Sqft') details = 'Value added per car parking space sq.ft.';
      else if (feature.startsWith('Facing_')) details = `Valuation offset if facing ${feature.split('_')[1]}`;
      
      return {
        feature: feature.replace('Car_Parking_Sqft', 'Car_Parking'),
        weight: Math.abs(coef),
        rawValue: coef,
        details
      };
    }).sort((a, b) => b.weight - a.weight);
  }, [metrics]);

  const CustomScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (data.actual === undefined || data.predicted === undefined) return null;
      
      const actualLakh = data.actual / 100000;
      const predictedLakh = data.predicted / 100000;
      const deltaLakh = predictedLakh - actualLakh;
      const deltaPercent = (deltaLakh / actualLakh) * 100;
      
      return (
        <div className="bg-white border border-[#FFD6F4] p-4 rounded-2xl shadow-md text-xs font-semibold text-[#2E1128]">
          <p className="font-extrabold text-[#FF73D0] mb-1.5 flex items-center gap-1.5">🎯 Valuation Audit Point</p>
          <div className="space-y-1 font-bold">
            <div>Actual Price: <span className="font-black text-[#2E1128]">₹{actualLakh.toFixed(2)} Lakh</span></div>
            <div>AI Valuation: <span className="font-black text-[#FF73D0]">₹{predictedLakh.toFixed(2)} Lakh</span></div>
            <div className="border-t border-[#FFD6F4] pt-1.5 mt-1.5 flex items-center justify-between gap-4 text-[10px]">
              <span>Deviation Delta:</span>
              <span className={`font-black ${Math.abs(deltaPercent) < 1.0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {deltaLakh >= 0 ? '+' : ''}₹{deltaLakh.toFixed(2)} Lakh ({deltaLakh >= 0 ? '+' : ''}{deltaPercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="min-h-screen text-[#2E1128] font-sans selection:bg-[#FFADEE]/30 overflow-x-hidden relative flex flex-col scroll-smooth"
      style={{
        background: 'radial-gradient(circle at 80% 80%, rgba(255, 245, 246, 0.95) 0%, transparent 80%), linear-gradient(135deg, #FFA4BD 0%, #FFCAD6 50%, #FFF5F6 100%)'
      }}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,173,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,173,238,0.06)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FFADEE]/15 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FFC6F3]/15 blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 border-b border-[#FFD6F4] bg-[#FFF5FA]/70 backdrop-blur-xl z-50">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl tracking-tight hover:scale-105 transition-transform duration-200">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF8CD9] to-[#FFC6F3] flex items-center justify-center text-white shadow-md shadow-[#FFADEE]/10">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-[#2E1128] text-2xl tracking-tighter font-extrabold flex items-center gap-1">
              FlatVision<span className="text-[#FF73D0]">.AI</span>
            </span>
          </Link>
          <MotionLink 
            to="/" 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 text-sm font-bold text-[#7C6274] hover:text-[#FF73D0] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </MotionLink>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-36 pb-32 max-w-6xl relative z-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFADEE]/15 border border-[#FFADEE]/30 text-[#FF73D0] text-sm font-bold mb-6 shadow-sm">
            <BrainCircuit className="w-4 h-4 text-[#FF8CD9]" /> Multiple Linear Regression Model
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#2E1128] mb-6">
            How the AI Model Works
          </h1>
          <p className="text-xl md:text-2xl text-[#7C6274] leading-relaxed font-semibold">
            Understand the mathematics, feature mapping, and regression coefficients that evaluate your property price.
          </p>
        </div>

        {/* 1. Request Pipeline Grid */}
        <section className="mb-20">
          <h2 className="text-3xl font-black text-[#2E1128] mb-8 flex items-center gap-3 tracking-tight">
            <Cpu className="text-[#FF8CD9] w-7 h-7 animate-spin" style={{ animationDuration: '8s' }} /> End-to-End System Architecture
          </h2>
          <div className="grid md:grid-cols-5 gap-6 items-center bg-white/40 border border-[#FFD6F4] rounded-3xl p-10 backdrop-blur-md shadow-md">
            
            <div className="bg-white border border-[#FFD6F4] rounded-3xl p-8 text-center shadow-md hover:scale-102 transition-transform">
              <span className="text-xs uppercase font-bold text-[#FF73D0] tracking-wider">Step 1</span>
              <div className="text-lg font-black text-[#2E1128] mt-3 mb-2">React Client</div>
              <p className="text-sm font-semibold text-[#7C6274] leading-relaxed">User inputs flat parameters on the dashboard UI (no extra mock parameters).</p>
            </div>
            
            <div className="flex justify-center text-[#FF8CD9]"><ArrowRight className="rotate-90 md:rotate-0 w-8 h-8" /></div>
            
            <div className="bg-white border border-[#FFD6F4] rounded-3xl p-8 text-center shadow-md hover:scale-102 transition-transform">
              <span className="text-xs uppercase font-bold text-[#FF73D0] tracking-wider">Step 2</span>
              <div className="text-lg font-black text-[#2E1128] mt-3 mb-2">Express API</div>
              <p className="text-sm font-semibold text-[#7C6274] leading-relaxed">Validates the 5 active features and writes logs to database.</p>
            </div>
            
            <div className="flex justify-center text-[#FF8CD9]"><ArrowRight className="rotate-90 md:rotate-0 w-8 h-8" /></div>
            
            <div className="bg-white border border-[#FFD6F4] rounded-3xl p-8 text-center shadow-md hover:scale-102 transition-transform">
              <span className="text-xs uppercase font-bold text-[#FF73D0] tracking-wider">Step 3</span>
              <div className="text-lg font-black text-[#2E1128] mt-3 mb-2">Python FastAPI</div>
              <p className="text-sm font-semibold text-[#7C6274] leading-relaxed">Applies Scikit-Learn linear regression and computes similar properties.</p>
            </div>

          </div>
        </section>

        {/* 2. Algorithm & Mathematics */}
        <section className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white/40 border border-[#FFD6F4] rounded-3xl p-10 flex flex-col justify-between shadow-md">
            <div>
              <h2 className="text-3xl font-black text-[#2E1128] mb-6 flex items-center gap-3">
                <Activity className="text-[#FF8CD9] w-7 h-7" /> The Mathematics of Regression
              </h2>
              <p className="text-[#7C6274] text-base leading-relaxed mb-6 font-semibold">
                Multiple Linear Regression models fit a straight hyperplane that minimizes the sum of squared differences (residual error) between actual spreadsheet prices and predicted values.
              </p>
              <ul className="space-y-4 text-base text-[#2E1128]">
                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF8CD9] mt-2 shrink-0" />
                  <div>
                    <strong className="text-[#2E1128] block font-extrabold">Ordinary Least Squares (OLS):</strong>
                    Calculates optimal feature weights ($\beta_i$) using exact linear matrix algebra.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF8CD9] mt-2 shrink-0" />
                  <div>
                    <strong className="text-[#2E1128] block font-extrabold">One-Hot Category Encoding:</strong>
                    Maps categorical variables (like Facing orientation) into separate binary flag values (0 or 1).
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF8CD9] mt-2 shrink-0" />
                  <div>
                    <strong className="text-[#2E1128] block font-extrabold">Additive Valuation Breakdown:</strong>
                    Directly sum the intercept and each variable multiplied by its coefficient. Makes the model extremely transparent!
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-[#FFD6F4] rounded-3xl p-10 flex flex-col justify-center items-center text-center shadow-md">
            <span className="text-xs text-[#7C6274] uppercase tracking-widest font-black mb-6">Linear Regression Mathematical Equation</span>
            
            {loading ? (
              <div className="h-48 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#FF8CD9]" />
              </div>
            ) : (
              <div className="text-sm md:text-base tracking-wide text-[#2E1128] font-mono bg-[#FFF5FA] px-8 py-8 rounded-2xl border border-[#FFD6F4] mb-8 leading-relaxed text-left w-full overflow-x-auto space-y-1.5">
                <div><strong>Price (Lakh)</strong> = {metrics?.intercept?.toFixed(4) || '-13.7460'}</div>
                <div className="text-pink-700"> + ({metrics?.coefficients?.Area_Sqft?.toFixed(6) || '0.060813'} × Area_Sqft)</div>
                <div className="text-pink-700"> + ({metrics?.coefficients?.Bedrooms?.toFixed(6) || '1.156441'} × Bedrooms)</div>
                <div className="text-pink-700"> + ({metrics?.coefficients?.Floor?.toFixed(6) || '0.437499'} × Floor)</div>
                <div className="text-pink-700"> + ({metrics?.coefficients?.Car_Parking_Sqft?.toFixed(6) || '0.024505'} × Car_Parking_Sqft)</div>
                <div className="text-[#FF73D0]"> + ({metrics?.coefficients?.Facing_East?.toFixed(6) || '-0.290379'} × IsFacingEast)</div>
                <div className="text-[#FF73D0]"> + ({metrics?.coefficients?.Facing_North?.toFixed(6) || '-0.391587'} × IsFacingNorth)</div>
                <div className="text-[#FF73D0]"> + ({metrics?.coefficients?.Facing_South?.toFixed(6) || '0.738098'} × IsFacingSouth)</div>
                <div className="text-[#FF73D0]"> + ({metrics?.coefficients?.Facing_West?.toFixed(6) || '-0.056132'} × IsFacingWest)</div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-6 text-sm max-w-md w-full border-t border-[#FFD6F4] pt-6 text-[#7C6274] font-bold">
              <div>
                <div className="font-extrabold text-[#FF8CD9] text-xl mb-1">y</div>
                <span>Price (Lakhs)</span>
              </div>
              <div>
                <div className="font-extrabold text-[#FF8CD9] text-xl mb-1">&beta;<sub>0</sub></div>
                <span>Intercept Offset</span>
              </div>
              <div>
                <div className="font-extrabold text-[#FF8CD9] text-xl mb-1">&beta;<sub>i</sub>x<sub>i</sub></div>
                <span>Feature Weights × Inputs</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Live Metrics & Feature Weights */}
        <section className="grid md:grid-cols-3 gap-8">
          {/* Live metrics card */}
          <div className="bg-white border border-[#FFD6F4] rounded-3xl p-10 flex flex-col justify-between shadow-md">
            <div>
              <h3 className="text-2xl font-black text-[#2E1128] mb-8 flex items-center gap-3">
                <LineChart className="text-[#FF8CD9] w-6 h-6" /> Live Model Accuracy
              </h3>

              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-[#FFD6F4] border-t-[#FF8CD9] animate-spin" />
                  <span className="text-xs text-[#7C6274] mt-2 font-bold">Fetching active training statistics...</span>
                </div>
              ) : error ? (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-2xl p-5 text-sm flex gap-3">
                  <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1">ML Service Offline</span>
                    <span>Displaying standard offline-calibrated regressor parameters.</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-[#FFF5FA] border border-[#FFD6F4] rounded-2xl p-5 shadow-sm">
                    <span className="text-sm text-[#7C6274] font-extrabold uppercase tracking-wider block mb-1">R² (R-Squared) Score</span>
                    <span className="text-4xl md:text-5xl font-black text-[#2E1128]">{metrics?.r2 ? Number(metrics.r2).toFixed(6) : '0.997875'}</span>
                    <p className="text-xs text-emerald-600 mt-1.5 font-bold">Perfect Fit (99.78% variance explained)</p>
                  </div>
                  
                  <div className="bg-[#FFF5FA] border border-[#FFD6F4] rounded-2xl p-5 shadow-sm">
                    <span className="text-sm text-[#7C6274] font-extrabold uppercase tracking-wider block mb-1">Mean Absolute Error (MAE)</span>
                    <span className="text-3xl md:text-4xl font-black text-[#2E1128]">₹{metrics?.mae ? Number(metrics.mae).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '63,126'}</span>
                    <p className="text-xs text-[#7C6274] mt-1.5 font-semibold">Average valuation delta variance</p>
                  </div>

                  <div className="bg-[#FFF5FA] border border-[#FFD6F4] rounded-2xl p-5 shadow-sm">
                    <span className="text-sm text-[#7C6274] font-extrabold uppercase tracking-wider block mb-1">Total Dataset Training Rows</span>
                    <span className="text-2xl font-black text-[#2E1128]">100 Real Properties</span>
                  </div>
                </div>
              )}
            </div>
            
            {!loading && (
              <div className="border-t border-[#FFD6F4] pt-4 mt-6 text-center text-xs text-[#7C6274] font-bold tracking-wider uppercase">
                Active Model: {metrics?.model_name || 'Multiple Linear Regression'}
              </div>
            )}
          </div>

          {/* Feature Weights Chart */}
          <div className="md:col-span-2 bg-white/40 border border-[#FFD6F4] rounded-3xl p-10 flex flex-col justify-between backdrop-blur-md shadow-md">
            <div>
              <h3 className="text-2xl font-black text-[#2E1128] mb-3 flex items-center gap-3">
                <BrainCircuit className="text-[#FF8CD9] w-6 h-6" /> Regressor Coefficient Weights
              </h3>
              <p className="text-sm font-semibold text-[#7C6274] mb-8">Absolute magnitude of influence (in Lakhs) for each model feature weight.</p>
              
              <div className="h-80 w-full">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#FF8CD9]" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={featureWeights} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                      <XAxis type="number" stroke="#7C6274" tick={{ fill: '#2E1128', fontWeight: 'bold', fontSize: 11 }} />
                      <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} tick={{ fill: '#2E1128', fontWeight: 'bold', fontSize: 11 }} width={90} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,173,238,0.04)' }} 
                        contentStyle={{ backgroundColor: 'white', borderColor: '#FFD6F4', borderRadius: '16px', fontWeight: 'bold' }}
                        formatter={(value, name, props) => [`${props.payload.rawValue.toFixed(5)} Lakh`, 'Coefficient']}
                      />
                      <Bar dataKey="weight" fill="#FF8CD9" radius={[0, 6, 6, 0]} barSize={24}>
                        {featureWeights.map((entry, index) => {
                          const colors = ['#FF8CD9', '#FFADEE', '#FFC6F3', '#FFD6F4', '#FF9EE2', '#FFA2E8', '#FF73D0', '#E888D3'];
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {!loading && (
              <div className="border-t border-[#FFD6F4] pt-4 mt-6 text-sm text-[#7C6274] grid grid-cols-2 md:grid-cols-3 gap-4 font-bold">
                {featureWeights.slice(0, 3).map(w => (
                  <div key={w.feature}>
                    <strong className="text-[#2E1128] block mb-0.5">{w.feature}</strong>
                    <span className="text-xs block leading-tight text-[#7C6274]">{w.details}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 4. Prediction Accuracy Scatter Plot */}
        <section className="mt-12 bg-white border border-[#FFD6F4] rounded-3xl p-10 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-[#2E1128] flex items-center gap-3 mb-2">
                <LineChart className="text-[#FF8CD9] w-6 h-6" /> Prediction Accuracy Scatter Plot
              </h3>
              <p className="text-sm font-bold text-[#7C6274]">
                Trained Linear Regression Model: Actual vs. Predicted Values for the Test Set (in Rupees)
              </p>
            </div>
          </div>
          
          <div className="h-[400px] w-full flex items-center justify-center">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#FF8CD9]" />
              </div>
            ) : scatterData.length === 0 ? (
              <div className="text-sm font-semibold text-gray-400">No accuracy plot data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FFF5FA" strokeWidth={1.5} />
                  <XAxis 
                    type="number" 
                    dataKey="actual" 
                    name="Actual Price" 
                    stroke="#7C6274"
                    tick={{ fill: '#2E1128', fontWeight: 'bold', fontSize: 12 }}
                    tickFormatter={(val) => `₹${val / 100000}L`} 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="predicted" 
                    name="Predicted Price" 
                    stroke="#7C6274"
                    tick={{ fill: '#2E1128', fontWeight: 'bold', fontSize: 12 }}
                    tickFormatter={(val) => `₹${val / 100000}L`} 
                  />
                  <Tooltip content={<CustomScatterTooltip />} />
                  
                  {/* Perfect Fit Reference Line */}
                  <Scatter 
                    name="Perfect Fit Line" 
                    data={diagonalLineData} 
                    line={{ stroke: '#FF73D0', strokeWidth: 3.5, strokeDasharray: '4 4' }} 
                    shape={() => null} 
                    legendType="none" 
                  />
                  
                  {/* Scatter dots */}
                  <Scatter 
                    name="Properties" 
                    data={scatterData} 
                    fill="#FF8CD9" 
                    stroke="#FF73D0" 
                    strokeWidth={2.5} 
                    r={8}
                    opacity={0.85} 
                  />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
