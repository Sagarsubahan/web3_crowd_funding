import { useEffect } from "react";
import { useBedrockPassport } from "@bedrock_org/passport";
import { supabase } from "../lib/supabase";

export default function BedrockSupabaseSync() {
  const { user, isLoggedIn } = useBedrockPassport();

  useEffect(() => {
    if (isLoggedIn && user?.email) {
      supabase.auth.signInWithOtp({ email: user.email });
      // Optionally: alert("Check your email for a magic link to complete login.");
    }
  }, [isLoggedIn, user]);

  return null;
} 