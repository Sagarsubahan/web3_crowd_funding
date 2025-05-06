import { useState } from "react";
import { useBedrockPassport, LoginPanel } from "@bedrock_org/passport";

const LoginButton = () => {
  const [showLoginPanel, setShowLoginPanel] = useState(false);
  const { isLoggedIn, signOut } = useBedrockPassport();

  const handleLogout = async () => {
    await signOut();
  };

  if (isLoggedIn) {
    return (
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
      >
        Sign Out
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowLoginPanel(true)}
        className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors"
      >
        Sign In
      </button>

      {showLoginPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setShowLoginPanel(false)}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 hover:bg-gray-100"
            >
              ✕
            </button>
            <LoginPanel
              title="Sign in to"
              logo="https://irp.cdn-website.com/e81c109a/dms3rep/multi/orange-web3-logo-v2a-20241018.svg"
              logoAlt="Orange Web3"
              walletButtonText="Connect Wallet"
              showConnectWallet={false}
              separatorText="OR"
              features={{
                enableWalletConnect: false,
                enableAppleLogin: true,
                enableGoogleLogin: true,
                enableEmailLogin: false,
              }}
              titleClass="text-xl font-bold"
              logoClass="ml-2 md:h-8 h-6"
              panelClass="container p-2 md:p-8 rounded-2xl max-w-[480px] bg-white"
              buttonClass="hover:border-orange-500"
              separatorTextClass="bg-white text-gray-500"
              separatorClass="bg-gray-200"
              linkRowClass="justify-center"
              headerClass="justify-center"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LoginButton; 