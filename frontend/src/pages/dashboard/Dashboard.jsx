import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, History as HistoryIcon, User, LogOut, Building2, Menu, X, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dbType, setDbType] = useState('');

  useEffect(() => {
    const fetchDbStatus = async () => {
      try {
        const res = await api.get('/health');
        if (res.data && res.data.database) {
          setDbType(res.data.database);
        }
      } catch (err) {
        console.error('Error fetching database status:', err);
      }
    };
    fetchDbStatus();
  }, []);

  const navItems = [
    { name: 'Prediction Form 🔮', path: '/dashboard', icon: LayoutDashboard },
    { name: 'History 📜', path: '/dashboard/history', icon: HistoryIcon },
    { name: 'How Model Works 🧠', path: '/model-works', icon: BrainCircuit },
    { name: 'Profile ⚙️', path: '/dashboard/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Sidebar = ({ mobile }) => (
    <div className={`h-full flex flex-col ${mobile ? '' : 'w-64 border-r border-[#E9D5FF] glass bg-[#F8F5FC]/50 hidden md:flex'}`}>
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight mb-8">
          <Building2 className="text-[#8B5CF6]" />
          <span className="text-[#1E1B4B]">FlatVision<span className="text-[#8B5CF6]">.AI</span> ✨</span>
        </Link>
        <div className="mb-8">
          <p className="text-xs text-[#6B5E78] font-bold">Welcome back, 🤖</p>
          <p className="font-extrabold text-[#1E1B4B] text-lg truncate">{user?.name}</p>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold ${
                  isActive 
                    ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/20' 
                    : 'hover:bg-[#F3E8FF] text-[#6B5E78] hover:text-[#1E1B4B]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto p-6">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-red-500 hover:bg-red-50 font-bold transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Log Out 🤖
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F5FC] flex animate-fadeIn">
      <Sidebar />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-[#E9D5FF] glass bg-[#F8F5FC]/70 z-50 flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Building2 className="text-[#8B5CF6]" />
            <span className="text-[#1E1B4B]">FlatVision<span className="text-[#8B5CF6]">.AI</span> ✨</span>
          </Link>
          {dbType && (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              dbType.includes('Mock') 
                ? 'bg-amber-50 text-amber-700 border-amber-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dbType.includes('Mock') ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              {dbType.includes('Mock') ? 'Mock DB 🤖' : 'MongoDB 🔮'}
            </span>
          )}
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-[#1E1B4B]">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#F8F5FC] md:hidden pt-16"
          >
            <Sidebar mobile />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto h-screen relative bg-[#F8F5FC] flex flex-col">
        {/* Top Navbar */}
        <header className="hidden md:flex h-16 bg-white border-b border-[#E9D5FF] items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-[#1E1B4B]">Dashboard ✨</h2>
            {dbType && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                dbType.includes('Mock') 
                  ? 'bg-amber-50 text-amber-700 border-amber-250' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-250'
              }`}>
                <span className={`w-2 h-2 rounded-full ${dbType.includes('Mock') ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
                DB Connection: {dbType} 🤖
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-[#6B5E78]">Hello, {user?.name || 'User'} 🤖</span>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 pt-20 md:pt-8 flex-1">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#8B5CF6]/5 blur-[120px] pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
