import * as Linking from "expo-linking";
import { useSSO } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

type OAuthStrategy = "oauth_google" | "oauth_apple";

export const useSocialAuth = () => {
  const [loadingProvider, setLoadingProvider] = useState<OAuthStrategy | null>(
    null,
  );

  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const handleSocialAuth = async (strategy: OAuthStrategy) => {
    if (loadingProvider) return;

    setLoadingProvider(strategy);

    try {
      const redirectUrl = Linking.createURL("sso-callback");

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/" as any);
      }
    } catch (error) {
      console.log("Error in social auth", error);

      const provider = strategy === "oauth_google" ? "Google" : "Apple";

      Alert.alert(
        "Error",
        `Failed to sign in with ${provider}. Please try again.`,
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  return {
    handleSocialAuth,
    loadingProvider,
  };
};
