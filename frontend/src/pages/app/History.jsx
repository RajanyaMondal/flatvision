import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const History = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prediction?")) return;
    setPredictions(predictions.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Prediction History</h1>
        <p className="text-neutral-400">View and manage your past property valuations.</p>
      </div>

      <Card>
        {predictions.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">
            No history found. Create your first prediction!
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-neutral-900 border-y border-neutral-800 text-neutral-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Configuration</th>
                  <th className="px-6 py-3 font-medium">Area (Sqft)</th>
                  <th className="px-6 py-3 font-medium">Parking (Sqft)</th>
                  <th className="px-6 py-3 font-medium text-right">Predicted Value</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {predictions.map((pred) => (
                  <tr key={pred.id} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 text-neutral-400">
                      {new Date(pred.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{pred.input_features.Bedrooms} BHK</div>
                      <div className="text-neutral-500 text-xs">{pred.input_features.Facing} Facing, Floor {pred.input_features.Floor}</div>
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      {pred.input_features.Area_Sqft}
                    </td>
                    <td className="px-6 py-4 text-neutral-300">
                      {pred.input_features.Car_Parking_Sqft}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-bold text-white">₹{(pred.predicted_price / 100000).toFixed(2)} Lakh</div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button variant="danger" size="sm" onClick={() => handleDelete(pred.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default History;
