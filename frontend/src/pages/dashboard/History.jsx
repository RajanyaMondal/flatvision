import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Loader2, Trash2, Calendar, MapPin, Building, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/predictions');
      if (res.data.success) {
        setPredictions(res.data.data);
      }
    } catch (err) {
      setError('Failed to load prediction history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prediction?')) return;
    
    try {
      await api.delete(`/predictions/${id}`);
      setPredictions(predictions.filter(p => p._id !== id));
    } catch (err) {
      alert('Failed to delete prediction');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#FF8CD9]" /></div>;

  return (
    <div className="text-[#2E1128]">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Prediction History</h1>
        <p className="text-[#7C6274] font-bold text-sm">View and manage your past AI valuations.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-150 text-red-600 rounded-xl font-bold">
          {error}
        </div>
      )}

      {predictions.length === 0 && !error ? (
        <div className="bg-white border border-[#FFD6F4] p-12 rounded-3xl text-center">
          <Activity className="w-12 h-12 text-[#FF8CD9] mx-auto mb-4 opacity-50 animate-pulse" />
          <h3 className="text-xl font-bold mb-2">No history found</h3>
          <p className="text-[#7C6274] font-semibold">You haven't made any property price predictions yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {predictions.map((pred, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={pred._id} 
              className="bg-white p-6 rounded-3xl border border-[#FFD6F4] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#FF8CD9] transition-all duration-200"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#7C6274] mb-2">
                  <Calendar className="w-4 h-4 text-[#FF8CD9]" />
                  {new Date(pred.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </div>
                <h3 className="text-lg font-black mb-1 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#FF8CD9]" />
                  {pred.inputFeatures.Bedrooms} BHK • {pred.inputFeatures.Area_Sqft} sqft
                </h3>
                <div className="text-xs text-[#7C6274] font-bold flex flex-wrap gap-x-4 gap-y-1">
                  <span>🧭 Facing: {pred.inputFeatures.Facing}</span>
                  <span>🏢 Floor: {pred.inputFeatures.Floor}</span>
                  <span>🚗 Parking: {pred.inputFeatures.Car_Parking_Sqft} sqft</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <div className="text-xs text-[#7C6274] font-bold mb-1">Estimated Value</div>
                  <div className="text-2xl font-black text-[#FF73D0]">
                    ₹{(pred.predictedPrice / 100000).toFixed(2)} Lakh
                  </div>
                </div>
                
                <motion.button 
                  onClick={() => handleDelete(pred._id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 text-[#7C6274] hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-200 cursor-pointer"
                  title="Delete Prediction"
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
