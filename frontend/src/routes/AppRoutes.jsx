import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

// Layouts
import PublicLayout from '../components/layout/PublicLayout';
import AppLayout from '../components/layout/AppLayout';

// Public Pages
import Home from '../pages/public/Home';
import { Features, HowItWorks, About, Contact } from '../pages/public/SimplePages';

// Auth Pages
import SignInPage from '../pages/auth/SignIn';
import SignUpPage from '../pages/auth/SignUp';

// App Pages
import Dashboard from '../pages/app/Dashboard';
import Predict from '../pages/app/Predict';
import History from '../pages/app/History';
import Analytics from '../pages/app/Analytics';
import Profile from '../pages/app/Profile';
import Help from '../pages/app/Help';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Auth Routes */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
      </Route>

      {/* Protected App Routes */}
      <Route path="/app" element={
        <>
          <SignedIn>
            <AppLayout />
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </>
      }>
        <Route index element={<Dashboard />} />
        <Route path="predict" element={<Predict />} />
        <Route path="history" element={<History />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<Profile />} />
        <Route path="help" element={<Help />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
