import Header from "@/components/Header";
import TokenBox from "@/components/TokenBox";
import UserCard from "@/components/UserCard";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type StoredUser = {
  email: string;
  role: string;
  rollNo: string | null;
};

export default function Home() {
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await SecureStore.getItemAsync("currentUser");
      if (!currentUser) return;

      try {
        setUser(JSON.parse(currentUser) as StoredUser);
      } catch {
        setUser(null);
      }
    };

    loadUser();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Recipes",
        }}
      />
      <View style={styles.container}>
        <Header />
        {user ? (
          <View style={styles.userMeta}>
            <Text style={styles.userMetaText}>{user.email}</Text>
            <Text style={styles.userMetaText}>
              {user.rollNo ? `Roll No: ${user.rollNo}` : `Role: ${user.role}`}
            </Text>
          </View>
        ) : null}
        <UserCard />
        <TokenBox />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userMeta: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f4f6f8",
  },
  userMetaText: {
    color: "#1f2937",
  },
  content: {
    padding: 16,
    paddingBottom: 80,
    gap: 16,
  },
});
