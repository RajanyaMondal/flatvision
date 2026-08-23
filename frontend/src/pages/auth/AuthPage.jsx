import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Sparkles } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const isRegister = queryParams.get('mode') === 'register';

  const { login, register } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans"
      style={{
        background: 'radial-gradient(circle at 80% 80%, rgba(255, 245, 246, 0.95) 0%, transparent 80%), linear-gradient(135deg, #FFA4BD 0%, #FFCAD6 50%, #FFF5F6 100%)'
      }}
    >
      <Link to="/" className="absolute top-6 left-6 text-[#7C6274] hover:text-[#FF73D0] hover:scale-105 transition-transform duration-200 flex items-center gap-2 font-black z-50">
        <Home className="w-5 h-5" /> Back to Home
      </Link>

      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#FFADEE]/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[#FFC6F3]/15 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[1000px] bg-white border border-[#FFD6F4] rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row relative">

        {/* Left Form Panel */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center min-h-[500px]">
          <div className="mb-6 text-center w-full max-w-sm">
            <h2 className="text-2xl font-black text-[#2E1128] tracking-tight mb-1">Welcome to FlatVision</h2>
            <p className="text-[#7C6274] text-xs font-semibold">Trained Linear Regression property valuations.</p>
          </div>

          <div className="w-full flex justify-center">
            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl border border-red-100">
                  {error}
                </div>
              )}
              
              {isRegister && (
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#FFF5FA] border border-[#FFD6F4] rounded-xl py-2.5 px-4 text-[#2E1128] outline-none focus:border-[#FF8CD9] focus:ring-2 focus:ring-[#FF8CD9]/20 transition-all"
                />
              )}
              
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#FFF5FA] border border-[#FFD6F4] rounded-xl py-2.5 px-4 text-[#2E1128] outline-none focus:border-[#FF8CD9] focus:ring-2 focus:ring-[#FF8CD9]/20 transition-all"
              />
              
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#FFF5FA] border border-[#FFD6F4] rounded-xl py-2.5 px-4 text-[#2E1128] outline-none focus:border-[#FF8CD9] focus:ring-2 focus:ring-[#FF8CD9]/20 transition-all"
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-[#FF8CD9] hover:bg-[#FF73D0] text-white text-sm font-bold rounded-xl py-3 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md shadow-[#FF8CD9]/10 mt-2 disabled:opacity-70 disabled:pointer-events-none"
              >
                {loading ? 'Processing...' : (isRegister ? 'Sign Up' : 'Sign In')}
              </button>
              
              <div className="text-center mt-2">
                <Link
                  to={isRegister ? "/auth?mode=login" : "/auth?mode=register"}
                  className="text-sm text-[#7C6274] hover:text-[#FF73D0] font-bold"
                >
                  {isRegister ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Right Info Panel (Visible on Desktop) */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#FF8CD9] to-[#FFC6F3] p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />

          <div>
            <h3 className="text-2xl font-black mb-4 flex items-center gap-2">FlatVision.AI <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" /></h3>
            <p className="text-sm font-semibold opacity-90 leading-relaxed">
              Experience the power of advanced Multiple Linear Regression models in predicting property market prices with up to 99.7% accuracy.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <span className="text-xs font-bold text-pink-100 block mb-1">Live Evaluation Model</span>
              <span className="font-extrabold text-white text-base">Multiple Linear Regression</span>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <span className="text-xs font-bold text-pink-100 block mb-1">Statistical Accuracy</span>
              <span className="font-extrabold text-white text-base">R² Score ≈ 0.9978 (99.78%)</span>
            </div>
          </div>

          <div className="text-xs text-pink-100 font-extrabold tracking-wider uppercase">
            Certified AI Market Predictions
          </div>
        </div>

      </div>
    </div>
  );
}
