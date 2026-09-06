import React from 'react';

export const Card = ({ children, className = '', padding = 'p-6' }) => {
  return (
    <div className={`clay-card ${className}`}>
      <div className={padding}>
        {children}
      </div>
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action }) => {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
