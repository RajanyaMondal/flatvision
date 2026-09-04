import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';
import BackButton from '../ui/BackButton';

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <BackButton fallbackPath="/app" />
        </div>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
