import { useSocialAuth } from "@/hooks/useSocialAuth";
import { Dimensions, Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AuthLoadingOverlay from "@/components/AuthLoadingOverlay";

const { width, height } = Dimensions.get("window");

export default function AuthScreen() {
  const { handleSocialAuth, loadingProvider } = useSocialAuth();

  const isGoogleLoading = loadingProvider === "oauth_google";
  const isAppleLoading = loadingProvider === "oauth_apple";

  return (
    <View className="flex-1 bg-surface-dark">
      <SafeAreaView className="flex-1">
        <View className="items-center pt-10">
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 100, height: 100, marginVertical: -20 }}
            contentFit="contain"
          />
          <Text className="text-4xl font-bold text-primary font-serif tracking-wider uppercase">
            Whisper
          </Text>
        </View>

        <View className="flex-1 justify-center items-center px-6">
          <Image
            source={require("@/assets/images/auth.png")}
            style={{
              width: width - 48,
              height: height * 0.3,
            }}
            contentFit="contain"
          />

          <View className="mt-6 items-center">
            <Text className="text-5xl font-bold text-foreground text-center font-sans">
              Connect & Chat
            </Text>
            <Text className="text-3xl font-bold text-primary font-mono">
              Seamlessly
            </Text>
          </View>

          <View className="flex-row gap-4 mt-10">
            <Pressable
              className="flex-1 flex-row items-center justify-center gap-2 bg-white/95 py-4 rounded-2xl active:scale-[0.97] disabled:opacity-50"
              disabled={!!loadingProvider}
              onPress={() => handleSocialAuth("oauth_google")}
            >
              <Image
                source={require("@/assets/images/google.png")}
                style={{ width: 20, height: 20 }}
                contentFit="contain"
              />
              <Text className="text-gray-900 font-semibold text-sm">
                Google
              </Text>
            </Pressable>
            <Pressable
              className="flex-1 flex-row items-center justify-center gap-2 bg-white/10 py-4 rounded-2xl border border-white/20 active:scale-[0.97] disabled:opacity-50"
              disabled={!!loadingProvider}
              onPress={() => handleSocialAuth("oauth_apple")}
            >
              <Ionicons name="logo-apple" size={20} color={"#FFFFFF"} />
              <Text className="text-foreground font-semibold text-sm">
                Apple
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <AuthLoadingOverlay
        isVisible={!!loadingProvider}
        provider={loadingProvider}
      />
    </View>
  );
}
