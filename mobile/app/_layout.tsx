import { Stack } from "expo-router";
import "../global.css";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import LoadingScreen from "@/components/LoadingScreen";

SplashScreen.preventAutoHideAsync().catch(() => {});

SplashScreen.setOptions({
  duration: 250,
  fade: true,
});

const queryClient = new QueryClient();
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

function AppStack() {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <Stack
      initialRouteName={isSignedIn ? "(tabs)" : "(auth)"}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0D0D0F" },
      }}
    >
      <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
      <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
      <Stack.Screen
        name="sso-callback"
        options={{ animation: "fade", gestureEnabled: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <AppStack />
      </QueryClientProvider>
    </ClerkProvider>
  );
}
