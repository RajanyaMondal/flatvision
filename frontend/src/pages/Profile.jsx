import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-full pb-12 text-[#0A2540]">
      <div className="mb-8 w-full max-w-4xl text-left">
        <h1 className="text-3xl font-black mb-2">Account Profile</h1>
        <p className="text-[#476685] font-bold text-sm">Manage your personal information, security settings, and active credentials.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-4xl bg-white border border-[#7AAACE]/30 rounded-3xl p-8 shadow-sm flex flex-col items-start gap-4"
      >
        <div className="w-full border-b border-[#7AAACE]/30 pb-4 mb-4">
          <h2 className="text-xl font-black text-[#0A2540]">Profile Details</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-8 w-full">
          <div>
            <span className="block text-sm text-[#476685] font-bold mb-1">Email</span>
            <span className="text-[#0A2540] font-semibold">{user?.email}</span>
          </div>
          <div>
            <span className="block text-sm text-[#476685] font-bold mb-1">User ID</span>
            <span className="text-[#0A2540] font-semibold text-xs bg-[#F0FCFF] p-2 rounded-lg border border-[#7AAACE]/30">{user?.id}</span>
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={logout}
            className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-6 rounded-xl border border-red-200 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
}
