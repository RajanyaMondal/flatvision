import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import BackButton from '../ui/BackButton';

const PublicLayout = () => {
  return (
    <div className="min-h-screen text-[#163050] font-sans flex flex-col" style={{ background: '#F2EFE7' }}>
      <Navbar />

      <main className="flex-1 flex flex-col w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-6">
          <BackButton />
        </div>
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
