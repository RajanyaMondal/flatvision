import React, { useContext, useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, History as HistoryIcon, User, LogOut, Building2, Menu, X, BrainCircuit, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const MotionLink = motion(Link);

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
    { name: 'Back to Home', path: '/', icon: Home },
    { name: 'Prediction Form', path: '/dashboard', icon: LayoutDashboard },
    { name: 'History', path: '/dashboard/history', icon: HistoryIcon },
    { name: 'How Model Works', path: '/model-works', icon: BrainCircuit },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Sidebar = ({ mobile }) => (
    <div className={`h-full flex flex-col ${mobile ? '' : 'w-64 border-r border-[#FFD6F4] bg-white/20 backdrop-blur-xl hidden md:flex'}`}>
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight mb-8 hover:scale-102 transition-transform duration-200">
          <Building2 className="text-[#FF8CD9]" />
          <span className="text-[#2E1128] font-black">FlatVision<span className="text-[#FF73D0]">.AI</span></span>
        </Link>
        <div className="mb-8">
          <p className="text-xs text-[#7C6274] font-bold">Welcome back,</p>
          <p className="font-bold text-[#2E1128] text-lg truncate">{user?.name}</p>
        </div>
        <nav className="space-y-2.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
            return (
              <MotionLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold cursor-pointer ${
                  isActive 
                    ? 'bg-[#FF8CD9] text-white shadow-md shadow-[#FF8CD9]/25 hover:shadow-[0_4px_15px_rgba(255,140,217,0.3)]' 
                    : 'hover:bg-[#FFF0FA] text-[#7C6274] hover:text-[#2E1128]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </MotionLink>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto p-6">
        <motion.button 
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-rose-500 hover:bg-rose-50 font-bold transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </motion.button>
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen flex animate-fadeIn text-[#2E1128]"
      style={{
        background: 'radial-gradient(circle at 80% 80%, rgba(255, 245, 246, 0.95) 0%, transparent 80%), linear-gradient(135deg, #FFA4BD 0%, #FFCAD6 50%, #FFF5F6 100%)'
      }}
    >
      <Sidebar />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-[#FFD6F4] bg-white/20 backdrop-blur-xl z-50 flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Building2 className="text-[#FF8CD9]" />
            <span className="text-[#2E1128] font-black">FlatVision<span className="text-[#FF73D0]">.AI</span></span>
          </Link>
          {dbType && (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              dbType.includes('Mock') 
                ? 'bg-amber-50 text-amber-700 border-amber-250' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-250'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dbType.includes('Mock') ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              {dbType.includes('Mock') ? 'Mock DB' : 'MongoDB'}
            </span>
          )}
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-[#2E1128]">
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
            className="fixed inset-0 z-40 md:hidden pt-16"
            style={{
              background: 'radial-gradient(circle at 80% 80%, rgba(255, 245, 246, 0.95) 0%, transparent 80%), linear-gradient(135deg, #FFA4BD 0%, #FFCAD6 50%, #FFF5F6 100%)'
            }}
          >
            <Sidebar mobile />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto h-screen relative flex flex-col pt-16 md:pt-0 bg-transparent">
        {/* Top Navbar */}
        <header className="hidden md:flex h-16 bg-white/20 backdrop-blur-md border-b border-[#FFD6F4] items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-[#2E1128]">Dashboard</h2>
            {dbType && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                dbType.includes('Mock') 
                  ? 'bg-amber-50 text-amber-700 border-amber-250' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-250'
              }`}>
                <span className={`w-2 h-2 rounded-full ${dbType.includes('Mock') ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
                DB Connection: {dbType}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-[#7C6274]">Hello, {user?.name || 'User'}</span>
            <motion.button 
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded-xl font-bold transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </motion.button>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#FFADEE]/5 blur-[120px] pointer-events-none" />
          <div className="max-w-6xl mx-auto relative z-10">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
