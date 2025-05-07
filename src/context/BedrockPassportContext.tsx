import { BedrockPassportProvider } from "@bedrock_org/passport";
import "@bedrock_org/passport/dist/style.css";

interface ProviderProps {
  children: React.ReactNode;
}

const BedrockPassportContext: React.FC<ProviderProps> = ({ children }) => {
  // Always use the production URL
  const PRODUCTION_URL = "https://web3-crowd-funding-8mbfx8j8n-subahan-ciccadas-projects.vercel.app/auth/callback";
  
  return (
    <BedrockPassportProvider
      baseUrl="https://api.bedrockpassport.com"
      authCallbackUrl="https://web3-crowd-funding-8mbfx8j8n-subahan-ciccadas-projects.vercel.app/auth/callback"
      // ⚠️ IMPORTANT: This is your project ID from the Orange ID dashboard after whitelisting your URL
      tenantId="orange-hgt3974b8s"
    >
      {children}
    </BedrockPassportProvider>
  );
};

export default BedrockPassportContext; 