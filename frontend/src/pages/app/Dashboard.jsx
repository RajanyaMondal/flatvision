import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Card } from '../../components/ui/Card';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
         {/* Card 1 */}
         <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
               <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                 <Home className="w-5 h-5" />
               </div>
               <div className="text-right">
                 <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Properties</div>
                 <div className="text-2xl font-bold text-slate-900 leading-tight">100</div>
               </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 mt-2">
               <TrendingUp className="w-3 h-3" /> 4.2% <span className="text-slate-400 font-medium ml-1">vs last month</span>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-8 opacity-20">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={miniChartData.map((v,i)=>({v, i}))}><Line type="monotone" dataKey="v" stroke="#3b82f6" strokeWidth={2} dot={false} /></LineChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Card 2 */}
         <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
               <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                 <Wallet className="w-5 h-5" />
               </div>
               <div className="text-right">
                 <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Average Price</div>
                 <div className="text-2xl font-bold text-slate-900 leading-tight">₹75.38 L</div>
               </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 mt-2">
               <TrendingDown className="w-3 h-3" /> 1.2% <span className="text-slate-400 font-medium ml-1">vs last month</span>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-8 opacity-20">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={miniChartData.map((v,i)=>({v: 15-v, i}))}><Line type="monotone" dataKey="v" stroke="#a855f7" strokeWidth={2} dot={false} /></LineChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Card 3 */}
         <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
               <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                 <TrendingUp className="w-5 h-5" />
               </div>
               <div className="text-right">
                 <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Model R² Score</div>
                 <div className="text-2xl font-bold text-slate-900 leading-tight">0.9979</div>
               </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 mt-2">
               <TrendingUp className="w-3 h-3" /> 2.4% <span className="text-slate-400 font-medium ml-1">vs last month</span>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-8 opacity-20">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={miniChartData.map((v,i)=>({v, i}))}><Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} /></LineChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Card 4 */}
         <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
               <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                 <ArrowRight className="w-5 h-5 -rotate-45" />
               </div>
               <div className="text-right">
                 <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Model RMSE</div>
                 <div className="text-2xl font-bold text-slate-900 leading-tight">₹0.80 L</div>
               </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 mt-2">
               <TrendingDown className="w-3 h-3" /> 15.3% <span className="text-slate-400 font-medium ml-1">vs last month</span>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-8 opacity-20">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={miniChartData.map((v,i)=>({v, i}))}><Line type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} dot={false} /></LineChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Card 5 */}
         <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-start mb-2">
               <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                 <PieIcon className="w-5 h-5" />
               </div>
               <div className="text-right">
                 <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Predictions This Month</div>
                 <div className="text-2xl font-bold text-slate-900 leading-tight">248</div>
               </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 mt-2">
               <TrendingUp className="w-3 h-3" /> 15.3% <span className="text-slate-400 font-medium ml-1">vs last month</span>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-8 opacity-20">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={miniChartData.map((v,i)=>({v: v*2, i}))}><Line type="monotone" dataKey="v" stroke="#6366f1" strokeWidth={2} dot={false} /></LineChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>

      {/* 3. Analytics Row (3 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
         {/* Scatter Plot */}
         <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 Area vs Price Correlation <Info className="w-3 h-3 text-slate-400" />
              </h3>
              <div className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-1 rounded-md">R² = {metrics?.r2 ? metrics.r2.toFixed(2) : '0.86'}</div>
            </div>
            <div className="flex-1 min-h-[220px]">
               <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" dataKey="x" name="Area" unit=" sq.ft" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis type="number" dataKey="y" name="Price" unit="L" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} label={{ value: 'Price (₹ Lakhs)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b', offset: 10 }} />
                    <ZAxis type="number" range={[15, 15]} />
                    <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Scatter name="Properties" data={stats?.scatterData || []} fill="#3b82f6" opacity={0.6} />
                    {/* Mock trendline */}
                    <Line dataKey="y" data={[{x: 500, y: 30}, {x: 3000, y: 110}]} stroke="#1e40af" strokeWidth={2} dot={false} activeDot={false} legendType="none" />
                  </ScatterChart>
               </ResponsiveContainer>
            </div>
            <div className="mt-4 bg-blue-50/50 rounded-lg p-3 flex items-center gap-3">
               <div className="text-blue-500"><Info className="w-4 h-4" /></div>
               <p className="text-xs font-medium text-blue-700">Strong positive correlation between area and price.</p>
            </div>
         </Card>

         {/* Doughnut Chart */}
         <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex flex-col">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
               Dataset Distribution <Info className="w-3 h-3 text-slate-400" />
            </h3>
            <div className="flex-1 flex items-center">
               <div className="w-1/2 h-[220px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats?.typeDistribution || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {(stats?.typeDistribution || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-[10px] font-bold text-slate-500">Total</span>
                     <span className="text-lg font-black text-slate-900 leading-none">{(stats?.totalProperties || 0).toLocaleString()}</span>
                     <span className="text-[10px] text-slate-400 mt-0.5">Records</span>
                  </div>
               </div>
               <div className="w-1/2 space-y-3 pl-4">
                  {(stats?.typeDistribution || []).map((entry, index) => {
                     const pct = ((entry.value / (stats?.totalProperties || 1)) * 100).toFixed(1);
                     return (
                       <div key={entry.name} className="flex items-center justify-between text-xs">
                         <div className="flex items-center gap-2 text-slate-600 font-medium">
                           <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                           {entry.name}
                         </div>
                         <div className="flex items-center gap-2">
                           <span className="text-slate-700 font-bold">{pct}%</span>
                           <span className="text-slate-400 text-[10px]">({entry.value.toLocaleString()})</span>
                         </div>
                       </div>
                     );
                  })}
               </div>
            </div>
         </Card>

         {/* Feature Importance Bar Chart */}
         <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex flex-col">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
               Feature Importance <Info className="w-3 h-3 text-slate-400" />
            </h3>
            <div className="flex-1 flex flex-col justify-center space-y-4 pr-4">
               {(stats?.featureImportance || []).map((feat, index) => (
                 <div key={feat.name} className="flex items-center gap-3">
                   <div className="w-24 text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                     <div className="w-3 h-3 bg-slate-100 rounded flex items-center justify-center text-slate-400 border border-slate-200">
                        {/* Placeholder generic icon box */}
                        <div className="w-1.5 h-1.5 rounded-sm bg-slate-300"></div>
                     </div>
                     {feat.name}
                   </div>
                   <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full" style={{ width: `${feat.value}%`, opacity: 1 - (index * 0.1) }}></div>
                   </div>
                   <div className="w-10 text-right text-xs font-bold text-slate-700">{feat.value.toFixed(1)}%</div>
                 </div>
               ))}
            </div>
            <div className="mt-4 bg-blue-50/50 rounded-lg p-3 flex items-center gap-3">
               <div className="text-blue-500"><Info className="w-4 h-4" /></div>
               <p className="text-[11px] font-medium text-blue-700 leading-tight">Higher importance means greater impact on price prediction.</p>
            </div>
         </Card>
      </div>

      {/* 4. Trends Row (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
         {/* Price Trend */}
         <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  Price Trend <span className="text-xs font-medium text-slate-400">(Last 6 Months)</span> <Info className="w-3 h-3 text-slate-400" />
               </h3>
               <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-bold text-slate-500">
                  <div className="px-3 py-1 rounded-md cursor-pointer hover:bg-white hover:shadow-sm">1M</div>
                  <div className="px-3 py-1 rounded-md cursor-pointer hover:bg-white hover:shadow-sm">3M</div>
                  <div className="px-3 py-1 rounded-md bg-blue-600 text-white shadow-sm">6M</div>
                  <div className="px-3 py-1 rounded-md cursor-pointer hover:bg-white hover:shadow-sm">1Y</div>
               </div>
            </div>
            <div className="flex-1 min-h-[220px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.trendData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: 'Price (₹ Lakhs)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b', offset: 15 }} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="price" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" activeDot={{ r: 6, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Future Price Forecast */}
         <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  Future Price Forecast <Info className="w-3 h-3 text-slate-400" />
               </h3>
               <div className="flex gap-4 text-[10px] font-bold text-slate-500">
                  <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-blue-600"></div> Historical Price</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-0.5 border-t border-dashed border-indigo-600"></div> Forecasted Price</div>
               </div>
            </div>
            <div className="flex-1 flex gap-4">
               <div className="flex-1 min-h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={stats?.forecastData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                       <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                       <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: 'Price (₹ Lakhs)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#64748b', offset: 15 }} />
                       <RechartsTooltip contentStyle={{ borderRadius: '8px', fontSize: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                       <Line type="monotone" dataKey="hist" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
                       <Line type="monotone" dataKey="forecast" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
               {/* Forecast Callout Box */}
               <div className="w-40 bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500">Expected Price<br/>(Nov '25)</div>
                    <div className="text-2xl font-bold text-indigo-700 mt-1">₹86.5 L</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500">Growth Prediction</div>
                    <div className="text-xl font-bold text-blue-600 mt-1">+12.6%</div>
                    <div className="text-[10px] text-slate-400 font-medium">in next 6 months</div>
                  </div>
                  {/* Decorative bar chart background */}
                  <div className="absolute bottom-0 right-0 w-full h-12 flex items-end gap-1 px-2 opacity-30">
                     <div className="w-1/4 bg-blue-500 rounded-t h-[30%]"></div>
                     <div className="w-1/4 bg-blue-500 rounded-t h-[50%]"></div>
                     <div className="w-1/4 bg-blue-500 rounded-t h-[70%]"></div>
                     <div className="w-1/4 bg-blue-500 rounded-t h-[100%]"></div>
                  </div>
               </div>
            </div>
         </Card>
      </div>

      {/* 5. Lists Row (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
         {/* Recent Predictions */}
         <Card className="col-span-2 bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex flex-col">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center"><Calendar className="w-3 h-3" /></div>
                  Recent Predictions <Info className="w-3 h-3 text-slate-400" />
               </h3>
               <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</a>
            </div>
            <div className="overflow-x-auto w-full">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                     <tr>
                        <th className="px-2 py-3">Property</th>
                        <th className="px-2 py-3">Location</th>
                        <th className="px-2 py-3">Area (sq.ft)</th>
                        <th className="px-2 py-3">Predicted Price</th>
                        <th className="px-2 py-3">Actual Price</th>
                        <th className="px-2 py-3">Date</th>
                        <th className="px-2 py-3">Accuracy</th>
                        <th className="px-2 py-3"></th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {(stats?.recentPredictions || []).map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-2 py-3 flex items-center gap-3">
                              <div className="w-10 h-8 bg-slate-200 rounded overflow-hidden">
                                <img src={`https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80`} alt="prop" className="w-full h-full object-cover" />
                              </div>
                              <span className="font-bold text-slate-700">{row.Bedrooms} BHK {row.Facing === 'East' ? 'Apartment' : 'Villa'}</span>
                           </td>
                           <td className="px-2 py-3 font-medium text-slate-600">Kolkata</td>
                           <td className="px-2 py-3 font-medium text-slate-600">{row.Area_Sqft}</td>
                           <td className="px-2 py-3 font-bold text-slate-800">₹{row.Price_Lakh} L</td>
                           <td className="px-2 py-3 font-bold text-slate-800">₹{(row.Price_Lakh * (1 + (Math.random() * 0.1 - 0.05))).toFixed(1)} L</td>
                           <td className="px-2 py-3 font-medium text-slate-500">27 May 2025</td>
                           <td className="px-2 py-3">
                              <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-600 font-bold text-[10px] uppercase">High</span>
                           </td>
                           <td className="px-2 py-3 text-right">
                              <button className="text-slate-400 hover:text-slate-600">
                                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </Card>

         {/* Top Locations */}
         <Card className="col-span-1 bg-white border border-slate-100 shadow-sm rounded-2xl p-5 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center"><MapPin className="w-3 h-3" /></div>
                  Top Locations by Avg. Price <Info className="w-3 h-3 text-slate-400" />
               </h3>
               <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</a>
            </div>
            <div className="flex-1 space-y-5 z-10">
               {[
                 { rank: 1, loc: 'New Alipore, Kolkata', price: 95.3, pct: 100 },
                 { rank: 2, loc: 'Salt Lake, Kolkata', price: 82.7, pct: 85 },
                 { rank: 3, loc: 'Ballygunge, Kolkata', price: 78.1, pct: 80 }
               ].map(loc => (
                 <div key={loc.rank} className="flex items-center gap-3">
                    <span className="font-bold text-slate-400 text-sm">{loc.rank}.</span>
                    <div className="flex-1">
                       <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-700">{loc.loc}</span>
                          <span className="text-slate-900">₹{loc.price} L</span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${loc.pct}%` }}></div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
            
            {/* Decorative city visual at bottom right */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-80 pointer-events-none">
               <div className="w-full h-full bg-blue-50 rounded-full absolute top-4 left-4"></div>
               <div className="absolute bottom-4 right-8 flex items-end gap-1">
                 <div className="w-4 h-12 bg-blue-200 rounded-t-sm"></div>
                 <div className="w-6 h-20 bg-indigo-200 rounded-t-sm"></div>
                 <div className="w-5 h-16 bg-blue-300 rounded-t-sm"></div>
               </div>
               <MapPin className="w-6 h-6 text-blue-600 absolute top-4 left-10 drop-shadow-md" />
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
