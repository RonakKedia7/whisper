import { View, Text, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const ErrorScreen = ({ refetch }: { refetch: any }) => {
  return (
    <View className="flex-1 bg-surface items-center justify-center px-6">
      <View className="w-full max-w-sm bg-card rounded-3xl p-6 items-center shadow-sm">
        <View className="h-14 w-14 rounded-full bg-red-500/10 items-center justify-center mb-4">
          <Ionicons name="warning-outline" size={30} color="#ef4444" />
        </View>

        <Text className="text-foreground text-xl font-bold text-center">
          Failed to load chats
        </Text>

        <Text className="text-muted-foreground text-center mt-2 leading-5">
          Something went wrong while fetching your conversations. Please try
          again.
        </Text>

        <Pressable
          onPress={() => refetch()}
          className="mt-6 w-full bg-primary rounded-2xl py-3 active:opacity-80"
        >
          <Text className="text-primary-foreground text-center font-semibold">
            Retry
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ErrorScreen;
