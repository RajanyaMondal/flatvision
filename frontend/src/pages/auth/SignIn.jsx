import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const SignInPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <SignIn 
        routing="path" 
        path="/sign-in" 
        signUpUrl="/sign-up" 
        forceRedirectUrl="/app"
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-neutral-900 border border-neutral-800 shadow-2xl rounded-xl",
            headerTitle: "text-white",
            headerSubtitle: "text-neutral-400",
            socialButtonsBlockButton: "border-neutral-700 text-white hover:bg-neutral-800",
            socialButtonsBlockButtonText: "font-medium",
            dividerLine: "bg-neutral-800",
            dividerText: "text-neutral-500",
            formFieldLabel: "text-neutral-300",
            formFieldInput: "bg-neutral-950 border-neutral-700 text-white focus:border-indigo-500 focus:ring-indigo-500",
            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-500 text-white",
            footerActionText: "text-neutral-400",
            footerActionLink: "text-indigo-400 hover:text-indigo-300"
          }
        }}
      />
    </div>
  );
};

export default SignInPage;
