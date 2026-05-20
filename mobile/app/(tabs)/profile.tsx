import { View, Text, ScrollView, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/expo";

const ProfileScreen = () => {
  const { signOut } = useAuth();
  return (
    <SafeAreaView>
      <ScrollView className="bg-surface ">
        <Text className="text-white">ProfileScreen</Text>
        <Pressable
          onPress={() => signOut()}
          className="mt-4 bg-red-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white">signout</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
