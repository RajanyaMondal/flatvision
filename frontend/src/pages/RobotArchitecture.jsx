import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, ArrowLeft, Cpu, Database, Server, Terminal, Code, HelpCircle, Bot, Sparkles } from 'lucide-react';

const steps = [
  {
    id: 'frontend',
    title: 'Robot Eyes: React UI 💻',
    subtitle: 'Vite • React Router • Recharts',
    description: 'The visual command center where property parameters (BHK, Area, Locality) are compiled into JSON vectors. Styled in cute light lavender with glassmorphic layouts.',
    icon: Code,
    schema: '{ "bhk": 3, "area": 1200, "locality": "Andheri", "amenities": { "gym": true } }',
    color: 'from-[#8B5CF6] to-[#A78BFA]'
  },
  {
    id: 'gateway',
    title: 'Robot Body: Express API Gateway ⚙️',
    subtitle: 'Node.js • Express • JWT Secure',
    description: 'Orchestrates incoming prediction queries, enforces secure JSON Web Token verification, handles profile settings, and acts as the secure request proxy.',
    icon: Server,
    schema: 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    color: 'from-[#A78BFA] to-[#C084FC]'
  },
  {
    id: 'database',
    title: 'Memory Core: Persistent Storage 💾',
    subtitle: 'MongoDB / Transparent JSON db.json Fallback',
    description: 'Saves user data and evaluation history. Uses mockMongoose layer on port 27017 check to auto-switch to a persistent JSON-file database if MongoDB is offline.',
    icon: Database,
    schema: '{ "users": [...], "predictions": [{ "_id": "mock_id", "predictedPrice": 22751392 }] }',
    color: 'from-[#C084FC] to-[#D8B4FE]'
  },
  {
    id: 'ml_microservice',
    title: 'Robot Brain: Python FastAPI 🔮',
    subtitle: 'FastAPI • Uvicorn • Port 8000',
    description: 'A dedicated AI prediction microservice. Exposes prediction routes and dynamically streams model metrics (R2 score, intercept, coefficients) back to the API gateway.',
    icon: Cpu,
    schema: 'GET http://localhost:8000/metrics -> { "r2": 0.997, "mae": 63126 }',
    color: 'from-[#818CF8] to-[#6366F1]'
  },
  {
    id: 'estimator',
    title: 'Prediction Model: Linear Regression 📈',
    subtitle: 'Scikit-Learn • Joblib Regressor',
    description: 'The mathematical predictor itself. Fits an optimal hyperplane using Ordinary Least Squares, enabling direct coefficient-based evaluation for property price predictions.',
    icon: Bot,
    schema: 'y = b0 + b1*x1 + b2*x2 + ... -> Prediction: ₹53.24 Lakh',
    color: 'from-[#6366F1] to-[#4F46E5]'
  }
];

export default function RobotArchitecture() {
  const [activeStep, setActiveStep] = useState('frontend');

  const currentStep = steps.find(s => s.id === activeStep);

  return (
    <div className="min-h-screen bg-[#F8F5FC] text-[#4A3E56] font-sans selection:bg-[#8B5CF6]/30 overflow-x-hidden relative">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#8B5CF6]/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#C084FC]/10 blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 border-b border-[#E9D5FF] bg-[#F8F5FC]/70 backdrop-blur-xl z-50">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl tracking-tight">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#C084FC] flex items-center justify-center text-white shadow-md">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-[#1E1B4B] text-2xl tracking-tighter font-extrabold flex items-center gap-1">
              FlatVision<span className="text-[#8B5CF6]">.AI</span> ✨
            </span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-[#6B5E78] hover:text-[#1E1B4B] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-36 pb-32 max-w-6xl relative z-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] text-sm font-bold mb-6">
            <Bot className="w-4 h-4 animate-bounce" /> Robot Architecture Matrix 🤖
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[#1E1B4B] mb-6">
            Explore Robot Architecture
          </h1>
          <p className="text-lg md:text-xl text-[#6B5E78] leading-relaxed font-semibold">
            Click through the pipeline nodes to inspect data flows, backend microservices, and persistent database fallbacks.
          </p>
        </div>

        {/* Pipeline Diagram */}
        <div className="bg-white border border-[#E9D5FF] rounded-3xl p-8 shadow-sm mb-12 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-xs font-bold text-[#8B5CF6] flex items-center gap-1">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} /> Interactive Schematic
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              const isActive = step.id === activeStep;
              
              return (
                <React.Fragment key={step.id}>
                  {/* Step Node */}
                  <button 
                    onClick={() => setActiveStep(step.id)}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all cursor-pointer w-full md:w-44 ${
                      isActive 
                        ? 'bg-[#F3E8FF] border-[#8B5CF6] scale-105 shadow-md shadow-[#8B5CF6]/10' 
                        : 'bg-white border-[#E9D5FF] hover:border-[#8B5CF6]/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-4 shadow-sm`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-extrabold text-[#1E1B4B] text-center tracking-tight leading-tight">{step.title.split(':')[0]}</span>
                    <span className="text-[10px] text-[#6B5E78] font-bold mt-1 text-center truncate w-full">{step.subtitle.split('•')[0]}</span>
                  </button>

                  {/* Arrow Indicator */}
                  {idx < steps.length - 1 && (
                    <div className="text-[#8B5CF6]/40 rotate-90 md:rotate-0 font-bold text-xl select-none">
                      ➔
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Selected Node Details Card */}
        <motion.div 
          key={activeStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#F3E8FF]/40 border border-[#E9D5FF] rounded-3xl p-8 md:p-12 shadow-sm grid md:grid-cols-2 gap-8 items-stretch"
        >
          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-extrabold mb-4 uppercase tracking-wider">
                Node Specification
              </div>
              <h3 className="text-2xl font-black text-[#1E1B4B] mb-2">{currentStep.title}</h3>
              <span className="text-sm font-bold text-[#8B5CF6] block mb-6">{currentStep.subtitle}</span>
              <p className="text-sm text-[#6B5E78] leading-relaxed font-semibold">
                {currentStep.description}
              </p>
            </div>
            
            <div className="border-t border-[#E9D5FF] pt-6 mt-8 text-xs text-[#6B5E78] font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#8B5CF6]" />
              Status: Ready and Online 🤖
            </div>
          </div>

          {/* JSON Schema Code Panel */}
          <div className="bg-[#1E1B4B] text-slate-300 rounded-2xl p-6 font-mono text-xs flex flex-col justify-between shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B5CF6]/10 rounded-full blur-[40px] pointer-events-none" />
            
            <div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                <span className="text-[10px] uppercase font-bold text-[#C084FC] tracking-wider">Data Payload Interface</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
                <code>{currentStep.schema}</code>
              </pre>
            </div>

            <div className="mt-8 text-[9px] text-[#A78BFA] font-bold flex items-center gap-1.5 border-t border-white/10 pt-3">
              <Sparkles className="w-3.5 h-3.5" /> Pipeline format is verified algorithmically.
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
