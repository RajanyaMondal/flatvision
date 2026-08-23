import React, { createContext, useState, useEffect, useMemo } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isSignedIn, user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [dbUser, setDbUser] = useState(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded) return;

      if (isSignedIn && clerkUser) {
        setSyncing(true);
        try {
          const email = clerkUser.primaryEmailAddress?.emailAddress;
          const name = clerkUser.fullName || clerkUser.username || email.split('@')[0];
          
          const res = await api.post('/auth/clerk-sync', {
            clerkId: clerkUser.id,
            email,
            name
          });

          if (res.data && res.data.success) {
            localStorage.setItem('token', res.data.token);
            setDbUser(res.data.user);
          }
        } catch (err) {
          console.error("Failed to sync Clerk user with backend:", err);
          // If sync fails, fall back to setting local state based on Clerk user directly so the app remains usable
          setDbUser({
            _id: clerkUser.id,
            name: clerkUser.fullName || clerkUser.username || "Clerk User",
            email: clerkUser.primaryEmailAddress?.emailAddress,
            role: 'user'
          });
        } finally {
          setSyncing(false);
        }
      } else {
        localStorage.removeItem('token');
        setDbUser(null);
      }
    };

    syncUser();
  }, [isSignedIn, clerkUser, isLoaded]);

  const logout = async () => {
    try {
      await signOut();
      localStorage.removeItem('token');
      setDbUser(null);
    } catch (err) {
      console.error("Error signing out from Clerk:", err);
    }
  };

  const loading = !isLoaded || syncing;

  return (
    <AuthContext.Provider value={{ user: dbUser, loading, register: () => {}, login: () => {}, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
