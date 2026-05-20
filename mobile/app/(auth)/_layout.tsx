import LoadingScreen from "@/components/LoadingScreen";
import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";

const AuthLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <LoadingScreen />;

  if (isSignedIn) return <Redirect href={"/(tabs)"} />;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0D0D0F" },
        animation: "fade",
      }}
    />
  );
};

export default AuthLayout;
