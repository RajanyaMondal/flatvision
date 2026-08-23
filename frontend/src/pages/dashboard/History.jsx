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

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Prediction History</h1>
        <p className="text-muted-foreground">View and manage your past AI valuations.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20">
          {error}
        </div>
      )}

      {predictions.length === 0 && !error ? (
        <div className="glass p-12 rounded-2xl border border-border text-center">
          <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No history found</h3>
          <p className="text-muted-foreground">You haven't made any property price predictions yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {predictions.map((pred, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={pred._id} 
              className="glass p-6 rounded-2xl border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-primary/50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(pred.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </div>
                <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                  <Building className="w-4 h-4 text-primary" />
                  {pred.inputFeatures.Bedrooms} BHK • {pred.inputFeatures.Area_Sqft} sqft
                </h3>
                <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4 gap-y-1">
                  <span>🧭 Facing: {pred.inputFeatures.Facing}</span>
                  <span>🏢 Floor: {pred.inputFeatures.Floor}</span>
                  <span>🚗 Parking: {pred.inputFeatures.Car_Parking_Sqft} sqft</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Estimated Value</div>
                  <div className="text-2xl font-bold text-foreground">
                    ₹{pred.predictedPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDelete(pred._id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  title="Delete Prediction"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
