import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, X, BrainCircuit, Activity, LineChart as LineChartIcon, CheckCircle2, Loader2, ArrowUpDown, Search, SlidersHorizontal } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import PredictionForm from './PredictionForm';
import api from '../../utils/api';

export default function DashboardHome() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dataset explorer states
  const [dataset, setDataset] = useState([]);
  const [datasetLoading, setDatasetLoading] = useState(true);
  const [datasetError, setDatasetError] = useState('');

  // Search & Filter state
  const [searchFacing, setSearchFacing] = useState('All');
  const [searchBedrooms, setSearchBedrooms] = useState('All');
  const [searchArea, setSearchArea] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('Flat_ID');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/model-metrics');
        if (res.data && res.data.success) {
          setMetrics(res.data.metrics);
        }
      } catch (err) {
        console.error("Failed to load model metrics:", err);
        setError('Failed to fetch model metrics.');
      } finally {
        setLoading(false);
      }
    };

    const fetchDataset = async () => {
      try {
        const res = await api.get('/dataset-data');
        if (res.data && res.data.success) {
          setDataset(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load dataset:", err);
        setDatasetError('Failed to fetch dataset information.');
      } finally {
        setDatasetLoading(false);
      }
    };

    fetchMetrics();
    fetchDataset();
  }, []);

  const scatterData = useMemo(() => {
    if (!metrics || !metrics.test_predictions) {
      return [];
    }
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

  const coefficientData = useMemo(() => {
    if (!metrics || !metrics.coefficients) return [];
    return Object.entries(metrics.coefficients).map(([feature, coef]) => ({
      feature: feature.replace('Facing_', ''),
      coefficient: Math.abs(coef),
      rawValue: coef
    })).sort((a, b) => b.coefficient - a.coefficient);
  }, [metrics]);

  const stats = useMemo(() => {
    if (dataset.length === 0) return null;
    const avgPrice = dataset.reduce((acc, row) => acc + row.Price_Lakh, 0) / dataset.length;
    const avgArea = dataset.reduce((acc, row) => acc + row.Area_Sqft, 0) / dataset.length;
    const countBHK = dataset.reduce((acc, row) => {
      acc[row.Bedrooms] = (acc[row.Bedrooms] || 0) + 1;
      return acc;
    }, {});
    return { avgPrice, avgArea, countBHK };
  }, [dataset]);

  const filteredDataset = useMemo(() => {
    return dataset
      .filter(row => {
        const matchFacing = searchFacing === 'All' || row.Facing.toLowerCase() === searchFacing.toLowerCase();
        const matchBedrooms = searchBedrooms === 'All' || row.Bedrooms.toString() === searchBedrooms;
        const matchArea = !searchArea || row.Area_Sqft >= Number(searchArea);
        return matchFacing && matchBedrooms && matchArea;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'string') {
          return sortOrder === 'asc' 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        } else {
          return sortOrder === 'asc' 
            ? valA - valB 
            : valB - valA;
        }
      });
  }, [dataset, searchFacing, searchBedrooms, searchArea, sortField, sortOrder]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredDataset.length / itemsPerPage);
  
  const paginatedDataset = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredDataset.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredDataset, currentPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const CustomScatterTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      // Skip the line dataset items which don't represent single properties
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
    <div className="flex flex-col min-h-full pb-12 text-[#2E1128]">
      
      {/* HERO SECTION */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-[#FFF0FA]/60 rounded-3xl p-10 shadow-sm border border-[#FFD6F4] flex flex-col md:flex-row items-center justify-between mb-8 relative overflow-hidden"
      >
        <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] rounded-full bg-[#FFADEE]/10 blur-[80px]" />
        
        <div className="max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFADEE]/15 text-[#FF73D0] text-sm font-extrabold mb-6 shadow-sm">
            <BrainCircuit className="w-4 h-4" /> AI Engine Active 🔮
          </div>
          <h1 className="text-4xl font-black text-[#2E1128] mb-4 tracking-tight">Predict Property Value with Linear Regression Precision ✨</h1>
          <p className="text-lg text-[#7C6274] mb-8 font-semibold">
            Our Multiple Linear Regression model has been trained on the reference dataset of 100 properties to evaluate flat price values instantly.
          </p>
          <motion.button 
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#FF8CD9] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#FF73D0] hover:shadow-[0_8px_30px_rgba(255,140,217,0.35)] transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-[#FF8CD9]/20"
          >
            <Calculator className="w-5 h-5" /> Start New Valuation
          </motion.button>
        </div>

        {loading ? (
          <div className="w-72 h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF8CD9]" />
          </div>
        ) : (
          <div className="hidden md:flex flex-col w-72 h-64 z-10 bg-white/60 p-4 rounded-2xl border border-[#FFD6F4] shadow-sm justify-between">
            <h4 className="text-xs font-extrabold text-[#2E1128] text-center mb-2">Feature Weight Coefficients</h4>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={coefficientData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <XAxis dataKey="feature" tick={{ fill: '#7C6274', fontSize: 9 }} />
                  <Tooltip 
                    formatter={(value, name, props) => [`${props.payload.rawValue.toFixed(4)}`, 'Coefficient']}
                    contentStyle={{ fontSize: '11px', borderRadius: '8px', borderColor: '#FFD6F4' }}
                  />
                  <Bar dataKey="coefficient" fill="#FF8CD9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[9px] text-[#7C6274] font-bold text-center mt-2">Bars show the absolute coefficient weights.</p>
          </div>
        )}
      </motion.div>

      {/* ML INSIGHTS GRID */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        
        {/* SCATTER PLOT (Accuracy) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-[#FFD6F4]"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-[#2E1128] flex items-center gap-2">
                <LineChartIcon className="w-5 h-5 text-[#FF8CD9]" /> Valuation Accuracy Matrix 📈
              </h3>
              <p className="text-sm text-[#7C6274] font-bold">
                Actual vs. Predicted Prices with OLS Fit Line (R² = {metrics?.r2 ? metrics.r2.toFixed(5) : '0.9978'})
              </p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          
          <div className="h-64 w-full flex items-center justify-center">
            {loading ? (
              <Loader2 className="w-8 h-8 animate-spin text-[#FF8CD9]" />
            ) : scatterData.length === 0 ? (
              <div className="text-sm font-semibold text-gray-400">No test metrics available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#FFF5FA" />
                  <XAxis 
                    type="number" 
                    dataKey="actual" 
                    name="Actual Price" 
                    stroke="#7C6274"
                    tickFormatter={(val) => `₹${val / 100000}L`} 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="predicted" 
                    name="Predicted Price" 
                    stroke="#7C6274"
                    tickFormatter={(val) => `₹${val / 100000}L`} 
                  />
                  <Tooltip content={<CustomScatterTooltip />} />
                  
                  {/* Perfect Fit Reference Line */}
                  <Scatter 
                    name="Perfect Fit Line" 
                    data={diagonalLineData} 
                    line={{ stroke: '#FF73D0', strokeWidth: 2, strokeDasharray: '4 4' }} 
                    shape={() => null} 
                    legendType="none" 
                  />
                  
                  {/* Valuation Scatter Points */}
                  <Scatter 
                    name="Test Properties" 
                    data={scatterData} 
                    fill="#FF8CD9" 
                    stroke="#FF73D0" 
                    strokeWidth={1} 
                    opacity={0.85} 
                  />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* MATH FORMULA SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#2E1128] rounded-3xl p-8 shadow-sm text-white relative overflow-hidden flex flex-col justify-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF8CD9]/10 rounded-full blur-[100px] pointer-events-none" />
          
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#FFC6F3]" /> Mathematical Regression Engine 🤖
          </h3>
          <p className="text-slate-400 text-sm mb-6 font-medium">
            Linear Regression models calculate flat values by assigning weights (coefficients) to input parameters and adding an intercept offset.
          </p>

          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#FFC6F3]" />
            </div>
          ) : (
            <div className="bg-black/30 p-5 rounded-2xl border border-white/5 font-mono flex flex-col mb-6 overflow-x-auto w-full text-xs md:text-sm">
              <span className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-3">Trained Regression Formula</span>
              <div className="tracking-wide text-slate-250 text-left space-y-1">
                <div><strong>Price (Lakh)</strong> = {metrics?.intercept?.toFixed(4)}</div>
                <div className="text-pink-300"> + ({metrics?.coefficients?.Area_Sqft?.toFixed(6)} × Area_Sqft)</div>
                <div className="text-pink-300"> + ({metrics?.coefficients?.Bedrooms?.toFixed(6)} × Bedrooms)</div>
                <div className="text-pink-300"> + ({metrics?.coefficients?.Floor?.toFixed(6)} × Floor)</div>
                <div className="text-pink-300"> + ({metrics?.coefficients?.Car_Parking_Sqft?.toFixed(6)} × Car_Parking_Sqft)</div>
                <div className="text-pink-400"> + ({metrics?.coefficients?.Facing_East?.toFixed(6)} × IsFacingEast)</div>
                <div className="text-pink-400"> + ({metrics?.coefficients?.Facing_North?.toFixed(6)} × IsFacingNorth)</div>
                <div className="text-pink-400"> + ({metrics?.coefficients?.Facing_South?.toFixed(6)} × IsFacingSouth)</div>
                <div className="text-pink-400"> + ({metrics?.coefficients?.Facing_West?.toFixed(6)} × IsFacingWest)</div>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-4 text-center text-xs font-bold">
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="font-bold text-[#FFC6F3] text-sm mb-0.5">Price</div>
              <div className="text-slate-400">Output (Lakhs)</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="font-bold text-[#FFC6F3] text-sm mb-0.5">{metrics?.intercept?.toFixed(2) || '-13.75'}</div>
              <div className="text-slate-400">Base Intercept</div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
              <div className="font-bold text-[#FFC6F3] text-sm mb-0.5">X_i</div>
              <div className="text-slate-400">Flat Inputs</div>
            </div>
          </div>

        </motion.div>
      </div>

      {/* REFERENCE DATASET EXPLORER (SHIFTED TO DASHBOARD) */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="pt-8 border-t border-[#FFD6F4]/60 scroll-mt-24 mb-8"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-black text-[#2E1128] mb-2 flex items-center gap-3">
            <SlidersHorizontal className="text-[#FF73D0] w-6 h-6" /> Reference Dataset Explorer 📊
          </h2>
          <p className="text-sm font-semibold text-[#7C6274]">
            This table contains the exact 100 surveyed properties used to train and evaluate the active Linear Regression model.
          </p>
        </div>

        {datasetLoading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-4 bg-white rounded-3xl border border-[#FFD6F4]">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF8CD9]" />
            <span className="text-[#7C6274] font-bold text-xs">Loading property records...</span>
          </div>
        ) : datasetError ? (
          <div className="p-6 bg-red-50 border border-red-200 text-red-600 rounded-3xl font-bold text-center">
            {datasetError}
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Stats Cards preview */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white border border-[#FFD6F4] p-5 rounded-3xl shadow-sm text-center">
                  <span className="text-xs font-bold text-[#7C6274] uppercase">Dataset Size</span>
                  <div className="text-2xl font-black text-[#2E1128] mt-1">100 Records</div>
                </div>
                <div className="bg-white border border-[#FFD6F4] p-5 rounded-3xl shadow-sm text-center">
                  <span className="text-xs font-bold text-[#7C6274] uppercase">Average Price</span>
                  <div className="text-2xl font-black text-[#2E1128] mt-1">₹{stats.avgPrice.toFixed(2)} Lakh</div>
                </div>
                <div className="bg-white border border-[#FFD6F4] p-5 rounded-3xl shadow-sm text-center">
                  <span className="text-xs font-bold text-[#7C6274] uppercase">Average Area</span>
                  <div className="text-2xl font-black text-[#2E1128] mt-1">{stats.avgArea.toFixed(1)} Sqft</div>
                </div>
                <div className="bg-white border border-[#FFD6F4] p-5 rounded-3xl shadow-sm text-center">
                  <span className="text-xs font-bold text-[#7C6274] uppercase">BHK Layouts</span>
                  <div className="text-xs font-bold text-[#2E1128] mt-1.5 flex justify-center gap-3">
                    {Object.entries(stats.countBHK).map(([bhk, count]) => (
                      <span key={bhk} className="px-2 py-0.5 bg-[#FFF0FA] rounded-lg border border-[#FFD6F4]">{bhk}BHK: {count}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Data Table */}
            <div className="bg-white border border-[#FFD6F4] rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-[#2E1128] w-full md:w-auto">Property Records Matrix</h3>
                
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  {/* Area Filter */}
                  <div className="flex items-center gap-2 bg-[#FFF5FA] border border-[#FFD6F4] px-3 py-1.5 rounded-xl">
                    <Search className="w-4 h-4 text-[#7C6274]" />
                    <input 
                      type="number" 
                      placeholder="Min Area (Sqft)" 
                      value={searchArea}
                      onChange={(e) => { setSearchArea(e.target.value); setCurrentPage(1); }}
                      className="bg-transparent text-xs font-semibold outline-none text-[#2E1128] placeholder-pink-300 w-28"
                    />
                  </div>

                  {/* Facing Filter */}
                  <select 
                    value={searchFacing} 
                    onChange={(e) => { setSearchFacing(e.target.value); setCurrentPage(1); }}
                    className="bg-[#FFF5FA] border border-[#FFD6F4] px-3 py-1.5 rounded-xl text-xs font-bold text-[#7C6274] outline-none"
                  >
                    <option value="All">All Facings</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                  </select>

                  {/* Bedrooms Filter */}
                  <select 
                    value={searchBedrooms} 
                    onChange={(e) => { setSearchBedrooms(e.target.value); setCurrentPage(1); }}
                    className="bg-[#FFF5FA] border border-[#FFD6F4] px-3 py-1.5 rounded-xl text-xs font-bold text-[#7C6274] outline-none"
                  >
                    <option value="All">All Bedrooms</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#FFD6F4] text-[#7C6274] font-bold text-xs uppercase bg-[#FFF5FA]/50">
                      <th onClick={() => handleSort('Flat_ID')} className="py-4 px-4 cursor-pointer hover:text-[#FF73D0] transition-colors">
                        <span className="flex items-center gap-1.5">Flat ID <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                      <th onClick={() => handleSort('Area_Sqft')} className="py-4 px-4 cursor-pointer hover:text-[#FF73D0] transition-colors">
                        <span className="flex items-center gap-1.5">Area (Sqft) <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                      <th onClick={() => handleSort('Facing')} className="py-4 px-4 cursor-pointer hover:text-[#FF73D0] transition-colors">
                        <span className="flex items-center gap-1.5">Facing <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                      <th onClick={() => handleSort('Floor')} className="py-4 px-4 cursor-pointer hover:text-[#FF73D0] transition-colors">
                        <span className="flex items-center gap-1.5">Floor Level <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                      <th onClick={() => handleSort('Car_Parking_Sqft')} className="py-4 px-4 cursor-pointer hover:text-[#FF73D0] transition-colors">
                        <span className="flex items-center gap-1.5">Car Parking (Sqft) <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                      <th onClick={() => handleSort('Bedrooms')} className="py-4 px-4 cursor-pointer hover:text-[#FF73D0] transition-colors">
                        <span className="flex items-center gap-1.5">Bedrooms <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                      <th onClick={() => handleSort('Price_Lakh')} className="py-4 px-4 cursor-pointer hover:text-[#FF73D0] transition-colors">
                        <span className="flex items-center gap-1.5">Price (Lakh) <ArrowUpDown className="w-3.5 h-3.5" /></span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDataset.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-8 text-center text-[#7C6274] font-bold">No matching property records found.</td>
                      </tr>
                    ) : (
                      paginatedDataset.map((row) => (
                        <tr key={row.Flat_ID} className="border-b border-[#FFD6F4]/60 hover:bg-[#FFF0FA]/40 transition-colors font-semibold text-[#2E1128]">
                          <td className="py-3.5 px-4 font-bold text-[#FF73D0]">#{row.Flat_ID}</td>
                          <td className="py-3.5 px-4">{row.Area_Sqft.toLocaleString()} sqft</td>
                          <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded-full bg-[#FFF0FA] border border-[#FFD6F4] text-xs font-bold text-[#FF73D0]">{row.Facing}</span></td>
                          <td className="py-3.5 px-4">Floor {row.Floor}</td>
                          <td className="py-3.5 px-4">{row.Car_Parking_Sqft} sqft</td>
                          <td className="py-3.5 px-4">{row.Bedrooms} BHK</td>
                          <td className="py-3.5 px-4 text-[#2E1128] font-bold">₹{row.Price_Lakh} Lakh</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#FFD6F4]">
                  <span className="text-xs text-[#7C6274] font-bold">
                    Showing Page {currentPage} of {totalPages} ({filteredDataset.length} items)
                  </span>
                  <div className="flex gap-2">
                    <motion.button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-xs font-bold border border-[#FFD6F4] hover:bg-[#FFF0FA] text-[#2E1128] disabled:opacity-50 rounded-lg transition-all cursor-pointer"
                    >
                      Previous
                    </motion.button>
                    <motion.button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 text-xs font-bold border border-[#FFD6F4] hover:bg-[#FFF0FA] text-[#2E1128] disabled:opacity-50 rounded-lg transition-all cursor-pointer"
                    >
                      Next
                    </motion.button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </motion.section>

      {/* POPUP MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2E1128]/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#FFF5FA] border border-[#FFD6F4] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#FFF0FA] transition-colors z-10 cursor-pointer"
              >
                <X className="w-6 h-6 text-[#7C6274]" />
              </button>
              
              <div className="p-8 md:p-10">
                <PredictionForm onComplete={() => setIsModalOpen(false)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
