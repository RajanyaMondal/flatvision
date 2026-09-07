import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { History as HistoryIcon, MapPin, Calendar, ArrowRight, Eye, Trash2, ShieldCheck, Home } from 'lucide-react';

const History = () => {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    try {
      const storedHistory = JSON.parse(localStorage.getItem('predictionHistory') || '[]');
      setPredictions(storedHistory);
    } catch (e) {
      console.error("Could not load history", e);
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this valuation?")) return;
    const updatedPredictions = predictions.filter(p => p.id !== id);
    setPredictions(updatedPredictions);
    localStorage.setItem('predictionHistory', JSON.stringify(updatedPredictions));
  };

  return (
    <div 
      className="relative min-h-screen overflow-hidden text-[#0A2540] font-sans selection:bg-[#92EEFF]/30"
      style={{ background: '#F2EFE7' }}
    >
      {/* Playful Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,173,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,173,238,0.06)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Animated Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#92EEFF]/30 blur-[120px] mix-blend-multiply animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] rounded-full bg-[#47D8FF]/20 blur-[120px] mix-blend-multiply animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center clay-card p-8 relative overflow-hidden transition-all duration-300">
          <div className="relative z-10">
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#0A2540] to-[#163050] flex items-center gap-3 tracking-tight">
              <HistoryIcon className="w-8 h-8 text-[#58E0FF]" /> Valuation History
            </h1>
            <p className="text-[#476685] mt-2 font-bold text-base tracking-wide">Review and manage your past AI property estimations.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 mt-6 md:mt-0 relative z-10">
            <Button onClick={() => navigate('/app/predict')} className="flex items-center gap-2 px-6 py-3 rounded-2xl clay-accent font-bold text-sm">
              New Valuation <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="absolute right-0 top-0 h-full w-[500px] opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <div className="absolute right-0 top-0 h-full w-[400px] opacity-20 pointer-events-none bg-gradient-to-l from-[#58E0FF] to-transparent"></div>
        </div>

        {/* Content Section */}
        {predictions.length === 0 ? (
          <Card className="clay-card p-12 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[400px]">
             <div className="w-24 h-24 rounded-[32px] bg-[#F2EFE7] border border-[#7AAACE]/30 text-[#00D2FF] flex items-center justify-center mb-6 shadow-sm">
               <ShieldCheck className="w-12 h-12" />
             </div>
             <h3 className="text-2xl font-black text-[#0A2540] mb-2 tracking-tight">No Valuations Yet</h3>
             <p className="text-[#476685] font-bold max-w-md mx-auto mb-8">You haven't run any property price predictions. Start your first valuation to uncover deep market insights.</p>
             <Button onClick={() => navigate('/app/predict')} className="clay-accent px-8 py-3 rounded-2xl font-black shadow-lg">Start First Valuation</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {predictions.map((pred) => (
              <Card key={pred.id} className="clay-card p-6 flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300 relative overflow-hidden">
                {/* Highlight gradient */}
                <div className="absolute top-0 right-0 w-[200px] h-full bg-gradient-to-l from-[#58E0FF]/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative z-10 flex justify-between items-start mb-6 border-b border-[#7AAACE]/30 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-[16px] bg-white border border-[#7AAACE]/30 text-[#00D2FF] flex items-center justify-center shadow-sm">
                      <Home className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black text-xl text-[#0A2540]">{pred.input_features.Bedrooms} BHK Apt</div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#476685] mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-[#58E0FF]" /> {new Date(pred.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#F0FCFF] text-[#00D2FF] font-black text-xs px-3 py-1 rounded-[10px] border border-[#7AAACE]/30 shadow-inner">
                    R² {(pred.prediction_metadata?.r2_score || 0.99).toFixed(2)}
                  </div>
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-[10px] font-extrabold text-[#476685] uppercase tracking-widest mb-1">Total Area</div>
                    <div className="text-lg font-black text-[#0A2540]">{pred.input_features.Area_Sqft} <span className="text-xs text-[#476685]">sqft</span></div>
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold text-[#476685] uppercase tracking-widest mb-1">Orientation</div>
                    <div className="text-lg font-black text-[#0A2540]">{pred.input_features.Facing}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold text-[#476685] uppercase tracking-widest mb-1">Floor Level</div>
                    <div className="text-lg font-black text-[#0A2540]">Floor {pred.input_features.Floor}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-extrabold text-[#476685] uppercase tracking-widest mb-1">Parking Space</div>
                    <div className="text-lg font-black text-[#0A2540]">{pred.input_features.Car_Parking_Sqft} <span className="text-xs text-[#476685]">sqft</span></div>
                  </div>
                </div>

                <div className="relative z-10 bg-[#F2EFE7] rounded-[20px] p-4 flex justify-between items-center shadow-inner border border-[#7AAACE]/30 mb-5">
                  <span className="font-extrabold text-[#476685] tracking-wide uppercase text-xs">Estimated Value</span>
                  <span className="text-2xl font-black text-[#00D2FF]">₹{(pred.predicted_price / 100000).toFixed(2)} L</span>
                </div>

                <div className="relative z-10 flex gap-3">
                  <Button 
                    onClick={() => navigate('/app/predict', { state: { prediction: pred } })} 
                    className="flex-1 bg-white hover:bg-[#F0FCFF] text-[#0A2540] font-bold border border-[#7AAACE]/30 shadow-sm flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4 text-[#00D2FF]" /> Open Report
                  </Button>
                  <Button 
                    onClick={() => handleDelete(pred.id)} 
                    className="px-4 bg-white hover:bg-red-50 text-red-500 font-bold border border-[#7AAACE]/30 shadow-sm flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
