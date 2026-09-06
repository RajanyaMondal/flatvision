import React from 'react';
import { Card } from '../../components/ui/Card';

const Help = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-bold text-[#0A2540] mb-2">Help & Documentation</h1>
        <p className="text-neutral-400">Learn how to use FlatVision effectively.</p>
      </div>

      <Card>
        <h2 className="text-lg font-bold text-[#0A2540] mb-4">Understanding the ML Model</h2>
        <div className="prose prose-invert prose-neutral max-w-none">
          <p>
            FlatVision uses a Multiple Linear Regression model trained on historical real estate data. 
            The model considers multiple independent variables to predict the dependent variable (Price).
          </p>
          <ul className="text-neutral-300 space-y-2 mt-4 list-disc pl-5">
            <li><strong>Area (Sqft):</strong> The super built-up area of the property. This has the highest positive correlation with price.</li>
            <li><strong>Bedrooms (BHK):</strong> The number of bedrooms. While correlated with Area, it independently affects price due to layout preferences.</li>
            <li><strong>Floor:</strong> Higher floors often command a premium in urban areas due to better views and less noise.</li>
            <li><strong>Parking:</strong> Dedicated parking space significantly adds to property value.</li>
            <li><strong>Facing:</strong> Vastu and sunlight preferences make certain facings (like East or North) more desirable.</li>
          </ul>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold text-[#0A2540] mb-4">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-[#0A2540]">How accurate is the prediction?</h3>
            <p className="text-sm text-neutral-400 mt-1">Our model currently achieves an R² score of ~0.99 on the test dataset, meaning it explains 99% of the variance in property prices within our training domain.</p>
          </div>
          <div>
            <h3 className="font-medium text-[#0A2540]">Why does the model need my location/facing?</h3>
            <p className="text-sm text-neutral-400 mt-1">Facing and location are categorical variables that heavily influence buyer sentiment and consequently, market value.</p>
          </div>
          <div>
            <h3 className="font-medium text-[#0A2540]">Is my data private?</h3>
            <p className="text-sm text-neutral-400 mt-1">Yes, all predictions are tied securely to your account using Clerk authentication and Supabase Row Level Security. No other user can see your history.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Help;
