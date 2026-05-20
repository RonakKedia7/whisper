import LottieView from "lottie-react-native";
import { View } from "react-native";

export default function LoadingScreen() {
  return (
    <View className="flex-1 bg-surface-dark items-center justify-center">
      <LottieView
        source={require("@/assets/animations/loading.json")}
        autoPlay
        loop
        style={{
          width: 150,
          height: 150,
        }}
      />
    </View>
  );
}
