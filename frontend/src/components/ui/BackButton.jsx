import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BackButton = ({ fallbackPath = '/' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show back button on the absolute root
  if (location.pathname === '/') {
    return null;
  }

  const handleBack = () => {
    // Navigate back in history, or fallback if history is empty
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <button 
      onClick={handleBack}
      className="flex items-center gap-2 text-neutral-400 hover:text-white mb-4 px-2 py-1 rounded-md hover:bg-neutral-800 transition-colors"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      <span className="text-sm font-medium">Back</span>
    </button>
  );
};

export default BackButton;
