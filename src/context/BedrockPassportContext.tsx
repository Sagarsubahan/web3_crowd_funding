import { BedrockPassportProvider } from "@bedrock_org/passport";
import "@bedrock_org/passport/dist/style.css";

interface ProviderProps {
  children: React.ReactNode;
}

const BedrockPassportContext: React.FC<ProviderProps> = ({ children }) => {
  return (
    <BedrockPassportProvider
      baseUrl="https://api.bedrockpassport.com"
      // ⚠️ IMPORTANT: Update this URL with your production URL after deployment
      authCallbackUrl={import.meta.env.VITE_AUTH_CALLBACK_URL || "http://localhost:5173/auth/callback"}
      // ⚠️ IMPORTANT: Your tenant ID from https://vibecodinglist.com/orange-id-integration
      tenantId="orange-hgt3974b8s"
    >
      {children}
    </BedrockPassportProvider>
  );
};

export default BedrockPassportContext; 