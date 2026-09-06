import React from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';
import BackButton from '../ui/BackButton';

const AppLayout = () => {
  return (
    <div className="min-h-screen text-[#163050] flex flex-col font-sans" style={{ background: '#F2EFE7' }}>
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 pt-6">
          <BackButton fallbackPath="/app" />
        </div>
        <div className="w-full px-4 sm:px-6 lg:px-8 pb-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
