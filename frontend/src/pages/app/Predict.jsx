import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const Predict = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    Area_Sqft: 1000,
    Facing: 'North',
    Floor: 3,
    Car_Parking_Sqft: 120,
    Bedrooms: 2
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      const mlServiceUrl = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000';
      const mlResponse = await fetch(`${mlServiceUrl}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!mlResponse.ok) throw new Error('Prediction service is currently unavailable.');
      const mlData = await mlResponse.json();

      const newPrediction = {
        input_features: formData,
        predicted_price: mlData.predicted_price,
        model_name: mlData.model_name,
        prediction_metadata: mlData.metadata
      };

      setResult({
        id: Math.random().toString(36).substring(7),
        ...newPrediction
      });
    } catch (err) {
      setError(err.message || 'Prediction failed to generate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">New Property Valuation</h1>
        <p className="text-neutral-400">Enter property details to get an estimated market price using our ML model.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-md">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Bedrooms</label>
                <select 
                  name="Bedrooms" 
                  value={formData.Bedrooms} 
                  onChange={handleInputChange} 
                  className="block w-full rounded-md bg-neutral-950 border border-neutral-700 text-white sm:text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                >
                  <option value={1}>1 BHK</option>
                  <option value={2}>2 BHK</option>
                  <option value={3}>3 BHK</option>
                  <option value={4}>4 BHK</option>
                  <option value={5}>5 BHK</option>
                </select>
              </div>
              <Input 
                label="Area (Sqft)" 
                type="number" 
                name="Area_Sqft" 
                value={formData.Area_Sqft} 
                onChange={handleInputChange} 
                min="100" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Floor Level" 
                type="number" 
                name="Floor" 
                value={formData.Floor} 
                onChange={handleInputChange} 
                min="1" 
                required 
              />
              <Input 
                label="Car Parking (Sqft)" 
                type="number" 
                name="Car_Parking_Sqft" 
                value={formData.Car_Parking_Sqft} 
                onChange={handleInputChange} 
                min="0" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">Property Facing</label>
              <select 
                name="Facing" 
                value={formData.Facing} 
                onChange={handleInputChange} 
                className="block w-full rounded-md bg-neutral-950 border border-neutral-700 text-white sm:text-sm py-2 px-3 focus:outline-none focus:ring-1 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
              >
                {['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Running Model...' : 'Calculate Price'}
            </Button>
          </form>
        </Card>

        <div>
          {result ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
              <Card className="bg-indigo-600 border-indigo-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="text-indigo-100 text-sm font-medium mb-1 uppercase tracking-wider">Estimated Valuation</div>
                  <div className="text-4xl md:text-5xl font-black text-white">
                    ₹{(result.predicted_price / 100000).toFixed(2)} <span className="text-2xl font-bold text-indigo-200">Lakh</span>
                  </div>
                  <div className="text-indigo-200 mt-2 text-sm">
                    Model Confidence R²: {result.prediction_metadata?.r2_score?.toFixed(4) || 'N/A'}
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-sm font-bold text-neutral-300 uppercase tracking-wider mb-4">Input Parameters</h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                  <div>
                    <div className="text-neutral-500">Layout</div>
                    <div className="font-medium text-white">{result.input_features.Bedrooms} BHK</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Size</div>
                    <div className="font-medium text-white">{result.input_features.Area_Sqft} Sqft</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Facing</div>
                    <div className="font-medium text-white">{result.input_features.Facing}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Floor</div>
                    <div className="font-medium text-white">Level {result.input_features.Floor}</div>
                  </div>
                  <div>
                    <div className="text-neutral-500">Parking</div>
                    <div className="font-medium text-white">{result.input_features.Car_Parking_Sqft} Sqft</div>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-neutral-800 rounded-xl flex flex-col items-center justify-center p-8 text-center text-neutral-500">
              <svg className="w-12 h-12 mb-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              <p>Fill out the form and submit to see the AI prediction results here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predict;
