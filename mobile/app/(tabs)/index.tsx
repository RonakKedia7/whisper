import { Text, View, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useChats } from "@/hooks/useChats";
import LoadingScreen from "@/components/LoadingScreen";
import Header from "@/components/ChatsScreen/Header";
import ChatItem from "@/components/ChatsScreen/ChatItem";
import { Chat } from "@/types";
import EmptyUI from "@/components/EmptyUI";
import { SafeAreaView } from "react-native-safe-area-context";
import ErrorScreen from "@/components/ChatsScreen/Error";

const ChatsScreen = () => {
  const router = useRouter();
  const { data: chats, isLoading, error, refetch } = useChats();

  if (isLoading) return <LoadingScreen />;

  if (error) return <ErrorScreen refetch={refetch} />;

  const handleChatPress = (chat: Chat) => {
    router.push({
      pathname: "/chat/[id]" as any,
      params: {
        id: chat._id,
        participantId: chat.participant._id,
        name: chat.participant.name,
        avatar: chat.participant.avatar,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <ChatItem chat={item} onPress={() => handleChatPress(item)} />
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 5,
          paddingBottom: 24,
        }}
        ListHeaderComponent={<Header />}
        ListEmptyComponent={
          <EmptyUI
            title="No chats yet"
            subtitle="Start a conversation!"
            iconName="chatbubbles-outline"
            iconColor="#6B6B70"
            iconSize={64}
            buttonLabel="New Chat"
            onPressButton={() => console.log("press")}
          />
        }
      />
    </SafeAreaView>
  );
};

export default ChatsScreen;
