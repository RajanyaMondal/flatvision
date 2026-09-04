import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';

const Analytics = () => {
  const [data, setData] = useState(null);
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
          
          if (datasetData.length > 0) {
            // Sort by Area for a logical line chart progression
            const sortedByArea = [...datasetData].sort((a,b) => a.Area_Sqft - b.Area_Sqft);
            const priceHistory = sortedByArea.map(d => ({
              size: d.Area_Sqft,
              price: d.Price_Lakh
            }));

            // Calculate BHK distribution
            const bhkCount = {};
            datasetData.forEach(d => {
              const bhk = `${d.Bedrooms} BHK`;
              bhkCount[bhk] = (bhkCount[bhk] || 0) + 1;
            });
            const bhkDistribution = Object.keys(bhkCount).map(k => ({ name: k, value: bhkCount[k] }));

            // Calculate Facing distribution
            const facingCount = {};
            datasetData.forEach(d => {
              facingCount[d.Facing] = (facingCount[d.Facing] || 0) + 1;
            });
            const facingDistribution = Object.keys(facingCount).map(k => ({ name: k, value: facingCount[k] }));

            setData({
              totalProperties: datasetData.length,
              priceHistory,
              bhkDistribution,
              facingDistribution,
              testPredictions: metricsData.test_predictions || []
            });
          } else {
             setData({ totalProperties: 0 });
          }
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data || data.totalProperties === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Market Analytics</h1>
          <p className="text-neutral-400">Not enough data to display analytics. Run some predictions first.</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f97316', '#22c55e', '#eab308', '#0ea5e9'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Dataset Analytics</h1>
        <p className="text-neutral-400">Insights derived from the ML reference dataset and test evaluations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-96">
          <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-6">Price vs Property Size (Lakhs)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.priceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey="size" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} name="Area (Sqft)" />
              <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', color: '#fff', borderRadius: '8px' }}
                itemStyle={{ color: '#818cf8' }}
                formatter={(value, name) => [value, name === 'price' ? 'Price (Lakh)' : name]}
              />
              <Line type="monotone" dataKey="price" stroke="#818cf8" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-96">
          <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-6">Model Test Accuracy: Actual vs Predicted (Rs)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="actual" type="number" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} name="Actual (Rs)" tickFormatter={(val) => `${val/100000}L`} />
              <YAxis dataKey="predicted" type="number" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} name="Predicted (Rs)" tickFormatter={(val) => `${val/100000}L`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', color: '#fff', borderRadius: '8px' }}
                cursor={{ strokeDasharray: '3 3' }}
                formatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Scatter name="Predictions" data={data.testPredictions} fill="#ec4899" />
              {/* Add a diagonal reference line if recharts ReferenceLine was imported, else rely on visual */}
            </ScatterChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-80">
          <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-6">Properties by Layout</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.bhkDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey="name" stroke="#737373" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#737373" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', color: '#fff', borderRadius: '8px' }}
                cursor={{ fill: '#262626' }}
              />
              <Bar dataKey="value" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="h-80">
          <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-6">Properties by Facing</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.facingDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.facingDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', color: '#fff', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {data.facingDistribution.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs text-neutral-400">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                {entry.name}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
