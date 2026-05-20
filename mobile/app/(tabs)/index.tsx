import { View, Text, ScrollView } from "react-native";
import React from "react";

const ChatsScreen = () => {
  return (
    <ScrollView
      className="bg-surface"
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text className="text-white">ChatsScreen</Text>
    </ScrollView>
  );
};

export default ChatsScreen;
