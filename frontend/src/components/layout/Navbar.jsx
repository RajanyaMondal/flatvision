import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Moon, Bell, ArrowRight, Menu, X } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/app');
  
  const activeLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/app' },
    { name: 'Start Prediction', path: '/app/predict' },
    { name: 'History', path: '/app/history' },
    { name: 'How It Works', path: '/how-it-works' }
  ];

  return (
    <header className="h-[72px] border-b border-white/40 bg-white/70 backdrop-blur-xl sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/flatvision-logo.png" alt="FlatVision Logo" className="h-16 md:h-20 -ml-2 mix-blend-multiply drop-shadow-sm hover:scale-105 transition-transform" />
          </Link>
        </div>
        
        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {activeLinks.map(link => {
            let isActive = false;
            if (isDashboard) {
               isActive = location.pathname === link.path || (link.path !== '/' && link.path !== '/app' && location.pathname.startsWith(link.path));
               if (location.pathname === '/app' && link.path === '/app') isActive = true;
               if (location.pathname !== '/app' && link.path === '/app') isActive = false;
            } else {
               isActive = location.pathname === link.path;
            }

            return (
              <Link 
                key={link.name}
                to={link.path} 
                className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300 group
                  ${isActive 
                    ? 'text-white bg-slate-900 shadow-md shadow-slate-900/20' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
        
        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
           <button className="hidden sm:block text-slate-500 hover:text-slate-800 transition-colors">
              <Moon className="w-5 h-5" />
           </button>
           <div className="relative hidden sm:block">
              <button className="text-slate-500 hover:text-slate-800 transition-colors">
                 <Bell className="w-5 h-5" />
              </button>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">3</div>
           </div>
           <div className="hidden sm:block h-6 w-px bg-slate-200 mx-1"></div>
           <SignedIn>
             <UserButton 
               afterSignOutUrl="/"
               appearance={{
                 elements: {
                   userButtonAvatarBox: "w-9 h-9 rounded-full ring-2 ring-indigo-100 hover:ring-indigo-300 transition-all shadow-sm"
                 }
               }}
             />
           </SignedIn>
           <SignedOut>
              <Link to="/app/predict" className="hidden md:flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all items-center gap-2 hover:scale-105 active:scale-95">
                 Get Started <ArrowRight className="w-4 h-4" />
              </Link>
           </SignedOut>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden p-1 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-2xl px-4 py-6 flex flex-col gap-3 max-h-[calc(100vh-72px)] overflow-y-auto animate-in slide-in-from-top-2 fade-in duration-200">
          {activeLinks.map(link => {
            let isActive = false;
            if (isDashboard) {
               isActive = location.pathname === link.path || (link.path !== '/' && link.path !== '/app' && location.pathname.startsWith(link.path));
               if (location.pathname === '/app' && link.path === '/app') isActive = true;
               if (location.pathname !== '/app' && link.path === '/app') isActive = false;
            } else {
               isActive = location.pathname === link.path;
            }

            return (
              <Link 
                key={link.name}
                to={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-3 px-5 text-[15px] font-bold rounded-2xl transition-all flex items-center justify-between
                  ${isActive 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                {link.name}
                {isActive && <ArrowRight className="w-4 h-4 opacity-50" />}
              </Link>
            );
          })}
          <SignedOut>
             <div className="mt-4 pt-6 border-t border-slate-100">
               <Link 
                 to="/app/predict" 
                 onClick={() => setIsMobileMenuOpen(false)}
                 className="flex justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-full text-[15px] font-bold shadow-lg shadow-indigo-500/30 active:scale-95 transition-transform"
               >
                 Get Started Now
               </Link>
             </div>
          </SignedOut>
        </div>
      )}
    </header>
  );
};

export default Navbar;
