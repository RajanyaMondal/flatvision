import React from 'react';

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-neutral-400">Manage your account settings and preferences.</p>
      </div>
      
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 text-center text-neutral-400">
        Authentication has been disabled for this session. Profile settings are not available.
      </div>
    </div>
  );
};

export default Profile;
