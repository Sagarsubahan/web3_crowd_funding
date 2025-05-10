declare module '@bedrock_org/passport' {
  import { ReactNode } from 'react';

  interface BedrockPassportProviderProps {
    baseUrl: string;
    authCallbackUrl: string;
    tenantId: string;
    children: ReactNode;
  }

  export const BedrockPassportProvider: React.FC<BedrockPassportProviderProps>;
} 