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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const Dashboard = () => {
  const { user } = useUser();
  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

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

            // Trend Data (mocking last 6 months)
            const trendData = [
               { month: 'Dec \'24', price: 62 }, { month: 'Jan \'25', price: 58 },
               { month: 'Feb \'25', price: 75 }, { month: 'Mar \'25', price: 68 },
               { month: 'Apr \'25', price: 85 }, { month: 'May \'25', price: 95 },
            ];

            // Forecast Data (mocking future 6 months)
            const forecastData = [
               { month: 'May \'25', hist: 50, forecast: 50 }, { month: 'Jun \'25', hist: 58, forecast: 55 },
               { month: 'Jul \'25', hist: 68, forecast: 65 }, { month: 'Aug \'25', hist: 75, forecast: 70 },
               { month: 'Sep \'25', hist: 85, forecast: 78 }, { month: 'Oct \'25', hist: null, forecast: 85 },
               { month: 'Nov \'25', hist: null, forecast: 95 }
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
              trendData,
              forecastData,
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
        <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Helper for mini charts in top cards
  const miniChartData = [4, 6, 5, 8, 7, 9, 12, 10];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-slate-50 min-h-screen">
      
      {/* 1. Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden mb-6">
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            Welcome back, {user?.firstName || 'Rai'}! <span className="text-2xl">👋</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Here's what's happening in your property market today.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-4 md:mt-0 relative z-10">
          <Link to="/app/predict" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm border border-blue-100 shadow-sm hover:bg-blue-100 transition-colors">
            <Plus className="w-4 h-4" />
            New Prediction
          </Link>
        </div>

        {/* Decorative illustration right side */}
        <div className="absolute right-0 top-0 h-full w-[400px] opacity-10 pointer-events-none bg-gradient-to-l from-blue-500 to-transparent"></div>
        <div className="absolute -right-10 -bottom-10 opacity-30 pointer-events-none hidden md:block">
           {/* Abstract city shapes */}
           <div className="w-32 h-40 bg-blue-400 rounded-t-lg absolute bottom-0 right-32"></div>
           <div className="w-24 h-56 bg-indigo-500 rounded-t-lg absolute bottom-0 right-10"></div>
           <div className="w-16 h-32 bg-emerald-400 rounded-t-lg absolute bottom-0 right-60"></div>
        </div>
      </div>

      {/* 2. Metrics Row (5 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
         {/* Card 1 */}
         <Card className="bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-[24px] p-6 flex flex-col justify-between relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center shadow-inner border border-blue-200/50 group-hover:scale-110 transition-transform">
                 <Home className="w-7 h-7" />
               </div>
               <div className="text-right">
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Properties</div>
                 <div className="text-4xl font-black text-slate-900 tracking-tight leading-none">100</div>
               </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 mt-2">
               <div className="bg-emerald-50 p-1 rounded-full"><TrendingUp className="w-3.5 h-3.5" /></div> 4.2% <span className="text-slate-400 font-medium ml-1">vs last month</span>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-10 opacity-20">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={miniChartData.map((v,i)=>({v, i}))}><Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={3} dot={false} /></LineChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Card 2 */}
         <Card className="bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-[24px] p-6 flex flex-col justify-between relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 flex items-center justify-center shadow-inner border border-purple-200/50 group-hover:scale-110 transition-transform">
                 <Wallet className="w-7 h-7" />
               </div>
               <div className="text-right">
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Average Price</div>
                 <div className="text-3xl font-black text-slate-900 tracking-tight leading-none">₹75.38 L</div>
               </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 mt-2">
               <div className="bg-red-50 p-1 rounded-full"><TrendingDown className="w-3.5 h-3.5" /></div> 1.2% <span className="text-slate-400 font-medium ml-1">vs last month</span>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-10 opacity-20">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={miniChartData.map((v,i)=>({v: 15-v, i}))}><Line type="monotone" dataKey="v" stroke="#a855f7" strokeWidth={3} dot={false} /></LineChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Card 3 */}
         <Card className="bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-[24px] p-6 flex flex-col justify-between relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner border border-emerald-200/50 group-hover:scale-110 transition-transform">
                 <TrendingUp className="w-7 h-7" />
               </div>
               <div className="text-right">
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Model R² Score</div>
                 <div className="text-3xl font-black text-slate-900 tracking-tight leading-none">0.9979</div>
               </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 mt-2">
               <div className="bg-emerald-50 p-1 rounded-full"><TrendingUp className="w-3.5 h-3.5" /></div> 2.4% <span className="text-slate-400 font-medium ml-1">vs last month</span>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-10 opacity-20">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={miniChartData.map((v,i)=>({v, i}))}><Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={3} dot={false} /></LineChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Card 4 */}
         <Card className="bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-[24px] p-6 flex flex-col justify-between relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 flex items-center justify-center shadow-inner border border-orange-200/50 group-hover:scale-110 transition-transform">
                 <ArrowRight className="w-7 h-7 -rotate-45" />
               </div>
               <div className="text-right">
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Model RMSE</div>
                 <div className="text-3xl font-black text-slate-900 tracking-tight leading-none">₹0.80 L</div>
               </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-red-500 mt-2">
               <div className="bg-red-50 p-1 rounded-full"><TrendingDown className="w-3.5 h-3.5" /></div> 15.3% <span className="text-slate-400 font-medium ml-1">vs last month</span>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-10 opacity-20">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={miniChartData.map((v,i)=>({v, i}))}><Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={3} dot={false} /></LineChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Card 5 */}
         <Card className="bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-[24px] p-6 flex flex-col justify-between relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
               <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner border border-indigo-200/50 group-hover:scale-110 transition-transform">
                 <PieIcon className="w-7 h-7" />
               </div>
               <div className="text-right">
                 <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Predictions (Mo)</div>
                 <div className="text-4xl font-black text-slate-900 tracking-tight leading-none">248</div>
               </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 mt-2">
               <div className="bg-emerald-50 p-1 rounded-full"><TrendingUp className="w-3.5 h-3.5" /></div> 15.3% <span className="text-slate-400 font-medium ml-1">vs last month</span>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-10 opacity-20">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={miniChartData.map((v,i)=>({v: v*2, i}))}><Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={3} dot={false} /></LineChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>

      {/* 3. Analytics Row (3 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
         {/* Scatter Plot */}
         <Card className="bg-gradient-to-br from-emerald-50/50 to-lime-50/30 border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-[24px] p-8 flex flex-col transition-all duration-300 hover:shadow-2xl">
            <div className="flex flex-col mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-8 bg-purple-500 rounded-full"></div>
                 <h3 className="text-2xl font-bold text-slate-800">Area vs. Price Correlation</h3>
              </div>
              <p className="text-slate-500 font-medium text-base mt-2 ml-5">
                 Sample distribution of property sizes vs valuation with best fit trend line.
              </p>
            </div>
            <div className="flex-1 min-h-[350px]">
               <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart margin={{ top: 10, right: 20, bottom: 0, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.6} />
                    <XAxis type="number" dataKey="x" name="Area" unit=" sqft" tick={{ fontSize: 13, fill: '#64748b', fontWeight: 'bold' }} axisLine={true} tickLine={false} stroke="#cbd5e1" domain={[0, 'dataMax + 100']} />
                    <YAxis type="number" dataKey="y" name="Price" unit=" L" tick={{ fontSize: 13, fill: '#64748b', fontWeight: 'bold' }} axisLine={true} tickLine={false} stroke="#cbd5e1" />
                    <ZAxis type="number" range={[80, 80]} />
                    <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    
                    <Scatter name="Properties" data={stats?.scatterData || []} fill="#34d399" stroke="#ffffff" strokeWidth={2} opacity={0.9} />
                    <Line data={stats?.bestFitData || []} type="monotone" dataKey="y" stroke="#ef4444" strokeWidth={3} dot={false} activeDot={false} legendType="none" />
                  </ComposedChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Doughnut Chart */}
         <Card className="bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-[24px] p-8 flex flex-col transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
               Dataset Distribution <Info className="w-4 h-4 text-slate-400" />
            </h3>
            <div className="flex-1 flex flex-col items-center">
               <div className="w-full h-[260px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats?.typeDistribution || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                      >
                        {(stats?.typeDistribution || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none drop-shadow-md">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total</span>
                     <span className="text-3xl font-black text-slate-900 leading-none mt-1">{(stats?.totalProperties || 0).toLocaleString()}</span>
                     <span className="text-xs text-slate-400 mt-1 font-medium">Records</span>
                  </div>
               </div>
               <div className="w-full space-y-3 mt-4 px-2">
                  {(stats?.typeDistribution || []).map((entry, index) => {
                     const pct = ((entry.value / (stats?.totalProperties || 1)) * 100).toFixed(1);
                     return (
                       <div key={entry.name} className="flex items-center justify-between text-sm">
                         <div className="flex items-center gap-3 text-slate-700 font-semibold">
                           <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                           {entry.name}
                         </div>
                         <div className="flex items-center gap-3">
                           <span className="text-slate-900 font-black">{pct}%</span>
                           <span className="text-slate-400 text-xs font-medium">({entry.value.toLocaleString()})</span>
                         </div>
                       </div>
                     );
                  })}
               </div>
            </div>
         </Card>

         {/* Feature Importance Bar Chart */}
         <Card className="bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-[24px] p-8 flex flex-col transition-all duration-300 hover:shadow-2xl">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
               Feature Importance <Info className="w-4 h-4 text-slate-400" />
            </h3>
            <div className="flex-1 flex flex-col justify-center space-y-5 pr-4">
               {(stats?.featureImportance || []).map((feat, index) => (
                 <div key={feat.name} className="flex items-center gap-4">
                   <div className="w-28 text-sm font-bold text-slate-700 flex items-center gap-2">
                     <div className="w-4 h-4 bg-slate-100 rounded flex items-center justify-center border border-slate-200 shadow-sm">
                        <div className="w-2 h-2 rounded-sm bg-slate-400"></div>
                     </div>
                     {feat.name}
                   </div>
                   <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${feat.value}%`, opacity: 1 - (index * 0.08) }}></div>
                   </div>
                   <div className="w-12 text-right text-sm font-black text-slate-800">{feat.value.toFixed(1)}%</div>
                 </div>
               ))}
            </div>
            <div className="mt-6 bg-blue-50 rounded-xl p-4 flex items-center gap-3 border border-blue-100/50">
               <div className="text-blue-500"><Info className="w-5 h-5" /></div>
               <p className="text-sm font-medium text-blue-800 leading-tight">Higher importance means greater impact on price prediction.</p>
            </div>
         </Card>
      </div>

      {/* 4. Trends Row (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
         {/* Price Trend */}
         <Card className="bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-[24px] p-8 flex flex-col transition-all duration-300 hover:shadow-2xl">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  Price Trend <span className="text-sm font-semibold text-slate-400">(Last 6 Months)</span> <Info className="w-4 h-4 text-slate-400" />
               </h3>
               <div className="flex bg-slate-100/80 p-1.5 rounded-xl text-xs font-bold text-slate-500 shadow-inner">
                  <div className="px-4 py-1.5 rounded-lg cursor-pointer hover:bg-white hover:shadow-sm transition-all">1M</div>
                  <div className="px-4 py-1.5 rounded-lg cursor-pointer hover:bg-white hover:shadow-sm transition-all">3M</div>
                  <div className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white shadow-md">6M</div>
                  <div className="px-4 py-1.5 rounded-lg cursor-pointer hover:bg-white hover:shadow-sm transition-all">1Y</div>
               </div>
            </div>
            <div className="flex-1 min-h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.trendData || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.6} />
                    <XAxis dataKey="month" axisLine={true} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 'bold' }} stroke="#cbd5e1" dy={10} />
                    <YAxis axisLine={true} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 'bold' }} stroke="#cbd5e1" />
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="price" stroke="#4f46e5" strokeWidth={5} fillOpacity={1} fill="url(#colorPrice)" activeDot={{ r: 8, fill: '#4f46e5', stroke: '#fff', strokeWidth: 4, style: { filter: 'drop-shadow(0px 4px 6px rgba(79, 70, 229, 0.4))' } }} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Future Price Forecast */}
         <Card className="bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-[24px] p-8 flex flex-col transition-all duration-300 hover:shadow-2xl">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  Future Price Forecast <Info className="w-4 h-4 text-slate-400" />
               </h3>
               <div className="flex gap-5 text-xs font-bold text-slate-500">
                  <div className="flex items-center gap-2"><div className="w-4 h-1 bg-blue-600 rounded-full"></div> Historical</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-1 border-t-2 border-dashed border-indigo-600"></div> Forecasted</div>
               </div>
            </div>
            <div className="flex-1 flex flex-col lg:flex-row gap-6">
               <div className="flex-1 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={stats?.forecastData || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.6} />
                       <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 'bold' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 'bold' }} />
                       <RechartsTooltip contentStyle={{ borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                       <Line type="monotone" dataKey="hist" stroke="#2563eb" strokeWidth={4} dot={{ r: 5, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} />
                       <Line type="monotone" dataKey="forecast" stroke="#6366f1" strokeWidth={4} strokeDasharray="6 6" dot={{ r: 5, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
               {/* Forecast Callout Box */}
               <div className="w-full lg:w-48 bg-gradient-to-b from-indigo-50 to-indigo-100/50 border border-indigo-100 rounded-[20px] p-6 flex flex-col justify-between relative overflow-hidden shadow-inner">
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Expected Price<br/>(Nov '25)</div>
                    <div className="text-4xl font-black text-indigo-700 mt-2 tracking-tight">₹86.5 L</div>
                  </div>
                  <div className="mt-6">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Growth Prediction</div>
                    <div className="text-3xl font-black text-emerald-600 mt-2 drop-shadow-sm">+12.6%</div>
                    <div className="text-xs text-slate-500 font-semibold mt-1">in next 6 months</div>
                  </div>
                  {/* Decorative bar chart background */}
                  <div className="absolute bottom-0 right-0 w-full h-16 flex items-end gap-1.5 px-3 opacity-20">
                     <div className="w-1/4 bg-blue-600 rounded-t-md h-[30%]"></div>
                     <div className="w-1/4 bg-blue-600 rounded-t-md h-[50%]"></div>
                     <div className="w-1/4 bg-blue-600 rounded-t-md h-[70%]"></div>
                     <div className="w-1/4 bg-indigo-600 rounded-t-md h-[100%]"></div>
                  </div>
               </div>
            </div>
         </Card>
      </div>


      {/* 6. Footer Banner */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-lg shadow-blue-900/20">
         <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-inner">
               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
            </div>
            <div>
               <h3 className="font-bold text-xl leading-tight">AI-Powered Insights</h3>
               <p className="text-blue-100 font-medium text-sm mt-1">Our model continuously learns from new data to provide you with more accurate predictions.</p>
            </div>
         </div>
         <div className="relative z-10 flex items-center gap-4">
            <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-2.5 rounded-full text-sm font-bold transition-colors flex items-center gap-2">
               Learn More <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-right hidden lg:block">
               <div className="font-serif italic font-bold text-xl text-blue-200 leading-tight">Smarter Cities<br/>Happier Homes</div>
            </div>
         </div>
         {/* Subtle background pattern */}
         <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none"></div>
      </div>

    </div>
  );
};

export default Dashboard;
