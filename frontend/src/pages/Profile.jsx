import React from 'react';
import { UserProfile } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

export default function Profile() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full pb-12 text-[#2E1128]">
      <div className="mb-8 w-full max-w-4xl text-left">
        <h1 className="text-3xl font-black mb-2">Account Profile</h1>
        <p className="text-[#7C6274] font-bold text-sm">Manage your personal information, security settings, and active credentials.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-4xl bg-white border border-[#FFD6F4] rounded-3xl p-4 shadow-sm overflow-hidden flex justify-center"
      >
        <UserProfile 
          appearance={{
            elements: {
              cardBox: "shadow-none border-none p-0 w-full bg-transparent",
              card: "shadow-none border-none p-0 w-full bg-transparent",
              navbar: "border-r border-[#FFD6F4] bg-transparent",
              headerTitle: "text-[#2E1128] font-black",
              headerSubtitle: "text-[#7C6274] font-semibold",
              profileSectionTitle: "text-[#2E1128] font-black border-b border-[#FFD6F4] pb-2",
              profilePage: "w-full",
              accordionTriggerButton: "text-[#FF8CD9] hover:text-[#FF73D0] font-bold",
              badge: "bg-[#FFF0FA] border border-[#FFD6F4] text-[#FF73D0] font-extrabold",
              formButtonPrimary: "bg-[#FF8CD9] hover:bg-[#FF73D0] text-xs font-bold rounded-xl py-2 transition-all hover:scale-105 active:scale-95 cursor-pointer",
              formFieldInput: "bg-[#FFF5FA] border-[#FFD6F4] rounded-xl py-2 text-[#2E1128]",
              breadcrumbsLink: "text-[#7C6274] hover:text-[#FF73D0] font-bold",
              breadcrumbsCurrentPage: "text-[#2E1128] font-black",
            }
          }}
        />
      </motion.div>
    </div>
  );
}
