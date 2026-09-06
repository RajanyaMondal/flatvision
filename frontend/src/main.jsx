import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.jsx';
import './index.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey || !clerkPubKey.startsWith('pk_')) {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <div style={{ padding: '40px', color: '#ffb3d9', background: '#0A2540', minHeight: '100vh', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️ Missing Clerk API Key</h1>
      <p>Please add a valid <strong>VITE_CLERK_PUBLISHABLE_KEY</strong> in your <code>frontend/.env</code> file.</p>
      <p style={{ marginTop: '10px', color: '#476685' }}>It should start with <code>pk_test_</code> or <code>pk_live_</code>. Currently, it is set to a placeholder or is invalid.</p>
      <p style={{ marginTop: '20px', fontSize: '0.9rem' }}>After updating the <code>.env</code> file, restart the development server.</p>
    </div>
  );
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={clerkPubKey} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
}
