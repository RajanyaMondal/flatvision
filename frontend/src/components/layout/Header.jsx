import React from 'react';

const Header = ({ onMenuClick }) => {
  return (
    <header className="h-16 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 -ml-2 text-neutral-400 hover:text-white rounded-md hover:bg-neutral-800"
            onClick={onMenuClick}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          
          <div className="hidden lg:block">
            {/* Breadcrumbs could go here */}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full border border-neutral-700 bg-neutral-800"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
