import React from 'react';

export const Card = ({ children, className = '', padding = 'p-6' }) => {
  return (
    <div className={`bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm ${className}`}>
      <div className={padding}>
        {children}
      </div>
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {subtitle && <p className="text-sm text-neutral-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
