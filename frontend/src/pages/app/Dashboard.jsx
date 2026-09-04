import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [recentData, setRecentData] = useState([]);
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
          setRecentData(datasetData.slice(0, 5)); // Show 5 random/first samples

          if (datasetData.length > 0) {
            const prices = datasetData.map(d => d.Price_Lakh * 100000);
            
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

            setStats({
              totalProperties: datasetData.length,
              avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
              highestPrice: Math.max(...prices),
              lowestPrice: Math.min(...prices),
              bhkDistribution,
              facingDistribution
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
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-neutral-400 mt-1">Dataset statistics and current ML model performance metrics.</p>
        </div>
        <Link to="/app/predict">
          <Button className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            New Prediction
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
          <div className="text-neutral-400 text-sm font-medium mb-2">Properties in Dataset</div>
          <div className="text-3xl font-bold text-white">{stats?.totalProperties || 0}</div>
        </Card>
        <Card>
          <div className="text-neutral-400 text-sm font-medium mb-2">Average Dataset Price</div>
          <div className="text-3xl font-bold text-white">
            ₹{stats?.avgPrice ? (stats.avgPrice / 100000).toFixed(2) : 0} <span className="text-lg text-neutral-500 font-normal">Lakh</span>
          </div>
        </Card>
        <Card>
          <div className="text-neutral-400 text-sm font-medium mb-2">Model R² Score</div>
          <div className="text-3xl font-bold text-white">
            {metrics?.r2 ? metrics.r2.toFixed(4) : 'N/A'}
          </div>
        </Card>
        <Card>
          <div className="text-neutral-400 text-sm font-medium mb-2">Model RMSE</div>
          <div className="text-3xl font-bold text-white">
            ₹{metrics?.rmse ? (metrics.rmse / 100000).toFixed(2) : 0} <span className="text-lg text-neutral-500 font-normal">Lakh</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader 
              title="Dataset Samples" 
              subtitle="A quick look at the data driving the ML model."
              action={<Link to="/app/analytics"><Button variant="outline" size="sm">View Analytics</Button></Link>}
            />
            
            {recentData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-400">No data found in the backend.</p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-neutral-900 border-y border-neutral-800 text-neutral-400">
                    <tr>
                      <th className="px-6 py-3 font-medium">Property Details</th>
                      <th className="px-6 py-3 font-medium">Size</th>
                      <th className="px-6 py-3 font-medium text-right">Actual Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    {recentData.map((data, i) => (
                      <tr key={i} className="hover:bg-neutral-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{data.Bedrooms} BHK, {data.Facing} Facing</div>
                          <div className="text-neutral-500 text-xs">Floor {data.Floor}</div>
                        </td>
                        <td className="px-6 py-4 text-neutral-300">
                          {data.Area_Sqft} Sqft
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="font-medium text-white">₹{data.Price_Lakh} Lakh</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
        
        <div>
          <Card className="h-full bg-indigo-900/10 border-indigo-500/20">
            <h3 className="text-lg font-medium text-white mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-800">
                <div className="text-xs text-neutral-400 mb-1 uppercase tracking-wider">Most Common BHK</div>
                <div className="text-xl font-bold text-white">
                  {stats?.bhkDistribution?.length > 0 
                    ? [...stats.bhkDistribution].sort((a,b) => b.value - a.value)[0].name
                    : 'N/A'}
                </div>
              </div>
              <div className="bg-neutral-900/50 p-4 rounded-lg border border-neutral-800">
                <div className="text-xs text-neutral-400 mb-1 uppercase tracking-wider">Most Common Facing</div>
                <div className="text-xl font-bold text-white">
                  {stats?.facingDistribution?.length > 0 
                    ? [...stats.facingDistribution].sort((a,b) => b.value - a.value)[0].name
                    : 'N/A'}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

