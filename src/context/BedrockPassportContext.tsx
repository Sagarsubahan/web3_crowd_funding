import React from 'react';
import { BedrockPassportProvider } from "@bedrock_org/passport";
import "@bedrock_org/passport/dist/style.css";

interface ProviderProps {
  children: React.ReactNode;
}

const BedrockPassportContext: React.FC<ProviderProps> = ({ children }) => {
  // Always use the production URL
  const PRODUCTION_URL = "http://localhost:5173/auth/callback";
  
  return (
    <BedrockPassportProvider
      baseUrl="https://api.bedrockpassport.com"
      authCallbackUrl="http://localhost:5173/auth/callback"
      // ⚠️ IMPORTANT: This is your project ID from the Orange ID dashboard after whitelisting your URL
      tenantId="orange-sxaecw02pt"
    >
      {children}
    </BedrockPassportProvider>
  );
};

export default BedrockPassportContext; 
