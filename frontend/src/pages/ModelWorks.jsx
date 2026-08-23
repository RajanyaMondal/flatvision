import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Building2, Cpu, ArrowLeft, ArrowRight, Activity, LineChart, ShieldAlert, Loader2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ScatterChart, Scatter, CartesianGrid } from 'recharts';
import api from '../utils/api';

export default function ModelWorks() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/model-metrics');
        if (res.data && res.data.success) {
          setMetrics(res.data.metrics);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch ML metrics:', err);
        setError(true);
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

  return (
    <div className="min-h-screen bg-[#F8F5FC] text-[#4A3E56] font-sans selection:bg-[#8B5CF6]/30 overflow-x-hidden relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#8B5CF6]/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#C084FC]/10 blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 border-b border-[#E9D5FF] bg-[#F8F5FC]/70 backdrop-blur-xl z-50">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl tracking-tight">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#C084FC] flex items-center justify-center text-white shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-[#1E1B4B] text-2xl tracking-tighter font-extrabold flex items-center gap-1">
              FlatVision<span className="text-[#8B5CF6]">.AI</span> ✨
            </span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-[#6B5E78] hover:text-[#1E1B4B] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-36 pb-32 max-w-6xl relative z-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] text-sm font-bold mb-6">
            <BrainCircuit className="w-4 h-4" /> Multiple Linear Regression Model 🔮
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[#1E1B4B] mb-6">
            How the AI Model Works 🤖
          </h1>
          <p className="text-lg md:text-xl text-[#6B5E78] leading-relaxed font-semibold">
            Understand the mathematics, feature mapping, and regression coefficients that evaluate your property price.
          </p>
        </div>

        {/* 1. Request Pipeline Grid */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-[#1E1B4B] mb-8 flex items-center gap-3">
            <Cpu className="text-[#8B5CF6] w-6 h-6 animate-spin" style={{ animationDuration: '8s' }} /> End-to-End System Architecture 🤖
          </h2>
          <div className="grid md:grid-cols-5 gap-4 items-center bg-[#F3E8FF]/40 border border-[#E9D5FF] rounded-3xl p-8 backdrop-blur-md shadow-sm">
            
            <div className="bg-white border border-[#E9D5FF] rounded-2xl p-5 text-center shadow-sm">
              <span className="text-[10px] uppercase font-bold text-[#8B5CF6] tracking-wider">Step 1</span>
              <div className="font-extrabold text-[#1E1B4B] mt-2 mb-1">React Client ✨</div>
              <p className="text-xs text-[#6B5E78] leading-relaxed font-medium">User inputs flat parameters on the dashboard UI (no extra mock parameters).</p>
            </div>
            
            <div className="flex justify-center text-[#8B5CF6]"><ArrowRight className="rotate-90 md:rotate-0 w-6 h-6" /></div>
            
            <div className="bg-white border border-[#E9D5FF] rounded-2xl p-5 text-center shadow-sm">
              <span className="text-[10px] uppercase font-bold text-[#8B5CF6] tracking-wider">Step 2</span>
              <div className="font-extrabold text-[#1E1B4B] mt-2 mb-1">Express API 🔒</div>
              <p className="text-xs text-[#6B5E78] leading-relaxed font-medium">Validates the 5 active features and writes logs to database.</p>
            </div>
            
            <div className="flex justify-center text-[#8B5CF6]"><ArrowRight className="rotate-90 md:rotate-0 w-6 h-6" /></div>
            
            <div className="bg-white border border-[#E9D5FF] rounded-2xl p-5 text-center shadow-sm">
              <span className="text-[10px] uppercase font-bold text-[#8B5CF6] tracking-wider">Step 3</span>
              <div className="font-extrabold text-[#1E1B4B] mt-2 mb-1">Python FastAPI 🔮</div>
              <p className="text-xs text-[#6B5E78] leading-relaxed font-medium">Applies Scikit-Learn linear regression and computes similar properties.</p>
            </div>

          </div>
        </section>

        {/* 2. Algorithm & Mathematics */}
        <section className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-[#F3E8FF]/40 border border-[#E9D5FF] rounded-3xl p-8 flex flex-col justify-between shadow-sm">
            <div>
              <h2 className="text-2xl font-bold text-[#1E1B4B] mb-4 flex items-center gap-3">
                <Activity className="text-[#8B5CF6] w-6 h-6" /> The Mathematics of Regression ✨
              </h2>
              <p className="text-[#6B5E78] text-sm leading-relaxed mb-6 font-semibold">
                Multiple Linear Regression models fit a straight hyperplane that minimizes the sum of squared differences (residual error) between actual spreadsheet prices and predicted values.
              </p>
              <ul className="space-y-4 text-sm text-[#4A3E56]">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] mt-2 shrink-0" />
                  <div>
                    <strong className="text-[#1E1B4B] block font-extrabold">Ordinary Least Squares (OLS):</strong>
                    Calculates optimal feature weights ($\beta_i$) using exact linear matrix algebra.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] mt-2 shrink-0" />
                  <div>
                    <strong className="text-[#1E1B4B] block font-extrabold">One-Hot Category Encoding:</strong>
                    Maps categorical variables (like Facing orientation) into separate binary flag values (0 or 1).
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6] mt-2 shrink-0" />
                  <div>
                    <strong className="text-[#1E1B4B] block font-extrabold">Additive Valuation Breakdown:</strong>
                    Directly sum the intercept and each variable multiplied by its coefficient. Makes the model extremely transparent!
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-[#E9D5FF] rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-sm">
            <span className="text-[10px] text-[#6B5E78] uppercase tracking-widest font-extrabold mb-4">Linear Regression Mathematical Equation</span>
            
            {loading ? (
              <div className="h-48 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
              </div>
            ) : (
              <div className="text-xs md:text-sm tracking-wide text-[#1E1B4B] font-mono bg-[#F8F5FC] px-6 py-6 rounded-2xl border border-[#E9D5FF] mb-6 leading-relaxed text-left w-full overflow-x-auto space-y-1">
                <div><strong>Price (Lakh)</strong> = {metrics?.intercept?.toFixed(4) || '-13.7460'}</div>
                <div className="text-emerald-700"> + ({metrics?.coefficients?.Area_Sqft?.toFixed(6) || '0.060813'} × Area_Sqft)</div>
                <div className="text-emerald-700"> + ({metrics?.coefficients?.Bedrooms?.toFixed(6) || '1.156441'} × Bedrooms)</div>
                <div className="text-emerald-700"> + ({metrics?.coefficients?.Floor?.toFixed(6) || '0.437499'} × Floor)</div>
                <div className="text-emerald-700"> + ({metrics?.coefficients?.Car_Parking_Sqft?.toFixed(6) || '0.024505'} × Car_Parking_Sqft)</div>
                <div className="text-purple-700"> + ({metrics?.coefficients?.Facing_East?.toFixed(6) || '-0.290379'} × IsFacingEast)</div>
                <div className="text-purple-700"> + ({metrics?.coefficients?.Facing_North?.toFixed(6) || '-0.391587'} × IsFacingNorth)</div>
                <div className="text-purple-700"> + ({metrics?.coefficients?.Facing_South?.toFixed(6) || '0.738098'} × IsFacingSouth)</div>
                <div className="text-purple-700"> + ({metrics?.coefficients?.Facing_West?.toFixed(6) || '-0.056132'} × IsFacingWest)</div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-6 text-xs max-w-md w-full border-t border-[#E9D5FF] pt-6 text-[#6B5E78] font-bold">
              <div>
                <div className="font-extrabold text-[#8B5CF6] text-lg mb-1">y</div>
                <span>Price (Lakhs)</span>
              </div>
              <div>
                <div className="font-extrabold text-[#8B5CF6] text-lg mb-1">&beta;<sub>0</sub></div>
                <span>Intercept Offset</span>
              </div>
              <div>
                <div className="font-extrabold text-[#8B5CF6] text-lg mb-1">&beta;<sub>i</sub>x<sub>i</sub></div>
                <span>Feature Weights × Inputs</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Live Metrics & Feature Weights */}
        <section className="grid md:grid-cols-3 gap-8">
          {/* Live metrics card */}
          <div className="bg-white border border-[#E9D5FF] rounded-3xl p-8 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="text-xl font-bold text-[#1E1B4B] mb-6 flex items-center gap-2">
                <LineChart className="text-[#8B5CF6] w-5 h-5" /> Live Model Accuracy
              </h3>

              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-[#E9D5FF] border-t-[#8B5CF6] animate-spin" />
                  <span className="text-xs text-[#6B5E78] mt-2 font-bold">Fetching active training statistics...</span>
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
                  <div className="bg-[#F8F5FC] border border-[#E9D5FF] rounded-2xl p-4 shadow-sm">
                    <span className="text-xs text-[#6B5E78] font-bold block mb-1">R² (R-Squared) Score</span>
                    <span className="text-3xl font-black text-[#1E1B4B]">{metrics?.r2 ? Number(metrics.r2).toFixed(6) : '0.997875'}</span>
                    <p className="text-[10px] text-emerald-600 mt-1 font-bold">Perfect Fit (99.78% variance explained)</p>
                  </div>
                  
                  <div className="bg-[#F8F5FC] border border-[#E9D5FF] rounded-2xl p-4 shadow-sm">
                    <span className="text-xs text-[#6B5E78] font-bold block mb-1">Mean Absolute Error (MAE)</span>
                    <span className="text-2xl font-black text-[#1E1B4B]">₹{metrics?.mae ? Number(metrics.mae).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '63,126'}</span>
                    <p className="text-[10px] text-[#6B5E78] mt-1">Average valuation delta variance</p>
                  </div>

                  <div className="bg-[#F8F5FC] border border-[#E9D5FF] rounded-2xl p-4 shadow-sm">
                    <span className="text-xs text-[#6B5E78] font-bold block mb-1">Total Dataset Training Rows</span>
                    <span className="text-xl font-bold text-[#1E1B4B]">100 Real Properties</span>
                  </div>
                </div>
              )}
            </div>
            
            {!loading && (
              <div className="border-t border-[#E9D5FF] pt-4 mt-6 text-center text-xs text-[#6B5E78] font-bold tracking-wider uppercase">
                Active Model: {metrics?.model_name || 'Multiple Linear Regression'}
              </div>
            )}
          </div>

          {/* Feature Weights Chart */}
          <div className="md:col-span-2 bg-[#F3E8FF]/40 border border-[#E9D5FF] rounded-3xl p-8 flex flex-col justify-between backdrop-blur-md shadow-sm">
            <div>
              <h3 className="text-xl font-bold text-[#1E1B4B] mb-2 flex items-center gap-2">
                <BrainCircuit className="text-[#8B5CF6] w-5 h-5" /> Regressor Coefficient Weights
              </h3>
              <p className="text-xs text-[#6B5E78] mb-6">Absolute magnitude of influence (in Lakhs) for each model feature weight.</p>
              
              <div className="h-64 w-full">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={featureWeights} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                      <XAxis type="number" stroke="#6B5E78" />
                      <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4A3E56', fontSize: 11 }} width={90} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(139,92,246,0.02)' }} 
                        contentStyle={{ backgroundColor: 'white', borderColor: '#E9D5FF', borderRadius: '12px' }}
                        formatter={(value, name, props) => [`${props.payload.rawValue.toFixed(5)} Lakh`, 'Coefficient']}
                      />
                      <Bar dataKey="weight" fill="#8B5CF6" radius={[0, 6, 6, 0]} barSize={16}>
                        {featureWeights.map((entry, index) => {
                          const colors = ['#8B5CF6', '#A78BFA', '#C084FC', '#D8B4FE', '#818CF8', '#6366F1', '#4F46E5', '#4338CA'];
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {!loading && (
              <div className="border-t border-[#E9D5FF] pt-4 mt-6 text-xs text-[#6B5E78] grid grid-cols-2 md:grid-cols-3 gap-4 font-bold">
                {featureWeights.slice(0, 3).map(w => (
                  <div key={w.feature}>
                    <strong className="text-[#1E1B4B] block mb-0.5">{w.feature}</strong>
                    <span className="text-[10px] block leading-tight text-[#6B5E78]">{w.details}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 4. Prediction Accuracy Scatter Plot */}
        <section className="mt-12 bg-white border border-[#E9D5FF] rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#1E1B4B] flex items-center gap-2">
                <LineChart className="text-[#8B5CF6] w-5 h-5" /> Prediction Accuracy Scatter Plot 📈
              </h3>
              <p className="text-xs text-[#6B5E78] font-bold">
                Trained Linear Regression Model: Actual vs. Predicted Values for the Test Set (in Rupees)
              </p>
            </div>
          </div>
          
          <div className="h-80 w-full flex items-center justify-center">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
              </div>
            ) : scatterData.length === 0 ? (
              <div className="text-sm font-semibold text-gray-400">No accuracy plot data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F8F5FC" />
                  <XAxis 
                    type="number" 
                    dataKey="actual" 
                    name="Actual Price" 
                    stroke="#6B5E78"
                    tickFormatter={(val) => `₹${val / 100000}L`} 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="predicted" 
                    name="Predicted Price" 
                    stroke="#6B5E78"
                    tickFormatter={(val) => `₹${val / 100000}L`} 
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    formatter={(value) => `₹${(value / 100000).toFixed(2)} Lakh`}
                  />
                  <Scatter name="Properties" data={scatterData} fill="#8B5CF6" opacity={0.8} />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
