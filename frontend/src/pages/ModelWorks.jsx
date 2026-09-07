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
        <div className="bg-white border border-[#7AAACE]/30 p-4 rounded-2xl shadow-md text-xs font-semibold text-[#0A2540]">
          <p className="font-extrabold text-[#00D2FF] mb-1.5 flex items-center gap-1.5">🎯 Valuation Audit Point</p>
          <div className="space-y-1 font-bold">
            <div>Actual Price: <span className="font-black text-[#0A2540]">₹{actualLakh.toFixed(2)} Lakh</span></div>
            <div>AI Valuation: <span className="font-black text-[#00D2FF]">₹{predictedLakh.toFixed(2)} Lakh</span></div>
            <div className="border-t border-[#7AAACE]/30 pt-1.5 mt-1.5 flex items-center justify-between gap-4 text-[10px]">
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
      className="min-h-screen text-[#0A2540] font-sans selection:bg-[#92EEFF]/30 overflow-x-hidden relative flex flex-col scroll-smooth"
      style={{
        background: '#F2EFE7'
      }}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,173,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,173,238,0.06)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#92EEFF]/15 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FFC6F3]/15 blur-[150px] pointer-events-none" />

      {/* Navigation handled by PublicLayout */}

      <main className="container mx-auto px-6 pt-36 pb-32 max-w-6xl relative z-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#92EEFF]/15 border border-[#92EEFF]/30 text-[#00D2FF] text-sm font-bold mb-6 shadow-sm">
            <BrainCircuit className="w-4 h-4 text-[#58E0FF]" /> Multiple Linear Regression Model
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[#0A2540] mb-6">
            How the AI Model Works
          </h1>
          <p className="text-xl md:text-2xl text-[#476685] leading-relaxed font-semibold">
            Understand the mathematics, feature mapping, and regression coefficients that evaluate your property price.
          </p>
        </div>

        {/* 1. Request Pipeline Grid */}
        <section className="mb-20">
          <h2 className="text-3xl font-black text-[#0A2540] mb-8 flex items-center gap-3 tracking-tight">
            <Cpu className="text-[#58E0FF] w-7 h-7 animate-spin" style={{ animationDuration: '8s' }} /> End-to-End System Architecture
          </h2>
          <div className="grid md:grid-cols-5 gap-6 items-center clay-card p-10 backdrop-blur-md">
            
            <div className="clay-card p-8 text-center hover:scale-[1.02] transition-transform">
              <span className="text-xs uppercase font-bold text-[#00D2FF] tracking-wider">Step 1</span>
              <div className="text-lg font-black text-[#0A2540] mt-3 mb-2">React Client</div>
              <p className="text-sm font-semibold text-[#476685] leading-relaxed">User inputs flat parameters on the dashboard UI (no extra mock parameters).</p>
            </div>
            
            <div className="flex justify-center text-[#58E0FF]"><ArrowRight className="rotate-90 md:rotate-0 w-8 h-8" /></div>
            
            <div className="clay-card p-8 text-center hover:scale-[1.02] transition-transform">
              <span className="text-xs uppercase font-bold text-[#00D2FF] tracking-wider">Step 2</span>
              <div className="text-lg font-black text-[#0A2540] mt-3 mb-2">Express API</div>
              <p className="text-sm font-semibold text-[#476685] leading-relaxed">Validates the 5 active features and writes logs to database.</p>
            </div>
            
            <div className="flex justify-center text-[#58E0FF]"><ArrowRight className="rotate-90 md:rotate-0 w-8 h-8" /></div>
            
            <div className="clay-card p-8 text-center hover:scale-[1.02] transition-transform">
              <span className="text-xs uppercase font-bold text-[#00D2FF] tracking-wider">Step 3</span>
              <div className="text-lg font-black text-[#0A2540] mt-3 mb-2">Python FastAPI</div>
              <p className="text-sm font-semibold text-[#476685] leading-relaxed">Applies Scikit-Learn linear regression and computes similar properties.</p>
            </div>

          </div>
        </section>

        {/* 2. Algorithm & Mathematics */}
        <section className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="clay-card p-10 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-black text-[#0A2540] mb-6 flex items-center gap-3">
                <Activity className="text-[#58E0FF] w-7 h-7" /> The Mathematics of Regression
              </h2>
              <p className="text-[#476685] text-base leading-relaxed mb-6 font-semibold">
                Multiple Linear Regression models fit a straight hyperplane that minimizes the sum of squared differences (residual error) between actual spreadsheet prices and predicted values.
              </p>
              <ul className="space-y-4 text-base text-[#0A2540]">
                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#58E0FF] mt-2 shrink-0" />
                  <div>
                    <strong className="text-[#0A2540] block font-extrabold">Ordinary Least Squares (OLS):</strong>
                    Calculates optimal feature weights ($\beta_i$) using exact linear matrix algebra.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#58E0FF] mt-2 shrink-0" />
                  <div>
                    <strong className="text-[#0A2540] block font-extrabold">One-Hot Category Encoding:</strong>
                    Maps categorical variables (like Facing orientation) into separate binary flag values (0 or 1).
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#58E0FF] mt-2 shrink-0" />
                  <div>
                    <strong className="text-[#0A2540] block font-extrabold">Additive Valuation Breakdown:</strong>
                    Directly sum the intercept and each variable multiplied by its coefficient. Makes the model extremely transparent!
                  </div>
                </li>
              </ul>

              <div className="mt-6 bg-[#F0FCFF] border border-[#7AAACE]/30 p-5 rounded-2xl">
                <h4 className="font-extrabold text-[#0A2540] mb-3">Example Calculation</h4>
                <p className="text-sm text-[#476685] mb-2 font-semibold">For a property with: <strong>Area</strong> = 1000 sqft, <strong>Bedrooms</strong> = 2, <strong>Floor</strong> = 3, <strong>Parking</strong> = 120 sqft, <strong>Facing</strong> = South</p>
                <div className="text-sm font-mono space-y-1 text-[#0A2540]">
                  <div><span className="text-pink-700">Area</span> = 1000 &times; 0.0608 = 60.8 Lakhs</div>
                  <div><span className="text-pink-700">Bedrooms</span> = 2 &times; 1.1564 = 2.31 Lakhs</div>
                  <div><span className="text-pink-700">Floor</span> = 3 &times; 0.4375 = 1.31 Lakhs</div>
                  <div><span className="text-pink-700">Parking</span> = 120 &times; 0.0245 = 2.94 Lakhs</div>
                  <div><span className="text-[#00D2FF]">Facing (South)</span> = 1 &times; 0.7381 = 0.74 Lakhs</div>
                  <div className="border-t border-[#7AAACE]/30 pt-1 mt-1 font-bold">Base (Intercept) = -13.75 Lakhs</div>
                  <div className="text-[#00D2FF] font-black text-base mt-2">Total Estimated Price = &#8377;54.35 Lakhs</div>
                </div>
              </div>
            </div>
          </div>

          <div className="clay-card p-10 flex flex-col justify-center items-center text-center">
            <span className="text-xs text-[#476685] uppercase tracking-widest font-black mb-6">Linear Regression Mathematical Equation</span>
            
            {loading ? (
              <div className="h-48 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#58E0FF]" />
              </div>
            ) : (
              <div className="text-sm md:text-base tracking-wide text-[#0A2540] font-mono bg-[#F0FCFF] px-8 py-8 rounded-2xl border border-[#7AAACE]/30 mb-8 leading-relaxed text-left w-full overflow-x-auto space-y-1.5">
                <div><strong>Price (Lakh)</strong> = {metrics?.intercept?.toFixed(4) || '-13.7460'}</div>
                <div className="text-pink-700"> + ({metrics?.coefficients?.Area_Sqft?.toFixed(6) || '0.060813'} × Area_Sqft)</div>
                <div className="text-pink-700"> + ({metrics?.coefficients?.Bedrooms?.toFixed(6) || '1.156441'} × Bedrooms)</div>
                <div className="text-pink-700"> + ({metrics?.coefficients?.Floor?.toFixed(6) || '0.437499'} × Floor)</div>
                <div className="text-pink-700"> + ({metrics?.coefficients?.Car_Parking_Sqft?.toFixed(6) || '0.024505'} × Car_Parking_Sqft)</div>
                <div className="text-[#00D2FF]"> + ({metrics?.coefficients?.Facing_East?.toFixed(6) || '-0.290379'} × IsFacingEast)</div>
                <div className="text-[#00D2FF]"> + ({metrics?.coefficients?.Facing_North?.toFixed(6) || '-0.391587'} × IsFacingNorth)</div>
                <div className="text-[#00D2FF]"> + ({metrics?.coefficients?.Facing_South?.toFixed(6) || '0.738098'} × IsFacingSouth)</div>
                <div className="text-[#00D2FF]"> + ({metrics?.coefficients?.Facing_West?.toFixed(6) || '-0.056132'} × IsFacingWest)</div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-6 text-sm max-w-md w-full border-t border-[#7AAACE]/30 pt-6 text-[#476685] font-bold">
              <div>
                <div className="font-extrabold text-[#58E0FF] text-xl mb-1">y</div>
                <span>Price (Lakhs)</span>
              </div>
              <div>
                <div className="font-extrabold text-[#58E0FF] text-xl mb-1">&beta;<sub>0</sub></div>
                <span>Intercept Offset</span>
              </div>
              <div>
                <div className="font-extrabold text-[#58E0FF] text-xl mb-1">&beta;<sub>i</sub>x<sub>i</sub></div>
                <span>Feature Weights × Inputs</span>
              </div>
            </div>
          </div>
        </section>

        {/* Error Metrics Formulas */}
        <section className="mb-20">
          <h2 className="text-3xl font-black text-[#0A2540] mb-8 flex items-center gap-3 tracking-tight">
            <LineChart className="text-[#58E0FF] w-7 h-7" /> Error Metrics & Formulas
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="clay-card p-6">
              <h3 className="font-extrabold text-[#0A2540] text-lg mb-2">MSE (Mean Squared Error)</h3>
              <p className="text-sm text-[#476685] mb-4 font-semibold">Average of the squared differences between predicted and actual values. Heavily penalizes large errors.</p>
              <div className="bg-[#F0FCFF] p-3 rounded-xl border border-[#7AAACE]/30 font-mono text-xs text-center text-[#0A2540] font-bold">
                MSE = (1/n) &Sigma; (y - &#375;)&sup2;
              </div>
            </div>
            
            <div className="clay-card p-6">
              <h3 className="font-extrabold text-[#0A2540] text-lg mb-2">RMSE (Root Mean Squared Error)</h3>
              <p className="text-sm text-[#476685] mb-4 font-semibold">Square root of MSE. Brings the error metric back to the same unit as the target variable (Lakhs).</p>
              <div className="bg-[#F0FCFF] p-3 rounded-xl border border-[#7AAACE]/30 font-mono text-xs text-center text-[#0A2540] font-bold">
                RMSE = &radic;[ (1/n) &Sigma; (y - &#375;)&sup2; ]
              </div>
            </div>

            <div className="clay-card p-6">
              <h3 className="font-extrabold text-[#0A2540] text-lg mb-2">MAE (Mean Absolute Error)</h3>
              <p className="text-sm text-[#476685] mb-4 font-semibold">Average of absolute differences between predicted and actual values. Easier to interpret directly.</p>
              <div className="bg-[#F0FCFF] p-3 rounded-xl border border-[#7AAACE]/30 font-mono text-xs text-center text-[#0A2540] font-bold">
                MAE = (1/n) &Sigma; |y - &#375;|
              </div>
            </div>

            <div className="clay-card p-6">
              <h3 className="font-extrabold text-[#0A2540] text-lg mb-2">R&sup2; (R-Squared)</h3>
              <p className="text-sm text-[#476685] mb-4 font-semibold">Proportion of the variance in the dependent variable that is predictable from the independent variables.</p>
              <div className="bg-[#F0FCFF] p-3 rounded-xl border border-[#7AAACE]/30 font-mono text-xs text-center text-[#0A2540] font-bold">
                R&sup2; = 1 - [ &Sigma; (y - &#375;)&sup2; / &Sigma; (y - y&#772;)&sup2; ]
              </div>
            </div>
          </div>
        </section>

        {/* 3. Live Metrics & Feature Weights */}
        <section className="grid md:grid-cols-3 gap-8">
          {/* Live metrics card */}
          <div className="clay-card p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-black text-[#0A2540] mb-8 flex items-center gap-3">
                <LineChart className="text-[#58E0FF] w-6 h-6" /> Live Model Accuracy
              </h3>

              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-full border-2 border-[#7AAACE]/30 border-t-[#58E0FF] animate-spin" />
                  <span className="text-xs text-[#476685] mt-2 font-bold">Fetching active training statistics...</span>
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
                  <div className="bg-[#F0FCFF] border border-[#7AAACE]/30 rounded-2xl p-5 shadow-sm">
                    <span className="text-sm text-[#476685] font-extrabold uppercase tracking-wider block mb-1">R² (R-Squared) Score</span>
                    <span className="text-4xl md:text-5xl font-black text-[#0A2540]">{metrics?.r2 ? Number(metrics.r2).toFixed(6) : '0.997875'}</span>
                    <p className="text-xs text-emerald-600 mt-1.5 font-bold">Perfect Fit (99.78% variance explained)</p>
                  </div>
                  
                  <div className="bg-[#F0FCFF] border border-[#7AAACE]/30 rounded-2xl p-5 shadow-sm">
                    <span className="text-sm text-[#476685] font-extrabold uppercase tracking-wider block mb-1">Mean Absolute Error (MAE)</span>
                    <span className="text-3xl md:text-4xl font-black text-[#0A2540]">₹{metrics?.mae ? Number(metrics.mae).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '63,126'}</span>
                    <p className="text-xs text-[#476685] mt-1.5 font-semibold">Average valuation delta variance</p>
                  </div>

                  <div className="bg-[#F0FCFF] border border-[#7AAACE]/30 rounded-2xl p-5 shadow-sm">
                    <span className="text-sm text-[#476685] font-extrabold uppercase tracking-wider block mb-1">Total Dataset Training Rows</span>
                    <span className="text-2xl font-black text-[#0A2540]">100 Real Properties</span>
                  </div>
                </div>
              )}
            </div>
            
            {!loading && (
              <div className="border-t border-[#7AAACE]/30 pt-4 mt-6 text-center text-xs text-[#476685] font-bold tracking-wider uppercase">
                Active Model: {metrics?.model_name || 'Multiple Linear Regression'}
              </div>
            )}
          </div>

          {/* Feature Weights Chart */}
          <div className="md:col-span-2 clay-card p-10 flex flex-col justify-between backdrop-blur-md">
            <div>
              <h3 className="text-2xl font-black text-[#0A2540] mb-3 flex items-center gap-3">
                <BrainCircuit className="text-[#58E0FF] w-6 h-6" /> Regressor Coefficient Weights
              </h3>
              <p className="text-sm font-semibold text-[#476685] mb-8">Absolute magnitude of influence (in Lakhs) for each model feature weight.</p>
              
              <div className="h-80 w-full">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#58E0FF]" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={featureWeights} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                      <XAxis type="number" stroke="#476685" tick={{ fill: '#0A2540', fontWeight: 'bold', fontSize: 11 }} />
                      <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} tick={{ fill: '#0A2540', fontWeight: 'bold', fontSize: 11 }} width={90} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,173,238,0.04)' }} 
                        contentStyle={{ backgroundColor: 'white', borderColor: '#C2F6FF', borderRadius: '16px', fontWeight: 'bold' }}
                        formatter={(value, name, props) => [`${props.payload.rawValue.toFixed(5)} Lakh`, 'Coefficient']}
                      />
                      <Bar dataKey="weight" fill="#00D2FF" radius={[0, 6, 6, 0]} barSize={24}>
                        {featureWeights.map((entry, index) => {
                          const colors = ['#58E0FF', '#92EEFF', '#FFC6F3', '#C2F6FF', '#33CEFF', '#FFA2E8', '#00D2FF', '#47D8FF'];
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {!loading && (
              <div className="border-t border-[#7AAACE]/30 pt-4 mt-6 text-sm text-[#476685] grid grid-cols-2 md:grid-cols-3 gap-4 font-bold">
                {featureWeights.slice(0, 3).map(w => (
                  <div key={w.feature}>
                    <strong className="text-[#0A2540] block mb-0.5">{w.feature}</strong>
                    <span className="text-xs block leading-tight text-[#476685]">{w.details}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 4. Prediction Accuracy Scatter Plot */}
        <section className="mt-12 clay-card p-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-[#0A2540] flex items-center gap-3 mb-2">
                <LineChart className="text-[#58E0FF] w-6 h-6" /> Prediction Accuracy Scatter Plot
              </h3>
              <p className="text-sm font-bold text-[#476685]">
                Trained Linear Regression Model: Actual vs. Predicted Values for the Test Set (in Rupees)
              </p>
            </div>
          </div>
          
          <div className="h-[400px] w-full flex items-center justify-center">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#58E0FF]" />
              </div>
            ) : scatterData.length === 0 ? (
              <div className="text-sm font-semibold text-gray-400">No accuracy plot data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0FCFF" strokeWidth={1.5} />
                  <XAxis 
                    type="number" 
                    dataKey="actual" 
                    name="Actual Price" 
                    stroke="#476685"
                    tick={{ fill: '#0A2540', fontWeight: 'bold', fontSize: 12 }}
                    tickFormatter={(val) => `₹${val / 100000}L`} 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="predicted" 
                    name="Predicted Price" 
                    stroke="#476685"
                    tick={{ fill: '#0A2540', fontWeight: 'bold', fontSize: 12 }}
                    tickFormatter={(val) => `₹${val / 100000}L`} 
                  />
                  <Tooltip content={<CustomScatterTooltip />} />
                  
                  {/* Perfect Fit Reference Line */}
                  <Scatter 
                    name="Perfect Fit Line" 
                    data={diagonalLineData} 
                    line={{ stroke: '#00D2FF', strokeWidth: 3.5, strokeDasharray: '4 4' }} 
                    shape={() => null} 
                    legendType="none" 
                  />
                  
                  {/* Scatter dots */}
                  <Scatter 
                    name="Properties" 
                    data={scatterData} 
                    fill="#00D2FF" 
                    stroke="#C8DFDB" 
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
