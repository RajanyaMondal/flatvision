import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card } from '../../components/ui/Card';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, ComposedChart
} from 'recharts';
import { 
  Calendar, Plus, Home, Wallet, TrendingUp, TrendingDown, PieChart as PieIcon, ArrowRight,
  MapPin, Settings, Info, Bell, Moon
} from 'lucide-react';
import { Link } from 'react-router-dom';

const COLORS = ['#58E0FF', '#92EEFF', '#47D8FF', '#92EEFF', '#00D2FF'];

const Dashboard = () => {
  const { user } = useUser();
  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6M');
  const [trendData, setTrendData] = useState([]);

  const fetchTrendData = async (range) => {
    try {
      const mlServiceUrl = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000';
      const res = await fetch(`${mlServiceUrl}/trend-data?time_range=${range}`);
      if (res.ok) {
        setTrendData(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTrendData(timeRange);
  }, [timeRange]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const mlServiceUrl = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000';
        
        const [metricsRes, datasetRes] = await Promise.all([
          fetch(`${mlServiceUrl}/metrics`),
          fetch(`${mlServiceUrl}/dataset-data`)
        ]);

        if (metricsRes.ok && datasetRes.ok) {
          const metricsData = await metricsRes.json();
          const datasetData = await datasetRes.json();
          
          setMetrics(metricsData);

          if (datasetData.length > 0) {
            const prices = datasetData.map(d => d.Price_Lakh * 100000);
            
            // Calculate distributions
            const typeCount = { 'Apartment': 0, 'Builder Floor': 0, 'Villa': 0, 'Independent House': 0, 'Others': 0 };
            datasetData.forEach(d => {
               // mock some property types based on bhk/area since we don't have this field
               if (d.Bedrooms >= 4 && d.Area_Sqft > 2000) typeCount['Villa']++;
               else if (d.Bedrooms === 3) typeCount['Builder Floor']++;
               else if (d.Bedrooms <= 2) typeCount['Apartment']++;
               else typeCount['Independent House']++;
            });
            const typeDistribution = Object.keys(typeCount).map(k => ({ name: k, value: typeCount[k] })).sort((a,b)=>b.value-a.value);

            // Scatter Data (Area vs Price)
            const scatterData = datasetData.slice(0, 300).map(d => ({
               x: d.Area_Sqft,
               y: d.Price_Lakh
            }));

            // Calculate best fit line (Linear Regression)
            const n = scatterData.length;
            let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
            scatterData.forEach(d => {
              sumX += d.x;
              sumY += d.y;
              sumXY += d.x * d.y;
              sumX2 += d.x * d.x;
            });
            const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;
            const minX = Math.min(...scatterData.map(d => d.x));
            const maxX = Math.max(...scatterData.map(d => d.x));
            const bestFitData = [
              { x: minX, y: slope * minX + intercept },
              { x: maxX, y: slope * maxX + intercept }
            ];

              // Feature Importance (mocked based on typical real estate models)
              const featureImportance = [
                 { name: 'Area', value: 32.4 }, { name: 'Location', value: 24.7 },
                 { name: 'Bedrooms', value: 16.6 }, { name: 'Floor', value: 10.8 },
                 { name: 'Parking', value: 7.3 }, { name: 'Facing', value: 5.2 },
                 { name: 'Bathrooms', value: 3.0 }
              ];

              setStats({
                totalProperties: datasetData.length,
                avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
                typeDistribution,
                scatterData,
                bestFitData,
                featureImportance,
                recentPredictions: datasetData.slice(0, 4) // reusing dataset data as mock predictions
              });
            }
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#58E0FF]/40 border-t-[#58E0FF] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen overflow-hidden text-[#0A2540] font-sans selection:bg-[#92EEFF]/30"
      style={{
        background: '#F2EFE7'
      }}
    >
      {/* Playful Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,173,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,173,238,0.06)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Animated Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#92EEFF]/30 blur-[120px] mix-blend-multiply animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#58E0FF]/20 blur-[120px] mix-blend-multiply animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-[#47D8FF]/20 blur-[120px] mix-blend-multiply animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* 1. Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center clay-card p-8 relative overflow-hidden mb-6 transition-all duration-300">
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#0A2540] to-[#163050] flex flex-wrap items-center gap-2 sm:gap-3 tracking-tight">
              Welcome back, {user?.firstName || 'Rai'}! <span className="text-3xl animate-wave origin-bottom-right inline-block">👋</span>
            </h1>
            <p className="text-[#476685] mt-2 font-bold text-base tracking-wide">Here's your intelligent real estate market overview today.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-6 md:mt-0 relative z-10">
            <Link to="/app/predict" className="flex items-center gap-2 px-6 py-3 rounded-2xl clay-accent font-bold text-sm">
              <Plus className="w-5 h-5" />
              New Prediction
            </Link>
          </div>

          {/* Decorative illustration right side */}
          <div className="absolute right-0 top-0 h-full w-[500px] opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <div className="absolute right-0 top-0 h-full w-[400px] opacity-20 pointer-events-none bg-gradient-to-l from-[#58E0FF] to-transparent"></div>
        </div>

        {/* 2. Metrics Row (5 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
           {/* Card 1 */}
           <Card className="clay-card p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                 <div className="w-14 h-14 rounded-[20px] bg-[#F2EFE7] border border-[#7AAACE]/30 text-[#00D2FF] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                   <Home className="w-7 h-7" />
                 </div>
                 <div className="text-right">
                   <div className="text-[10px] font-extrabold text-[#476685] uppercase tracking-widest mb-1">Total Properties</div>
                   <div className="text-4xl font-black text-[#0A2540] tracking-tighter leading-none">100</div>
                 </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 mt-2">
                 <div className="bg-emerald-500/10 p-1 rounded-full"><TrendingUp className="w-3.5 h-3.5" /></div> 4.2% <span className="text-[#476685]/70 font-semibold ml-1">vs last month</span>
              </div>
           </Card>

           {/* Card 2 */}
           <Card className="clay-card p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                 <div className="w-14 h-14 rounded-[20px] bg-[#F2EFE7] border border-[#7AAACE]/30 text-[#00D2FF] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                   <Wallet className="w-7 h-7" />
                 </div>
                 <div className="text-right">
                   <div className="text-[10px] font-extrabold text-[#476685] uppercase tracking-widest mb-1">Average Price</div>
                   <div className="text-3xl font-black text-[#0A2540] tracking-tighter leading-none">₹75.38 L</div>
                 </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 mt-2">
                 <div className="bg-red-500/10 p-1 rounded-full"><TrendingDown className="w-3.5 h-3.5" /></div> 1.2% <span className="text-[#476685]/70 font-semibold ml-1">vs last month</span>
              </div>
           </Card>

           {/* Card 3 */}
           <Card className="clay-card p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                 <div className="w-14 h-14 rounded-[20px] bg-[#F2EFE7] border border-[#7AAACE]/30 text-[#00D2FF] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                   <TrendingUp className="w-7 h-7" />
                 </div>
                 <div className="text-right">
                   <div className="text-[10px] font-extrabold text-[#476685] uppercase tracking-widest mb-1">Model R² Score</div>
                   <div className="text-3xl font-black text-[#0A2540] tracking-tighter leading-none">0.9979</div>
                 </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 mt-2">
                 <div className="bg-emerald-500/10 p-1 rounded-full"><TrendingUp className="w-3.5 h-3.5" /></div> 2.4% <span className="text-[#476685]/70 font-semibold ml-1">vs last month</span>
              </div>
           </Card>

           {/* Card 4 */}
           <Card className="clay-card p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                 <div className="w-14 h-14 rounded-[20px] bg-[#F2EFE7] border border-[#7AAACE]/30 text-[#00D2FF] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                   <ArrowRight className="w-7 h-7 -rotate-45" />
                 </div>
                 <div className="text-right">
                   <div className="text-[10px] font-extrabold text-[#476685] uppercase tracking-widest mb-1">Model RMSE</div>
                   <div className="text-3xl font-black text-[#0A2540] tracking-tighter leading-none">₹0.80 L</div>
                 </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 mt-2">
                 <div className="bg-red-500/10 p-1 rounded-full"><TrendingDown className="w-3.5 h-3.5" /></div> 15.3% <span className="text-[#476685]/70 font-semibold ml-1">vs last month</span>
              </div>
           </Card>

           {/* Card 5 */}
           <Card className="clay-card p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                 <div className="w-14 h-14 rounded-[20px] bg-[#F2EFE7] border border-[#7AAACE]/30 text-[#00D2FF] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                   <PieIcon className="w-7 h-7" />
                 </div>
                 <div className="text-right">
                   <div className="text-[10px] font-extrabold text-[#476685] uppercase tracking-widest mb-1">Predictions (Mo)</div>
                   <div className="text-4xl font-black text-[#0A2540] tracking-tighter leading-none">248</div>
                 </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 mt-2">
                 <div className="bg-emerald-500/10 p-1 rounded-full"><TrendingUp className="w-3.5 h-3.5" /></div> 15.3% <span className="text-[#476685]/70 font-semibold ml-1">vs last month</span>
              </div>
           </Card>
        </div>

        {/* 3. Analytics Row (3 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
           {/* Scatter Plot - Span 2 cols */}
           <Card className="col-span-1 lg:col-span-2 clay-card p-8 flex flex-col">
              <div className="flex flex-col mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-8 bg-gradient-to-b from-[#00D2FF] to-[#58E0FF] rounded-full shadow-lg shadow-[#58E0FF]/50"></div>
                   <h3 className="text-2xl font-black text-[#0A2540] tracking-tight">Area vs. Price Correlation</h3>
                </div>
                <p className="text-[#476685] font-bold text-sm mt-2 ml-5">
                   Sample distribution of property sizes vs valuation with best fit trend line.
                </p>
              </div>
              <div className="flex-1 min-h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={stats?.scatterData || []} margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#C2F6FF" opacity={0.6} />
                      <XAxis type="number" dataKey="x" name="Area" unit=" sqft" tick={{ fontSize: 13, fill: '#476685', fontWeight: 'bold' }} axisLine={false} tickLine={false} stroke="#C2F6FF" domain={[0, 'dataMax + 100']} />
                      <YAxis type="number" dataKey="y" name="Price" unit=" L" tick={{ fontSize: 13, fill: '#476685', fontWeight: 'bold' }} axisLine={false} tickLine={false} stroke="#C2F6FF" />
                      <ZAxis type="number" range={[80, 80]} />
                      <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '16px', padding: '12px', fontSize: '14px', fontWeight: 'bold', border: '1px solid #C2F6FF', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', color: '#0A2540', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                      
                      <Scatter name="Properties" data={stats?.scatterData || []} fill="#00D2FF" stroke="none" opacity={0.7} />
                      <Line data={stats?.bestFitData || []} type="monotone" dataKey="y" stroke="#0A2540" strokeWidth={4} dot={false} activeDot={false} legendType="none" style={{ filter: 'drop-shadow(0px 4px 6px rgba(46, 17, 40, 0.2))' }} />
                    </ComposedChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           {/* Doughnut Chart */}
           <Card className="clay-card p-8 flex flex-col">
              <h3 className="text-xl font-black text-[#0A2540] tracking-tight flex items-center gap-2 mb-6">
                 Dataset Distribution
              </h3>
              <div className="flex-1 flex flex-col items-center">
                 <div className="w-full h-[300px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats?.typeDistribution || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={85}
                          outerRadius={115}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                          cornerRadius={8}
                        >
                          {(stats?.typeDistribution || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={{ borderRadius: '16px', padding: '12px', fontSize: '14px', fontWeight: 'bold', border: '1px solid #C2F6FF', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', color: '#0A2540', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none drop-shadow-sm">
                       <span className="text-[10px] font-extrabold text-[#476685] uppercase tracking-widest">Total</span>
                       <span className="text-4xl font-black text-[#0A2540] leading-none tracking-tighter mt-1">{(stats?.totalProperties || 0).toLocaleString()}</span>
                    </div>
                 </div>
                 <div className="w-full space-y-3 mt-6 px-2">
                    {(stats?.typeDistribution || []).map((entry, index) => {
                       const pct = ((entry.value / (stats?.totalProperties || 1)) * 100).toFixed(1);
                       return (
                         <div key={entry.name} className="flex items-center justify-between text-sm">
                           <div className="flex items-center gap-3 text-[#476685] font-bold tracking-wide">
                             <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                             {entry.name}
                           </div>
                           <div className="flex items-center gap-3">
                             <span className="text-[#0A2540] font-black">{pct}%</span>
                             <span className="text-[#476685]/70 text-xs font-semibold">({entry.value.toLocaleString()})</span>
                           </div>
                         </div>
                       );
                    })}
                 </div>
              </div>
           </Card>

           {/* Feature Importance Bar Chart - Full width */}
           <Card className="col-span-1 lg:col-span-3 clay-card p-8 flex flex-col">
              <h3 className="text-2xl font-black text-[#0A2540] tracking-tight flex items-center gap-2 mb-8">
                 Feature Importance Analysis
              </h3>
              <div className="flex-1 flex flex-col justify-center space-y-6 pr-4">
                 {(stats?.featureImportance || []).map((feat, index) => (
                   <div key={feat.name} className="flex items-center gap-6">
                     <div className="w-32 text-sm font-bold text-[#476685] flex items-center gap-3 tracking-wide">
                       <div className="w-5 h-5 bg-white rounded-[6px] flex items-center justify-center border border-[#7AAACE]/30 shadow-sm">
                          <div className="w-2.5 h-2.5 rounded-[3px] bg-[#58E0FF]"></div>
                       </div>
                       {feat.name}
                     </div>
                     <div className="flex-1 h-4 bg-[#F2EFE7] rounded-full overflow-hidden shadow-inner border border-[#7AAACE]/30/50">
                        <div className="h-full bg-gradient-to-r from-[#00D2FF] to-[#47D8FF] rounded-full shadow-[0_0_10px_rgba(255,115,208,0.5)]" style={{ width: `${feat.value}%`, opacity: 1 - (index * 0.05) }}></div>
                     </div>
                     <div className="w-14 text-right text-base font-black text-[#0A2540]">{feat.value.toFixed(1)}%</div>
                   </div>
                 ))}
              </div>
           </Card>
           
           {/* 4. Trends Row (1 Col) */}
           <div className="grid grid-cols-1 gap-8 mb-8 w-full col-span-1 lg:col-span-3">
              {/* Price Trend */}
             <Card className="clay-card p-8 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
                   <div className="flex items-center gap-3 shrink-0">
                     <div className="w-2 h-8 bg-gradient-to-b from-[#00D2FF] to-[#58E0FF] rounded-full shadow-lg shadow-[#58E0FF]/50"></div>
                     <h3 className="text-2xl font-black text-[#0A2540] tracking-tight">
                        Market Price Trend
                     </h3>
                   </div>
                   <div className="flex flex-wrap bg-white/60 p-1.5 rounded-[14px] text-xs font-bold text-[#476685] shadow-inner w-full sm:w-auto border border-[#7AAACE]/30 backdrop-blur-md gap-1 justify-center sm:justify-start">
                      {['1M', '3M', '6M', '1Y', '5Y'].map(r => (
                        <div 
                          key={r}
                          onClick={() => setTimeRange(r)}
                          className={`px-4 sm:px-5 py-2 rounded-[10px] cursor-pointer transition-all duration-300 tracking-wide flex-grow sm:flex-grow-0 text-center ${timeRange === r ? 'bg-[#58E0FF] text-[#0A2540] shadow-md shadow-[#58E0FF]/40' : 'hover:bg-white/60'}`}
                        >
                          {r}
                        </div>
                      ))}
                   </div>
                </div>
                <div className="w-full h-[500px] min-h-[500px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorPrice2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00D2FF" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#00D2FF" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#C2F6FF" opacity={0.6} />
                        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#476685', fontWeight: 'bold' }} dy={10} />
                        <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#476685', fontWeight: 'bold' }} />
                        <RechartsTooltip contentStyle={{ borderRadius: '16px', padding: '12px', fontSize: '14px', fontWeight: 'bold', border: '1px solid #C2F6FF', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', color: '#0A2540', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                        <Area type="monotone" dataKey="price" name="Price (₹ Lakhs)" stroke="#C8DFDB" strokeWidth={6} fillOpacity={1} fill="url(#colorPrice2)" activeDot={{ r: 8, fill: '#00D2FF', stroke: '#fff', strokeWidth: 4, style: { filter: 'drop-shadow(0px 4px 8px rgba(0, 210, 255, 0.6))' } }} />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </Card>
           </div>
        </div>

        {/* 6. Footer Banner */}
        <div className="w-full clay-accent !bg-[#00D2FF] p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
           <div className="flex items-center gap-5 relative z-10">
              <div className="w-16 h-16 rounded-[24px] bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.3)]">
                 <svg className="w-8 h-8 text-[#0A2540]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
              </div>
              <div>
                 <h3 className="font-black text-xl sm:text-2xl tracking-tight text-[#0A2540]">AI-Powered Insights</h3>
                 <p className="text-[#0A2540]/70 font-semibold text-sm mt-1 tracking-wide">Our model continuously learns from new data to provide you with more accurate predictions.</p>
              </div>
           </div>
           <div className="relative z-10 flex items-center gap-6">
              <Link to="/how-it-works" className="bg-white hover:bg-[#F0FCFF] text-[#00D2FF] px-8 py-3.5 rounded-2xl text-sm font-black tracking-wide shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2">
                 Explore Algorithms <ArrowRight className="w-4 h-4" />
              </Link>
           </div>
           {/* Subtle background patterns */}
           <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
           <div className="absolute top-0 right-0 w-[80%] h-[200%] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/30 to-transparent pointer-events-none rounded-full blur-[100px] transform translate-x-1/3 -translate-y-1/3"></div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
