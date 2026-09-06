import React from 'react';

const SimplePage = ({ title, content }) => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <h1 className="text-4xl font-bold text-[#0A2540] mb-8">{title}</h1>
    <div className="prose prose-invert prose-neutral max-w-none">
      <p className="text-lg text-neutral-400 leading-relaxed">
        {content}
      </p>
    </div>
  </div>
);

export const Features = () => <SimplePage title="Features" content="Discover the powerful features of FlatVision, including real-time AI predictions, history tracking, and market analytics." />;
export const HowItWorks = () => <SimplePage title="How it Works" content="FlatVision uses advanced machine learning models trained on vast real estate datasets to provide accurate property valuations based on input features like area, BHK, and location." />;
export const About = () => <SimplePage title="About Us" content="We are on a mission to bring transparency to the real estate market using the power of artificial intelligence." />;
export const Contact = () => <SimplePage title="Contact" content="Get in touch with us at support@flatvision.ai for any inquiries or enterprise solutions." />;
