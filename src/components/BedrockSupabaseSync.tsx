import { useEffect, useState } from "react";
import { useBedrockPassport } from "@bedrock_org/passport";
import { supabase } from "../lib/supabase";

export default function BedrockSupabaseSync() {
  const { user, isLoggedIn } = useBedrockPassport();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user?.email) {
      supabase.auth.signInWithOtp({ email: user.email });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 6000); // Hide after 6 seconds
    }
  }, [isLoggedIn, user]);

  return showToast ? (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        background: "#333",
        color: "#fff",
        padding: "16px 24px",
        borderRadius: "8px",
        zIndex: 9999,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      Check your email for a magic link to complete login!
    </div>
  ) : null;
} 