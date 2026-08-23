import React from 'react';
import { UserProfile } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

export default function Profile() {
  return (
    <div className="flex flex-col items-center justify-center min-h-full pb-12">
      <div className="mb-8 w-full max-w-4xl text-left">
        <h1 className="text-3xl font-bold mb-2">Account Profile</h1>
        <p className="text-muted-foreground">Manage your personal information, security settings, and active credentials.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-4xl bg-white border border-[#E9D5FF] rounded-3xl p-4 shadow-sm overflow-hidden flex justify-center"
      >
        <UserProfile 
          appearance={{
            elements: {
              cardBox: "shadow-none border-none p-0 w-full bg-transparent",
              card: "shadow-none border-none p-0 w-full bg-transparent",
              navbar: "border-r border-[#E9D5FF] bg-transparent",
              headerTitle: "text-[#1E1B4B]",
              headerSubtitle: "text-[#6B5E78]",
              profileSectionTitle: "text-[#1E1B4B]",
              profilePage: "w-full",
              accordionTriggerButton: "text-[#8B5CF6] hover:text-[#7C3AED]",
              badge: "bg-[#F3E8FF] border border-[#E9D5FF] text-[#8B5CF6]",
            }
          }}
        />
      </motion.div>
    </div>
  );
}
