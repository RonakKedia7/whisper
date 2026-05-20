import LottieView from "lottie-react-native";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AuthLoadingOverlayProps {
  isVisible: boolean;
  provider?: "oauth_google" | "oauth_apple";
}

export default function AuthLoadingOverlay({
  isVisible,
  provider,
}: AuthLoadingOverlayProps) {
  const insets = useSafeAreaInsets();

  if (!isVisible) {
    return null;
  }

  const providerName = provider === "oauth_google" ? "Google" : "Apple";
  const loadingText = `Signing in with ${providerName}...`;

  return (
    <View
      className="absolute inset-0 bg-surface-dark items-center justify-center"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View className="flex-1 items-center justify-center">
        <LottieView
          source={require("@/assets/animations/loading.json")}
          autoPlay
          loop
          style={{
            width: 150,
            height: 150,
          }}
        />
        <Text className="text-foreground font-semibold mt-6 text-center">
          {loadingText}
        </Text>
      </View>
    </View>
  );
}
