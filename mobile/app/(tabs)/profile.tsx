import { View, Text, ScrollView, Pressable, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import LoadingScreen from "@/components/LoadingScreen";

const ProfileScreen = () => {
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();

  const fullName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "User";

  const email = user?.primaryEmailAddress?.emailAddress;
  const imageUrl = user?.imageUrl;
  const username = user?.username;
  const phoneNumber = user?.primaryPhoneNumber?.phoneNumber;
  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : null;

  if (!isLoaded) return <LoadingScreen />;

  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-4 pb-6">
          <Text className="text-foreground text-3xl font-bold">Profile</Text>
          <Text className="text-muted-foreground mt-1">
            Your account information
          </Text>
        </View>

        <View className="bg-surface-card rounded-3xl p-5 border border-surface-light">
          <View className="items-center">
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                className="w-24 h-24 rounded-full bg-surface-light"
              />
            ) : (
              <View className="w-24 h-24 rounded-full bg-primary-soft items-center justify-center">
                <Text className="text-surface-dark text-3xl font-bold">
                  {fullName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <Text className="text-foreground text-2xl font-bold mt-4 text-center">
              {fullName}
            </Text>

            {email && (
              <Text className="text-muted-foreground mt-1 text-center">
                {email}
              </Text>
            )}
          </View>
        </View>

        <View className="mt-6 bg-surface-card rounded-3xl overflow-hidden border border-surface-light">
          <ProfileRow icon="person-outline" label="Name" value={fullName} />

          {username && (
            <ProfileRow icon="at-outline" label="Username" value={username} />
          )}

          {email && (
            <ProfileRow icon="mail-outline" label="Email" value={email} />
          )}

          {phoneNumber && (
            <ProfileRow icon="call-outline" label="Phone" value={phoneNumber} />
          )}

          {createdAt && (
            <ProfileRow
              icon="calendar-outline"
              label="Joined"
              value={createdAt}
            />
          )}
        </View>

        <Pressable
          onPress={() => signOut()}
          className="mt-8 bg-primary-dark rounded-2xl py-4 items-center active:opacity-80"
        >
          <View className="flex-row items-center">
            <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
            <Text className="text-foreground font-bold text-base ml-2">
              Sign out
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const ProfileRow = ({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) => {
  return (
    <View className="flex-row items-center px-5 py-4 border-b border-surface-light">
      <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
        <Ionicons name={icon} size={20} color="#F4A261" />
      </View>

      <View className="ml-4 flex-1">
        <Text className="text-muted-foreground text-sm">{label}</Text>
        <Text className="text-foreground font-medium mt-0.5" numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
};

export default ProfileScreen;
