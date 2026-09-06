import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, ArrowLeft, Cpu, Database, Server, Terminal, Code, HelpCircle, Bot, Sparkles } from 'lucide-react';

const steps = [
  {
    id: 'frontend',
    title: 'Robot Eyes: React UI',
    subtitle: 'Vite • React Router • Recharts',
    description: 'The visual command center where property parameters (Bedrooms, Area, Facing) are compiled into JSON vectors. Styled in cute light pink with glassmorphic layouts.',
    icon: Code,
    schema: '{ "Bedrooms": 3, "Area_Sqft": 1200, "Facing": "North", "Floor": 2, "Car_Parking_Sqft": 120 }',
    color: 'from-[#58E0FF] to-[#92EEFF]'
  },
  {
    id: 'gateway',
    title: 'Robot Body: Express API Gateway',
    subtitle: 'Node.js • Express • JWT Secure',
    description: 'Orchestrates incoming prediction queries, enforces secure JSON Web Token verification, handles Clerk session syncing, and acts as the secure request proxy.',
    icon: Server,
    schema: 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    color: 'from-[#92EEFF] to-[#FFC6F3]'
  },
  {
    id: 'database',
    title: 'Memory Core: Persistent Storage',
    subtitle: 'MongoDB / Transparent JSON db.json Fallback',
    description: 'Saves user data and evaluation history. Uses mockMongoose layer on port 27017 check to auto-switch to a persistent JSON-file database if MongoDB is offline.',
    icon: Database,
    schema: '{ "users": [...], "predictions": [{ "_id": "mock_id", "predictedPrice": 5324119 }] }',
    color: 'from-[#FFC6F3] to-[#C2F6FF]'
  },
  {
    id: 'ml_microservice',
    title: 'Robot Brain: Python FastAPI',
    subtitle: 'FastAPI • Uvicorn • Port 8000',
    description: 'A dedicated AI prediction microservice. Exposes prediction routes and dynamically streams model metrics (R2 score, intercept, coefficients) back to the API gateway.',
    icon: Cpu,
    schema: 'GET http://localhost:8000/metrics -> { "r2": 0.997, "mae": 63126 }',
    color: 'from-[#58E0FF] to-[#FFC6F3]'
  },
  {
    id: 'estimator',
    title: 'Prediction Model: Linear Regression',
    subtitle: 'Scikit-Learn • Joblib Regressor',
    description: 'The mathematical predictor itself. Fits an optimal hyperplane using Ordinary Least Squares, enabling direct coefficient-based evaluation for property price predictions.',
    icon: Bot,
    schema: 'y = b0 + b1*x1 + b2*x2 + ... -> Prediction: ₹53.24 Lakh',
    color: 'from-[#00D2FF] to-[#47D8FF]'
  }
];

export default function RobotArchitecture() {
  const [activeStep, setActiveStep] = useState('frontend');

  const currentStep = steps.find(s => s.id === activeStep);

  return (
    <div 
      className="min-h-screen text-[#0A2540] font-sans selection:bg-[#92EEFF]/30 overflow-x-hidden relative flex flex-col scroll-smooth"
      style={{
        background: '#F2EFE7'
      }}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,173,238,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,173,238,0.06)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#92EEFF]/15 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#FFC6F3]/15 blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 border-b border-[#7AAACE]/30 bg-[#F0FCFF]/70 backdrop-blur-xl z-50">
        <div className="container mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl tracking-tight hover:scale-105 transition-transform duration-200">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#58E0FF] to-[#FFC6F3] flex items-center justify-center text-[#0A2540] shadow-md shadow-[#92EEFF]/10">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-[#0A2540] text-2xl tracking-tighter font-extrabold flex items-center gap-1">
              FlatVision<span className="text-[#00D2FF]">.AI</span>
            </span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-[#476685] hover:text-[#00D2FF] hover:scale-105 transition-transform duration-200">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-36 pb-32 max-w-6xl relative z-10">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#92EEFF]/15 border border-[#92EEFF]/30 text-[#00D2FF] text-sm font-bold mb-6 shadow-sm">
            <Bot className="w-4 h-4 text-[#58E0FF]" /> Robot Architecture Matrix
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[#0A2540] mb-6">
            Explore Robot Architecture
          </h1>
          <p className="text-lg md:text-xl text-[#476685] leading-relaxed font-semibold">
            Click through the pipeline nodes to inspect data flows, backend microservices, and persistent database fallbacks.
          </p>
        </div>

        {/* Pipeline Diagram */}
        <div className="bg-white border border-[#7AAACE]/30 rounded-3xl p-8 shadow-sm mb-12 relative overflow-hidden">
          <div className="absolute top-4 right-4 text-xs font-bold text-[#00D2FF] flex items-center gap-1">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} /> Interactive Schematic
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
            {steps.map((step, idx) => {
              const IconComponent = step.icon;
              const isActive = step.id === activeStep;
              
              return (
                <React.Fragment key={step.id}>
                  {/* Step Node */}
                  <motion.button 
                    onClick={() => setActiveStep(step.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex flex-col items-center justify-center p-8 border transition-all cursor-pointer w-full md:w-52 duration-200 ${
                      isActive 
                        ? 'bg-white/60 border-[#58E0FF] rounded-3xl shadow-lg shadow-[#58E0FF]/20' 
                        : 'bg-white/40 border-[#7AAACE]/30 rounded-3xl hover:border-[#58E0FF]/50 shadow-sm'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-[#0A2540] mb-5 shadow-md shadow-[#92EEFF]/10`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <span className="text-sm font-black text-[#0A2540] text-center tracking-tight leading-tight">{step.title.split(':')[0]}</span>
                    <span className="text-xs font-bold text-[#476685] mt-2 text-center truncate w-full">{step.subtitle.split('•')[0]}</span>
                  </motion.button>

                  {/* Arrow Indicator */}
                  {idx < steps.length - 1 && (
                    <div className="text-[#58E0FF]/60 rotate-90 md:rotate-0 font-bold text-2xl select-none">
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
          className="bg-white/40 border border-[#7AAACE]/30 rounded-3xl p-8 md:p-12 shadow-md grid md:grid-cols-2 gap-8 items-stretch"
        >
          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#92EEFF]/10 text-[#00D2FF] text-xs font-extrabold mb-4 uppercase tracking-wider">
                Node Specification
              </div>
              <h3 className="text-3xl font-black text-[#0A2540] mb-3 tracking-tight">{currentStep.title}</h3>
              <span className="text-base font-bold text-[#00D2FF] block mb-6">{currentStep.subtitle}</span>
              <p className="text-base text-[#476685] leading-relaxed font-semibold">
                {currentStep.description}
              </p>
            </div>
            
            <div className="border-t border-[#7AAACE]/30 pt-6 mt-8 text-sm text-[#476685] font-bold flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#58E0FF]" />
              Status: Ready and Online
            </div>
          </div>

          {/* JSON Schema Code Panel */}
          <div className="bg-white text-[#E0FAFF] rounded-2xl p-6 font-mono text-xs flex flex-col justify-between shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#58E0FF]/10 rounded-full blur-[40px] pointer-events-none" />
            
            <div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                <span className="text-[10px] uppercase font-bold text-[#92EEFF] tracking-wider">Data Payload Interface</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed text-[#C2F6FF]">
                <code>{currentStep.schema}</code>
              </pre>
            </div>

            <div className="mt-8 text-[9px] text-[#92EEFF] font-bold flex items-center gap-1.5 border-t border-white/10 pt-3">
              <Sparkles className="w-3.5 h-3.5" /> Pipeline format is verified algorithmically.
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
