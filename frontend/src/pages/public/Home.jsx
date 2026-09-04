import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          FlatVision AI 2.0 is now live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl">
          Predict Property Prices with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Precision.</span>
        </h1>
        
        <p className="text-xl text-neutral-400 max-w-2xl mb-10">
          Harness the power of machine learning to get accurate, real-time property valuations. Built for buyers, sellers, and real estate professionals.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            to="/app/predict" 
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
          >
            Start Predicting Free
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </Link>
          <Link 
            to="/how-it-works" 
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors flex items-center justify-center"
          >
            How it works
          </Link>
        </div>
      </section>

      {/* Feature Highlight Section */}
      <section className="w-full bg-neutral-900 border-y border-neutral-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white">Instant Valuation</h3>
              <p className="text-neutral-400">Get highly accurate property price estimates in milliseconds using our advanced linear regression models.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white">Market Analytics</h3>
              <p className="text-neutral-400">Track your prediction history and understand market trends with beautiful, interactive visualizations.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white">Secure & Private</h3>
              <p className="text-neutral-400">Your data is yours. Protected by enterprise-grade security and isolated workspaces for every user.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
