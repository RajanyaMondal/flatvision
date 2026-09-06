import React from 'react';
import { UserProfile } from '@clerk/clerk-react';

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 flex justify-center">
      <UserProfile 
        appearance={{
          elements: {
            rootBox: "w-full flex justify-center",
            card: "bg-white border border-slate-200 shadow-xl rounded-2xl w-full max-w-3xl",
            headerTitle: "text-slate-900",
            headerSubtitle: "text-slate-500",
            profileSectionTitle: "text-slate-800",
            profileSectionTitleText: "text-slate-800",
            profileSectionContent: "text-slate-600",
            formFieldLabel: "text-slate-700",
            formFieldInput: "bg-white border-slate-300 text-slate-900 focus:border-teal-500 focus:ring-teal-500 shadow-sm",
            formButtonPrimary: "bg-teal-600 hover:bg-teal-500 text-[#0A2540] shadow-sm",
            dividerLine: "bg-slate-200",
            dividerText: "text-slate-400",
            pageScrollBox: "bg-white",
            navbar: "bg-slate-50 border-r border-slate-200",
            navbarButton: "text-slate-600 hover:text-slate-900 hover:bg-slate-200",
            breadcrumbsItem: "text-slate-500",
            badge: "bg-teal-50 text-teal-700 border border-teal-200",
            avatarBox: "border-2 border-white shadow-sm",
          }
        }}
      />
    </div>
  );
};

export default Profile;
