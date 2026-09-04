import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Moon, Bell, ArrowRight } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/app');
  
  const landingLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/app' },
    { name: 'Start Prediction', path: '/app/predict' },
    { name: 'How It Works', path: '/how-it-works' }
  ];

  const dashboardLinks = [
    { name: 'Home', path: '/' },
    { name: 'How it Works', path: '/how-it-works' },
    { name: 'Dashboard', path: '/app' },
    { name: 'Start Prediction', path: '/app/predict' },
    { name: 'History', path: '/app/history' },
  ];

  const activeLinks = isDashboard ? dashboardLinks : landingLinks;

  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
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
                className={`py-5 text-sm font-semibold transition-all duration-200 border-b-2
                  ${isActive 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
        
        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {isDashboard ? (
             <div className="flex items-center gap-4">
                <button className="text-slate-500 hover:text-slate-800 transition-colors">
                   <Moon className="w-5 h-5" />
                </button>
                <div className="relative">
                   <button className="text-slate-500 hover:text-slate-800 transition-colors">
                      <Bell className="w-5 h-5" />
                   </button>
                   <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">3</div>
                </div>
                <div className="h-6 w-px bg-slate-200 mx-1"></div>
                <SignedIn>
                  <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-8 h-8 rounded-full ring-2 ring-slate-100 hover:ring-indigo-200 transition-all shadow-sm"
                      }
                    }}
                  />
                </SignedIn>
                <SignedOut>
                   <Link to="/sign-in" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">Sign In</Link>
                </SignedOut>
             </div>
          ) : (
             <div className="flex items-center gap-4">
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
                   <Link to="/app/predict" className="hidden md:flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md shadow-indigo-500/20 transition-all items-center gap-2">
                      Get Started <ArrowRight className="w-4 h-4" />
                   </Link>
                </SignedOut>
             </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
