import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Moon, Sun, Bell, ArrowRight, Menu, X, Home, LayoutDashboard, Sparkles, History, HelpCircle } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/app');
  
  const activeLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/app', icon: LayoutDashboard },
    { name: 'Start Prediction', path: '/app/predict', icon: Sparkles },
    { name: 'History', path: '/app/history', icon: History },
    { name: 'How It Works', path: '/how-it-works', icon: HelpCircle }
  ];

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="h-[72px] border-b border-white/40 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img src="/new-logo.png" alt="FlatVision Logo" className="h-24 md:h-[6.5rem] -ml-2 mix-blend-multiply dark:mix-blend-normal drop-shadow-sm group-hover:scale-105 transition-transform no-invert" />
          </Link>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex items-center justify-center gap-2 sm:gap-6 flex-1 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden mx-2 sm:mx-6">
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
                className={`relative p-2.5 sm:p-3 rounded-full transition-all duration-300 group flex items-center justify-center
                  ${isActive 
                    ? 'text-[#163050] bg-white shadow-sm shadow-slate-200/50 dark:bg-slate-800 dark:text-white dark:shadow-slate-900/50' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                  }`}
              >
                <link.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-[#00D2FF]' : 'group-hover:text-[#00D2FF]'}`} />
              </Link>
            );
          })}
        </nav>
        
        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
           <div className="relative">
              <button 
                onClick={toggleTheme}
                className="text-slate-500 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-slate-100 no-invert"
              >
                 {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
              </button>
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

        </div>

      </div>


    </header>
  );
};

export default Navbar;
