import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const PublicLayout = () => {

  return (
    <div className="min-h-screen bg-neutral-900 text-white font-sans flex flex-col">
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <span className="font-bold text-white text-lg leading-none">F</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">FlatVision</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <Link to="/features" className="hover:text-white transition-colors">Features</Link>
            <Link to="/how-it-works" className="hover:text-white transition-colors">How it Works</Link>
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link to="/app" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Go to Dashboard
            </Link>
          </div>
        </div>

      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      
      <footer className="border-t border-neutral-800 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center">
              <span className="font-bold text-indigo-400 text-xs leading-none">F</span>
            </div>
            <span className="text-neutral-500 text-sm">© 2024 FlatVision. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-sm text-neutral-500">
            <Link to="/privacy" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
